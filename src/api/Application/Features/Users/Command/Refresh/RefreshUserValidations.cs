using FluentValidation;

namespace Application.Features.Users.Command.Refresh
{
    public class RefreshUserValidations : AbstractValidator<RefreshUserRequest>
    {
        public RefreshUserValidations()
        {
            RuleFor(x => x.RefreshToken)
                .NotEmpty().WithMessage("Refresh token is required.");
        }
    }
}
