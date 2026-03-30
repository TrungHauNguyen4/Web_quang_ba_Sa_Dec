using System.Text.Json;
using Sadec.Api.Exceptions;

namespace Sadec.Api.Middleware;

public sealed class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, title) = exception switch
        {
            ApiValidationException => (StatusCodes.Status400BadRequest, "Validation error"),
            ApiNotFoundException => (StatusCodes.Status404NotFound, "Resource not found"),
            _ => (StatusCodes.Status500InternalServerError, "Unexpected server error")
        };

        if (statusCode >= 500)
        {
            logger.LogError(exception, "Unhandled exception. TraceId={TraceId}", context.TraceIdentifier);
        }
        else
        {
            logger.LogWarning(exception, "Handled exception. TraceId={TraceId}", context.TraceIdentifier);
        }

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";

        var payload = new
        {
            type = $"https://httpstatuses.com/{statusCode}",
            title,
            status = statusCode,
            detail = exception.Message,
            traceId = context.TraceIdentifier
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
    }
}
