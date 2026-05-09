using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.HabitLogs.Commands
{
    /// <summary>
    /// UpdateHabitLogRequest represents a command to update a habit log for a specific user, habit, and date. This command is used to toggle the completion status of a habit for a given date. When executed, it will either create or remove a habit log entry based on the current state of the log for the specified parameters.
    /// </summary>
    /// <param name="userId">The unique identifier of the user.</param>
    /// <param name="habitId">The unique identifier of the habit.</param>
    /// <param name="date">The date for which the habit log is to be updated.</param>
    public class UpdateHabitLogRequest(Guid userId, Guid habitId, DateOnly date) : IRequest<bool>, IValidate
    {
        public Guid UserId { get; set; } = userId;
        public Guid HabitId { get; set; } = habitId;
        public DateOnly Date { get; set; } = date;
    }
}
