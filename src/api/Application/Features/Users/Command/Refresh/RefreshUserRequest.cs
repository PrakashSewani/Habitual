using Application.Models.Users.Auth;
using MediatR;

namespace Application.Features.Users.Command.Refresh
{
    public class RefreshUserRequest(string refreshToken) : IRequest<AuthResponse>
    {
        public string RefreshToken { get; set; } = refreshToken;
    }
}
