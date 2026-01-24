using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SchoolERP.Core.Entities;
using SchoolERP.Core.Interfaces;
using SchoolERP.Infra.Persistence;

namespace SchoolERP.Infra.Repositories
{
    public class FinanceRepository : IFinanceRepository
    {
        private readonly SchoolErpDbContext _context;

        public FinanceRepository(SchoolErpDbContext context)
        {
            _context = context;
        }

        public async Task<Invoice?> GetInvoiceByIdAsync(int invoiceId)
        {
            return await _context.Invoices
                .Include(i => i.InvoiceItems)
                .Include(i => i.Payments)
                .Include(i => i.Student)
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
        }

        public async Task<IEnumerable<Invoice>> GetStudentInvoicesAsync(int studentId)
        {
            return await _context.Invoices
                .Include(i => i.InvoiceItems)
                .Include(i => i.Payments)
                .Where(i => i.StudentId == studentId)
                .OrderByDescending(i => i.IssueDate)
                .ToListAsync();
        }

        public async Task<Invoice> CreateInvoiceAsync(Invoice invoice)
        {
            await _context.Invoices.AddAsync(invoice);
            await _context.SaveChangesAsync();
            return invoice;
        }

        public async Task<Payment> RecordPaymentAsync(Payment payment)
        {
            var invoice = await _context.Invoices.Include(i => i.Payments).FirstOrDefaultAsync(i => i.InvoiceId == payment.InvoiceId);
            if (invoice != null)
            {
                invoice.Payments.Add(payment);
                invoice.PaidAmount += payment.Amount;
                invoice.Balance = invoice.TotalAmount - invoice.PaidAmount;
                
                if (invoice.Balance <= 0) invoice.Status = "Paid";
                else if (invoice.PaidAmount > 0) invoice.Status = "Partial";

                await _context.Payments.AddAsync(payment);
                _context.Invoices.Update(invoice);
                await _context.SaveChangesAsync();
            }
            return payment;
        }
    }
}
