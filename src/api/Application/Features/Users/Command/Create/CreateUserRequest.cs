using Application.Models.Users.Create;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Create
{
    public class CreateUserRequest(CreateUser userRequest) : IRequest<CreateUserResponse>, IValidate
    {
        public CreateUser UserRequest { get; set; } = userRequest;
    }
}
