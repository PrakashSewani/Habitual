using Domain;

namespace Application.Repository
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