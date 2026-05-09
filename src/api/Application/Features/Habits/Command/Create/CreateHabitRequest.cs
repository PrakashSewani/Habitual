using Application.Models.Habits.Create;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Habits.Command.Create
{
    /// <summary>
    /// CreateHabitRequest represents a command to create a new habit for a specific user. It contains the user's unique identifier and the details of the habit to be created, encapsulated in the CreateHabit model. When executed, this command will trigger the creation of a new habit in the system for the specified user.
    /// </summary>
    /// <param name="UserId">The unique identifier of the user.</param>
    /// <param name="createHabit">The details of the habit to be created.</param>
    public class CreateHabitRequest(Guid UserId, CreateHabit createHabit) : IRequest<CreateHabitResponse>, IValidate
    {
        public Guid UserId { get; set; } = UserId;
        public CreateHabit CreateHabit { get; set; } = createHabit;
    }
}
