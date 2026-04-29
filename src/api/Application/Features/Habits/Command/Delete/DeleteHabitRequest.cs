using MediatR;

namespace Application.Features.Habits.Command.Delete
{
    public class DeleteHabitRequest(Guid userId, Guid habitId) : IRequest<bool>
    {
        public Guid HabitId { get; set; } = habitId;
        public Guid UserId { get; set; } = userId;
    }
}
