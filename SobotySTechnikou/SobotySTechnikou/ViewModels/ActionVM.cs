using SobotySTechnikou.Models;

namespace SobotySTechnikou.ViewModels
{
    public class ActionVM
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Year { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
        public bool Active { get; set; }
        public bool Availability { get; set; }
        public string Description { get; set; }
        public string CreateTime { get; set; }
        public string UpdateTime { get; set; }
        public string CreatorName { get; set; }
        public ActionType Type { get; set; }
        public List<GroupVM> Groups { get; set; }

        public bool UserIsInAction { get; set; }
    }
}
