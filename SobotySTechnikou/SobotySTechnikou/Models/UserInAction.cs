using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SobotySTechnikou.Models
{
    public class UserInAction
    {
        [Key]
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
        [Key] 
        public string ActionId { get; set; }
        [ForeignKey("ActionId")]
        public Action Action { get; set; }
        public DateTime AddTime { get; set; }
        public DateTime RemoveTime { get; set; }
        [Required]
        public string GroupId { get; set; }
        [ForeignKey("GroupId")]
        public Group Group { get; set; }

        [Required]
        public string AddById { get; set; }
        [ForeignKey("AddById")]
        public ApplicationUser AddBy { get; set; }
        public string RemovedById { get; set; }
        [ForeignKey("RemovedById")]
        public ApplicationUser RemovedBy { get; set; }
    }
}
