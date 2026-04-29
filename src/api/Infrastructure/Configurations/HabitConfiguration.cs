using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class HabitConfiguration : IEntityTypeConfiguration<Habit>
    {
        public void Configure(EntityTypeBuilder<Habit> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.HasOne(x => x.User)
                   .WithMany(u => u.Habits)
                   .HasForeignKey(x => x.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.HabitLog)
                   .WithOne(l => l.Habit)
                   .HasForeignKey(l => l.HabitId);

            builder.HasOne(x => x.Schedule)
                   .WithOne(s => s.Habit)
                   .HasForeignKey<HabitSchedule>(s => s.HabitId);
        }
    }
}
