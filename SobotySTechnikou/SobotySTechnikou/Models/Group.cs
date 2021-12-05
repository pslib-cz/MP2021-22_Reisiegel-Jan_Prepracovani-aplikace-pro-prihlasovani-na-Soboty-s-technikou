using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SobotySTechnikou.Models
{
    public class Group
    {
        [Key]
        public string ID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public bool Opened { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        [ForeignKey("ActionID")]
        public Action Action { get; set; }
        [Required]
        public string ActionID { get; set; }
        public ICollection<ApplicationUser> Users { get; set; }
        
    }
}
