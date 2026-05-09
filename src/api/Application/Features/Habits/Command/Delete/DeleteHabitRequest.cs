using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Habits.Command.Delete
{
    /// <summary>
    /// DeleteHabitRequest represents a command to delete an existing habit for a specific user. It contains the user's unique identifier and the unique identifier of the habit to be deleted. When executed, this command will trigger the deletion of the specified habit from the system for the given user.
    /// </summary>
    /// <param name="userId">The unique identifier of the user.</param>
    /// <param name="habitId">The unique identifier of the habit to be deleted.</param>
    public class DeleteHabitRequest(Guid userId, Guid habitId) : IRequest<bool>, IValidate
    {
        public Guid HabitId { get; set; } = habitId;
        public Guid UserId { get; set; } = userId;
    }
}
