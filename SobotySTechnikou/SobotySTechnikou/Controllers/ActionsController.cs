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
    public class ActionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ActionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Models.Action>>> Get(string? name, int? year, bool? isActive, bool? availability)
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
        [HttpGet("{year}/{nameId}")]
        public async Task<ActionResult<ActionVM>> GetAction(string nameId, int year)
        {
            var action = await _context.Actions.Where(x => x.NameId == nameId && year == year)
                .Include(x=>x.Creator)
                .Select(x => new ActionVM
                {
                    Id = x.Id,
                    Name = x.Name,
                    Year = x.Year,
                    Start = x.Start.ToString(),
                    End = x.End.ToString(),
                    Active = x.Active,
                    Availability = x.Availability,
                    Description = x.Description,
                    CreateTime=x.CreatedAt.ToString(),
                    UpdateTime = x.UpdatedAt.ToString(),
                    CreatorName = $"{x.Creator.FirstName} {x.Creator.LastName}",
                    Type = x.FormOfAction
                }).FirstOrDefaultAsync();
            if(action is null)
                return NotFound();
            return Ok(action);
        }

        [Authorize] //(Roles = "Administrator, Lector")
        [HttpPut]
        public async Task<ActionResult> PutAction(ActionIM actionInput)
        {
            if (actionInput == null)
                return BadRequest();
            var action = await _context.Actions.Where(x => x.Id == actionInput.Id).FirstOrDefaultAsync();

            action.Name = actionInput.Name;
            action.NameId = actionInput.Name.Replace(" ", "_");
            action.Description = actionInput.Description;
            action.Year = actionInput.Year;
            action.Start = DateTime.Parse(actionInput.Start);
            action.End = DateTime.Parse(actionInput.End);
            action.Active = actionInput.Active;
            action.Availability = actionInput.Availability;
            action.UpdatedAt = DateTime.Now;
            action.FormOfAction = actionInput.FormOfAction;

            _context.Entry(action).State = EntityState.Modified;
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
            var existAction = await _context.Actions.Where(x=>x.NameId == actionInput.Name && x.Year == actionInput.Year).ToListAsync();
            if (existAction.Count > 0)
                return StatusCode(418);
            var userId = User.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value;
            Models.Action action = new Models.Action
            {
                Id = Guid.NewGuid().ToString(),
                NameId = actionInput.Name.Replace(" ", "_"),
                Name = actionInput.Name,
                Description = actionInput.Description,
                Year = actionInput.Year,
                Start = DateTime.Parse(actionInput.Start),
                End = DateTime.Parse(actionInput.End),
                FormOfAction = actionInput.FormOfAction,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Active = actionInput.Active,
                Availability = actionInput.Availability,
                CreatorId = userId,
            };
            action.Creator = _context.Users.Where(x => x.Id==userId).FirstOrDefault();
            _context.Actions.Add(action);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetAction", new { id = action.Id }, action);
        }

        [Authorize]//(Roles = "Administrator, Lector")
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAction(string id)
        {
            if (String.IsNullOrEmpty(id) || id == "XXXXXXXX-XXXX-AKCE-XXXX-XXXXXXXXXXXX")
                return BadRequest();
            var action = await _context.Actions.FindAsync(id);
            if (action is null)
                return NotFound();
            var defAction = _context.Actions.Where(x => x.Id=="XXXXXXXX-XXXX-AKCE-XXXX-XXXXXXXXXXXX").FirstOrDefault();
            var groups = _context.Groups.Where(x => x.ActionId == action.Id).ToList();
            foreach (var group in groups)
            {
                group.ActionId = defAction.Id;
                group.Open = false;
                _context.Entry(group).State = EntityState.Modified;
            }
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
