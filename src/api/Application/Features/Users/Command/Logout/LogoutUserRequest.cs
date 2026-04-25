using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.Users.Command.Logout
{
    public class LogoutUserRequest(string refreshToken) : IRequest<bool>, IValidate
    {
        public string RefreshToken { get; set; } = refreshToken;
    }
}
