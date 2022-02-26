using SobotySTechnikou.Models;

namespace SobotySTechnikou.ViewModels
{
    public class UserVM
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string BirthDate { get; set; }
        public Gender Gender { get; set; }
        public string School { get; set; }
        public Year Year { get; set; }
        public bool PotentionalStudent { get; set; }
        public Condition Condition { get; set; }
        public bool BeInformed { get; set; }
        public bool EmailConfirmed { get; set; }
        public string RoleString { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Id { get; set; }

        public string UserSetInGroup { get; set; }

    }
}
