using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SobotySTechnikou.Data;
using SobotySTechnikou.Models;
using SobotySTechnikou.ViewModels;
using System.Collections.Generic;
using System.Security.Claims;

namespace SobotySTechnikou.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        public UserIdentificator Get()
        {
            var userId = User.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
            return new UserIdentificator { Id = userId };
        }

        [Authorize]
        [HttpGet("UserInfo")]
        public async Task<ActionResult<UserVM>> GetUser()
        {
            var userId = User.Claims.Where(x=>x.Type == ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
            if (userId is null)
                return BadRequest();
            var userInfo = await _context.Users
                .Where(x => x.Id == userId)
                .Select(x => new UserVM
                {
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    BirthDate = DateTime.Parse(x.BirthDate),
                    Gender = x.Gender,
                    School = x.School,
                    Year = x.Year,
                    PotentionalStudent = x.PotentionalStudent,
                    Condition = x.Condition,
                    UserName = x.UserName,
                    Email = x.Email,
                    PhoneNumber = x.PhoneNumber,
                }).FirstOrDefaultAsync();
            if (userInfo is null)
                return NotFound();
            return Ok(userInfo);
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet("AllUsers")]
        public async Task<ActionResult<ICollection<ApplicationUser>>> GetAll()
        {
            return await _context.Users.Where(x => x.Id != "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX").ToListAsync();
        }

        [Authorize(Policy = "Administrator")]
        [HttpPost("{userId}/ChangeAuthorization/{function}")]
        public async Task<ActionResult> UserAddPolicy(string userId, string function)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(function))
                return BadRequest();
            var policy = _context.Roles.Where(x => x.Name == function).FirstOrDefault();
            var user = await _context.Users.FindAsync(userId);
            if ((user is null) || (policy is null))
                return NotFound();
            IdentityUserRole<string> userRole = new IdentityUserRole<string>
            {
                RoleId = policy.Id,
                UserId = user.Id,
            };
            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetUsersByRole", new { roleid = policy.Id }, user);
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet("{roleId}")]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetUsersByRole(string roleId)
        {
            if (roleId is null)
                return BadRequest();
            List<string> userIds = await _context.UserRoles
                .Where(x => x.RoleId == roleId)
                .Select(x => x.UserId)
                .ToListAsync();
            List<ApplicationUser> users = new List<ApplicationUser>();
            foreach (var a in userIds)
            {
                var user = await _context.Users.FindAsync(a);
                if (user != null)
                    users.Add(user);
            }
            if (users.Count <= 0)
                return NotFound();
            return Ok(users);
        }
    }
}