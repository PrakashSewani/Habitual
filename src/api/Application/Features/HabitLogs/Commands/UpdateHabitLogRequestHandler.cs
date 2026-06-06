using Application.Helpers;
using Application.Interfaces;
using Application.Models.Habits.SignalR;
using Application.Repositories.Habits;
using MediatR;

namespace Application.Features.HabitLogs.Commands
{
    /// <summary>
    /// UpdateHabitLogRequestHandler is responsible for handling the UpdateHabitLogRequest command, which toggles the habit log for a specific habit, user, and date. It interacts with the IHabitLogRepository to perform the necessary operations to update the habit log and returns a boolean indicating the success of the operation.
    /// </summary>
    /// <param name="habitLogRepository">The repository used to manage habit logs.</param>
    /// <param name="habitRepository">The repository used to retrieve habit details.</param>
    /// <param name="habitRealtimeService">The service used to broadcast habit log updates in real-time.</param>
    public class UpdateHabitLogRequestHandler(IHabitLogRepository habitLogRepository, IHabitRepository habitRepository, IHabitRealtimeService habitRealtimeService) : IRequestHandler<UpdateHabitLogRequest, bool>
    {
        private readonly IHabitLogRepository _habitLogRepository = habitLogRepository;
        private readonly IHabitRepository _habitRepository = habitRepository;
        private readonly IHabitRealtimeService _habitRealtimeService = habitRealtimeService;

        public async Task<bool> Handle(UpdateHabitLogRequest request, CancellationToken cancellationToken)
        {
            var habit = await _habitRepository.GetHabitByIdAsync(request.HabitId, request.UserId);

            if (request.Date > DateOnly.FromDateTime(DateTime.Today))
            {
                throw new InvalidOperationException("Cannot log habits for future dates.");
            }

            if (!ScheduleHelper.IsScheduledForDate(habit.Schedule, habit.CreatedAt, request.Date))
            {
                throw new InvalidOperationException("Habit is not scheduled for this date.");
            }

            var resp = await _habitLogRepository.ToggleHabitLogAsync(request.HabitId, request.UserId, request.Date);
            var payload = new HabitLogUpdatedEvent
            {
                HabitId = request.HabitId,
                Completed = resp,
                Date = request.Date
            };
            await _habitRealtimeService.BroadcastHabitLogUpdatedAsync(request.UserId, payload);
            return resp;
        }
    }
}
