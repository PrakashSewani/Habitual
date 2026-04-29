using Application.Models.Habits.Create;
using MediatR;

namespace Application.Features.Habits.Command.Create
{
    public class CreateHabitRequest(CreateHabit createHabit) : IRequest<CreateHabitResponse>
    {
        public CreateHabit CreateHabit { get; set; } = createHabit;
    }
}
