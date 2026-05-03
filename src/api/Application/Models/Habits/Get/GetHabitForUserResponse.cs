using Application.Models.Habits.Create;

namespace Application.Models.Habits.Get
{
    public class GetHabitForUserResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public CreateHabitSchedule Schedule { get; set; }
        public List<GetHabitLogEntryForUserResponse> HabitLog { get; set; }
    }
}
