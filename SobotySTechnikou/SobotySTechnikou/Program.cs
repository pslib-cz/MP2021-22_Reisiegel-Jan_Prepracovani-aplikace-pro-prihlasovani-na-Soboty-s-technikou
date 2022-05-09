using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using SobotySTechnikou.Data;
using SobotySTechnikou.Models;
using SobotySTechnikou.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddScoped<IEmailSender, EmailSender>();
builder.Services.AddScoped<EmailSender>();

builder.Services.AddScoped<RazorViewToStringRenderer>();

builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.Password.RequireDigit = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
    options.ClaimsIdentity.UserIdClaimType = "role";
    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddIdentityServer(options => { })
    .AddAspNetIdentity<ApplicationUser>()
    .AddOperationalStore<ApplicationDbContext>()
    .AddIdentityResources()
    .AddApiResources()
    .AddProfileService<ProfileService<ApplicationUser>>()
    .AddClients()
    .AddSigningCredentials();
//.AddApiAuthorization<ApplicationUser, ApplicationDbContext>(options => { });

builder.Services.AddAuthentication("Bearer").AddIdentityServerJwt();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthorizationConstants.ADMINISTRATOR_POLICY, policy =>
    {
        //policy.RequireClaim(AuthorizationConstants.ADMINISTRATOR_CLAIM, "1");
        policy.RequireAssertion(context =>
            context.User.HasClaim(
                c => (c.Type == AuthorizationConstants.LECTOR_CLAIM || c.Type == AuthorizationConstants.ADMINISTRATOR_CLAIM) && c.Value == "1"));
    });
    options.AddPolicy(AuthorizationConstants.LECTOR_POLICY, policy =>
    {
        policy.RequireClaim(AuthorizationConstants.LECTOR_CLAIM, "1");
    });
});

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseIdentityServer();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapFallbackToFile("index.html"); ;

app.Run();
