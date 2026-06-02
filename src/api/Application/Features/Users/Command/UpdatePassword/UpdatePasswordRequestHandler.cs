using Application.Interfaces;
using Application.Repositories.Users;
using AutoMapper;
using MediatR;

namespace Application.Features.Users.Command.UpdatePassword
{
    /// <summary>
    /// UpdatePasswordRequestHandler handles the password change command.
    /// It verifies the current password before applying the new one.
    /// </summary>
    public class UpdatePasswordRequestHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, IMapper mapper) : IRequestHandler<UpdatePasswordRequest, Application.Models.Users.PasswordUpdate.UpdatePasswordResponse>
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IMapper _mapper = mapper;

        async Task<Application.Models.Users.PasswordUpdate.UpdatePasswordResponse> IRequestHandler<UpdatePasswordRequest, Application.Models.Users.PasswordUpdate.UpdatePasswordResponse>.Handle(UpdatePasswordRequest request, CancellationToken cancellationToken)
        {
            var userInDb = await _userRepository.GetUserByIdAsync(request.UserId);

            if (userInDb == null)
            {
                throw new UnauthorizedAccessException("User not found.");
            }

            // Verify current password
            var isCurrentPasswordValid = _passwordHasher.VerifyPassword(
                request.PasswordRequest.CurrentPassword,
                userInDb.PasswordHash
            );

            if (!isCurrentPasswordValid)
            {
                throw new UnauthorizedAccessException("Current password is incorrect.");
            }

            // Hash and set new password
            userInDb.PasswordHash = _passwordHasher.HashPassword(request.PasswordRequest.NewPassword);
            userInDb.LastModified = DateTime.UtcNow;

            var updatedUser = await _userRepository.UpdateUserAsync(userInDb);

            return _mapper.Map<Application.Models.Users.PasswordUpdate.UpdatePasswordResponse>(updatedUser);
        }
    }
}
