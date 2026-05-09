using Application.Models.Habits.Get;
using MediatR;

namespace Application.Features.Habits.Query.Get
{
    /// <summary>
    /// GetHabitForUserRequest represents a query to retrieve a list of habits for a specific user. It contains the user's unique identifier and, when executed, will trigger the retrieval of all habits associated with that user in the system, returning the details of each habit in a list of GetHabitForUserResponse objects.
    /// </summary>
    /// <param name="userId">The unique identifier of the user.</param>
    public class GetHabitForUserRequest(Guid userId) : IRequest<List<GetHabitForUserResponse>>
    {
        public Guid UserId { get; set; } = userId;
    }
}
