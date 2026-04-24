using Application.Abstractions.Authentication;
using MediatR;

namespace Application.Features.Users.Command.Logout
{
    public class LogoutUserRequestHandler(IRefreshTokenStore refreshTokenStore) : IRequestHandler<LogoutUserRequest, bool>
    {
        private readonly IRefreshTokenStore _refreshTokenStore = refreshTokenStore;

        async Task<bool> IRequestHandler<LogoutUserRequest, bool>.Handle(LogoutUserRequest request, CancellationToken cancellationToken)
        {
            var userId = await _refreshTokenStore.GetUserIdAsync(request.RefreshToken);

            if (userId == Guid.Empty)
            {
                return false;
            }

            await _refreshTokenStore.DeleteAsync(request.RefreshToken);

            return true;
        }
    }
}
