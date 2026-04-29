using Application.Models.Habits.Update;
using MediatR;

namespace Application.Features.Habits.Command.Update
{
    public class UpdateHabitRequest(UpdateHabit updateHabit) : IRequest<UpdateHabitResponse>
    {
        public UpdateHabit UpdateHabit { get; set; } = updateHabit;
    }
}
