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
            var userInDb = await _userRepository
                .GetUserByIdAsync(request.UserId);

            if (request.UserRequest.Name is not null)
            {
                userInDb.Name = request.UserRequest.Name;
            }

            if (request.UserRequest.Email is not null)
            {
                userInDb.Email = request.UserRequest.Email
                    .Trim()
                    .ToLower();
            }

            if (request.UserRequest.PhoneNumber is not null)
            {
                userInDb.PhoneNumber = request.UserRequest.PhoneNumber;
            }

            if (request.UserRequest.DateOfBirth.HasValue)
            {
                userInDb.DateOfBirth = (DateOnly)request.UserRequest.DateOfBirth;
            }

            if (!string.IsNullOrWhiteSpace(request.UserRequest.Password))
            {
                userInDb.PasswordHash = _passwordHasher
                    .HashPassword(request.UserRequest.Password);
            }

            userInDb.LastModified = DateTime.UtcNow;

            var updatedUser = await _userRepository
                .UpdateUserAsync(userInDb);

            return _mapper.Map<UpdateUserResponse>(updatedUser);
        }
    }
}
