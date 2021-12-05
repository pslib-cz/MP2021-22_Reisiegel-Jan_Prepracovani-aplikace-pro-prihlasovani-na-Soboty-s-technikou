using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SobotySTechnikou.Models
{
    public class Action
    {
        [Key]
        public string ID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public ActionType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int Year { get; set; }
        [Required]
        public string CreatedByID { get; set; }
        [ForeignKey("CreatedByID")]
        public ApplicationUser CreatedBy { get; set; }
        [Required]
        public string UpdatedByID { get; set; }
        [ForeignKey("UpdatedByID")]
        public ApplicationUser UpdatedBy { get; set; }
        public ICollection<Group> Groups { get; set; }
        public ICollection<UserInAction> Users { get; set; }
    }
    public enum ActionType
    {
        Online,
        Offline
    }
}
