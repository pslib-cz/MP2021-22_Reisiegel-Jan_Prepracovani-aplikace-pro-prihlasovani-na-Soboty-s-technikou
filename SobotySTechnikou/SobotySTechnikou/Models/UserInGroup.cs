using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SobotySTechnikou.Models
{
    public class UserInGroup
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string UserId { get; set; } = "Nevyplněno";
        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }
        [Required]
        public string GroupId { get; set; } = "Nevyplněno";
        [ForeignKey("GroupId")]
        public Group? Group { get; set; }


        public DateTime CreatedAt { get; set; }
        public DateTime? CancelledAt { get; set; }
        public string? CreatedById { get; set; }
        [ForeignKey("CreatedById")]
        public ApplicationUser? CreatedBy { get; set; }
        public string? CancelledById { get; set; }
        [ForeignKey("CancelledById")]
        public ApplicationUser? CancelledBy { get; set; }
    }
}
