namespace SobotySTechnikou.ViewModels
{
    public class ApplicationsVM
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Year { get; set; }
        public string ActionName { get; set; }
        public string GroupName { get; set; }
        public string CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public string CancelledBy { get; set; }
        public string CancelDate { get; set; }
        public UserVM User { get; set; }
    }
}
