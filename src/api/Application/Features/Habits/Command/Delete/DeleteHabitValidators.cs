using FluentValidation;

namespace Application.Features.Habits.Command.Delete
{
    public class DeleteHabitValidators : AbstractValidator<DeleteHabitRequest>
    {
        public DeleteHabitValidators()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required.")
                .NotEqual(Guid.Empty).WithMessage("UserId cannot be an empty GUID.");
            RuleFor(x => x.HabitId)
                .NotEmpty().WithMessage("HabitId is required.")
                .NotEqual(Guid.Empty).WithMessage("HabitId cannot be an empty GUID.");
        }
    }
}
