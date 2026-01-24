using System;
using System.Collections.Generic;

namespace SchoolERP.Core.Entities
{
    public class Campus
    {
        public int CampusId { get; set; }
        public string CampusCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<UserCampusAccess> UserAccesses { get; set; } = new List<UserCampusAccess>();
    }

    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public ICollection<UserCampusAccess> CampusAccesses { get; set; } = new List<UserCampusAccess>();
    }

    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;

        // Navigation properties
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }

    public class UserRole
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
    }

    public class UserCampusAccess
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int CampusId { get; set; }
        public Campus Campus { get; set; } = null!;

        public string AccessLevel { get; set; } = "Read"; // Read, Write, Admin
    }
}
