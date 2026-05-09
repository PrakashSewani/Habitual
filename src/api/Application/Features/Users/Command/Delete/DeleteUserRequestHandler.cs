using Application.Repositories.Users;
using MediatR;

namespace Application.Features.Users.Command.Delete
{
    /// <summary>
    /// DeleteUserRequestHandler is responsible for handling the DeleteUserRequest command, which deletes an existing user from the system. It interacts with the IUserRepository to perform the necessary operations to delete the user from the database and returns a boolean indicating the success of the operation.
    /// </summary>
    /// <param name="userRepository">The repository used to manage user data.</param>
    public class DeleteUserRequestHandler(IUserRepository userRepository) : IRequestHandler<DeleteUserRequest, bool>
    {
        private readonly IUserRepository _userRepository = userRepository;

        async Task<bool> IRequestHandler<DeleteUserRequest, bool>.Handle(DeleteUserRequest request, CancellationToken cancellationToken)
        {
            var isDeleted = await _userRepository.DeleteUserAsync(request.Id);

            if (!isDeleted) throw new Exception("User not found");

            return true;
        }
    }
}
