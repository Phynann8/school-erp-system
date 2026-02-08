using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.Core.DTOs;
using SchoolERP.Core.Entities;
using SchoolERP.Core.Interfaces;
using SchoolERP.Infra.Persistence;

namespace SchoolERP.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FinanceController : ControllerBase
    {
        private readonly IFinanceRepository _financeRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly SchoolErpDbContext _db;

        public FinanceController(
            IFinanceRepository financeRepository, 
            IStudentRepository studentRepository, 
            ICurrentUserService currentUserService,
            SchoolErpDbContext db)
        {
            _financeRepository = financeRepository;
            _studentRepository = studentRepository;
            _currentUserService = currentUserService;
            _db = db;
        }

        [HttpGet("invoices/student/{studentId}")]
        public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetStudentInvoices(int studentId)
        {
            var student = await _studentRepository.GetByIdAsync(studentId);
            if (student == null) return NotFound("Student not found");

            if (!_currentUserService.HasAccessToCampus(student.CampusId))
            {
                return Forbid();
            }

            var invoices = await _financeRepository.GetStudentInvoicesAsync(studentId);
            
            var dtos = invoices.Select(i => new InvoiceDto
            {
                InvoiceId = i.InvoiceId,
                StudentId = i.StudentId,
                StudentName = student.EnglishName ?? student.StudentCode,
                InvoiceNumber = i.InvoiceNumber,
                IssueDate = i.IssueDate,
                DueDate = i.DueDate,
                TotalAmount = i.TotalAmount,
                PaidAmount = i.PaidAmount,
                Balance = i.Balance,
                Status = i.Status,
                Items = i.InvoiceItems.Select(item => new InvoiceItemDto
                {
                    InvoiceItemId = item.InvoiceItemId,
                    Description = item.Description,
                    Amount = item.Amount
                }).ToList()
            });

            return Ok(dtos);
        }

        [HttpPost("invoices")]
        public async Task<ActionResult<InvoiceDto>> CreateInvoice([FromBody] CreateInvoiceDto request)
        {
            var student = await _studentRepository.GetByIdAsync(request.StudentId);
            if (student == null) return NotFound("Student not found");

            if (!_currentUserService.HasAccessToCampus(student.CampusId))
            {
                return Forbid();
            }

            var invoice = new Invoice
            {
                StudentId = request.StudentId,
                InvoiceNumber = $"INV-{DateTime.UtcNow:yyMMddHHmmss}", // Shorter format: INV-260125110530 (16 chars)
                IssueDate = DateTime.UtcNow,
                DueDate = request.DueDate,
                Status = "Unpaid"
            };

            foreach (var itemDto in request.Items)
            {
                invoice.InvoiceItems.Add(new InvoiceItem
                {
                    Description = itemDto.Description,
                    Amount = itemDto.Amount
                });
            }

            invoice.TotalAmount = invoice.InvoiceItems.Sum(i => i.Amount);
            invoice.Balance = invoice.TotalAmount;

            await _financeRepository.CreateInvoiceAsync(invoice);

            var dto = new InvoiceDto
            {
                InvoiceId = invoice.InvoiceId,
                StudentId = invoice.StudentId,
                InvoiceNumber = invoice.InvoiceNumber,
                IssueDate = invoice.IssueDate,
                DueDate = invoice.DueDate,
                TotalAmount = invoice.TotalAmount,
                PaidAmount = invoice.PaidAmount,
                Balance = invoice.Balance,
                Status = invoice.Status
            };

            return CreatedAtAction(nameof(GetStudentInvoices), new { studentId = invoice.StudentId }, dto);
        }

        [HttpPost("payments")]
        public async Task<ActionResult<PaymentDto>> RecordPayment([FromBody] CreatePaymentDto request)
        {
            var invoice = await _financeRepository.GetInvoiceByIdAsync(request.InvoiceId);
            if (invoice == null) return NotFound("Invoice not found");

            if (!_currentUserService.HasAccessToCampus(invoice.Student.CampusId))
            {
                return Forbid();
            }

            if (request.Amount > invoice.Balance)
            {
                 return BadRequest("Payment amount exceeds invoice balance.");
            }

            var payment = new Payment
            {
                InvoiceId = request.InvoiceId,
                ReceiptNumber = $"RCT-{DateTime.UtcNow.Ticks}",
                PaymentDate = DateTime.UtcNow,
                Amount = request.Amount,
                PaymentMethod = request.PaymentMethod,
                ReferenceNumber = request.ReferenceNumber,
                ReceivedBy = _currentUserService.Username // basic audit
            };

            await _financeRepository.RecordPaymentAsync(payment);

            return Ok(new PaymentDto
            {
                PaymentId = payment.PaymentId,
                InvoiceId = payment.InvoiceId,
                ReceiptNumber = payment.ReceiptNumber,
                PaymentDate = payment.PaymentDate,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod
            });
        }

        // ========== VOID WORKFLOW ==========

        /// <summary>
        /// Request to void a payment (Cashier can request)
        /// </summary>
        [HttpPost("payments/{paymentId}/void-request")]
        public async Task<ActionResult> RequestVoid(int paymentId, [FromBody] VoidRequestDto request)
        {
            var payment = await _db.Payments.Include(p => p.Invoice).ThenInclude(i => i.Student)
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId);
            
            if (payment == null) return NotFound("Payment not found");
            if (payment.IsVoided) return BadRequest("Payment is already voided");

            if (!_currentUserService.HasAccessToCampus(payment.Invoice.Student.CampusId))
            {
                return Forbid();
            }

            // Check if there's already a pending void request
            var existingRequest = await _db.VoidRequests
                .FirstOrDefaultAsync(v => v.PaymentId == paymentId && v.Status == "Pending");
            if (existingRequest != null)
            {
                return BadRequest("A void request is already pending for this payment");
            }

            var voidRequest = new VoidRequest
            {
                PaymentId = paymentId,
                Reason = request.Reason,
                RequestedBy = _currentUserService.Username ?? "system",
                RequestedAt = DateTime.UtcNow,
                Status = "Pending"
            };

            _db.VoidRequests.Add(voidRequest);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Void request submitted", voidRequestId = voidRequest.VoidRequestId });
        }

        /// <summary>
        /// Get pending void requests (Manager only)
        /// </summary>
        [HttpGet("void-requests")]
        public async Task<ActionResult> GetPendingVoidRequests([FromQuery] int? campusId)
        {
            var effectiveCampusId = campusId ?? _currentUserService.CampusId;

            var requests = await _db.VoidRequests
                .Include(v => v.Payment)
                    .ThenInclude(p => p.Invoice)
                        .ThenInclude(i => i.Student)
                .Where(v => v.Status == "Pending")
                .Where(v => !effectiveCampusId.HasValue || v.Payment.Invoice.Student.CampusId == effectiveCampusId.Value)
                .Select(v => new
                {
                    v.VoidRequestId,
                    v.PaymentId,
                    v.Payment.ReceiptNumber,
                    v.Payment.Amount,
                    v.Payment.PaymentDate,
                    StudentName = v.Payment.Invoice.Student.EnglishName ?? v.Payment.Invoice.Student.KhmerName,
                    v.Reason,
                    v.RequestedBy,
                    v.RequestedAt
                })
                .OrderByDescending(v => v.RequestedAt)
                .ToListAsync();

            return Ok(requests);
        }

        /// <summary>
        /// Approve void request (Manager only)
        /// </summary>
        [HttpPost("void-requests/{voidRequestId}/approve")]
        public async Task<ActionResult> ApproveVoid(int voidRequestId)
        {
            var voidRequest = await _db.VoidRequests
                .Include(v => v.Payment)
                    .ThenInclude(p => p.Invoice)
                .FirstOrDefaultAsync(v => v.VoidRequestId == voidRequestId);

            if (voidRequest == null) return NotFound("Void request not found");
            if (voidRequest.Status != "Pending") return BadRequest("Request is not pending");

            // Update void request
            voidRequest.Status = "Approved";
            voidRequest.ApprovedBy = _currentUserService.Username ?? "system";
            voidRequest.ApprovedAt = DateTime.UtcNow;

            // Void the payment
            var payment = voidRequest.Payment;
            payment.IsVoided = true;
            payment.VoidedAt = DateTime.UtcNow;
            payment.VoidedBy = _currentUserService.Username;
            payment.VoidReason = voidRequest.Reason;

            // Update invoice balance
            var invoice = payment.Invoice;
            invoice.PaidAmount -= payment.Amount;
            invoice.Balance += payment.Amount;
            invoice.Status = invoice.Balance >= invoice.TotalAmount ? "Unpaid" 
                           : invoice.Balance > 0 ? "Partial" : "Paid";

            await _db.SaveChangesAsync();

            return Ok(new { message = "Void approved. Payment reversed.", paymentId = payment.PaymentId });
        }

        /// <summary>
        /// Reject void request
        /// </summary>
        [HttpPost("void-requests/{voidRequestId}/reject")]
        public async Task<ActionResult> RejectVoid(int voidRequestId, [FromBody] RejectVoidDto request)
        {
            var voidRequest = await _db.VoidRequests.FindAsync(voidRequestId);
            if (voidRequest == null) return NotFound("Void request not found");
            if (voidRequest.Status != "Pending") return BadRequest("Request is not pending");

            voidRequest.Status = "Rejected";
            voidRequest.ApprovedBy = _currentUserService.Username ?? "system";
            voidRequest.ApprovedAt = DateTime.UtcNow;
            voidRequest.RejectionReason = request.Reason;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Void request rejected" });
        }
    }

    // DTOs for void workflow
    public class VoidRequestDto
    {
        public string Reason { get; set; } = string.Empty;
    }

    public class RejectVoidDto
    {
        public string Reason { get; set; } = string.Empty;
    }
}

