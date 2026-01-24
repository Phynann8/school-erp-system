using System;
using System.Collections.Generic;

namespace SchoolERP.Core.Entities
{
    public class Invoice
    {
        public int InvoiceId { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal Balance { get; set; }
        
        public string Status { get; set; } = "Unpaid"; // Unpaid, Partial, Paid, Cancelled

        public ICollection<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }

    public class InvoiceItem
    {
        public int InvoiceItemId { get; set; }
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;

        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class Payment
    {
        public int PaymentId { get; set; }
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;

        public string ReceiptNumber { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "Cash"; // Cash, Bank Transfer, ABA
        public string? ReferenceNumber { get; set; } // Transaction ID
        public string? ReceivedBy { get; set; } // Cashier Name or UserID
        
        // Void workflow
        public bool IsVoided { get; set; } = false;
        public string? VoidReason { get; set; }
        public DateTime? VoidedAt { get; set; }
        public string? VoidedBy { get; set; }
    }

    public class VoidRequest
    {
        public int VoidRequestId { get; set; }
        public int PaymentId { get; set; }
        public Payment Payment { get; set; } = null!;
        
        public string Reason { get; set; } = string.Empty;
        public string RequestedBy { get; set; } = string.Empty; // Username
        public DateTime RequestedAt { get; set; }
        
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public string? ApprovedBy { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public string? RejectionReason { get; set; }
    }
}

