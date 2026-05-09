using FluentValidation;

namespace Application.Features.Users.Command.Auth
{
    public class AuthUserValidators : AbstractValidator<AuthUserRequest>
    {
        public AuthUserValidators()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$").WithMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
        }
    }
}
