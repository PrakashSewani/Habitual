using MediatR;

namespace Application.Features.Users.Command.Delete
{
    public class DeleteUserRequest(Guid id) : IRequest<bool>
    {
        public Guid Id { get; set; } = id;
    }
}
