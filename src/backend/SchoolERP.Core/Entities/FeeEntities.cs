using System;
using System.Collections.Generic;

namespace SchoolERP.Core.Entities
{
    public class FeeTemplate
    {
        public int FeeTemplateId { get; set; }
        public int CampusId { get; set; }
        public Campus Campus { get; set; } = null!;
        
        public string Name { get; set; } = string.Empty;
        public string Frequency { get; set; } = "Term"; // Monthly, Term, Annually
        public bool IsActive { get; set; } = true;

        public ICollection<FeeTemplateItem> FeeTemplateItems { get; set; } = new List<FeeTemplateItem>();
    }

    public class FeeTemplateItem
    {
        public int FeeTemplateItemId { get; set; }
        public int FeeTemplateId { get; set; }
        public FeeTemplate FeeTemplate { get; set; } = null!;

        public string FeeName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public bool IsOptional { get; set; } = false;
    }

    public class StudentFeePlan
    {
        public int StudentFeePlanId { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public int FeeTemplateId { get; set; }
        public FeeTemplate FeeTemplate { get; set; } = null!;

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = "Active"; // Active, Expired, Cancelled
    }
}
