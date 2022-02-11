using System.ComponentModel.DataAnnotations;

namespace SobotySTechnikou.Models
{
    public class Action
    {
        [Key]
        public string Id { get; set; } = "Nevyplněno";
        [Required]
        public string Name { get; set; } = "Nevyplněno";
        [Required]
        public string Description { get; set; } = "Nevyplněno";
        [Required]
        public int Year { get; set; }
        [Required]
        public DateTime Start { get; set; }
        [Required]
        public DateTime End { get; set; }
        [Required]
        public ActionType FormOfAction { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Active { get; set; }
        public bool Availability { get; set; }


        public ICollection<Group>? Groups { get; set; }
    }
    public enum ActionType
    {
        [Display(Name = "Distančně")]
        Online = 0,
        [Display(Name = "Prezenčně")]
        Offline = 1,
    }
}
