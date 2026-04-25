using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Delete
{
    public class DeleteUserRequest(Guid id) : IRequest<bool>, IValidate
    {
        public Guid Id { get; set; } = id;
    }
}
