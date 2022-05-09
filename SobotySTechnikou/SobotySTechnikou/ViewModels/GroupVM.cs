using SobotySTechnikou.Models;

namespace SobotySTechnikou.ViewModels
{
    public class GroupVM
    {
        public string Id { get; set; }
        public string NameId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public bool Open { get; set; }
        public string HeadLectorId { get; set; }
        public string ActionId { get; set; }
        public string ActionName { get; set; }
        public string ActionNameId { get; set; }
        public int NumberOfLectors { get; set; }
        public string NoteForLectors { get; set; }
        public string Note { get; set; }
        public Year MinYearToEnter { get; set; }
        public int Year { get; set; }

        public string HeadLectorName { get; set; }

        public ActionVM Action { get; set; }
        public List<UserVM> Users { get; set; }
        public int CountOfUsers { get; set; }

        public bool IsUserAdded { get; set; }

        public bool CanEnroll { get; set; }

        public bool CanGenerateCertificate { get; set; }
    }
}
