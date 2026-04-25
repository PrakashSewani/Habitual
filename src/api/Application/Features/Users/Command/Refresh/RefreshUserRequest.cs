using Application.Models.Users.Auth;
using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Refresh
{
    public class RefreshUserRequest(string refreshToken) : IRequest<AuthResponse>, IValidate
    {
        public string RefreshToken { get; set; } = refreshToken;
    }
}
