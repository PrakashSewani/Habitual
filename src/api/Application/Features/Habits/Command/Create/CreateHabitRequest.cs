using Application.Models.Habits.Create;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Habits.Command.Create
{
    public class CreateHabitRequest(Guid UserId, CreateHabit createHabit) : IRequest<CreateHabitResponse>, IValidate
    {
        public Guid UserId { get; set; } = UserId;
        public CreateHabit CreateHabit { get; set; } = createHabit;
    }
}
