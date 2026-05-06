using Application.Pipeline_Behaviour.Contract;
using MediatR;

namespace Application.Features.HabitLogs.Commands
{
    public class UpdateHabitLogRequest : IRequest<bool>, IValidate
    {
        public Guid UserId { get; set; }
        public Guid HabitId { get; set; }
        public DateOnly Date { get; set; }
    }
}
