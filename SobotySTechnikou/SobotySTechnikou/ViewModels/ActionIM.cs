using SobotySTechnikou.Models;

namespace SobotySTechnikou.ViewModels
{
    public class ActionIM
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Year { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public ActionType FormOfAction { get; set; }
        public bool Active { get; set; }
        public bool Availability { get; set; } 
    }
}
