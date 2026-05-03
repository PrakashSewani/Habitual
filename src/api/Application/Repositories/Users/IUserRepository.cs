using Domain.Entities.Users;

namespace Application.Repositories.Users
{
    public interface IUserRepository
    {
        Task<User> AddUserAsync(User user);
        Task<User> GetUserByIdAsync(Guid userId);
        Task<User> GetUserByEmailIdAsync(string emailId);
        Task<User> UpdateUserAsync(User user);
        Task<bool> DeleteUserAsync(Guid userId);
    }
}