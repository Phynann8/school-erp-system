using System.Collections.Generic;
using System.Threading.Tasks;
using SchoolERP.Core.Entities;

namespace SchoolERP.Core.Interfaces
{
    public interface IFinanceRepository
    {
        Task<Invoice?> GetInvoiceByIdAsync(int invoiceId);
        Task<IEnumerable<Invoice>> GetStudentInvoicesAsync(int studentId);
        Task<Invoice> CreateInvoiceAsync(Invoice invoice);
        Task<Payment> RecordPaymentAsync(Payment payment);
    }
}
