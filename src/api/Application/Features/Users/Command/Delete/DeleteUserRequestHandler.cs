using Application.Repository;
using MediatR;

namespace Application.Features.Users.Command.Delete
{
    public class DeleteUserRequestHandler(IUserRepository userRepository) : IRequestHandler<DeleteUserRequest, bool>
    {
        private readonly IUserRepository _userRepository = userRepository;

        Task<bool> IRequestHandler<DeleteUserRequest, bool>.Handle(DeleteUserRequest request, CancellationToken cancellationToken)
        {
            try
            {
                _userRepository.DeleteUserAsync(request.Id);
                return Task.FromResult(true);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
