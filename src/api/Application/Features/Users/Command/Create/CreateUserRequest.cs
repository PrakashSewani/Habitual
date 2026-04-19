using Application.Models.Users.Create;
using Domain;
using MediatR;

namespace Application.Features.Users.Command.Create
{
    public class CreateUserRequest(CreateUser userRequest) : IRequest<CreateUserDTO>
    {
        public CreateUser UserRequest { get; set; } = userRequest;
    }
}
