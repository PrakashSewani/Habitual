using Application.Models.Users.Update;
using Domain;
using MediatR;

namespace Application.Features.Users.Command.Update
{
    public class UpdateUserRequest(UpdateUser userRequest) : IRequest<UpdateUserDTO>
    {
        public UpdateUser UserRequest { get; set; } = userRequest;
    }
}
