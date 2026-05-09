using Application.Models.Users.Auth;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Auth
{
    /// <summary>
    /// AuthUserRequest represents a command to authenticate a user in the system. It contains the user's email and password, which are required for the authentication process. When executed, this command will trigger the authentication logic, which typically involves validating the provided credentials against stored user data and generating an authentication token or response if the credentials are valid.
    /// </summary>
    /// <param name="email">The email of the user.</param>
    /// <param name="password">The password of the user.</param>
    public class AuthUserRequest(string email, string password) : IRequest<AuthResponse>, IValidate
    {
        public string Email { get; set; } = email;
        public string Password { get; set; } = password;
    }
}
