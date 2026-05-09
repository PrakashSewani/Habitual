using Application.Models.Users.Update;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Update
{
    /// <summary>
    /// UpdateUserRequest represents a command to update an existing user's information in the system. It contains the user's unique identifier and the details of the user to be updated, encapsulated in the UpdateUser model. When executed, this command will trigger the update of the specified user's information in the system and return the updated user details in the response.
    /// </summary>
    /// <param name="userId">The unique identifier of the user to be updated.</param>
    /// <param name="userRequest">The details of the user to be updated.</param>
    public class UpdateUserRequest(Guid userId, UpdateUser userRequest) : IRequest<UpdateUserResponse>, IValidate
    {
        public Guid UserId { get; set; } = userId;
        public UpdateUser UserRequest { get; set; } = userRequest;
    }
}
