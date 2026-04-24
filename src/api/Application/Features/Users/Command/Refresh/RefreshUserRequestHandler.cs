using Application.Abstractions.Authentication;
using Application.Models.Users.Auth;
using Application.Repository;
using AutoMapper;
using MediatR;

namespace Application.Features.Users.Command.Refresh
{
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
                throw new UnauthorizedAccessException("Invalid refresh token.");
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
