using Application.Repository;
using Domain;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class UserRepository(AppDbContext context) : IUserRepository
    {
        private readonly AppDbContext _context = context;

        public User AddUserAsync(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public bool DeleteUserAsync(Guid userId)
        {
            _context.Users.Remove(new User { Id = userId });
            _context.SaveChanges();
            return true;
        }

        public Task<User> GetUserByEmailIdAsync(string emailId)
        {
            return _context.Users.FirstOrDefaultAsync(u => u.Email == emailId);
        }

        public Task<User> GetUserByIdAsync(Guid userId)
        {
            return _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            User userToUpdate = await GetUserByIdAsync(user.Id);
            
            userToUpdate.Email = user.Email;
            userToUpdate.Name = user.Name;
            userToUpdate.PhoneNumber = user.PhoneNumber;

            _context.Users.Update(userToUpdate);
            _context.SaveChanges();

            return userToUpdate;
        }
    }
}
