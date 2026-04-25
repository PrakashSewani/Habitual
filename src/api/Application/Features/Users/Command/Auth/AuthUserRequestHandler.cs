using Application.Abstractions.Authentication;
using Application.Interfaces;
using Application.Models.Users.Auth;
using Application.Repository;
using AutoMapper;
using MediatR;

namespace Application.Features.Users.Command.Auth
{
    public class AuthUserRequestHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, IMapper mapper, ITokenService tokenService, IRefreshTokenStore refreshTokenStore) : IRequestHandler<AuthUserRequest, AuthResponse>
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IMapper _mapper = mapper;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IRefreshTokenStore _refreshTokenStore = refreshTokenStore;

        async Task<AuthResponse> IRequestHandler<AuthUserRequest, AuthResponse>.Handle(AuthUserRequest request, CancellationToken cancellationToken)
        {
            var email = request.Email.Trim().ToLower();
            var userInDb = await _userRepository.GetUserByEmailIdAsync(email) ?? throw new Exception("User not found");

            var isPasswordValid = _passwordHasher.VerifyPassword(
                request.Password,
                userInDb.PasswordHash
            );

            if (!isPasswordValid) throw new Exception("Username/Password is incorrect");

            var accessToken = _tokenService.GenerateAccessToken(userInDb.Id, userInDb.Email);
            var refreshToken = _tokenService.GenerateRefreshToken();

            await _refreshTokenStore.StoreAsync(
                refreshToken,
                userInDb.Id,
                TimeSpan.FromDays(7)
            );

            return new AuthResponse
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                UserInfo = _mapper.Map<AuthUserDTO>(userInDb)
            };
        }
    }
}
