using MediatR;

namespace Application.Features.HabitLogs.Commands
{
    public class UpdateHabitLogRequest : IRequest<bool>
    {
        public Guid UserId { get; set; }
        public Guid HabitId { get; set; }
        public DateOnly Date { get; set; }
    }
}
