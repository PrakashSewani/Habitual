using Application.Models.Habits.Get;
using MediatR;

namespace Application.Features.Habits.Query.Get
{
    /// <summary>
    /// Get habits for a user with optional filters for date range and search term.
    /// </summary>
    /// <param name="userId">The unique identifier of the user.</param>
    /// <param name="From">The start date for filtering habits.</param>
    /// <param name="To">The end date for filtering habits.</param>
    /// <param name="Search">The search term for filtering habits.</param>
    public class GetHabitForUserRequest(Guid userId, DateOnly? From, DateOnly? To, string? Search) : IRequest<List<GetHabitForUserResponse>>
    {
        public Guid UserId { get; set; } = userId;
        public DateOnly? From { get; set; } = From;
        public DateOnly? To { get; set; } = To;
        public string? Search { get; set; } = Search;
    }
}
