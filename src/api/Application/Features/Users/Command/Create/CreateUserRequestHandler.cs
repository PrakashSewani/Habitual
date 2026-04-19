using Application.Models.Users.Create;
using Application.Repository;
using AutoMapper;
using Domain;
using MediatR;

namespace Application.Features.Users.Command.Create
{
    public class CreateUserRequestHandler(IUserRepository userRepository, IMapper mapper) : IRequestHandler<CreateUserRequest, CreateUserDTO>
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IMapper _mapper = mapper;

        async Task<CreateUserDTO> IRequestHandler<CreateUserRequest, CreateUserDTO>.Handle(CreateUserRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var userInDb = await _userRepository.GetUserByEmailIdAsync(request.UserRequest.Email);

                if (userInDb != null) throw new Exception("User already exists, please try Log In");

                var resp = _mapper.Map<CreateUserDTO>(await _userRepository.AddUserAsync(new User
                {
                    Name = request.UserRequest.Name,
                    Email = request.UserRequest.Email,
                    PasswordHash = "",
                    PhoneNumber = request.UserRequest.PhoneNumber,
                    CreatedAt = DateTime.UtcNow
                }));

                return resp;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
