using Application.Repository;
using Domain;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class UserRepository(AppDbContext context) : IUserRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<User> AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<bool> DeleteUserAsync(Guid userId)
        {
            var user = await _context.Users
                                     .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<User> GetUserByEmailIdAsync(string emailId)
        {
            return await _context.Users
                                 .AsNoTracking()
                                 .FirstOrDefaultAsync(u => u.Email == emailId);
        }

        public async Task<User> GetUserByIdAsync(Guid userId)
        {
            return await _context.Users
                                 .AsNoTracking()
                                 .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            var userToUpdate = await GetUserByIdAsync(user.Id);

            userToUpdate.Email = user.Email;
            userToUpdate.Name = user.Name;
            userToUpdate.PhoneNumber = user.PhoneNumber;

            await _context.SaveChangesAsync();

            return userToUpdate;
        }
    }
}