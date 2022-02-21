using SobotySTechnikou.Models;

namespace SobotySTechnikou.ViewModels
{
    public class GroupVM
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public bool Open { get; set; }
        public string HeadLectorId { get; set; }
        public string ActionId { get; set; }
        public string ActionName { get; set; }
        public int NumberOfLectors { get; set; }
        public string NoteForLectors { get; set; }
        public string Note { get; set; }

        public SobotySTechnikou.Models.Action Action { get; set; }
        public List<ApplicationUser> Users { get; set; }
        public int CountOfUsers { get; set; }
    }
}
