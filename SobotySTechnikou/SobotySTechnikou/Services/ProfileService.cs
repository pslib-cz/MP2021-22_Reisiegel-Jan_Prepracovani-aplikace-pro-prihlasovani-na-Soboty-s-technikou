using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using Microsoft.AspNetCore.Identity;
using SobotySTechnikou.Models;
using System.Security.Claims;

namespace SobotySTechnikou.Services
{
    public class ProfileService<TUser> : IProfileService where TUser : ApplicationUser
    {
        protected readonly UserManager<ApplicationUser> _userManager;
        protected readonly IUserClaimsPrincipalFactory<TUser> _claimsFactory;

        public ProfileService(UserManager<ApplicationUser> userManager, IUserClaimsPrincipalFactory<TUser> claimsFactory)
        {
            _userManager=userManager;
            _claimsFactory=claimsFactory;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub = context.Subject.Claims.FirstOrDefault(cl => cl.Type == "sub");
            if (sub == null)
                throw new Exception("No sub claim provided");
            var user = await _userManager.FindByIdAsync(sub.Value);
            if (user != null)
            {
                context.IssuedClaims.Add(new Claim("email", user.Email));
                context.IssuedClaims.Add(new Claim("email_verified", user.EmailConfirmed == true ? "1" : "0"));
                context.IssuedClaims.Add(new Claim("preferred_username", $"{user.FirstName} {user.LastName}"));
                context.IssuedClaims.Add(new Claim("completed_information", GetCompleted(user)? "true" : "false"));

                List<Claim> userClaims = (List<Claim>)_userManager.GetClaimsAsync(user).Result;
                foreach (var uc in userClaims)
                {
                    context.IssuedClaims.Add(new Claim(uc.Type, uc.Value));
                }
            }
        }
        public bool GetCompleted(ApplicationUser? user)
        {
            if (user == null)
                return false;
            if (String.IsNullOrEmpty(user.FirstName) || String.IsNullOrEmpty(user.LastName))
                return false;
            return true;
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            context.IsActive = true;

            return Task.FromResult(0);
        }
    }
}
