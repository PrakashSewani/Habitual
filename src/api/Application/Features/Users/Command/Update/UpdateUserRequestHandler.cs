using Application.Interfaces;
using Application.Models.Users.Update;
using Application.Repositories.Users;
using AutoMapper;
using Domain.Entities.Users;
using MediatR;

namespace Application.Features.Users.Command.Update
{
    public class UpdateUserRequestHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, IMapper mapper) : IRequestHandler<UpdateUserRequest, UpdateUserResponse>
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IMapper _mapper = mapper;

        async Task<UpdateUserResponse> IRequestHandler<UpdateUserRequest, UpdateUserResponse>.Handle(UpdateUserRequest request, CancellationToken cancellationToken)
        {
            var userMapped = _mapper.Map<User>(request.UserRequest);
            userMapped.PasswordHash = _passwordHasher.HashPassword(request.UserRequest.Password);
            var resp = _mapper.Map<UpdateUserResponse>(await _userRepository.UpdateUserAsync(userMapped));
            return resp;
        }
    }
}
