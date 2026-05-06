using FluentValidation;

namespace Application.Features.Users.Command.Update
{
    public class UpdateUserValidators : AbstractValidator<UpdateUserRequest>
    {
        public UpdateUserValidators()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("User ID is required.")
                .Must(id => Guid.TryParse(id.ToString(), out _)).WithMessage("Invalid User ID format.");
        }
    }
}
