using FluentValidation;

namespace Application.Features.HabitLogs.Commands
{
    public class UpdateHabitLogValidators : AbstractValidator<UpdateHabitLogRequest>
    {
        public UpdateHabitLogValidators()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("Id is required.");
            RuleFor(x => x.HabitId)
                .NotEmpty().WithMessage("Id is required.");
            RuleFor(x => x.Date)
               .NotEmpty().WithMessage("Date is required.");
            RuleFor(x => x.Date)
                .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("Cannot log habits for future dates.");
        }
    }
}
