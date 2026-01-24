using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolERP.Core.DTOs;
using SchoolERP.Core.Entities;
using SchoolERP.Core.Interfaces;

namespace SchoolERP.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FeesController : ControllerBase
    {
        private readonly IFeeRepository _feeRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly ICurrentUserService _currentUserService;

        public FeesController(IFeeRepository feeRepository, IStudentRepository studentRepository, ICurrentUserService currentUserService)
        {
            _feeRepository = feeRepository;
            _studentRepository = studentRepository;
            _currentUserService = currentUserService;
        }

        [HttpGet("templates")]
        public async Task<ActionResult<IEnumerable<FeeTemplateDto>>> GetTemplates([FromQuery] int? campusId)
        {
            var effectiveCampusId = campusId ?? _currentUserService.CampusId;

            if (!effectiveCampusId.HasValue || !_currentUserService.HasAccessToCampus(effectiveCampusId.Value))
            {
                return Forbid();
            }

            var templates = await _feeRepository.GetTemplatesAsync(effectiveCampusId.Value);

            var dtos = templates.Select(t => new FeeTemplateDto
            {
                FeeTemplateId = t.FeeTemplateId,
                Name = t.Name,
                Frequency = t.Frequency,
                IsActive = t.IsActive,
                Items = t.FeeTemplateItems.Select(i => new FeeTemplateItemDto
                {
                    FeeTemplateItemId = i.FeeTemplateItemId,
                    FeeName = i.FeeName,
                    Amount = i.Amount,
                    IsOptional = i.IsOptional
                }).ToList()
            });

            return Ok(dtos);
        }

        [HttpPost("templates")]
        public async Task<ActionResult<FeeTemplateDto>> CreateTemplate([FromBody] CreateFeeTemplateDto request)
        {
            if (!_currentUserService.HasAccessToCampus(request.CampusId))
            {
                return Forbid();
            }

            var template = new FeeTemplate
            {
                CampusId = request.CampusId,
                Name = request.Name,
                Frequency = request.Frequency,
                IsActive = true
            };

            foreach (var itemDto in request.Items)
            {
                template.FeeTemplateItems.Add(new FeeTemplateItem
                {
                    FeeName = itemDto.FeeName,
                    Amount = itemDto.Amount,
                    IsOptional = itemDto.IsOptional
                });
            }

            await _feeRepository.AddTemplateAsync(template);

            // Re-map to DTO
            var dto = new FeeTemplateDto
            {
                FeeTemplateId = template.FeeTemplateId,
                Name = template.Name,
                Frequency = template.Frequency,
                IsActive = template.IsActive,
                Items = template.FeeTemplateItems.Select(i => new FeeTemplateItemDto
                {
                    FeeTemplateItemId = i.FeeTemplateItemId,
                    FeeName = i.FeeName,
                    Amount = i.Amount,
                    IsOptional = i.IsOptional
                }).ToList()
            };

            return CreatedAtAction(nameof(GetTemplates), new { campusId = template.CampusId }, dto);
        }

        [HttpPost("plans/assign")]
        public async Task<ActionResult> AssignPlan([FromBody] AssignFeePlanDto request)
        {
            // Verify Student exists and User has access
            var student = await _studentRepository.GetByIdAsync(request.StudentId);
            if (student == null) return NotFound("Student not found");

            if (!_currentUserService.HasAccessToCampus(student.CampusId))
            {
                return Forbid();
            }

            // Verify Template (Optional: check campus match)
            var template = await _feeRepository.GetTemplateByIdAsync(request.FeeTemplateId);
            if (template == null) return NotFound("Template not found");
            
            if (template.CampusId != student.CampusId)
            {
                return BadRequest("Fee Template belongs to a different campus");
            }

            var plan = new StudentFeePlan
            {
                StudentId = request.StudentId,
                FeeTemplateId = request.FeeTemplateId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = "Active"
            };

            await _feeRepository.AssignFeePlanAsync(plan);

            return Ok(new { message = "Fee Plan Assigned Successfully" });
        }

        [HttpGet("plans/{studentId}")]
        public async Task<ActionResult<IEnumerable<StudentFeePlanDto>>> GetStudentPlans(int studentId)
        {
            var student = await _studentRepository.GetByIdAsync(studentId);
            if (student == null) return NotFound();

            if (!_currentUserService.HasAccessToCampus(student.CampusId))
            {
                return Forbid();
            }

            var plans = await _feeRepository.GetStudentFeePlansAsync(studentId);

            var dtos = plans.Select(p => new StudentFeePlanDto
            {
                StudentFeePlanId = p.StudentFeePlanId,
                FeeTemplateName = p.FeeTemplate.Name,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Status = p.Status,
                TotalAmount = p.FeeTemplate.FeeTemplateItems.Sum(i => i.Amount)
            });

            return Ok(dtos);
        }
    }
}
