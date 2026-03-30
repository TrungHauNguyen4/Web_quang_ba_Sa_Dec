using Microsoft.AspNetCore.Identity;

namespace Sadec.Api.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string DisplayName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation examples
    public ICollection<TinTuc> TinTucs { get; set; } = new List<TinTuc>();
}
