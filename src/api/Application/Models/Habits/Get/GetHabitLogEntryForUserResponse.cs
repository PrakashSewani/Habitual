namespace Application.Models.Habits.Get
{
    public class GetHabitLogEntryForUserResponse
    {
        public Guid Id { get; set; }
        public DateOnly Date { get; set; }
    }
}