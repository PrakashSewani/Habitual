using Application.Interfaces;
using Application.Models.Users.Create;
using Application.Repositories.Users;
using AutoMapper;
using Domain.Entities.Users;
using MediatR;

namespace Application.Features.Users.Command.Create
{
    public class CreateUserRequestHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, IMapper mapper) : IRequestHandler<CreateUserRequest, CreateUserResponse>
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IMapper _mapper = mapper;

        async Task<CreateUserResponse> IRequestHandler<CreateUserRequest, CreateUserResponse>.Handle(CreateUserRequest request, CancellationToken cancellationToken)
        {
            var userInDb = await _userRepository.GetUserByEmailIdAsync(request.UserRequest.Email.Trim().ToLower());

            if (userInDb != null) throw new Exception("User already exists, redirecting to login");

            var hashedPassword = _passwordHasher.HashPassword(request.UserRequest.Password);

            var resp = _mapper.Map<CreateUserResponse>(await _userRepository.AddUserAsync(new User
            {
                Name = request.UserRequest.Name,
                Email = request.UserRequest.Email.Trim().ToLower(),
                PasswordHash = hashedPassword,
                PhoneNumber = request.UserRequest.PhoneNumber,
                DateOfBirth = request.UserRequest.DateOfBirth,
            }));

            return resp;
        }
    }
}
