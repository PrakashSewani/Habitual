namespace WebApi.Extensions
{
    public static class CorsExtensions
    {
        public static IServiceCollection
            AddCorsPolicies(
                this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("Frontend", policy =>
                {
                    policy
                        .WithOrigins(
                            "http://localhost:5173",
                            "https://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            return services;
        }
    }
}