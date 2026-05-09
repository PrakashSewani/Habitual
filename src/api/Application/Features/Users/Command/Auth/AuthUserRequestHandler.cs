using Application.Abstractions.Authentication;
using Application.Interfaces;
using Application.Models.Users.Auth;
using Application.Repositories.Users;
using AutoMapper;
using MediatR;

namespace Application.Features.Users.Command.Auth
{
    /// <summary>
    /// AuthUserRequestHandler is responsible for handling the AuthUserRequest command, which authenticates a user in the system. It interacts with the IUserRepository to retrieve user information based on the provided email, uses IPasswordHasher to verify the provided password against the stored password hash, and utilizes ITokenService to generate access and refresh tokens upon successful authentication. The handler also stores the generated refresh token using IRefreshTokenStore for future token refresh operations. When executed, this handler will return an AuthResponse containing the access token, refresh token, and user information if the authentication is successful; otherwise, it will throw an exception indicating the failure reason (e.g., user not found or incorrect password).
    /// </summary>
    /// <param name="userRepository">The repository used to manage user data.</param>
    /// <param name="passwordHasher">The service used to hash and verify passwords.</param>
    /// <param name="mapper">The AutoMapper instance used for mapping between models and entities.</param>
    /// <param name="tokenService">The service used to generate access and refresh tokens.</param>
    /// <param name="refreshTokenStore"></param>
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
