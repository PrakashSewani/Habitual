using Application.Models.Users.Update;
using Application.Pipeline_Behaviour.Contract;
using Domain;
using MediatR;

namespace Application.Features.Users.Command.Update
{
    public class UpdateUserRequest(UpdateUser userRequest) : IRequest<UpdateUserResponse>, IValidate
    {
        public UpdateUser UserRequest { get; set; } = userRequest;
    }
}
