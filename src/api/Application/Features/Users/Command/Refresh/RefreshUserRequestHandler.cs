using Application.Abstractions.Authentication;
using Application.Models.Users.Auth;
using Application.Repositories.Users;
using AutoMapper;
using MediatR;

namespace Application.Features.Users.Command.Refresh
{
    /// <summary>
    /// RefreshUserRequestHandler is responsible for handling the RefreshUserRequest command, which is used to refresh a user's authentication tokens. It interacts with the IRefreshTokenStore to validate the provided refresh token and retrieve the associated user ID. If the refresh token is valid, it retrieves the user information from the IUserRepository, generates new access and refresh tokens using the ITokenService, and stores the new refresh token in the IRefreshTokenStore. Finally, it returns an AuthResponse containing the new access token and refresh token. If the refresh token is invalid or if any other error occurs during the process, it throws an appropriate exception (e.g., UnauthorizedAccessException for invalid tokens or a general Exception for user not found).
    /// </summary>
    /// <param name="userRepository">The repository used to manage user data.</param>
    /// <param name="tokenService">The service used to generate access and refresh tokens.</param>
    /// <param name="refreshStore">The store used to manage refresh tokens.</param>
    public class RefreshUserRequestHandler(IUserRepository userRepository, ITokenService tokenService, IRefreshTokenStore refreshStore) : IRequestHandler<RefreshUserRequest, AuthResponse>
    {
        private readonly IRefreshTokenStore _refreshStore = refreshStore;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IUserRepository _userRepository = userRepository;

        async Task<AuthResponse> IRequestHandler<RefreshUserRequest, AuthResponse>.Handle(RefreshUserRequest request, CancellationToken cancellationToken)
        {
            var userId = await _refreshStore.GetUserIdAsync(request.RefreshToken);

            if (userId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Invalid refresh token");
            }

            var user = await _userRepository.GetUserByIdAsync(userId) ?? throw new Exception("User not found");

            await _refreshStore.DeleteAsync(request.RefreshToken);

            var newRefreshToken = _tokenService.GenerateRefreshToken();

            await _refreshStore.StoreAsync(
                newRefreshToken,
                user.Id,
                TimeSpan.FromDays(7)
            );

            var newAccessToken = _tokenService.GenerateAccessToken(user.Id, user.Email);

            return new AuthResponse
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken
            };
        }
    }
}
