using Application.Models.Habits.Create;
using MediatR;

namespace Application.Features.Habits.Command.Create
{
    public class CreateHabitRequest(Guid UserId, CreateHabit createHabit) : IRequest<CreateHabitResponse>
    {
        public Guid UserId { get; set; } = UserId;
        public CreateHabit CreateHabit { get; set; } = createHabit;
    }
}
