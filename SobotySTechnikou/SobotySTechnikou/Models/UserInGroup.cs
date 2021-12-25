using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SobotySTechnikou.Models
{
    public class UserInGroup
    {
        [Key]
        public string UserId { get; set; } = string.Empty;
        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }
        [Key]
        public string GroupId { get; set; } = string.Empty;
        [ForeignKey("GroupId")]
        public Group? Group { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public string? CreatedById { get; set; }
        [ForeignKey("CreatedById")]
        public ApplicationUser? CreatedBy { get; set; }
        public string? CancelledById { get; set; }
        [ForeignKey("CancelledById")]
        public ApplicationUser? CancelledBy { get; set; }
    }
}
