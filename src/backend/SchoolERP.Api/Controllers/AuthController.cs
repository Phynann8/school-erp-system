using Microsoft.AspNetCore.Mvc;
using SchoolERP.Core.DTOs;
using SchoolERP.Core.Interfaces;
using SchoolERP.Core.Entities;

namespace SchoolERP.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthController(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            IJwtTokenGenerator jwtTokenGenerator)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userRepository.GetByUsernameAsync(request.Username);

            if (user == null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
            {
                // Generic error to prevent username enumeration
                return Unauthorized(new { message = "Invalid username or password" });
            }

            if (!user.IsActive)
            {
                return Unauthorized(new { message = "Account is inactive" });
            }

            var token = _jwtTokenGenerator.GenerateToken(user);

            var response = new AuthResponse
            {
                AccessToken = token,
                User = new UserProfileDto
                {
                    UserId = user.UserId,
                    FullName = user.FullName,
                    Roles = user.UserRoles.Select(ur => ur.Role.RoleName).ToList(),
                    CampusAccess = user.CampusAccesses.Select(ca => new CampusAccessDto
                    {
                        CampusId = ca.CampusId,
                        CampusCode = ca.Campus.CampusCode,
                        AccessLevel = ca.AccessLevel
                    }).ToList()
                }
            };

            return Ok(response);
        }
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] RegisterRequest request)
        {
            // Note: This is an unsecure, development-only endpoint to allow manual user creation
            // if the seeding fails. In production, registration should be restricted.
            
            var existingUser = await _userRepository.GetByUsernameAsync(request.Username);
            if (existingUser != null)
                return BadRequest("Username already exists.");

            var user = new SchoolERP.Core.Entities.User
            {
                Username = request.Username,
                PasswordHash = _passwordHasher.Hash(request.Password),
                FullName = request.FullName,
                IsActive = true
            };

            await _userRepository.CreateAsync(user);
            return Ok(new { message = "User created successfully. Please login." });
        }
    }

    public class RegisterRequest { public string Username { get; set; } = null!; public string Password { get; set; } = null!; public string FullName { get; set; } = null!; }
}
