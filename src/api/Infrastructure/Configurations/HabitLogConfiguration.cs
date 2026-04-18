using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class HabitLogConfiguration : IEntityTypeConfiguration<HabitLog>
    {
        public void Configure(EntityTypeBuilder<HabitLog> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasIndex(x => new { x.HabitId, x.Date })
                   .IsUnique();
        }
    }
}
