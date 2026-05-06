using Application.Models.Habits.Get;
using Application.Models.Habits.Update;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Habits.Command.Update
{
    public class UpdateHabitRequest(Guid userId, UpdateHabit updateHabit) : IRequest<GetHabitForUserResponse>, IValidate
    {
        public Guid UserId { get; set; } = userId;
        public UpdateHabit UpdateHabit { get; set; } = updateHabit;
    }
}
