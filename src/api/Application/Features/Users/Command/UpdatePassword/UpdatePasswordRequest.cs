using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.UpdatePassword
{
    /// <summary>
    /// UpdatePasswordRequest represents a command to update a user's password.
    /// </summary>
    public class UpdatePasswordRequest(Guid userId, Application.Models.Users.PasswordUpdate.UpdatePassword passwordRequest) : IRequest<Application.Models.Users.PasswordUpdate.UpdatePasswordResponse>, IValidate
    {
        public Guid UserId { get; set; } = userId;
        public Application.Models.Users.PasswordUpdate.UpdatePassword PasswordRequest { get; set; } = passwordRequest;
    }
}
