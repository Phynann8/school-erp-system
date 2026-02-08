export interface UserProfile {
    userId: number;
    fullName: string;
    email?: string;
    roles: string[];
    campusAccess: {
        campusId: number;
        campusCode: string;
        accessLevel: string;
    }[];
}

export interface AuthResponse {
    accessToken: string;
    user: UserProfile;
}

export interface StudentListDto {
    studentId: number;
    studentCode: string;
    khmerName?: string;
    englishName?: string;
    className: string;
    status: string;
}

export interface CreateStudentDto {
    khmerName: string;
    englishName?: string;
    studentCode?: string;
    dob?: string;
    gender?: string;
    campusId: number;
    programId?: number;
    gradeId?: number;
    classId?: number;
    guardians: GuardianDto[];
}

export interface GuardianDto {
    fullName: string;
    relationship: string;
    phone?: string;
    isPrimary: boolean;
}

export interface Campus {
    campusId: number;
    campusCode: string;
    name: string;
}

export interface FeeTemplateDto {
    feeTemplateId: number;
    name: string;
    frequency: string;
    isActive: boolean;
    items: FeeTemplateItemDto[];
}

export interface FeeTemplateItemDto {
    feeTemplateItemId: number;
    feeName: string;
    amount: number;
    isOptional: boolean;
}

export interface CreateFeeTemplateDto {
    campusId: number;
    name: string;
    frequency: string;
    items: CreateFeeTemplateItemDto[];
}

export interface CreateFeeTemplateItemDto {
    feeName: string;
    amount: number;
    isOptional: boolean;
}

export interface AssignFeePlanDto {
    studentId: number;
    feeTemplateId: number;
    startDate: string;
    endDate?: string;
}

export interface StudentFeePlanDto {
    studentFeePlanId: number;
    feeTemplateName: string;
    startDate: string;
    endDate?: string;
    status: string;
    totalAmount: number;
}

export interface InvoiceDto {
    invoiceId: number;
    studentId: number;
    studentName: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    paidAmount: number;
    balance: number;
    status: string;
    items: InvoiceItemDto[];
}

export interface InvoiceItemDto {
    invoiceItemId: number;
    description: string;
    amount: number;
}

export interface CreateInvoiceDto {
    studentId: number;
    dueDate: string;
    items: CreateInvoiceItemDto[];
}

export interface CreateInvoiceItemDto {
    description: string;
    amount: number;
}

export interface PaymentDto {
    paymentId: number;
    invoiceId: number;
    receiptNumber: string;
    paymentDate: string;
    amount: number;
    paymentMethod: string;
}

export interface CreatePaymentDto {
    invoiceId: number;
    amount: number;
    paymentMethod: string;
    referenceNumber?: string;
}
