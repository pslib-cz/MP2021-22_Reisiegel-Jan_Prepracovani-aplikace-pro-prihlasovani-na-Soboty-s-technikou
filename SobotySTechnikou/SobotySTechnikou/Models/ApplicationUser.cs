using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace SobotySTechnikou.Models
{
    public class ApplicationUser : IdentityUser
    {

        [Required]
        public string FirstName { get; set; } = "Nevyplněno";
        [Required]
        public string LastName { get; set; } = "Nevyplněno";
        public string BirthDate { get; set; } = "Nevyplněno";
        [Required]
        public Gender Gender { get; set; }
        [Required]
        public string School { get; set; } = "Nevyplněno";
        [Required]
        public Year Year { get; set; }
        public bool PotentionalStudent { get; set; }
        public Condition Condition { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }


        public ICollection<Group>? GroupsHeadLector { get; set; }
        public ICollection<UserInGroup>? UserInGroups { get; set; }
        public ICollection<UserInGroup>? Created { get; set; }
        public ICollection<UserInGroup>? Cancelled { get; set; }
    }
    public enum Gender
    {
        Male,
        Female,
        Other
    }
    public enum Year
    {
        [Display(Name = "7. a nižší třída ZŠ")]
        Class7,
        [Display(Name = "8. třída ZŠ")]
        Class8,
        [Display(Name = "8. třída ZŠ")]
        Class9,
        [Display(Name = "Vyšší třída (SŠ)")]
        Class10,
    }
    public enum Condition
    {
        Active, 
        Banned,
    }
}