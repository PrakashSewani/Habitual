using Application.Interfaces;
using Application.Models.Users.Update;
using Application.Repository;
using AutoMapper;
using Domain;
using MediatR;

namespace Application.Features.Users.Command.Update
{
    public class UpdateUserRequestHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, IMapper mapper) : IRequestHandler<UpdateUserRequest, UpdateUserDTO>
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IMapper _mapper = mapper;

        async Task<UpdateUserDTO> IRequestHandler<UpdateUserRequest, UpdateUserDTO>.Handle(UpdateUserRequest request, CancellationToken cancellationToken)
        {
            var userMapped = _mapper.Map<User>(request.UserRequest);
            userMapped.PasswordHash = _passwordHasher.HashPassword(request.UserRequest.Password);
            var resp = _mapper.Map<UpdateUserDTO>(await _userRepository.UpdateUserAsync(userMapped));
            return resp;
        }
    }
}
