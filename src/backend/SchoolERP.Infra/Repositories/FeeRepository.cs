using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SchoolERP.Core.Entities;
using SchoolERP.Core.Interfaces;
using SchoolERP.Infra.Persistence;

namespace SchoolERP.Infra.Repositories
{
    public class FeeRepository : IFeeRepository
    {
        private readonly SchoolErpDbContext _context;

        public FeeRepository(SchoolErpDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FeeTemplate>> GetTemplatesAsync(int campusId)
        {
            return await _context.FeeTemplates
                .Include(t => t.FeeTemplateItems)
                .Where(t => t.CampusId == campusId && t.IsActive)
                .ToListAsync();
        }

        public async Task<FeeTemplate?> GetTemplateByIdAsync(int id)
        {
            return await _context.FeeTemplates
                .Include(t => t.FeeTemplateItems)
                .FirstOrDefaultAsync(t => t.FeeTemplateId == id);
        }

        public async Task<FeeTemplate> AddTemplateAsync(FeeTemplate template)
        {
            await _context.FeeTemplates.AddAsync(template);
            await _context.SaveChangesAsync();
            return template;
        }

        public async Task<StudentFeePlan> AssignFeePlanAsync(StudentFeePlan plan)
        {
            await _context.StudentFeePlans.AddAsync(plan);
            await _context.SaveChangesAsync();
            return plan;
        }

        public async Task<IEnumerable<StudentFeePlan>> GetStudentFeePlansAsync(int studentId)
        {
            return await _context.StudentFeePlans
                .Include(p => p.FeeTemplate).ThenInclude(t => t.FeeTemplateItems)
                .Where(p => p.StudentId == studentId)
                .ToListAsync();
        }
    }
}
