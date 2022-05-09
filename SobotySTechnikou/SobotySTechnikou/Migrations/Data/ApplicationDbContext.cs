using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SobotySTechnikou.Models;

namespace SobotySTechnikou.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        //public DbSet<ApplicationUser> Users { get; set;}
        public DbSet<SobotySTechnikou.Models.Action> Actions { get; set;}
        public DbSet<Group> Groups { get; set;}
        public DbSet<UserInGroup> UsersInGroups { get; set;}
        public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserInGroup>().HasKey(x => x.Id);
            
            modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                Name = "Administrator",
                NormalizedName = "ADMINISTRATOR"
            });
            modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
                Name = "Lector",
                NormalizedName = "LECTOR"
            });
            modelBuilder.Entity<IdentityRoleClaim<string>>().HasData(new IdentityRoleClaim<string>
            {
                Id = 1,
                RoleId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                ClaimType = "admin",
                ClaimValue = "1"
            });
            modelBuilder.Entity<IdentityRoleClaim<string>>().HasData(new IdentityRoleClaim<string>
            {
                Id = 2,
                RoleId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                ClaimType = "lector",
                ClaimValue = "1"
            });
            modelBuilder.Entity<IdentityRoleClaim<string>>().HasData(new IdentityRoleClaim<string>
            {
                Id = 3,
                RoleId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
                ClaimType = "lector",
                ClaimValue = "1"
            });

            var hasher = new PasswordHasher<ApplicationUser>();

            modelBuilder.Entity<ApplicationUser>().HasData(new ApplicationUser
            {
                Id = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                Email = "sobota@pslib.cz",
                NormalizedEmail = "SOBOTA@PSLIB.CZ",
                EmailConfirmed = true,
                LockoutEnabled = false,
                UserName = "sobota@pslib.cz",
                NormalizedUserName = "SOBOTA@PSLIB.CZ",
                PasswordHash = hasher.HashPassword(null, "Admin_1234"),
                SecurityStamp = string.Empty,
                FirstName = "Admin",
                LastName = "PSLIB",
                BirthDate = DateTime.Today.ToString(),
                Gender = Gender.Other,
                School = "Střední průmyslová škola strojní a elektrotechnická Liberec",
                Year =  Year.Class10,
                BeInformed = false,
            });
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                RoleId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                UserId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
            });
            modelBuilder.Entity<IdentityUserClaim<string>>().HasData(new IdentityUserClaim<string>
            {
                Id = 1,
                UserId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                ClaimType = "admin",
                ClaimValue = "1"
            },
            new IdentityUserClaim<string>
            {
                Id = 2,
                UserId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                ClaimType = "lector",
                ClaimValue = "1"
            });
            modelBuilder.Entity<SobotySTechnikou.Models.Action>().HasData(new SobotySTechnikou.Models.Action
            {
                Id = "XXXXXXXX-XXXX-AKCE-XXXX-XXXXXXXXXXXX",
                Name = "Defaultní akce",
                NameId = "Defaultní_akce",
                Description = "",
                Year=0,
                Start = DateTime.Now,
                End = DateTime.Now.AddDays(1),
                FormOfAction = ActionType.Online,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Active=false,
                Availability = false,
                CreatorId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
            });
            modelBuilder.Entity<UserInGroup>(entity =>
            {
                entity.HasOne(x => x.Group).WithMany(x => x.UsersInGroup).HasForeignKey(x => x.GroupId).OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<UserInGroup>(Entity =>
            {
                Entity.HasOne(x => x.User).WithMany(x => x.UserInGroups).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<UserInGroup>(entity =>
            {
                entity.HasOne(x => x.CancelledBy).WithMany(x => x.Cancelled).HasForeignKey(x => x.CancelledById).OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<UserInGroup>(entity =>
            {
                entity.HasOne(x => x.CreatedBy).WithMany(x => x.Created).HasForeignKey(x => x.CreatedById).OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<Group>(entity =>
            {
                entity.HasOne(x => x.HeadLector).WithMany(x => x.GroupsHeadLector).HasForeignKey(x => x.HeadLectorId).OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<Group>(entity =>
            {
                entity.HasOne(x => x.Action).WithMany(x => x.Groups).HasForeignKey(x => x.ActionId).OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}