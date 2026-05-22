using FluentValidation;

namespace Application.Features.Users.Command.Logout
{
    public class LogoutUserValidators : AbstractValidator<LogoutUserRequest>
    {
        public LogoutUserValidators()
        {
            RuleFor(x => x.RefreshToken)
                .NotEmpty()
                .WithMessage(
                    "Refresh token is required."
                )
                .MaximumLength(512)
                .WithMessage(
                    "Refresh token is too long."
                );
        }
    }
}
