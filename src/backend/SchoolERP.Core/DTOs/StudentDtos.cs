using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SchoolERP.Core.DTOs
{
    public class StudentListDto
    {
        public int StudentId { get; set; }
        public string StudentCode { get; set; } = string.Empty;
        public string? KhmerName { get; set; }
        public string? EnglishName { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class CreateStudentDto
    {
        [Required]
        public string KhmerName { get; set; } = string.Empty;
        public string? EnglishName { get; set; }
        public string? StudentCode { get; set; } // Optional, auto-generated if null
        public DateTime? DOB { get; set; }
        public string? Gender { get; set; }
        
        [Required]
        public int CampusId { get; set; }
        public int? ProgramId { get; set; }
        public int? GradeId { get; set; }
        public int? ClassId { get; set; }
        
        public List<GuardianDto> Guardians { get; set; } = new();
    }

    public class GuardianDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;
        public string Relationship { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public bool IsPrimary { get; set; }
    }
}
