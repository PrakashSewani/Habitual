using Scalar.AspNetCore;

namespace WebApi.Extensions
{
    public static class OpenApiExtensions
    {
        public static IServiceCollection
            AddOpenApiServices(
                this IServiceCollection services)
        {
            services.AddOpenApi();

            return services;
        }

        public static WebApplication
            UseOpenApiServices(
                this WebApplication app)
        {
            app.MapOpenApi();

            app.MapScalarApiReference();

            return app;
        }
    }
}