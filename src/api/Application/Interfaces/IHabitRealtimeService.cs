using Application.Models.Habits.SignalR;

namespace Application.Interfaces
{
    public interface IHabitRealtimeService
    {
        /// <summary>
        /// Broadcasts a habit log update to all connected clients for the specified user.
        /// </summary>
        /// <param name="userId">The ID of the user whose habit log was updated.</param>
        /// <param name="payload">The payload containing the updated habit log information.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task BroadcastHabitLogUpdatedAsync(Guid userId, HabitLogUpdatedEvent payload);
    }
}
