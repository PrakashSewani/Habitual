using Application.Models.Habits.Get;
using Application.Models.Habits.Update;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Habits.Command.Update
{
    /// <summary>
    /// UpdateHabitRequest represents a command to update an existing habit for a specific user. It contains the user's unique identifier and the details of the habit to be updated, encapsulated in the UpdateHabit model. When executed, this command will trigger the update of the specified habit in the system for the given user and return the updated habit details in the response.
    /// </summary>
    /// <param name="userId">The unique identifier of the user.</param>
    /// <param name="updateHabit">The details of the habit to be updated.</param>
    public class UpdateHabitRequest(Guid userId, UpdateHabit updateHabit) : IRequest<GetHabitForUserResponse>, IValidate
    {
        public Guid UserId { get; set; } = userId;
        public UpdateHabit UpdateHabit { get; set; } = updateHabit;
    }
}
