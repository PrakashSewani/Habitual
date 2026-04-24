using MediatR;

namespace Application.Features.Users.Command.Logout
{
    public class LogoutUserRequest(string refreshToken) : IRequest<bool>
    {
        public string RefreshToken { get; set; } = refreshToken;
    }
}
