using Application.Interfaces;
using Microsoft.AspNetCore.SignalR;
using WebApi.Common.SignalR;
using WebApi.Hubs;
using WebApi.Services;

namespace WebApi.Extensions
{
    public static class SignalRExtensions
    {
        public static IServiceCollection
            AddSignalRServices(
                this IServiceCollection services)
        {
            services.AddSignalR();

            services.AddSingleton<IUserIdProvider,
                CustomUserIdProvider>();

            services.AddScoped<IHabitRealtimeService,
                HabitRealtimeService>();

            return services;
        }

        public static IEndpointRouteBuilder
            MapSignalRHubs(
                this IEndpointRouteBuilder app)
        {
            app.MapHub<HabitHub>("/hubs/habits")
                .RequireCors("Frontend");

            return app;
        }
    }
}