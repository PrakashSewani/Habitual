using Application.Abstractions.Authentication;
using Application.Models.Users.Auth;
using Application.Repositories.Users;
using AutoMapper;
using MediatR;

namespace Application.Features.Users.Command.Refresh
{
    /// <summary>
    /// RefreshUserRequestHandler is responsible for handling the RefreshUserRequest command, which refreshes a user's authentication tokens in the system. It interacts with the IRefreshTokenStore to retrieve the user ID associated with the provided refresh token, uses IUserRepository to retrieve user information based on the user ID, and utilizes ITokenService to generate new access and refresh tokens. The handler also updates the refresh token store with the new refresh token and deletes the old one. When executed, this handler will return an AuthResponse containing the new access token, new refresh token, and user information if the refresh operation is successful; otherwise, it will throw an exception indicating the failure reason (e.g., invalid refresh token or user not found).
    /// </summary>
    /// <param name="mapper">The mapper used to map user entities to DTOs.</param>
    /// <param name="userRepository">The repository used to manage user data.</param>
    /// <param name="tokenService">The service used to generate access and refresh tokens.</param>
    /// <param name="refreshStore">The store used to manage refresh tokens.</param>
    public class RefreshUserRequestHandler(IMapper mapper, IUserRepository userRepository, ITokenService tokenService, IRefreshTokenStore refreshStore) : IRequestHandler<RefreshUserRequest, AuthResponse>
    {
        private readonly IRefreshTokenStore _refreshStore = refreshStore;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IMapper _mapper = mapper;

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
                RefreshToken = newRefreshToken,
                UserInfo = _mapper.Map<AuthUserDTO>(user)
            };
        }
    }
}
