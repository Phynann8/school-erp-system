using SchoolERP.Core.Entities;

namespace SchoolERP.Core.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
    }

    public interface IPasswordHasher
    {
        string Hash(string password);
        bool Verify(string password, string hash);
    }
}
