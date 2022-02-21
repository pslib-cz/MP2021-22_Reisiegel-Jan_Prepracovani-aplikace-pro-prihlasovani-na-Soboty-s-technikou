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
    public class ActionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ActionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Models.Action>>> Get(string name, int? year, bool? isActive, bool? availability)
        {
            IQueryable<SobotySTechnikou.Models.Action> actions = _context.Actions;
            if (!String.IsNullOrEmpty(name))
            {
                actions = actions.Where(x=>x.Name.Contains(name));
            }
            if (year != null)
            {
                actions = actions.Where(x => x.Year.ToString().Contains(year.ToString()));
            }
            if(isActive != null)
            {
                actions = actions.Where(x=>x.Active == isActive);
            }
            if (availability != null)
            {
                actions = actions.Where(x=>x.Availability == availability);
            }
            return await actions.ToListAsync();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Models.Action>> GetAction(string id)
        {
            var action = await _context.Actions.FindAsync(id);
            if(action is null)
                return NotFound();
            return Ok(action);
        }

        [Authorize] //(Roles = "Administrator, Lector")
        [HttpPut]
        public async Task<ActionResult> PutAction(Models.Action actionInput)
        {
            if (actionInput == null)
                return BadRequest();
            _context.Entry(actionInput).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActionExists(actionInput.Id))
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
        [HttpPost]
        public async Task<ActionResult<Models.Action>> PostAction(ActionIM actionInput)
        {
            if (actionInput == null)
                return BadRequest();
            var existAction = await _context.Actions.Where(x=>x.Name == actionInput.Name && x.Year == actionInput.Year).ToListAsync();
            if (existAction != null)
                return StatusCode(418);
            Models.Action action = new Models.Action
            {
                Id = Guid.NewGuid().ToString(),
                Name = actionInput.Name,
                Description = actionInput.Description,
                Year = actionInput.Year,
                Start = actionInput.Start,
                End = actionInput.End,
                FormOfAction = actionInput.FormOfAction,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Active = actionInput.Active,
                Availability = actionInput.Availability,
            };
            _context.Actions.Add(action);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetAction", new { id = action.Id }, action);
        }

        [Authorize]//(Roles = "Administrator, Lector")
        [HttpDelete]
        public async Task<ActionResult> DeleteAction(string id)
        {
            if (String.IsNullOrEmpty(id))
                return BadRequest();
            var action = await _context.Actions.FindAsync(id);
            if (action is null)
                return NotFound();
            _context.Actions.Remove(action);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpGet("{id}/Groups")]
        public async Task<ActionResult<ICollection<Group>>> GetActionGroups(string id)
        {
            if (id == null)
                return BadRequest();
            var action = await _context.Actions.FindAsync(id);
            if (action is null)
                return NotFound();
            var groups = await _context.Groups
                .Where(x => x.ActionId == id)
                .ToListAsync();
            return Ok(groups);
        }

        [Authorize]
        [HttpGet("Selector")]
        public async Task<ActionResult<ICollection<MySelector>>> GetActionsSelector()
        {
            var actions = await _context.Actions.Select(x => new MySelector
            {
                Label = $"{x.Year}/{x.Name}",
                Value = x.Id
            }).ToListAsync();
            if (actions == null)
                return NoContent();
            return Ok(actions);
        }

        private bool ActionExists(string id)
        {
            return _context.Actions.Any(e => e.Id == id);
        }
    }
}
