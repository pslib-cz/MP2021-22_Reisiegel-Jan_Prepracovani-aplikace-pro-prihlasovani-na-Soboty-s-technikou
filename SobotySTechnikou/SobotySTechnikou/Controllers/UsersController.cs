﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SobotySTechnikou.Data;
using SobotySTechnikou.Models;
using SobotySTechnikou.Prints.ViewModels;
using SobotySTechnikou.Services;
using SobotySTechnikou.ViewModels;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

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
        public async Task<ActionResult<UserVM>> GetUser(string? mail)
        {
            string userId = "";
            if (String.IsNullOrEmpty(mail))
                userId = User.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
            else
                userId = _context.Users.Where(x => x.Email == mail).Select(x => x.Id).FirstOrDefault();
            if (userId is null)
                return BadRequest();
            var userInfo = await _context.Users
                .Where(x => x.Id == userId)
                .Select(x => new UserVM
                {
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    BirthDate = DateTime.Parse(x.BirthDate).ToShortDateString(),
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
            userInfo.Groups = await _context.UsersInGroups.Where(x => x.UserId == userId).Include(x => x.Group).Include(x => x.Group.Action)
                .Select(x => new GroupVM
                {
                    Id = x.Group.Id,
                    Name = x.Group.Name,
                    NameId = x.Group.NameId,
                    Description = x.Group.Description,
                    Year = x.Group.Action.Year,
                    ActionName = x.Group.Action.Name
                }).ToListAsync();
            return Ok(userInfo);
        }

        [Authorize]//(Roles = "Administrator")
        [HttpGet("AllUsers")]
        public async Task<ActionResult<ICollection<ApplicationUser>>> GetAll()
        {
            var allUsers = await _context.Users.ToListAsync();
            if (allUsers == null)
                return StatusCode(418);
            return allUsers;
        }

        [Authorize] //(Roles = "Administrator")
        [HttpPost("{userId}/ChangeAuthorization/{function}")]
        public async Task<ActionResult> UserAddPolicy(string userId, string function)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound();
            var userClaim = _context.UserClaims.Where(x=>x.UserId == user.Id).FirstOrDefault();
            var userRole = _context.UserRoles.Where(x => x.UserId == user.Id).FirstOrDefault();
            if (userClaim != null)
                _context.UserClaims.Remove(userClaim);
            if (userRole != null)
                _context.UserRoles.Remove(userRole);
            
            int newClaimId = _context.UserClaims.Count() + 1;
            var roleClaim = _context.RoleClaims.Where(x => x.ClaimType == function).FirstOrDefault();
            if (roleClaim == null)
            {
                await _context.SaveChangesAsync();
                return Ok();
            }
            if(function == "admin")
            {
                IdentityUserRole<string> newRole = new IdentityUserRole<string>
                {
                    RoleId = roleClaim.RoleId,
                    UserId = user.Id,
                };
                _context.UserRoles.Add(newRole);
                IdentityUserClaim<string> newClaim = new IdentityUserClaim<string>
                {
                    UserId = user.Id,
                    ClaimType = function,
                    ClaimValue = "1",
                };
                _context.UserClaims.Add(newClaim);
            }
            if(function == "lector")
            {
                IdentityUserRole<string> newRole = new IdentityUserRole<string>
                {
                    RoleId = roleClaim.RoleId,
                    UserId = user.Id,
                };
                _context.UserRoles.Add(newRole);
                IdentityUserClaim<string> newClaim = new IdentityUserClaim<string>
                {
                    UserId = user.Id,
                    ClaimType = function,
                    ClaimValue = "1",
                };
                _context.UserClaims.Add(newClaim);
            }
            


            /*var policy2 = _context.UserRoles.Where(x => x.UserId == userId).FirstOrDefault();
            if (policy2 != null)
                _context.UserRoles.Remove(policy2);
            
            var policy = _context.RoleClaims.Where(x => x.ClaimType == function); //_context.Roles.Where(x => x.Id == function).FirstOrDefault();
            var user = await _context.Users.FindAsync(userId);
            if ((user is null) || (policy is null))
                return NotFound();
            
            

            var lastClaimId = _context.UserClaims.OrderByDescending(x => x.Id).Select(x => x.Id).FirstOrDefault();
            if(function == "admin")
            {
                IdentityUserRole<string> userRole = new IdentityUserRole<string>
                {
                    RoleId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                    UserId = user.Id,
                };

            }
            */
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetUsersByRole", new { roleid = roleClaim.RoleId }, user);
        }

        [Authorize] //(Roles = "Administrator")
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

        [Authorize]
        [HttpGet("IsCompleted")]
        public async Task<ActionResult<bool>> GetCompleted()
        {
            var userId = User.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
            if (userId == null)
            {
                return NotFound();
            }
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound();
            if (String.IsNullOrEmpty(user.FirstName) || String.IsNullOrEmpty(user.LastName))
                return false;
            return true;
        }

        [Authorize]
        [HttpGet("User/{mail}")]
        public async Task<ActionResult<UserVM>> GetUserByMail(string mail)
        {
            var user = await _context.Users.Where(x => x.Email == mail)
                .Select(x => new UserVM
                {
                    Id = x.Id,
                    Email = x.Email,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    BirthDate = DateTime.Parse(x.BirthDate).ToShortDateString(),
                    Gender = x.Gender,
                    School=x.School,
                    Year=x.Year,
                    PotentionalStudent=x.PotentionalStudent,
                    Condition=x.Condition,
                    BeInformed=x.BeInformed,
                    EmailConfirmed=x.EmailConfirmed,
                }).FirstOrDefaultAsync();

            if (user == null)
                return NotFound();
            string roleId = await _context.UserRoles.Where(x => x.UserId == user.Id).Select(x => x.RoleId).FirstOrDefaultAsync();
            user.RoleString = await _context.RoleClaims.Where(x=>x.RoleId==roleId).Select(x=>x.ClaimType).FirstOrDefaultAsync();
            if (user.RoleString == null)
                user.RoleString = "user";
            return Ok(user);
        }

        [Authorize]
        [HttpPut("{userId}")]
        public async Task<ActionResult> PutUser(string userId, UserIM user)
        {
            var thisUser = _context.Users.Find(userId);
            if (thisUser == null)
                return NotFound();
            var roleOfUser = _context.UserRoles.Where(x => x.UserId == user.Id).Select(x => x.RoleId).FirstOrDefault();

            thisUser.FirstName = user.FirstName;
            thisUser.LastName = user.LastName;
            thisUser.BirthDate = DateTime.Parse(user.BirthDate).ToShortDateString();
            thisUser.Gender = user.Gender switch
            {
                0 => Gender.Other,
                1 => Gender.Male,
                2 => Gender.Female,
                _ => Gender.Other
            };
            thisUser.School = user.School;
            thisUser.Year = user.Year switch
            {
                0 => Year.none,
                1 => Year.Class7,
                2 => Year.Class8,
                3 => Year.Class9,
                4 => Year.Class10,
                _ => Year.none
            };
            thisUser.PotentionalStudent = user.PotentionalStudent;
            thisUser.Condition = user.Condition switch
            {
                0 => Condition.Active,
                1 => Condition.Banned,
                _ => Condition.Active
            };
            thisUser.BeInformed = user.BeInformed;
            thisUser.EmailConfirmed = user.EmailConfirmed;
            thisUser.Email = user.Email;
            thisUser.UpdatedAt = DateTime.Now;

            _context.Entry(thisUser).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExist(thisUser.Id))
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
        
        [Authorize]
        [HttpGet("LectorSelector")]
        public async Task<ActionResult<ICollection<MySelector>>> GetUsersSelector()
        {
            var lectorsIds = await _context.UserRoles.Where(x => x.RoleId == "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2").Select(x=>x.UserId).ToListAsync();
            List<MySelector> mySelectors = new List<MySelector>();
            foreach(var a in lectorsIds)
            {
                var user = _context.Users.Where(x=>x.Id == a).FirstOrDefault();
                mySelectors.Add(new MySelector
                {
                    Value = user.Id,
                    Label = $"{user.FirstName} {user.LastName}"
                });
            }
            return Ok(mySelectors);
        }

        /// <summary>
        /// Neozkoušené, asi nubude potřebné
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet("MyAccount/Delete")]
        public async Task<ActionResult> DeleteMyAccount()
        {
            return RedirectToPage("Areas/Identity/Pages/Account/Manage/DeletePersonalData");  
        }

        /// <summary>
        /// Neozkoušené, asi nubude potřebné
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [Authorize]
        [HttpDelete("{userId}")]
        public async Task<ActionResult> DeleteMyAccount(string userId)
        {
            var user = _context.Users.Where(x => x.Id == userId).FirstOrDefault();
            if (user == null)
                return NotFound();
            var userInGroups = _context.UsersInGroups.Where(x => x.UserId==userId).ToList();
            foreach (var group in userInGroups)
                _context.UsersInGroups.Remove(group);
            var Groups = _context.Groups.Where(x => x.HeadLectorId == userId).ToList();
            foreach(var group in Groups)
            {
                group.HeadLectorId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
                _context.Entry(group).State = EntityState.Modified;
            }
            _context.Users.Remove(user);
            return Ok();
        }

        

        private bool UserExist(string id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}