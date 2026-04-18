using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class HabitLogArchiveConfiguration : IEntityTypeConfiguration<HabitLogArchive>
    {
        public void Configure(EntityTypeBuilder<HabitLogArchive> builder)
        {
            builder.HasKey(x => x.Id);

            builder.ToTable("HabitLogsArchive");

            builder.HasIndex(x => new { x.HabitId, x.Date });
        }
    }
}
