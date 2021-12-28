using System.ComponentModel.DataAnnotations;

namespace SobotySTechnikou.Models
{
    public class Action
    {
        [Key]
        public string Id { get; set; } = string.Empty;
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
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
