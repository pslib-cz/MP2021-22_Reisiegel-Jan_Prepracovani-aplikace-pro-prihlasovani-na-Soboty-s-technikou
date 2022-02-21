namespace SobotySTechnikou.ViewModels
{
    public class GroupVM
    {
        public string Name { get; set; }
        public string Description { get; set; } 
        public int Capacity { get; set; }
        public bool Open { get; set; }
        public string? HeadLectorId { get; set; }
        public string ActionId { get; set; }
        public Action Action { get; set; }
        public int NumberOfLectors { get; set; }
        public string NoteForLectors { get; set; }
        public string Note { get; set; }
    }
}
