using System.Collections.Generic;
using System.Threading.Tasks;
using SchoolERP.Core.Entities;

namespace SchoolERP.Core.Interfaces
{
    public interface IFeeRepository
    {
        Task<IEnumerable<FeeTemplate>> GetTemplatesAsync(int campusId);
        Task<FeeTemplate?> GetTemplateByIdAsync(int id);
        Task<FeeTemplate> AddTemplateAsync(FeeTemplate template);
        
        Task<StudentFeePlan> AssignFeePlanAsync(StudentFeePlan plan);
        Task<IEnumerable<StudentFeePlan>> GetStudentFeePlansAsync(int studentId);
    }
}
