using Application.Repositories.Habits;
using MediatR;

namespace Application.Features.HabitLogs.Commands
{
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
