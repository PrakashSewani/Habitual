using Application.Models.Habits.Get;
using MediatR;

namespace Application.Features.Habits.Query.Get
{
    public class GetHabitForUserRequest(Guid userId) : IRequest<List<GetHabitForUserResponse>>
    {
        public Guid UserId { get; set; } = userId;
    }
}
