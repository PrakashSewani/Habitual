using Application.Abstractions.Authentication;
using MediatR;

namespace Application.Features.Users.Command.Logout
{
    /// <summary>
    /// LogoutUserRequestHandler is responsible for handling the LogoutUserRequest command, which logs out a user from the system. It interacts with the IRefreshTokenStore to retrieve the user ID associated with the provided refresh token and then deletes the refresh token from the store to effectively log the user out. When executed, this handler will return a boolean value indicating whether the logout was successful or not (i.e., whether the refresh token was found and deleted successfully).
    /// </summary>
    /// <param name="refreshTokenStore">The store used to manage refresh tokens.</param>
    public class LogoutUserRequestHandler(IRefreshTokenStore refreshTokenStore) : IRequestHandler<LogoutUserRequest, bool>
    {
        private readonly IRefreshTokenStore _refreshTokenStore = refreshTokenStore;

        async Task<bool> IRequestHandler<LogoutUserRequest, bool>.Handle(LogoutUserRequest request, CancellationToken cancellationToken)
        {
            var userId = await _refreshTokenStore.GetUserIdAsync(request.RefreshToken);

            if (userId == Guid.Empty) return false;

            await _refreshTokenStore.DeleteAsync(request.RefreshToken);

            return true;
        }
    }
}
