﻿// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
#nullable disable

using System;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using SobotySTechnikou.Models;
using SobotySTechnikou.Prints.ViewModels;
using SobotySTechnikou.Services;

namespace SobotySTechnikou.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class ResendEmailConfirmationModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly RazorViewToStringRenderer _razorViewToStringRenderer;

        public ResendEmailConfirmationModel(UserManager<ApplicationUser> userManager, IEmailSender emailSender, RazorViewToStringRenderer razorViewToStringRenderer)
        {
            _userManager = userManager;
            _emailSender = emailSender;
            _razorViewToStringRenderer = razorViewToStringRenderer;
        }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        [BindProperty]
        public InputModel Input { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        public class InputModel
        {
            /// <summary>
            ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
            ///     directly from your code. This API may change or be removed in future releases.
            /// </summary>
            [Required]
            [EmailAddress]
            public string Email { get; set; }
        }

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            var user = await _userManager.FindByEmailAsync(Input.Email);
            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Ověřovací email byl odeslán. Prosím, zkontrolujte svou emailovou schránku.");
                return Page();
            }

            var userId = await _userManager.GetUserIdAsync(user);
            var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            var callbackUrl = Url.Page(
                "/Account/ConfirmEmail",
                pageHandler: null,
                values: new { userId = userId, code = code },
                protocol: Request.Scheme);
            string fileName = "/Prints/Pages/EmailBody.cshtml";
            string mailBody = await _razorViewToStringRenderer.RenderViewToStringAsync(fileName, new EmailBodyVM
            {
                CallBackURL = callbackUrl,
            });
            await _emailSender.SendEmailAsync(
                Input.Email,
                "Potvrďte váš email",
                mailBody); //$"Prosím, potvrďte svou registraci <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>kliknutím zde</a>.");

            ModelState.AddModelError(string.Empty, "Ověřovací email byl odeslán. Prosím, zkontrolujte svou emailovou schránku.");
            return Page();
        }
    }
}
