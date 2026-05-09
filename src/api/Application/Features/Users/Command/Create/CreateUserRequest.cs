using Application.Models.Users.Create;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Create
{
    /// <summary>
    /// CreateUserRequest represents a command to create a new user in the system. It contains the details of the user to be created, encapsulated in the CreateUser model. When executed, this command will trigger the creation of a new user in the system and return the details of the created user in the response.
    /// </summary>
    /// <param name="userRequest">The details of the user to be created.</param>
    public class CreateUserRequest(CreateUser userRequest) : IRequest<CreateUserResponse>, IValidate
    {
        public CreateUser UserRequest { get; set; } = userRequest;
    }
}
