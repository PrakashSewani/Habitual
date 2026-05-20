using Application.Models.Users.Get;
using MediatR;

namespace Application.Features.Users.Query.Get
{
    public class GetUserRequest(Guid userId) : IRequest<GetUserResponse>
    {
        public Guid UserId { get; set; } = userId;
    }
}
