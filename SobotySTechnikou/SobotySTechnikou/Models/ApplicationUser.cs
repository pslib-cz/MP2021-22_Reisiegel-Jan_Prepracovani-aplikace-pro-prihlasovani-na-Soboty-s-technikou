using Microsoft.AspNetCore.Identity;

namespace SobotySTechnikou.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime CreatedTime { get; set; }
        public Condition Condition { get; set; }
        public ICollection<UserInAction> Actions { get; set; }
    }
    public enum Condition
    {
        banned,
        active,
        none
    }
}