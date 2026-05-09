using Application.Interfaces;
using Application.Models.Users.Create;
using Application.Repositories.Users;
using AutoMapper;
using Domain.Entities.Users;
using MediatR;

namespace Application.Features.Users.Command.Create
{
    /// <summary>
    /// CreateUserRequestHandler is responsible for handling the CreateUserRequest command, which creates a new user in the system. It interacts with the IUserRepository to add the new user to the database and uses IPasswordHasher to hash the user's password before storing it. The handler also utilizes AutoMapper to map between the CreateUser model and the User entity, as well as to map the resulting User entity to a CreateUserResponse. When executed, this handler will create a new user in the system and return the details of the created user in the response.
    /// </summary>
    /// <param name="userRepository">The repository used to manage user data.</param>
    /// <param name="passwordHasher">The service used to hash and verify passwords.</param>
    /// <param name="mapper">The AutoMapper instance used for mapping between models and entities.</param>
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
