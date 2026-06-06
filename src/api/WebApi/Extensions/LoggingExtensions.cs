using Serilog;
using Serilog.Events;

namespace WebApi.Extensions;

public static class LoggingExtensions
{
    public static IServiceCollection AddSerilogServices(
        this IServiceCollection services)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Console(
                outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
            .WriteTo.File(
                "logs/habitual-.txt",
                rollingInterval: RollingInterval.Day,
                outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
            .CreateLogger();

        services.AddSerilog();

        return services;
    }

    public static IApplicationBuilder UseRequestLogging(
        this IApplicationBuilder app)
    {
        app.UseMiddleware<WebApi.Common.Middleware.RequestCorrelationMiddleware>();

        return app;
    }
}
