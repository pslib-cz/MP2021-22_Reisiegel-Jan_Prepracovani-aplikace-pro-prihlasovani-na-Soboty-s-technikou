using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SobotySTechnikou.Data;
using SobotySTechnikou.Models;
using SobotySTechnikou.Prints.ViewModels;
using SobotySTechnikou.Services;
using SobotySTechnikou.ViewModels;
using System.Security.Claims;
using System.Text;

namespace SobotySTechnikou.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly RazorViewToStringRenderer _razorRenderer;

        public ApplicationsController(ApplicationDbContext context, RazorViewToStringRenderer razorRenderer)
        {
            _context = context;
            _razorRenderer = razorRenderer;
        }
        
        [Authorize]
        [HttpPost("Enroll")]
        public async Task<IActionResult> AddUserToGroup(ApplicationsIM application)
        {
            string userId = "";
            if (String.IsNullOrEmpty(application.UserId))
                userId = User.Claims.Where(x => x.Type==ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
            else
                userId = application.UserId;
            var group = _context.Groups.Find(application.GroupId);
            var enrolled = _context.UsersInGroups.Include(x => x.Group).Where(x => x.UserId==userId && x.Group.ActionId == group.ActionId && x.CancelledAt == null).ToList();
            if (enrolled.Count > 0)
                return BadRequest();
            var userInGroup = new UserInGroup
            {
                Id = Guid.NewGuid().ToString(),
                UserId=userId,
                GroupId=application.GroupId,
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
        [HttpPut("Unenroll")]
        public async Task<IActionResult> RemoveUserfromGroup(ApplicationsIM application)
        {
            string userId = "";
            if (String.IsNullOrEmpty(application.UserId))
                userId = User.Claims.Where(x => x.Type==ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
            else userId = application.UserId;
            var exist = _context.UsersInGroups.Where(x => x.UserId==userId && x.GroupId == application.GroupId&&x.CancelledAt == null).FirstOrDefault();
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
        public async Task<ActionResult<IEnumerable<ApplicationsVM>>> GetAllApplications(string? lastName, string? actionName, string? groupName, int? actionYear)
        {
            IQueryable<UserInGroup> applications = _context.UsersInGroups
                .Include(x => x.User)
                .Include(x => x.Group)
                .Include(x => x.Group.Action)
                .Include(x => x.CreatedBy)
                .Include(x => x.CancelledBy);
            if (!String.IsNullOrEmpty(lastName))
            {
                applications = applications.Where(x => x.User.LastName.Contains(lastName));
            }
            if (!String.IsNullOrEmpty(actionName))
            {
                applications = applications.Where(x=>x.Group.Action.Name.Contains(actionName));
            }
            if (!String.IsNullOrEmpty(groupName))
            {
                applications = applications.Where(x => x.Group.Name.Contains(groupName));
            }
            if (actionYear != null && actionYear > 0)
            {
                applications = applications.Where(x => x.Group.Action.Year.ToString().Contains(actionYear.ToString()));
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

        [Authorize]
        [HttpGet("Print")]
        public async Task<ActionResult> DownloadCertificate(string? userId, string? actionId)
        {
            if (String.IsNullOrEmpty(userId))
                userId="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
            Models.Action action;
            if (!String.IsNullOrEmpty(actionId))
                 action = await _context.Actions.Where(x => x.Id==actionId).FirstOrDefaultAsync();
            else
                action = await _context.Actions.FirstOrDefaultAsync();
            var user = await _context.Users.Where(x => x.Id == userId).FirstOrDefaultAsync();
            string fileName = "/Prints/Pages/Certificate.cshtml";
            string outputFileName = $"certificate-{action.NameId}_{action.Year}-{user.FirstName}{user.LastName}";
            string documentBody = await _razorRenderer.RenderViewToStringAsync(fileName, new CertificatePrintVM
            {
                UserName = user.FirstName + " " + user.LastName,
                Gender = user.Gender,
                ActionName = action.Name,
                Date = action.Start.ToShortDateString()
              
            });
            MemoryStream memory = new(Encoding.UTF8.GetBytes(documentBody));
            return File(memory, "text/html", outputFileName + ".html");
        }
    }
}
