using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SobotySTechnikou.Models
{
    public class Group
    {
        [Key]
        public string Id { get; set; } = "Nevyplněno";
        public string NameId { get; set; }
        [Required]
        public string Name { get; set; } = "Nevyplněno";
        [Required]
        public string Description { get; set; } = "Nevyplněno";
        [Required]
        public int Capacity { get; set; }
        public bool Open { get; set; }
        [ForeignKey("HeadLectorId")]
        public ApplicationUser? HeadLector { get; set; }
        public string? HeadLectorId { get; set; }
        [Required]
        public string ActionId { get; set; } = "Nevyplněno";
        [ForeignKey("ActionId")]
        public Action? Action { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime UpdatedTime { get; set; }

        public int NumberOfLectors { get; set; }
        public Year MinimalYear { get; set; }
        public string NoteForLectors { get; set; }
        public string Note { get; set; }

        public ICollection<UserInGroup>? UsersInGroup { get; set; }
    }
}
