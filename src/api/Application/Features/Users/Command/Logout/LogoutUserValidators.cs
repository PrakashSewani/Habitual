using FluentValidation;

namespace Application.Features.Users.Command.Logout
{
    public class LogoutUserValidators : AbstractValidator<LogoutUserRequest>
    {
        public LogoutUserValidators()
        {
            RuleFor(x => x.RefreshToken)
                .NotEmpty().WithMessage("Refresh token is required.")
                .Matches("^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_.+/=]*$").WithMessage("Invalid refresh token format.");
        }
    }
}
