using System.Collections.Generic;

namespace SchoolERP.Core.Entities
{
    public class Program
    {
        public int ProgramId { get; set; }
        public string Name { get; set; } = string.Empty;

        // Navigation
        public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    }

    public class Grade
    {
        public int GradeId { get; set; }
        public int ProgramId { get; set; }
        public Program Program { get; set; } = null!;
        public string Name { get; set; } = string.Empty;

        // Navigation
        public ICollection<Class> Classes { get; set; } = new List<Class>();
    }

    public class Class
    {
        public int ClassId { get; set; }
        public int CampusId { get; set; }
        public Campus Campus { get; set; } = null!;
        
        public int GradeId { get; set; }
        public Grade Grade { get; set; } = null!;
        
        public string Name { get; set; } = string.Empty;
    }
}
