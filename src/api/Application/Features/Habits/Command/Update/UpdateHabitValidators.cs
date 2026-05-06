using FluentValidation;

namespace Application.Features.Habits.Command.Update
{
    public class UpdateHabitValidators : AbstractValidator<UpdateHabitRequest>
    {
        public UpdateHabitValidators()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required.");
            RuleFor(x => x.UpdateHabit.Id)
                .NotEmpty().WithMessage("Habit Id is required.");
        }
    }
}
