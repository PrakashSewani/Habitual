using Application.Models.Users.Auth;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Refresh
{
    /// <summary>
    /// RefreshUserRequest represents a command to refresh a user's authentication token in the system. It contains the refresh token associated with the user's session, which is required to generate a new authentication token. When executed, this command will trigger the token refresh process, which typically involves validating the provided refresh token and generating a new authentication token if the refresh token is valid. The response will contain the new authentication token and any relevant information related to the refreshed session.
    /// </summary>
    /// <param name="refreshToken">The refresh token associated with the user's session.</param>
    public class RefreshUserRequest(string refreshToken) : IRequest<AuthResponse>, IValidate
    {
        public string RefreshToken { get; set; } = refreshToken;
    }
}
