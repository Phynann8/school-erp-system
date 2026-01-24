using System;
using System.Collections.Generic;

namespace SchoolERP.Core.Entities
{
    public class Student
    {
        public int StudentId { get; set; }
        public int CampusId { get; set; }
        public Campus Campus { get; set; } = null!;

        public string StudentCode { get; set; } = string.Empty;
        public string? KhmerName { get; set; }
        public string? EnglishName { get; set; }
        public DateTime? DOB { get; set; }
        public string? Gender { get; set; } // Male, Female
        public string Status { get; set; } = "Active"; // Active, Suspended, Graduated, Dropped

        public int? ProgramId { get; set; }
        public Program? Program { get; set; }

        public int? GradeId { get; set; }
        public Grade? Grade { get; set; }

        public int? ClassId { get; set; }
        public Class? Class { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<StudentGuardian> StudentGuardians { get; set; } = new List<StudentGuardian>();
    }

    public class Guardian
    {
        public int GuardianId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }

        // Navigation
        public ICollection<StudentGuardian> StudentGuardians { get; set; } = new List<StudentGuardian>();
    }

    public class StudentGuardian
    {
        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public int GuardianId { get; set; }
        public Guardian Guardian { get; set; } = null!;

        public string? Relationship { get; set; } // Father, Mother, Guardian
        public bool IsPrimary { get; set; } = false;
    }
}
