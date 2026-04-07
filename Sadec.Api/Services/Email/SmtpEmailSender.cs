using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace Sadec.Api.Services.Email;

public sealed class SmtpEmailSender(IConfiguration configuration) : IEmailSender
{
    private readonly IConfiguration _configuration = configuration;

    private sealed record SmtpOptions(
        string Host,
        int Port,
        bool EnableSsl,
        string? Username,
        string? Password,
        string FromEmail,
        string FromName);

    private SmtpOptions? ReadOptions()
    {
        var host = _configuration["Smtp:Host"];
        if (string.IsNullOrWhiteSpace(host)) return null;

        var fromEmail = _configuration["Smtp:FromEmail"];
        if (string.IsNullOrWhiteSpace(fromEmail)) return null;

        var fromName = _configuration["Smtp:FromName"] ?? "Sadec";
        var port = _configuration.GetValue<int?>("Smtp:Port") ?? 587;
        var enableSsl = _configuration.GetValue<bool?>("Smtp:EnableSsl") ?? true;
        var username = _configuration["Smtp:Username"];
        var password = _configuration["Smtp:Password"];

        return new SmtpOptions(host.Trim(), port, enableSsl, username, password, fromEmail.Trim(), fromName);
    }

    public async Task<bool> SendAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        var options = ReadOptions();
        if (options is null) return false;

        using var message = new MailMessage();
        message.From = new MailAddress(options.FromEmail, options.FromName);
        message.To.Add(new MailAddress(toEmail));
        message.Subject = subject;
        message.Body = htmlBody;
        message.IsBodyHtml = true;

        using var client = new SmtpClient(options.Host, options.Port);
        client.EnableSsl = options.EnableSsl;

        if (!string.IsNullOrWhiteSpace(options.Username))
        {
            client.Credentials = new NetworkCredential(options.Username, options.Password);
        }
        else
        {
            client.UseDefaultCredentials = true;
        }

        // SmtpClient has no true cancellation support.
        await client.SendMailAsync(message);
        return true;
    }
}
