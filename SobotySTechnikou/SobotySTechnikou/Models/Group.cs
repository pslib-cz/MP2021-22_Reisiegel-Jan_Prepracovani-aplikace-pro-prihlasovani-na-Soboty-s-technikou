using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SobotySTechnikou.Models
{
    public class Group
    {
        [Key]
        public string Id { get; set; } = string.Empty;
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        [Required]
        public int Capacity { get; set; }
        public bool Open { get; set; }
        [ForeignKey("HeadLectorId")]
        public ApplicationUser? HeadLector { get; set; }
        public string? HeadLectorId { get; set; }
        [Required]
        public string ActionId { get; set; } = string.Empty;
        [ForeignKey("ActionId")]
        public Action? Action { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime UpdatedTime { get; set; }

        public ICollection<UserInGroup>? UsersInGroup { get; set; }
    }
}
