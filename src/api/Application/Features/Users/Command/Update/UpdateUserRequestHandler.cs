using Application.Interfaces;
using Application.Models.Users.Update;
using Application.Repositories.Users;
using AutoMapper;
using Domain.Entities.Users;
using MediatR;

namespace Application.Features.Users.Command.Update
{
    /// <summary>
    /// UpdateUserRequestHandler is responsible for handling the UpdateUserRequest command, which updates an existing user's information in the system. It interacts with the IUserRepository to retrieve the user by their ID, update the user's details based on the provided information in the request, and save the changes back to the database. The handler also uses IPasswordHasher to hash the new password if it is provided. AutoMapper is utilized to map between the User entity and the UpdateUserResponse model. When executed, this handler will update the specified user's information in the system and return the updated user details in the response.
    /// </summary>
    /// <param name="userRepository">The repository used to manage user data.</param>
    /// <param name="passwordHasher">The service used to hash user passwords.</param>
    /// <param name="mapper">The mapper used to map user entities to DTOs.</param>
    public class UpdateUserRequestHandler(IUserRepository userRepository, IMapper mapper) : IRequestHandler<UpdateUserRequest, UpdateUserResponse>
    {
        private readonly IUserRepository _userRepository = userRepository;
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

            userInDb.LastModified = DateTime.UtcNow;

            var updatedUser = await _userRepository
                .UpdateUserAsync(userInDb);

            return _mapper.Map<UpdateUserResponse>(updatedUser);
        }
    }
}
