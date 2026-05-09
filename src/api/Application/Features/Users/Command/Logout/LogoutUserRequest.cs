using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Logout
{
    /// <summary>
    /// LogoutUserRequest represents a command to log out a user from the system. It contains the refresh token associated with the user's session, which is required to invalidate the session and effectively log the user out. When executed, this command will trigger the logout process, which typically involves invalidating the provided refresh token and returning a boolean value indicating whether the logout was successful or not.
    /// </summary>
    /// <param name="refreshToken">The refresh token associated with the user's session.</param>
    public class LogoutUserRequest(string refreshToken) : IRequest<bool>, IValidate
    {
        public string RefreshToken { get; set; } = refreshToken;
    }
}
