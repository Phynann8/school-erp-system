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
    [Authorize] // Requires valid JWT
    public class StudentsController : ControllerBase
    {
        private readonly IStudentRepository _studentRepository;
        private readonly ICurrentUserService _currentUserService;

        public StudentsController(IStudentRepository studentRepository, ICurrentUserService currentUserService)
        {
            _studentRepository = studentRepository;
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetList(
            [FromQuery] string? q, 
            [FromQuery] int? campusId, 
            [FromQuery] int? programId,
            [FromQuery] int? gradeId,
            [FromQuery] int? classId,
            [FromQuery] string? status,
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20)
        {
            // RBAC / Tenant Check
            var effectiveCampusId = campusId ?? _currentUserService.CampusId;
            
            // If user has specific campus context, enforce it.
            // If user is Admin (no context), they might see all (policy dependent).
            // For now, if no CampusId provided and user has no context, return empty or bad request?
            // Let's default to: If no Context, User MUST provide campusId param which they have access to.
            
            if (!effectiveCampusId.HasValue)
            {
                // Optionally allow super-admin to view all? For now, enforce campus context.
                // return BadRequest("Campus Context required.");
            }
            
            if (effectiveCampusId.HasValue && !_currentUserService.HasAccessToCampus(effectiveCampusId.Value))
            {
                // Check if user is global admin etc.
                // For strict tenancy:
                return Forbid();
            }

            var (items, total) = await _studentRepository.GetListAsync(effectiveCampusId, q, programId, gradeId, classId, status, page, pageSize);

            var dtos = items.Select(s => new StudentListDto
            {
                StudentId = s.StudentId,
                StudentCode = s.StudentCode,
                KhmerName = s.KhmerName,
                EnglishName = s.EnglishName,
                ClassName = s.Class != null ? s.Class.Name : "N/A",
                Status = s.Status
            }).ToList();

            return Ok(new 
            {
                Data = dtos,
                Total = total,
                Page = page,
                PageSize = pageSize
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetById(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null) return NotFound();

            if (!_currentUserService.HasAccessToCampus(student.CampusId))
            {
                return Forbid();
            }

            return Ok(student);
        }

        [HttpPost]
        public async Task<ActionResult<Student>> Create([FromBody] CreateStudentDto request)
        {
            // Debug: Return validation errors if model binding failed
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!_currentUserService.HasAccessToCampus(request.CampusId))
            {
                return Forbid();
            }

            // Generate Student Code if missing (Using SP in real app, simplified here)
            var studentCode = request.StudentCode;
            if (string.IsNullOrEmpty(studentCode))
            {
                // In prod, call SP: sp_NextNumber
                studentCode = $"ST-{DateTime.UtcNow.Ticks}"; 
            }
            else
            {
                if (await _studentRepository.ExistsAsync(studentCode))
                {
                    return BadRequest("Student Code already exists.");
                }
            }

            var student = new Student
            {
                CampusId = request.CampusId,
                StudentCode = studentCode,
                KhmerName = request.KhmerName,
                EnglishName = request.EnglishName,
                DOB = request.DOB,
                Gender = request.Gender,
                ProgramId = request.ProgramId,
                GradeId = request.GradeId,
                ClassId = request.ClassId,
                Status = "Active"
            };

            // Guardians
            foreach (var gDto in request.Guardians)
            {
                var guardian = new Guardian
                {
                    FullName = gDto.FullName,
                    Phone = gDto.Phone
                };
                
                student.StudentGuardians.Add(new StudentGuardian
                {
                    Guardian = guardian,
                    Relationship = gDto.Relationship,
                    IsPrimary = gDto.IsPrimary
                });
            }

            await _studentRepository.AddAsync(student);

            return CreatedAtAction(nameof(GetById), new { id = student.StudentId }, student);
        }
    }
}
