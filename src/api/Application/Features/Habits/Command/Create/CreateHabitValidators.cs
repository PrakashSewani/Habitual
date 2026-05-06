using Domain.Common.Enums;
using FluentValidation;

namespace Application.Features.Habits.Command.Create
{
    public class CreateHabitValidators : AbstractValidator<CreateHabitRequest>
    {
        public CreateHabitValidators()
        {
            RuleFor(x => x.UserId).NotEmpty().WithMessage("UserId is required.");
            RuleFor(x => x.CreateHabit.Name)
                .NotEmpty().WithMessage("Habit name is required.");
            RuleFor(x => x.CreateHabit.Description)
                .NotEmpty().WithMessage("Habit description is required.");
            RuleFor(x => x.CreateHabit.Schedule)
                .NotNull().WithMessage("Habit schedule is required.");
            RuleFor(x => x.CreateHabit.Schedule.Type)
                .IsInEnum().WithMessage("Invalid schedule type.");
            RuleFor(x => x.CreateHabit.Schedule.DaysOfWeek)
                .NotEmpty().WithMessage("Days of week are required for weekly schedule.")
                .When(x => x.CreateHabit.Schedule.Type == ScheduleType.Weekly);
            RuleFor(x => x.CreateHabit.Schedule.Interval)
                .GreaterThan(0).WithMessage("Interval must be greater than 0 for daily and custom schedules.")
                .When(x => x.CreateHabit.Schedule.Type == ScheduleType.Daily || x.CreateHabit.Schedule.Type == ScheduleType.Interval);
            RuleFor(x => x.CreateHabit.Schedule.Interval)
                .Null().WithMessage("Interval should be null for weekly schedule.")
                .When(x => x.CreateHabit.Schedule.Type == ScheduleType.Weekly);
        }
    }
}
