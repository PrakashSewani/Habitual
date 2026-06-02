# Database Schema

## Overview

Habitual uses PostgreSQL with Entity Framework Core. The database is organized around two core domains: Users and Habits.

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│    User     │       │    Habit    │       │  HabitSchedule  │
├─────────────┤       ├─────────────┤       ├─────────────────┤
│ Id (PK)     │◄──────│ UserId (FK) │       │ Id (PK)         │
│ Name        │       │ Id (PK)     │◄─────│ HabitId (FK)    │
│ Email       │       │ Name        │       │ Type            │
│ PasswordHash│       │ Description │       │ Interval        │
│ PhoneNumber │       │ IsActive    │       │ DaysOfWeek      │
│ DateOfBirth │       │ CreatedFrom │       └─────────────────┘
│ CreatedAt   │       │ CreatedAt   │
│ LastModified│       │ LastModified│
└─────────────┘       └──────┬──────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐
       │  HabitLog   │ │HabitLogArchive│ │     (future)    │
       ├─────────────┤ ├─────────────┤ ├─────────────────┤
       │ Id (PK)     │ │ Id (PK)     │ │                 │
       │ HabitId (FK)│ │ HabitId (FK)│ │                 │
       │ Date        │ │ Date        │ │                 │
       └─────────────┘ └─────────────┘ └─────────────────┘
```

## Entities

### User

Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | UUID | PK | Unique identifier |
| Name | VARCHAR | Required | Display name |
| Email | VARCHAR | Required, Unique | Email address |
| PasswordHash | VARCHAR | Required | BCrypt hash |
| PhoneNumber | VARCHAR | Required | Phone number |
| DateOfBirth | DATE | Required | Date of birth |
| CreatedAt | TIMESTAMP | Default NOW | Creation timestamp |
| LastModified | TIMESTAMP | Default NOW | Last update timestamp |

**Relationships:**
- One-to-Many with `Habit` (a user has many habits)

### Habit

Stores habit definitions and metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | UUID | PK | Unique identifier |
| UserId | UUID | FK → User | Owner reference |
| Name | VARCHAR | Required | Habit name |
| Description | VARCHAR | Required | Habit description |
| IsActive | BOOLEAN | Default true | Active status |
| CreatedFrom | INT | Required | Source platform (1=Web, 2=Mobile) |
| CreatedAt | TIMESTAMP | Default NOW | Creation timestamp |
| LastModified | TIMESTAMP | Default NOW | Last update timestamp |

**Relationships:**
- Many-to-One with `User` (belongs to a user)
- One-to-Many with `HabitLog` (has many log entries)
- One-to-One with `HabitSchedule` (has one schedule)

### HabitSchedule

Defines the recurrence pattern for a habit.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | UUID | PK | Unique identifier |
| HabitId | UUID | FK → Habit | Parent habit reference |
| Type | INT | Required | Schedule type (0=Daily, 1=Weekly, 2=Interval) |
| Interval | INT | Nullable | Interval in days (for Interval type) |
| DaysOfWeek | INT[] | Nullable | Days of week (for Weekly type) |

**Relationships:**
- One-to-One with `Habit` (belongs to one habit)

### Schedule Types

| Type | Description | Requirements |
|------|-------------|--------------|
| 0 | Daily | No additional fields |
| 1 | Weekly | `DaysOfWeek` array (0=Sunday, 6=Saturday) |
| 2 | Interval | `Interval` integer (days between occurrences) |

### HabitLog

Records individual habit completions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | UUID | PK | Unique identifier |
| HabitId | UUID | FK → Habit | Parent habit reference |
| Date | DATE | Required | Completion date |

**Relationships:**
- Many-to-One with `Habit` (belongs to a habit)

**Logic:** Each row represents a completed habit on a specific date. No row means the habit was not completed that day. Toggling creates or deletes the row.

### HabitLogArchive

Archived copies of historical habit logs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | UUID | PK | Unique identifier |
| HabitId | UUID | FK → Habit | Parent habit reference |
| Date | DATE | Required | Archived date |

**Relationships:**
- Many-to-One with `Habit` (belongs to a habit)

**Purpose:** Stores older log entries moved from `HabitLog` for performance. Currently a future feature.

## Enums

### Source

| Value | Name | Description |
|-------|------|-------------|
| 1 | Web | Created via web application |
| 2 | Mobile | Created via mobile application |

### ScheduleType

| Value | Name | Description |
|-------|------|-------------|
| 0 | Daily | Every day |
| 1 | Weekly | Specific days of the week |
| 2 | Interval | Every N days |

### WeekDay

| Value | Name |
|-------|------|
| 0 | Sunday |
| 1 | Monday |
| 2 | Tuesday |
| 3 | Wednesday |
| 4 | Thursday |
| 5 | Friday |
| 6 | Saturday |

## Indexes

Recommended indexes for performance:

```sql
-- User lookups
CREATE INDEX idx_users_email ON Users (Email);

-- Habit queries by user
CREATE INDEX idx_habits_user_id ON Habits (UserId);

-- Log lookups by habit
CREATE INDEX idx_habit_logs_habit_id ON HabitLogs (HabitId);
CREATE INDEX idx_habit_logs_habit_id_date ON HabitLogs (HabitId, Date);

-- Archive lookups
CREATE INDEX idx_habit_log_archives_habit_id ON HabitLogArchives (HabitId);
```

## EF Core Configurations

Entity configurations are defined in `Infrastructure/Configurations/`:

- `UserConfiguration.cs`
- `HabitConfiguration.cs`
- `HabitLogConfiguration.cs`
- `HabitLogArchiveConfiguration.cs`

## Migrations

Migrations are stored in `Infrastructure/Migrations/` and applied automatically on startup:

```csharp
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}
```

## Connection String

```
Host={host};Database={database};Username={user};Password={password}
```

Configured via `ConnectionStrings:DefaultConnection` in appsettings.

---

## Related Documentation

- [architecture.md](architecture.md) - System architecture
- [api-reference.md](api-reference.md) - API endpoints
