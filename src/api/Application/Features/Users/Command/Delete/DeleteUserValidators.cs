using FluentValidation;

namespace Application.Features.Users.Command.Delete
{
    public class DeleteUserValidators : AbstractValidator<DeleteUserRequest>
    {
        public DeleteUserValidators()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("User ID is required.")
                .Must(id => Guid.TryParse(id.ToString(), out _)).WithMessage("Invalid User ID format.");
        }
    }
}
