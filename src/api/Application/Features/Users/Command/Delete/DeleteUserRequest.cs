using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Delete
{
    /// <summary>
    /// DeleteUserRequest represents a command to delete an existing user from the system. It contains the unique identifier of the user to be deleted. When executed, this command will trigger the deletion of the specified user from the system and return a boolean value indicating whether the deletion was successful or not.
    /// </summary>
    /// <param name="id">The unique identifier of the user to be deleted.</param>
    public class DeleteUserRequest(Guid id) : IRequest<bool>, IValidate
    {
        public Guid Id { get; set; } = id;
    }
}
