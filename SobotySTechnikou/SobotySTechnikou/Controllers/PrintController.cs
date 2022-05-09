using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SobotySTechnikou.Data;
using SobotySTechnikou.Prints.ViewModels;
using SobotySTechnikou.Services;
using System.Text;

namespace SobotySTechnikou.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrintController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly RazorViewToStringRenderer _razorRenderer;

        public PrintController(ApplicationDbContext context, RazorViewToStringRenderer razorRenderer)
        {
            _context=context;
            _razorRenderer = razorRenderer;
        }

        [HttpGet("{userId}/{actionId}")]
        public async Task<ActionResult> DownloadCertificate(string userId, string actionId)
        {
            var action = await _context.Actions.Where(x=>x.Id==actionId).FirstOrDefaultAsync();
            if (action == null)
                return NotFound();
            var user = await _context.Users.Where(x=>x.Id == userId).FirstOrDefaultAsync();
            if (user == null)
                return NotFound();
            string fileName = "/Prints/Pages/Certificate.cshtml";
            string outputFileName = $"certificate-{action.NameId}_{action.Year}-{user.FirstName}{user.LastName}";
            string documentBody = await _razorRenderer.RenderViewToStringAsync(fileName, new CertificatePrintVM
            {
                UserName = user.FirstName + " " + user.LastName,
                ActionName = action.Name,
                Date = action.Start.ToShortDateString()
            });
            MemoryStream memory = new(Encoding.UTF8.GetBytes(documentBody));
            return File(memory, "text/html", outputFileName + ".html");
        }
    }
}
