using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.Core.Interfaces;
using SchoolERP.Infra.Persistence;

namespace SchoolERP.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly SchoolErpDbContext _db;
        private readonly ICurrentUserService _currentUserService;

        public ReportsController(SchoolErpDbContext db, ICurrentUserService currentUserService)
        {
            _db = db;
            _currentUserService = currentUserService;
        }

        /// <summary>
        /// Daily Cashbox Report - Shows all payments collected by cashier on a given date
        /// </summary>
        [HttpGet("daily-cashbox")]
        public async Task<ActionResult> GetDailyCashbox([FromQuery] DateTime? date, [FromQuery] int? campusId)
        {
            var reportDate = date ?? DateTime.Today;
            var effectiveCampusId = campusId ?? _currentUserService.CampusId;

            if (effectiveCampusId.HasValue && !_currentUserService.HasAccessToCampus(effectiveCampusId.Value))
            {
                return Forbid();
            }

            var payments = await _db.Payments
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.Student)
                .Where(p => p.PaymentDate.Date == reportDate.Date)
                .Where(p => !effectiveCampusId.HasValue || p.Invoice.Student.CampusId == effectiveCampusId.Value)
                .Select(p => new
                {
                    p.PaymentId,
                    p.ReceiptNumber,
                    PaymentDate = p.PaymentDate,
                    p.Amount,
                    p.PaymentMethod,
                    p.ReferenceNumber,
                    InvoiceNumber = p.Invoice.InvoiceNumber,
                    StudentCode = p.Invoice.Student.StudentCode,
                    StudentName = p.Invoice.Student.EnglishName ?? p.Invoice.Student.KhmerName,
                    CampusId = p.Invoice.Student.CampusId,
                    p.IsVoided
                })
                .OrderBy(p => p.PaymentDate)
                .ToListAsync();

            var summary = new
            {
                ReportDate = reportDate.ToString("yyyy-MM-dd"),
                CampusId = effectiveCampusId,
                TotalTransactions = payments.Count,
                TotalCash = payments.Where(p => p.PaymentMethod == "Cash").Sum(p => p.Amount),
                TotalBankTransfer = payments.Where(p => p.PaymentMethod == "BankTransfer").Sum(p => p.Amount),
                TotalKHQR = payments.Where(p => p.PaymentMethod == "KHQR").Sum(p => p.Amount),
                TotalCheque = payments.Where(p => p.PaymentMethod == "Cheque").Sum(p => p.Amount),
                GrandTotal = payments.Sum(p => p.Amount),
                Transactions = payments
            };

            return Ok(summary);
        }

        /// <summary>
        /// Outstanding Debt Report - Students with unpaid balances
        /// </summary>
        [HttpGet("outstanding-debt")]
        public async Task<ActionResult> GetOutstandingDebt([FromQuery] int? campusId, [FromQuery] int? gradeId)
        {
            var effectiveCampusId = campusId ?? _currentUserService.CampusId;

            if (effectiveCampusId.HasValue && !_currentUserService.HasAccessToCampus(effectiveCampusId.Value))
            {
                return Forbid();
            }

            // Simplified query - fetch data first, then group on client side
            var invoicesWithDebt = await _db.Invoices
                .Include(i => i.Student)
                    .ThenInclude(s => s.Class)
                .Where(i => i.Balance > 0)
                .Where(i => !effectiveCampusId.HasValue || i.Student.CampusId == effectiveCampusId.Value)
                .Where(i => !gradeId.HasValue || (i.Student.Class != null && i.Student.Class.GradeId == gradeId.Value))
                .Select(i => new
                {
                    i.StudentId,
                    i.Student.StudentCode,
                    StudentName = i.Student.EnglishName ?? i.Student.KhmerName,
                    ClassName = i.Student.Class != null ? i.Student.Class.Name : "N/A",
                    i.Student.CampusId,
                    i.Balance,
                    i.DueDate
                })
                .ToListAsync();

            var debtors = invoicesWithDebt
                .GroupBy(i => new { i.StudentId, i.StudentCode, i.StudentName, i.ClassName, i.CampusId })
                .Select(g => new
                {
                    g.Key.StudentId,
                    g.Key.StudentCode,
                    g.Key.StudentName,
                    g.Key.ClassName,
                    g.Key.CampusId,
                    TotalInvoices = g.Count(),
                    TotalOwed = g.Sum(i => i.Balance),
                    OldestDueDate = g.Min(i => i.DueDate)
                })
                .OrderByDescending(d => d.TotalOwed)
                .Take(100)
                .ToList();

            var summary = new
            {
                CampusId = effectiveCampusId,
                TotalDebtors = debtors.Count,
                TotalOutstandingAmount = debtors.Sum(d => d.TotalOwed),
                Debtors = debtors
            };

            return Ok(summary);
        }

        /// <summary>
        /// Enrollment Stats - Student counts by status
        /// </summary>
        [HttpGet("enrollment-stats")]
        public async Task<ActionResult> GetEnrollmentStats([FromQuery] int? campusId)
        {
            var effectiveCampusId = campusId ?? _currentUserService.CampusId;

            if (effectiveCampusId.HasValue && !_currentUserService.HasAccessToCampus(effectiveCampusId.Value))
            {
                return Forbid();
            }

            var stats = await _db.Students
                .Where(s => !effectiveCampusId.HasValue || s.CampusId == effectiveCampusId.Value)
                .GroupBy(s => s.Status)
                .Select(g => new
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var totalActive = stats.FirstOrDefault(s => s.Status == "Active")?.Count ?? 0;

            return Ok(new
            {
                CampusId = effectiveCampusId,
                TotalActive = totalActive,
                TotalStudents = stats.Sum(s => s.Count),
                ByStatus = stats
            });
        }

        /// <summary>
        /// Daily Income Summary - Total income by category for a given date range
        /// </summary>
        [HttpGet("daily-income")]
        public async Task<ActionResult> GetDailyIncome([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int? campusId)
        {
            var start = startDate ?? DateTime.Today;
            var end = endDate ?? DateTime.Today;
            var effectiveCampusId = campusId ?? _currentUserService.CampusId;

            if (effectiveCampusId.HasValue && !_currentUserService.HasAccessToCampus(effectiveCampusId.Value))
            {
                return Forbid();
            }

            var dailySummary = await _db.Payments
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.Student)
                .Where(p => p.PaymentDate.Date >= start.Date && p.PaymentDate.Date <= end.Date)
                .Where(p => !effectiveCampusId.HasValue || p.Invoice.Student.CampusId == effectiveCampusId.Value)
                .GroupBy(p => p.PaymentDate.Date)
                .Select(g => new
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    TotalAmount = g.Sum(p => p.Amount),
                    TransactionCount = g.Count()
                })
                .OrderBy(d => d.Date)
                .ToListAsync();

            return Ok(new
            {
                StartDate = start.ToString("yyyy-MM-dd"),
                EndDate = end.ToString("yyyy-MM-dd"),
                CampusId = effectiveCampusId,
                TotalIncome = dailySummary.Sum(d => d.TotalAmount),
                DailySummary = dailySummary
            });
        }
    }
}
