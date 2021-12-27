using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SobotySTechnikou.Models;
using System.Security.Claims;

namespace SobotySTechnikou.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public UserIdentificator Get()
        {
            var userId = User.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value;
            return new UserIdentificator { Id = userId };
        }
    }
}