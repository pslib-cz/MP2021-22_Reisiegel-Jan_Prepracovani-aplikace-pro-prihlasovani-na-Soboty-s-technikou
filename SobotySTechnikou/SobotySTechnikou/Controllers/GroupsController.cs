using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SobotySTechnikou.Data;
using SobotySTechnikou.Models;
using SobotySTechnikou.ViewModels;

namespace SobotySTechnikou.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GroupsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Group>>> Get(string name, SobotySTechnikou.Models.Action action, bool open)
        {
            IQueryable<Group> groups = _context.Groups
                .Include(x => x.Action);
            return await groups.ToListAsync();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Group>> GetGroup(string id)
        {
            var group = await _context.Groups.FindAsync(id);

            if (group == null)
            {
                return NotFound();
            }

            return Ok(group);
        }

        [Authorize] //(Roles = "Administrator, Lector")
        [HttpPost]
        public async Task<ActionResult<Group>> Post(GroupIM group)
        {
            if (group == null)
                return BadRequest();
            Group newGroup = new Group
            {
                Id = Guid.NewGuid().ToString(),
                Name = group.Name,
                Description = group.Description,
                Capacity = group.Capacity,
                Open = group.Open,
                HeadLectorId = group.HeadLectorId,
                HeadLector = _context.Users.Find(group.HeadLectorId),
                ActionId = group.ActionId,
                Action = _context.Actions.Find(group.ActionId),
                CreateTime = DateTime.Now,
                UpdatedTime = DateTime.Now,
            };
            _context.Groups.Add(newGroup);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetGroup", new { id = newGroup.Id }, newGroup);
        }

        [Authorize] //(Roles = "Administrator, Lector")
        [HttpPut]
        public async Task<ActionResult> Put(Group inputGroup)
        {
            _context.Entry(inputGroup).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GroupExists(inputGroup.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok();
        }

        [Authorize] //(Roles = "Administrator, Lector")
        [HttpDelete]
        public async Task<ActionResult> Delete(string id)
        {
            if (String.IsNullOrEmpty(id))
                return BadRequest();
            var group = await _context.Groups.FindAsync(id);
            if (group is null)
                return NotFound();
            _context.Groups.Remove(group);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize] //(Roles = "Administrator, Lector")
        [HttpGet("{id}/Users")]
        public async Task<ActionResult<ICollection<ApplicationUser>>> GetUsers(string id)
        {
            if (id is null)
                return BadRequest();
            var group = await _context.Groups.FindAsync(id);
            if (group is null)
                return NotFound();

            var users = await _context.UsersInGroups
                .Include(x => x.User)
                .Include(x => x.Group)
                .Where(x => x.GroupId == id)
                .Select(x => x.User)
                .ToListAsync();
            if (users is null)
                return NoContent();
            else
                return Ok(users);
        }

        [Authorize]
        [HttpGet("{id}/HeadLector")]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetHeadLector(string id)
        {
            var group = await _context.Groups.FindAsync(id);
            if (group is null)
                return NotFound();
            var user = await _context.Users.FindAsync(group.HeadLectorId);
            return Ok(user);
        }

        private bool GroupExists(string id)
        {
            return _context.Groups.Any(e => e.Id == id);
        }
    }
}
