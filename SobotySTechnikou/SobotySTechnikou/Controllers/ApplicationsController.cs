using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SobotySTechnikou.Data;
using SobotySTechnikou.Models;
using SobotySTechnikou.ViewModels;
using System.Security.Claims;

namespace SobotySTechnikou.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public ApplicationsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [Authorize]
        [HttpPost("{groupId}/Enroll")]
        public async Task<IActionResult> AddUserToGroup(string groupId, string? userId = "")
        {
            if (String.IsNullOrEmpty(userId))
                userId = User.Claims.Where(x => x.Type==ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
            var group = _context.Groups.Find(groupId);
            var enrolled = _context.UsersInGroups.Include(x => x.Group).Where(x => x.UserId==userId && x.Group.ActionId == group.ActionId && x.CancelledAt == null).ToList();
            if (enrolled.Count > 0)
                return BadRequest();
            var userInGroup = new UserInGroup
            {
                Id = Guid.NewGuid().ToString(),
                UserId=userId,
                GroupId=groupId,
                CreatedAt=DateTime.Now,
                CreatedById = User.Claims.Where(x => x.Type==ClaimTypes.NameIdentifier).FirstOrDefault()?.Value,
                CancelledBy = null,
                CancelledById = null
            };
            _context.UsersInGroups.Add(userInGroup);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPut("{groupId}/Unenrol")]
        public async Task<IActionResult> RemoveUserfromGroup(string groupId, string? userId = "")
        {
            if (String.IsNullOrEmpty(userId))
                userId = User.Claims.Where(x => x.Type==ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
            var exist = _context.UsersInGroups.Where(x => x.UserId==userId && x.GroupId == groupId&&x.CancelledAt == null).FirstOrDefault();
            if (exist == null)
                return NotFound();
            exist.CancelledAt = DateTime.Now;
            exist.CancelledById = User.Claims.Where(x => x.Type==ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
            _context.Entry(exist).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApplicationsVM>>> GetAllApplications(string? lastName, string? actionId)
        {
            IQueryable<UserInGroup> applications = _context.UsersInGroups
                .Include(x => x.User)
                .Include(x => x.Group)
                .Include(x => x.Group.Action)
                .Include(x => x.CreatedBy)
                .Include(x => x.CancelledBy);
            if (!String.IsNullOrEmpty(lastName))
            {
                applications = applications.Where(x => x.User.LastName == lastName);
            }
            if (!String.IsNullOrEmpty(actionId))
            {
                applications = applications.Where(x=>x.Group.ActionId == actionId);
            }
            return applications.Select(x => new ApplicationsVM
            {
                FirstName = x.User.FirstName,
                LastName=x.User.LastName,
                Year = x.Group.Action.Year,
                ActionName = x.Group.Action.Name,
                GroupName = x.Group.Name,
                CreateDate = x.CreatedAt.ToString(),
                CreatedBy = x.CreatedBy.FirstName + " " + x.CreatedBy.LastName,
                CancelledBy = x.CancelledBy.FirstName + " " + x.CancelledBy.LastName,
                CancelDate = x.CancelledAt.ToString()
            }).ToList();
        }
    }
}
