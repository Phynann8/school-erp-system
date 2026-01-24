using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SchoolERP.Core.DTOs
{
    public class InvoiceDto
    {
        public int InvoiceId { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal Balance { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<InvoiceItemDto> Items { get; set; } = new();
    }

    public class InvoiceItemDto
    {
        public int InvoiceItemId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class CreateInvoiceDto
    {
        [Required]
        public int StudentId { get; set; }
        
        [Required]
        public DateTime DueDate { get; set; }
        
        public List<CreateInvoiceItemDto> Items { get; set; } = new();
    }

    public class CreateInvoiceItemDto
    {
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public decimal Amount { get; set; }
    }

    public class PaymentDto
    {
        public int PaymentId { get; set; }
        public int InvoiceId { get; set; }
        public string ReceiptNumber { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
    }

    public class CreatePaymentDto
    {
        [Required]
        public int InvoiceId { get; set; }
        
        [Required]
        public decimal Amount { get; set; }
        
        public string PaymentMethod { get; set; } = "Cash";
        public string? ReferenceNumber { get; set; }
    }
}
