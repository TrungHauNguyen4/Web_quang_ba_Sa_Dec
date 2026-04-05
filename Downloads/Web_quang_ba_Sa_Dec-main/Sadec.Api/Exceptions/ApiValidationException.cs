namespace Sadec.Api.Exceptions;

public sealed class ApiValidationException(string message) : Exception(message);
