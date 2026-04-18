using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber{ get; set; }

        public List<Habit> Habits { get; set; } = [];
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
