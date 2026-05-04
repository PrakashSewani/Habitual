using Application.Models.Users.Update;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Update
{
    public class UpdateUserRequest(Guid userId, UpdateUser userRequest) : IRequest<UpdateUserResponse>, IValidate
    {
        public Guid UserId { get; set; } = userId;
        public UpdateUser UserRequest { get; set; } = userRequest;
    }
}
