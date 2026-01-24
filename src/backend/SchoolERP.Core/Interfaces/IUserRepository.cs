using System.Threading.Tasks;
using SchoolERP.Core.Entities;

namespace SchoolERP.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByUsernameAsync(string username);
        Task<User> CreateAsync(User user);
        Task UpdateAsync(User user);
        // Add more methods as needed (e.g. for roles)
    }
}
