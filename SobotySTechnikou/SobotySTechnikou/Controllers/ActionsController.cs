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
        public async Task<ActionResult<IEnumerable<Models.Action>>> Get(string? name, int? year, bool? isActive, int? typeOfAction)
        {
            var userId = User.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
            var not = User.Claims.ToList();

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
            if (typeOfAction != null)
            {
                actions = typeOfAction switch
                {
                    0 => actions.Where(x => x.FormOfAction == ActionType.Online),
                    1 => actions.Where(x => x.FormOfAction == ActionType.Offline),
                    _ => actions
                };
            }
            return await actions.ToListAsync();
        }

        [Authorize(Policy = AuthorizationConstants.LECTOR_POLICY)]
        [HttpGet("{year}/{nameId}")]
        public async Task<ActionResult<ActionVM>> GetAction(string nameId, int year, bool? forEdit)
        {
            ActionVM action = null;
            if (forEdit == true)
            {
                action = await _context.Actions.Where(x => x.NameId == nameId && year == year)
                .Include(x => x.Creator)
                .Select(x => new ActionVM
                {
                    Id = x.Id,
                    Name = x.Name,
                    Year = x.Year,
                    Start = x.Start.ToString(DateFormats.EditTimeFormat),
                    End = x.End.ToString(DateFormats.EditTimeFormat),
                    Active = x.Active,
                    Availability = x.Availability,
                    Description = x.Description,
                    CreateTime=x.CreatedAt.ToString(DateFormats.CreateTimeFormat),
                    UpdateTime = x.UpdatedAt.ToString(DateFormats.CreateTimeFormat),
                    CreatorName = $"{x.Creator.FirstName} {x.Creator.LastName}",
                    Type = x.FormOfAction
                }).FirstOrDefaultAsync();
            }
            else
            {
                action = await _context.Actions.Where(x => x.NameId == nameId && year == year)
                .Include(x => x.Creator)
                .Select(x => new ActionVM
                {
                    Id = x.Id,
                    Name = x.Name,
                    Year = x.Year,
                    Start = x.Start.ToString(DateFormats.InfoDateTimeFormat),
                    End = x.End.ToString(DateFormats.InfoDateTimeFormat),
                    Active = x.Active,
                    Availability = x.Availability,
                    Description = x.Description,
                    CreateTime=x.CreatedAt.ToString(DateFormats.CreateTimeFormat),
                    UpdateTime = x.UpdatedAt.ToString(DateFormats.CreateTimeFormat),
                    CreatorName = $"{x.Creator.FirstName} {x.Creator.LastName}",
                    Type = x.FormOfAction
                }).FirstOrDefaultAsync();
                action.Groups = await _context.Groups.Where(x => x.ActionId == action.Id).Select(x => new GroupVM
                {
                    Id=x.Id,
                    Name=x.Name,
                    NameId=x.NameId,
                    Capacity = x.Capacity,
                    NumberOfLectors = x.NumberOfLectors,
                    Open= x.Open,
                    CountOfUsers = _context.UsersInGroups.Where(a => a.GroupId==x.Id && a.CancelledAt == null).Count()
                }).ToListAsync();
            }
            if(action is null)
                return NotFound();
            return Ok(action);
        }

        [Authorize(Policy = AuthorizationConstants.LECTOR_POLICY)]
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

        [Authorize(Policy = AuthorizationConstants.LECTOR_POLICY)]
        [HttpPost]
        public async Task<ActionResult<Models.Action>> PostAction(ActionIM actionInput)
        {
            if (actionInput == null)
                return BadRequest();
            var existAction = await _context.Actions.Where(x=>x.NameId == actionInput.Name && x.Year == actionInput.Year).ToListAsync();
            if (existAction.Count > 0)
                return BadRequest("Akce již existuje");
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

        [Authorize(Policy = AuthorizationConstants.LECTOR_POLICY)]
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

        [Authorize(Policy = AuthorizationConstants.LECTOR_POLICY)]
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

        [HttpGet("MainAction")]
        public async Task<ActionResult<ActionVM>> GetMainAction()
        {
            var action = await _context.Actions.Include(x => x.Creator).Where(x => x.Availability == true).OrderBy(x => x.Start).Select(x => new ActionVM
            {
                Id = x.Id,
                Name = x.Name,
                Year = x.Year,
                Start = x.Start.ToString(DateFormats.InfoDateTimeFormat),
                End = x.End.ToString(DateFormats.InfoDateTimeFormat),
                Active = x.Active,
                Availability = x.Availability,
                Description = x.Description,
                CreateTime = x.CreatedAt.ToString(),
                UpdateTime = x.UpdatedAt.ToString(),
                CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                Type = x.FormOfAction,
                UserIsInAction = false
            }).FirstOrDefaultAsync();

            if (action is null)
                return NoContent();

            action.Groups = await _context.Groups.Include(x => x.HeadLector).Where(x => x.ActionId==action.Id).Select(x => new GroupVM
            {
                Id=x.Id,
                NameId = x.NameId,
                Name = x.Name,
                Description = x.Description,
                Capacity = x.Capacity,
                Open = x.Open,
                HeadLectorName = x.HeadLector.FirstName +" "+x.HeadLector.LastName,
                NumberOfLectors = x.NumberOfLectors,
                Note = x.Note,
                MinYearToEnter = x.MinimalYear,
                CountOfUsers = _context.UsersInGroups.Where(c => c.GroupId == x.Id && c.CancelledAt == null).Count(),
                IsUserAdded = false
            }).ToListAsync();
            var userId = User.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
            if(userId != null)
            {
                foreach (var group in action.Groups)
                {
                    var usersIds = await _context.UsersInGroups.Where(x => x.GroupId == group.Id && x.CancelledAt == null).Select(x => x.UserId).ToListAsync();
                    if (usersIds.Contains(userId))
                    {
                        action.UserIsInAction = true;
                        group.IsUserAdded = true;
                    }
                    else
                    {
                        group.IsUserAdded = false;
                    }
                }
            }
            

            return Ok(action);
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
