using Application.Models.Users.Auth;
using MediatR;

namespace Application.Features.Users.Command.Auth
{
    public class AuthUserRequest(string email, string password) : IRequest<AuthUserDTO>
    {
        public string Email { get; set; } = email;
        public string Password { get; set; } = password;
    }
}
