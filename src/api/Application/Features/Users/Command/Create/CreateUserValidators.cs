using FluentValidation;

namespace Application.Features.Users.Command.Create
{
    public class CreateUserValidators : AbstractValidator<CreateUserRequest>
    {
        public CreateUserValidators()
        {
            RuleFor(x => x.UserRequest.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name must not exceed 100 characters.");
            RuleFor(x => x.UserRequest.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");
            RuleFor(x => x.UserRequest.Password)
                .NotEmpty().WithMessage("Password is required.")
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$").WithMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
            RuleFor(x => x.UserRequest.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is required.")
                .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Invalid phone number format.");
            RuleFor(x => x.UserRequest.DateOfBirth)
                .NotEmpty().WithMessage("Date of Birth is required");
        }
    }
}
