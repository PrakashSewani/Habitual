using Application.Models.Users.Auth;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Auth
{
    public class AuthUserRequest(string email, string password) : IRequest<AuthResponse>, IValidate
    {
        public string Email { get; set; } = email;
        public string Password { get; set; } = password;
    }
}
