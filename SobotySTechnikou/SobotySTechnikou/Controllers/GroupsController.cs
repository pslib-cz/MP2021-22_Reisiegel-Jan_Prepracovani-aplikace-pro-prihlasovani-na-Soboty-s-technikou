﻿using Microsoft.AspNetCore.Authorization;
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
        public async Task<ActionResult<IEnumerable<GroupVM>>> Get(string? name, string? actionName, bool? open)
        {
            IQueryable<GroupVM> groups = _context.Groups
                .Include(x=>x.Action)
                .Select(x => new GroupVM
                {
                    Name = x.Name,
                    Capacity = x.Capacity,
                    Open = x.Open,
                    ActionName = x.Action.Name,
                    Year = x.Action.Year,
                    ActionNameId = x.Action.NameId,
                    NameId = x.NameId
                });
            if (!String.IsNullOrEmpty(name))
            {
                groups = groups.Where(x=>x.Name == name);
            }
            if (!String.IsNullOrEmpty(actionName))
            {
                groups = groups.Where(x => x.Action.Name == actionName);
            }
            if(open != null)
            {
                groups.Where(x=>x.Open == open);
            }
            return await groups.ToListAsync();
        }

        [Authorize]
        [HttpGet("{year}/{actionNameId}/{groupNameId}")]
        public async Task<ActionResult<GroupVM>> GetGroup(string actionNameId, string groupNameId, int year )
        {
            var group = await _context.Groups
                .Include(x=>x.Action)
                .Include(x=>x.HeadLector)
                .Where(x => x.Action.NameId == actionNameId && x.Action.Year == year && x.NameId == groupNameId)
                .Select(x => new GroupVM
                {
                    Name = x.Name,
                    HeadLectorId = x.HeadLectorId,
                    HeadLectorName = $"{x.HeadLector.FirstName} {x.HeadLector.LastName}",
                    NoteForLectors = x.NoteForLectors,
                    NumberOfLectors = x.NumberOfLectors,
                    Capacity = x.Capacity,
                    MinYearToEnter = x.MinimalYear,
                    Open = x.Open,
                    Description = x.Description,
                    Note = x.Note,
                    ActionId = x.ActionId,
                    Id = x.Id,
                    Action = new ActionVM
                    {
                        Name = x.Action.Name,
                        Year = x.Action.Year,
                        Start = x.Action.Start.ToString(),
                        End = x.Action.End.ToString(),
                        Active = x.Action.Active,
                        Description = x.Description
                    }
                }).FirstOrDefaultAsync();
            group.Users = _context.UsersInGroups.Include(x => x.User).Where(x => x.GroupId==group.Id)
                .Select(x => new UserVM
                {
                    FirstName = x.User.FirstName,
                    LastName = x.User.LastName,
                    BirthDate = x.User.BirthDate.ToString(),
                    Gender = x.User.Gender,
                    Year = x.User.Year,
                    Email = x.User.Email,
                    UserSetInGroup = x.CreatedAt.ToString()
                }).ToList();

            if (group == null)
            {
                return NotFound();
            }

            group.Action = _context.Actions.Where(x => x.Id == group.ActionId)
                .Select(x => new ActionVM
                {
                    Name = x.Name,
                    Year = x.Year,
                    Start = x.Start.ToString(),
                    End = x.End.ToString(),
                    Active = x.Active,
                    Description = x.Description,
                }).FirstOrDefault();

            group.Users = _context.UsersInGroups.Include(x => x.Group).Where(x => x.GroupId == group.Id)
                .Select(x => new UserVM
                {
                    FirstName = x.User.FirstName,
                    LastName = x.User.LastName,
                    Email = x.User.Email,
                    Gender = x.User.Gender,
                    BirthDate = DateTime.Parse(x.User.BirthDate).ToShortDateString(),
                    Year = x.User.Year,
                    UserSetInGroup = x.CreatedAt.ToString()
                }).ToList();
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
                NameId = group.Name.Replace(" ", "_"),
                Description = group.Description,
                Capacity = group.Capacity,
                Open = group.Open,
                HeadLectorId = group.HeadLectorId,
                HeadLector = _context.Users.Find(group.HeadLectorId),
                ActionId = group.ActionId,
                Action = _context.Actions.Find(group.ActionId),
                CreateTime = DateTime.Now,
                UpdatedTime = DateTime.Now,
                NumberOfLectors = group.NumberOfLectors,
                NoteForLectors = group.NoteForLectors,
                Note = group.Note
            };
            newGroup.MinimalYear = group.MinYear switch
            {
                0 => Year.none,
                1 => Year.Class7,
                2 => Year.Class8,
                3 => Year.Class9,
                4 => Year.Class10,
                _ => Year.none
            };
            var actionGroups = _context.Groups.Where(x => x.ActionId == newGroup.ActionId && x.Name == newGroup.Name).ToList();
            if (actionGroups != null)
                return BadRequest();
            _context.Groups.Add(newGroup);
            await _context.SaveChangesAsync();
            return StatusCode(201);//CreatedAtAction("GetGroup", new { id = newGroup.Id }, newGroup);
        }

        [Authorize] //(Roles = "Administrator, Lector")
        [HttpPut]
        public async Task<ActionResult> Put(GroupIM inputGroup)
        {
            var group = _context.Groups.Find(inputGroup.Id);
            group.Name = inputGroup.Name;
            group.Description = inputGroup.Description;
            group.Capacity = inputGroup.Capacity;
            group.Open = inputGroup.Open;
            group.HeadLectorId = inputGroup.HeadLectorId;
            group.HeadLector = await _context.Users.FindAsync(inputGroup.HeadLectorId);
            group.ActionId = inputGroup.ActionId;
            group.Action = _context.Actions.Find(inputGroup.ActionId);
            group.UpdatedTime = DateTime.Now;
            group.NoteForLectors = inputGroup.NoteForLectors;
            group.Note = inputGroup.Note;

            _context.Entry(group).State = EntityState.Modified;
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
            var usersInGroup = _context.UsersInGroups.Where(x => x.GroupId == group.Id).ToList();
            foreach (var user in usersInGroup)
            {
                _context.UsersInGroups.Remove(user);
            }
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
