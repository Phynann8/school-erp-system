using System.ComponentModel.DataAnnotations;

namespace SchoolERP.Core.DTOs
{
    public class LoginRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public UserProfileDto User { get; set; } = new();
    }

    public class UserProfileDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
        public List<CampusAccessDto> CampusAccess { get; set; } = new();
    }

    public class CampusAccessDto
    {
        public int CampusId { get; set; }
        public string CampusCode { get; set; } = string.Empty;
        public string AccessLevel { get; set; } = string.Empty;
    }
}
