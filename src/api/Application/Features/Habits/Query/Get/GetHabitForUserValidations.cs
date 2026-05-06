using FluentValidation;

namespace Application.Features.Habits.Query.Get
{
    public class GetHabitForUserValidations : AbstractValidator<GetHabitForUserRequest>
    {
        public GetHabitForUserValidations()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required.")
                .Must(id => id != Guid.Empty).WithMessage("UserId must be a valid GUID.");
        }
    }
}
