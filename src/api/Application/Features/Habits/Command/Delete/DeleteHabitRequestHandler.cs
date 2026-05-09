using Application.Repositories.Habits;
using MediatR;

namespace Application.Features.Habits.Command.Delete
{
    /// <summary>
    /// DeleteHabitRequestHandler is responsible for handling the DeleteHabitRequest command, which deletes an existing habit for a specific user. It interacts with the IHabitRepository to perform the necessary operations to delete the habit from the database and returns a boolean indicating the success of the operation.
    /// </summary>
    /// <param name="habitRepository">The repository used to manage habits.</param>
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
