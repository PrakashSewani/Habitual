using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace WebApi.Extensions;

public static class HealthCheckExtensions
{
    public static IServiceCollection AddHealthCheckServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddHealthChecks()
            .AddNpgSql(
                configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection is not configured"),
                name: "postgresql",
                tags: ["db", "ready"])
            .AddRedis(
                configuration["Redis:Connection"]
                ?? throw new InvalidOperationException("Redis connection is not configured"),
                name: "redis",
                tags: ["cache", "ready"]);

        return services;
    }

    public static IEndpointRouteBuilder UseHealthCheckServices(
        this IEndpointRouteBuilder app)
    {
        app.MapHealthChecks("/health", new HealthCheckOptions
        {
            Predicate = _ => false
        });

        app.MapHealthChecks("/health/ready", new HealthCheckOptions
        {
            Predicate = healthCheck => healthCheck.Tags.Contains("ready")
        });

        return app;
    }
}
