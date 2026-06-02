using FluentValidation;

namespace Application.Features.Users.Command.UpdatePassword
{
    public class UpdatePasswordValidators : AbstractValidator<UpdatePasswordRequest>
    {
        public UpdatePasswordValidators()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("User ID is required.")
                .Must(id => Guid.TryParse(id.ToString(), out _)).WithMessage("Invalid User ID format.");

            RuleFor(x => x.PasswordRequest.CurrentPassword)
                .NotEmpty().WithMessage("Current password is required.");

            RuleFor(x => x.PasswordRequest.NewPassword)
                .NotEmpty().WithMessage("New password is required.")
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$")
                .WithMessage("Password must be at least 8 characters and contain one uppercase letter, one lowercase letter, one number, and one special character.");
        }
    }
}
