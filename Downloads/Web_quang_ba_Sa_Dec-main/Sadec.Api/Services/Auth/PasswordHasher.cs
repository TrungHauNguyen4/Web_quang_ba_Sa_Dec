using System.Security.Cryptography;
using System.Text;

namespace Sadec.Api.Services.Auth;

public static class PasswordHasher
{
    // Simple SHA256-based hasher for demo purposes only.
    public static string HashPassword(string password)
    {
        if (password is null) throw new ArgumentNullException(nameof(password));

        using var sha = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToHexString(hash);
    }

    public static bool VerifyPassword(string password, string? hash)
    {
        if (string.IsNullOrEmpty(hash)) return false;
        var computed = HashPassword(password);
        return StringComparer.OrdinalIgnoreCase.Equals(computed, hash);
    }
}
