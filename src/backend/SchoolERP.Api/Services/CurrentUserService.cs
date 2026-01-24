using System.Security.Claims;
using SchoolERP.Core.Interfaces;

namespace SchoolERP.Api.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int? UserId
        {
            get
            {
                var idClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier) 
                              ?? _httpContextAccessor.HttpContext?.User?.FindFirst("sub");
                
                return idClaim != null && int.TryParse(idClaim.Value, out var id) ? id : null;
            }
        }

        public string? Username
        {
            get
            {
                return _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Name)?.Value;
            }
        }

        public int? CampusId
        {
            get
            {
                // 1. Try get from Header (Client explicitly requests context)
                var headerIds = _httpContextAccessor.HttpContext?.Request.Headers["X-Campus-Id"];
                if (headerIds.HasValue && int.TryParse(headerIds.Value, out var campusId))
                {
                    // Validate access
                    if (HasAccessToCampus(campusId))
                    {
                        return campusId;
                    }
                }
                
                // 2. Fallback: If user has access to only 1 campus, default to it? 
                // For now, return null (Context not set).
                return null;
            }
        }

        public bool HasAccessToCampus(int campusId)
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null) return false;

            // Check "CampusAccess" claim: "1:Write"
            var accessClaims = user.FindAll("CampusAccess");
            foreach (var claim in accessClaims)
            {
                if (claim.Value.StartsWith($"{campusId}:"))
                {
                    return true;
                }
            }

            // Also check for Admin role or similar if global admin logic exists
            // But strict RBAC per campus is safer.
            return false;
        }
    }
}
