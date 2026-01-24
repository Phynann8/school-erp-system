using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SchoolERP.Core.Entities;
using SchoolERP.Core.Interfaces;
using SchoolERP.Infra.Persistence;

namespace SchoolERP.Infra.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly SchoolErpDbContext _context;

        public UserRepository(SchoolErpDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .Include(u => u.CampusAccesses).ThenInclude(ca => ca.Campus)
                .FirstOrDefaultAsync(u => u.UserId == id);
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .Include(u => u.CampusAccesses).ThenInclude(ca => ca.Campus)
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User> CreateAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
