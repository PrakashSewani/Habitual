using Application.Models.Habits.Get;
using Application.Models.Habits.Update;
using MediatR;

namespace Application.Features.Habits.Command.Update
{
    public class UpdateHabitRequest(Guid userId, UpdateHabit updateHabit) : IRequest<GetHabitForUserResponse>
    {
        public Guid UserId { get; set; } = userId;
        public UpdateHabit UpdateHabit { get; set; } = updateHabit;
    }
}
