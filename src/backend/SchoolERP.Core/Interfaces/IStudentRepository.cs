using System.Collections.Generic;
using System.Threading.Tasks;
using SchoolERP.Core.Entities;

namespace SchoolERP.Core.Interfaces
{
    public interface IStudentRepository
    {
        Task<Student?> GetByIdAsync(int id);
        Task<Student?> GetByCodeAsync(string code);
        Task<(IEnumerable<Student> Items, int Total)> GetListAsync(int? campusId, string? searchTerm, int? programId, int? gradeId, int? classId, string? status, int page, int pageSize);
        Task<Student> AddAsync(Student student);
        Task UpdateAsync(Student student);
        Task DeleteAsync(Student student); // Soft delete if needed, or hard
        Task<bool> ExistsAsync(string studentCode, int? ignoreId = null);
    }
}
