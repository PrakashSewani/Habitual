using Application.Repository;
using MediatR;

namespace Application.Features.Users.Command.Delete
{
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
