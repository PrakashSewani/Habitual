using Application.Interfaces;
using Application.Models.Users.Auth;
using Application.Repository;
using AutoMapper;
using MediatR;

namespace Application.Features.Users.Command.Auth
{
    public class AuthUserRequestHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, IMapper mapper) : IRequestHandler<AuthUserRequest, AuthUserDTO>
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IMapper _mapper = mapper;

        async Task<AuthUserDTO> IRequestHandler<AuthUserRequest, AuthUserDTO>.Handle(AuthUserRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var userInDb = await _userRepository.GetUserByEmailIdAsync(request.Email) ?? throw new Exception("User not found");

                var isPasswordValid = _passwordHasher.VerifyPassword(request.Password, userInDb.PasswordHash);
                if (!isPasswordValid) throw new Exception("Username/Password is incorrect");
                return _mapper.Map<AuthUserDTO>(userInDb);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
