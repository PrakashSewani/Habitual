using Application.Interfaces;
using Application.Repository;
using Infrastructure.Context;
using Infrastructure.Repository;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")))
                .AddScoped<IUserRepository, UserRepository>()
                .AddScoped<IPasswordHasher, PasswordHasher>();

            return services;
        }
    }
}
