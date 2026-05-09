using Domain.Common.Enums;
using FluentValidation;

namespace Application.Features.Habits.Command.Update
{
    public class UpdateHabitValidators : AbstractValidator<UpdateHabitRequest>
    {
        public UpdateHabitValidators()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required.");
            RuleFor(x => x.UpdateHabit.Id)
                .NotEmpty().WithMessage("Habit Id is required.");
            RuleFor(x => x.UpdateHabit.Name)
                .NotEmpty().WithMessage("Habit name is required.");
            RuleFor(x => x.UpdateHabit.Description)
                .NotEmpty().WithMessage("Habit description is required.");
            RuleFor(x => x.UpdateHabit.Schedule)
                .NotNull().WithMessage("Habit schedule is required.");
            RuleFor(x => x.UpdateHabit.Schedule.Type)
                .IsInEnum().WithMessage("Invalid schedule type.");
            RuleFor(x => x.UpdateHabit.Schedule.DaysOfWeek)
                .NotEmpty().WithMessage("Days of week are required for weekly schedule.")
                .When(x => x.UpdateHabit.Schedule.Type == ScheduleType.Weekly);
            RuleFor(x => x.UpdateHabit.Schedule.Interval)
                .GreaterThan(0).WithMessage("Interval must be greater than 0 for daily and custom schedules.")
                .When(x => x.UpdateHabit.Schedule.Type == ScheduleType.Daily || x.UpdateHabit.Schedule.Type == ScheduleType.Interval);
            RuleFor(x => x.UpdateHabit.Schedule.Interval)
                .Null().WithMessage("Interval should be null for weekly schedule.")
                .When(x => x.UpdateHabit.Schedule.Type == ScheduleType.Weekly);
        }
    }
}
