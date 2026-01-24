using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SchoolERP.Core.Entities;
using SchoolERP.Core.Interfaces;
using SchoolERP.Infra.Persistence;

namespace SchoolERP.Infra.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly SchoolErpDbContext _context;

        public StudentRepository(SchoolErpDbContext context)
        {
            _context = context;
        }

        public async Task<Student?> GetByIdAsync(int id)
        {
            return await _context.Students
                .Include(s => s.Campus)
                .Include(s => s.Program)
                .Include(s => s.Grade)
                .Include(s => s.Class)
                .Include(s => s.StudentGuardians).ThenInclude(sg => sg.Guardian)
                .FirstOrDefaultAsync(s => s.StudentId == id);
        }

        public async Task<Student?> GetByCodeAsync(string code)
        {
            return await _context.Students
                .Include(s => s.Campus)
                .FirstOrDefaultAsync(s => s.StudentCode == code);
        }

        public async Task<(IEnumerable<Student> Items, int Total)> GetListAsync(
            int? campusId, 
            string? searchTerm, 
            int? programId, 
            int? gradeId, 
            int? classId, 
            string? status, 
            int page, 
            int pageSize)
        {
            var query = _context.Students
                .Include(s => s.Program)
                .Include(s => s.Grade)
                .Include(s => s.Class)
                .AsQueryable();

            if (campusId.HasValue)
                query = query.Where(s => s.CampusId == campusId);

            if (!string.IsNullOrWhiteSpace(searchTerm))
                query = query.Where(s => 
                    s.StudentCode.Contains(searchTerm) || 
                    (s.KhmerName != null && s.KhmerName.Contains(searchTerm)) || 
                    (s.EnglishName != null && s.EnglishName.Contains(searchTerm)));

            if (programId.HasValue) query = query.Where(s => s.ProgramId == programId);
            if (gradeId.HasValue) query = query.Where(s => s.GradeId == gradeId);
            if (classId.HasValue) query = query.Where(s => s.ClassId == classId);
            if (!string.IsNullOrWhiteSpace(status)) query = query.Where(s => s.Status == status);

            var total = await query.CountAsync();
            var items = await query
                .OrderBy(s => s.StudentCode)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task<Student> AddAsync(Student student)
        {
            await _context.Students.AddAsync(student);
            await _context.SaveChangesAsync();
            return student;
        }

        public async Task UpdateAsync(Student student)
        {
            _context.Students.Update(student);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Student student)
        {
            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(string studentCode, int? ignoreId = null)
        {
            var query = _context.Students.AsQueryable();
            if (ignoreId.HasValue)
                query = query.Where(s => s.StudentId != ignoreId);
            
            return await query.AnyAsync(s => s.StudentCode == studentCode);
        }
    }
}
