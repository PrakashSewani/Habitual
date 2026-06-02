using Application.Interfaces;
using Application.Models.Habits.SignalR;
using Microsoft.AspNetCore.SignalR;
using WebApi.Hubs;

namespace WebApi.Services
{
    public class HabitRealtimeService(IHubContext<HabitHub> hubContext) : IHabitRealtimeService
    {
        private readonly IHubContext<HabitHub> _hubContext = hubContext;

        public async Task BroadcastHabitLogUpdatedAsync(Guid userId, HabitLogUpdatedEvent payload)
        {
            await _hubContext.Clients
                .User(userId.ToString())
                .SendAsync("HabitLogUpdated", payload);
        }

        public async Task BroadcastHabitUpdatedAsync(Guid userId, HabitUpdatedEvent payload)
        {
            await _hubContext.Clients
                .User(userId.ToString())
                .SendAsync("HabitUpdated", payload);
        }
    }
}
