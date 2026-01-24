# SchoolERP E2E Test Script

$BaseUrl = "http://localhost:5000/api"
$AdminUser = "admin"
$AdminPass = "Admin123!"
$CampusId = 1

function Request($Method, $Uri, $Body = $null, $Token = $null) {
    $Headers = @{ "Content-Type" = "application/json" }
    if ($Token) { 
        $Headers["Authorization"] = "Bearer $Token" 
        $Headers["X-Campus-Id"] = $CampusId.ToString()
    }
    
    try {
        $params = @{
            Uri = "$BaseUrl$Uri"
            Method = $Method
            Headers = $Headers
            ErrorAction = "Stop"
        }
        if ($Body) { $params["Body"] = ($Body | ConvertTo-Json -Depth 5) }
        
        $response = Invoke-RestMethod @params
        return $response
    } catch {
        Write-Host "Error calling $Uri : $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
            Write-Host $reader.ReadToEnd() -ForegroundColor Yellow
        }
        throw
    }
}

# 1. Login
Write-Host "1. Logging in..." -ForegroundColor Cyan
$loginBody = @{ username = $AdminUser; password = $AdminPass }
$auth = Request "POST" "/auth/login" $loginBody
$token = $auth.token
Write-Host "   Success! Token received." -ForegroundColor Green

# 2. Create Student
Write-Host "2. Creating Student..." -ForegroundColor Cyan
$studentCode = "TEST-" + (Get-Date -Format "mmss")
$studentBody = @{
    campusId = $CampusId
    studentCode = $studentCode
    englishName = "John Doe Test"
    khmerName = "ចន ដូ"
    dob = "2015-01-01"
    gender = "Male"
    gradeId = 1
    classId = 1
    guardians = @(
        @{ fullName = "Papa Doe"; relationship = "Father"; isPrimary = $true; phone = "012345678" }
    )
}
$student = Request "POST" "/students" $studentBody $token
$studentId = $student.studentId
Write-Host "   Created Student ID: $studentId ($studentCode)" -ForegroundColor Green

# 3. Create Fee Template
Write-Host "3. Creating Fee Template..." -ForegroundColor Cyan
$templateBody = @{
    campusId = $CampusId
    name = "Test Term Fee"
    frequency = "Term"
    items = @(
        @{ feeName = "Tuition"; amount = 100.00; isOptional = $false }
        @{ feeName = "Materials"; amount = 20.00; isOptional = $false }
    )
}
$template = Request "POST" "/fees/templates" $templateBody $token
$templateId = $template.feeTemplateId
Write-Host "   Created Fee Template ID: $templateId" -ForegroundColor Green

# 4. Assign Fee Plan
Write-Host "4. Assigning Fee Plan..." -ForegroundColor Cyan
$planBody = @{
    studentId = $studentId
    feeTemplateId = $templateId
    startDate = (Get-Date).ToString("yyyy-MM-dd")
}
Request "POST" "/fees/plans/assign" $planBody $token
Write-Host "   Fee Plan Assigned." -ForegroundColor Green

# 5. Generate Invoice
Write-Host "5. Generating Invoice..." -ForegroundColor Cyan
$invoiceBody = @{
    studentId = $studentId
    dueDate = (Get-Date).AddDays(30).ToString("yyyy-MM-dd")
    items = @(
        @{ description = "Tuition Term 1"; amount = 100.00 }
        @{ description = "Materials"; amount = 20.00 }
    )
}
$invoice = Request "POST" "/finance/invoices" $invoiceBody $token
$invoiceId = $invoice.invoiceId
Write-Host "   Created Invoice ID: $invoiceId (Total: $($invoice.totalAmount))" -ForegroundColor Green

# 6. Record Payment
Write-Host "6. Recording Payment..." -ForegroundColor Cyan
$paymentBody = @{
    invoiceId = $invoiceId
    amount = 120.00
    paymentMethod = "Cash"
}
$payment = Request "POST" "/finance/payments" $paymentBody $token
Write-Host "   Payment Recorded: $($payment.amount)" -ForegroundColor Green

# 7. Verify Balance
Write-Host "7. Verifying Balance..." -ForegroundColor Cyan
$invoices = Request "GET" "/finance/invoices/student/$studentId" $null $token
$targetInvoice = $invoices | Where-Object { $_.invoiceId -eq $invoiceId }

if ($targetInvoice.status -eq "Paid" -and $targetInvoice.balance -eq 0) {
    Write-Host "   TEST PASSED! Invoice is Paid and Balance is 0." -ForegroundColor Green
} else {
    Write-Host "   TEST FAILED! Status: $($targetInvoice.status), Balance: $($targetInvoice.balance)" -ForegroundColor Red
}
