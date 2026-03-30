using Sadec.Api.Dtos;

namespace Sadec.Api.Services.Auth;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(string usernameOrEmail, string password, CancellationToken cancellationToken = default);
    Task<AuthResponseDto?> RefreshAsync(string token, string refreshToken, CancellationToken cancellationToken = default);
}
