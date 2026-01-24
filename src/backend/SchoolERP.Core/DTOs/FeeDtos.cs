using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SchoolERP.Core.DTOs
{
    public class FeeTemplateDto
    {
        public int FeeTemplateId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List<FeeTemplateItemDto> Items { get; set; } = new();
    }

    public class FeeTemplateItemDto
    {
        public int FeeTemplateItemId { get; set; }
        public string FeeName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public bool IsOptional { get; set; }
    }

    public class CreateFeeTemplateDto
    {
        [Required]
        public int CampusId { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Frequency { get; set; } = "Term"; // "Monthly", "Term", "Annually"

        public List<CreateFeeTemplateItemDto> Items { get; set; } = new();
    }

    public class CreateFeeTemplateItemDto
    {
        [Required]
        public string FeeName { get; set; } = string.Empty;
        
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }
        
        public bool IsOptional { get; set; } = false;
    }

    public class AssignFeePlanDto
    {
        [Required]
        public int StudentId { get; set; }

        [Required]
        public int FeeTemplateId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }
    }

    public class StudentFeePlanDto
    {
        public int StudentFeePlanId { get; set; }
        public string FeeTemplateName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
    }
}
