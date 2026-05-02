using Application.Abstractions.Authentication;
using Application.Interfaces;
using Application.Repositories.Habits;
using Application.Repositories.Users;
using Infrastructure.Authentication;
using Infrastructure.Context;
using Infrastructure.Repositories.Habits;
using Infrastructure.Repositories.Users;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")))
                .AddScoped<IUserRepository, UserRepository>()
                .AddScoped<IHabitRepository, HabitRepository>()
                .AddScoped<IPasswordHasher, PasswordHasher>()
                .AddSingleton<IConnectionMultiplexer>(sp =>
                {
                    var configuration = sp.GetRequiredService<IConfiguration>();
                    var connectionString = configuration["Redis:Connection"];

                    return ConnectionMultiplexer.Connect(connectionString);
                })
                .AddScoped<IRefreshTokenStore, RedisRefreshTokenStore>()
                .AddScoped<ITokenService>(sp =>
                {
                    var config = sp.GetRequiredService<IConfiguration>();
                    return new TokenService(config["Jwt:Secret"]);
                });

            return services;
        }
    }
}
