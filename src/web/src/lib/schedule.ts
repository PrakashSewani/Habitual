import { Habit } from "@/types/habit";

// ========================================
// DATE HELPERS
// ========================================

const getDateKey = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

// ========================================
// SCHEDULE CHECK
// ========================================

export type ScheduleCheckInput = {
    type: number;
    intervalDays: number;
    daysOfWeek: number[];
};

/**
 * Determines whether a schedule is active for a given date.
 */
export function isScheduleActiveForDate(
    schedule: ScheduleCheckInput,
    createdAt: string,
    dateStr: string
): boolean {
    const date = new Date(dateStr + "T00:00:00");
    const dayOfWeek = date.getDay();

    switch (schedule.type) {
        case 0: // Daily
            return true;

        case 1: // Weekly
            if (!schedule.daysOfWeek || schedule.daysOfWeek.length === 0) return true;
            return schedule.daysOfWeek.includes(dayOfWeek);

        case 2: { // Interval
            const interval = schedule.intervalDays;
            if (!interval || interval <= 0) return true;

            const created = new Date(createdAt);
            const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());
            const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            const diffMs = checkDate.getTime() - createdDate.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            return diffDays >= 0 && diffDays % interval === 0;
        }

        default:
            return true;
    }
}

/**
 * Determines whether a habit is scheduled for a given date.
 */
export function isHabitScheduledForDate(habit: Habit, dateStr: string): boolean {
    return isScheduleActiveForDate(habit.schedule, habit.createdAt, dateStr);
}

/**
 * Returns all date strings in a range where the habit is scheduled.
 */
export function getScheduledDatesInRange(habit: Habit, fromStr: string, toStr: string): string[] {
    const from = new Date(fromStr + "T00:00:00");
    const to = new Date(toStr + "T00:00:00");
    const dates: string[] = [];

    const current = new Date(from);
    while (current <= to) {
        const dateStr = getDateKey(current);
        if (isHabitScheduledForDate(habit, dateStr)) {
            dates.push(dateStr);
        }
        current.setDate(current.getDate() + 1);
    }

    return dates;
}

/**
 * Returns a user-friendly label for a habit schedule.
 */
export function getScheduleLabel(schedule: Habit["schedule"]): string {
    switch (schedule.type) {
        case 0:
            return "Daily";
        case 1: {
            if (!schedule.daysOfWeek || schedule.daysOfWeek.length === 0) return "Weekly";
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const selected = schedule.daysOfWeek
                .sort((a, b) => a - b)
                .map(d => dayNames[d])
                .join(", ");
            return selected;
        }
        case 2:
            return schedule.intervalDays > 0
                ? `Every ${schedule.intervalDays} days`
                : "Interval";
        default:
            return "Unknown";
    }
}
