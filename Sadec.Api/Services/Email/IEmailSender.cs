namespace Sadec.Api.Services.Email;

public interface IEmailSender
{
    Task<bool> SendAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken = default);
}
