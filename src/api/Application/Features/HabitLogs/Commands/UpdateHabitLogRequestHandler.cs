using Application.Repositories.Habits;
using MediatR;

namespace Application.Features.HabitLogs.Commands
{
    /// <summary>
    /// UpdateHabitLogRequestHandler is responsible for handling the UpdateHabitLogRequest command, which toggles the habit log for a specific habit, user, and date. It interacts with the IHabitLogRepository to perform the necessary operations to update the habit log and returns a boolean indicating the success of the operation.
    /// </summary>
    /// <param name="habitLogRepository">The repository used to manage habit logs.</param>
    public class UpdateHabitLogRequestHandler(IHabitLogRepository habitLogRepository) : IRequestHandler<UpdateHabitLogRequest, bool>
    {
        private readonly IHabitLogRepository _habitLogRepository = habitLogRepository;

        public async Task<bool> Handle(UpdateHabitLogRequest request, CancellationToken cancellationToken)
        {
            var resp = await _habitLogRepository.ToggleHabitLogAsync(request.HabitId, request.UserId, request.Date);
            return resp;
        }
    }
}
