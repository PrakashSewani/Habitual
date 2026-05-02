using Application.Repositories.Habits;
using MediatR;

namespace Application.Features.Habits.Command.Delete
{
    public class DeleteHabitRequestHandler(IHabitRepository habitRepository) : IRequestHandler<DeleteHabitRequest, bool>
    {
        private readonly IHabitRepository _habitRepository = habitRepository;

        async Task<bool> IRequestHandler<DeleteHabitRequest, bool>.Handle(DeleteHabitRequest request, CancellationToken cancellationToken)
        {
            var resp = await _habitRepository.DeleteHabitAsync(request.HabitId, request.UserId);
            return resp;
        }
    }
}
