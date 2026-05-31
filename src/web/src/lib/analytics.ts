import {
    Habit,
    HabitLog,
} from "@/types/habit";

import {
    isScheduleActiveForDate,
} from "@/lib/schedule";

// ========================================
// DATE HELPERS
// ========================================

export const getDateKey = (
    d: Date
): string =>
    d
        .toISOString()
        .split("T")[0];

export const parseDateKey = (
    key: string
): Date => {

    const [
        y,
        m,
        day,
    ] = key
        .split("-")
        .map(Number);

    return new Date(
        y,
        m - 1,
        day
    );
};

export const addDays = (
    d: Date,
    days: number
): Date => {

    const result =
        new Date(d);

    result.setDate(
        d.getDate() + days
    );

    return result;
};

// ========================================
// STREAKS
// ========================================

export const computeCurrentStreak = (
    logs: HabitLog[],
    schedule: Habit["schedule"],
    createdAt: string,
    upTo: Date = new Date()
): number => {

    const logSet = new Set(
        logs.map(l => l.date)
    );

    let streak = 0;

    let cursor = new Date(upTo);

    const created = new Date(createdAt);
    const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());

    while (cursor >= createdDate) {

        const dateStr = getDateKey(cursor);

        if (isScheduleActiveForDate(schedule, createdAt, dateStr)) {
            if (logSet.has(dateStr)) {
                streak++;
            } else {
                break;
            }
        }

        cursor = addDays(
            cursor,
            -1
        );
    }

    return streak;
};

export const computeLongestStreak = (
    logs: HabitLog[],
    schedule: Habit["schedule"],
    createdAt: string
): number => {

    if (
        logs.length === 0
    )
        return 0;

    const logSet = new Set(
        logs.map(l => l.date)
    );

    const created = new Date(createdAt);
    const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());
    const today = new Date();

    let maxStreak = 0;
    let current = 0;

    let cursor = new Date(createdDate);

    while (cursor <= today) {

        const dateStr = getDateKey(cursor);

        if (isScheduleActiveForDate(schedule, createdAt, dateStr)) {
            if (logSet.has(dateStr)) {
                current++;
                maxStreak = Math.max(maxStreak, current);
            } else {
                current = 0;
            }
        }

        cursor = addDays(cursor, 1);
    }

    return maxStreak;
};

// ========================================
// WEEKLY TREND
// ========================================

export type WeekTrend = {
    label: string;
    count: number;
};

export const getWeeklyTrend = (
    habits: Habit[],
    weeks: number = 8
): WeekTrend[] => {

    const today = new Date();

    const day = today.getDay();

    const diffToMonday =
        (day + 6) % 7;

    const currentMonday =
        addDays(
            today,
            -diffToMonday
        );

    const allLogs = habits.flatMap(
        h => h.habitLogs
    );

    const logSet = new Set(
        allLogs.map(l => l.date)
    );

    const result: WeekTrend[] = [];

    for (
        let i = weeks - 1;
        i >= 0;
        i--
    ) {

        const monday = addDays(
            currentMonday,
            -i * 7
        );

        let count = 0;

        for (
            let d = 0;
            d < 7;
            d++
        ) {

            const dateKey = getDateKey(
                addDays(monday, d)
            );

            if (logSet.has(dateKey)) {

                count++;
            }
        }

        const label =
            monday.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                }
            );

        result.push({
            label,
            count,
        });
    }

    return result;
};

// ========================================
// HEATMAP
// ========================================

export type HeatmapDay = {
    date: string;
    count: number;
};

export const getHeatmapData = (
    habits: Habit[],
    days: number = 90
): HeatmapDay[] => {

    const today = new Date();

    const allLogs = habits.flatMap(
        h => h.habitLogs
    );

    const dateCounts: Record<
        string,
        number
    > = {};

    for (const log of allLogs) {

        dateCounts[log.date] =
            (dateCounts[log.date] ??
                0) + 1;
    }

    const result: HeatmapDay[] = [];

    for (
        let i = days - 1;
        i >= 0;
        i--
    ) {

        const d = addDays(
            today,
            -i
        );

        const key = getDateKey(d);

        result.push({
            date: key,
            count:
                dateCounts[key] ?? 0,
        });
    }

    return result;
};

// ========================================
// HABIT STATS
// ========================================

export type HabitStat = {
    habit: Habit;
    totalLogs: number;
    currentStreak: number;
    longestStreak: number;
    thisWeekLogs: number;
};

export const getHabitStats = (
    habits: Habit[]
): HabitStat[] => {

    const today = new Date();

    const day = today.getDay();

    const diffToMonday =
        (day + 6) % 7;

    const monday = getDateKey(
        addDays(
            today,
            -diffToMonday
        )
    );

    const sunday = getDateKey(
        addDays(
            addDays(
                today,
                -diffToMonday
            ),
            6
        )
    );

    return habits.map(habit => {

        const totalLogs =
            habit.habitLogs.length;

        const currentStreak =
            computeCurrentStreak(
                habit.habitLogs,
                habit.schedule,
                habit.createdAt
            );

        const longestStreak =
            computeLongestStreak(
                habit.habitLogs,
                habit.schedule,
                habit.createdAt
            );

        const thisWeekLogs =
            habit.habitLogs.filter(
                l =>
                    l.date >= monday &&
                    l.date <= sunday
            ).length;

        return {
            habit,
            totalLogs,
            currentStreak,
            longestStreak,
            thisWeekLogs,
        };
    });
};

// ========================================
// GLOBAL STATS
// ========================================

export type GlobalStats = {
    totalHabits: number;
    activeHabits: number;
    totalLogs: number;
    thisWeekLogs: number;
    bestStreak: number;
    avgLogsPerDay: number;
};

export const getGlobalStats = (
    habits: Habit[]
): GlobalStats => {

    const totalHabits =
        habits.length;

    const activeHabits =
        habits.filter(h => h.isActive)
            .length;

    const allLogs = habits.flatMap(
        h => h.habitLogs
    );

    const totalLogs =
        allLogs.length;

    const today = new Date();

    const day = today.getDay();

    const diffToMonday =
        (day + 6) % 7;

    const monday = getDateKey(
        addDays(
            today,
            -diffToMonday
        )
    );

    const sunday = getDateKey(
        addDays(
            addDays(
                today,
                -diffToMonday
            ),
            6
        )
    );

    const thisWeekLogs =
        allLogs.filter(
            l =>
                l.date >= monday &&
                l.date <= sunday
        ).length;

    const bestStreak = Math.max(
        0,
        ...habits.map(h =>
            computeLongestStreak(
                h.habitLogs,
                h.schedule,
                h.createdAt
            )
        )
    );

    const uniqueDays = new Set(
        allLogs.map(l => l.date)
    ).size;

    const avgLogsPerDay =
        uniqueDays > 0
            ? totalLogs / uniqueDays
            : 0;

    return {
        totalHabits,
        activeHabits,
        totalLogs,
        thisWeekLogs,
        bestStreak,
        avgLogsPerDay: Math.round(
            avgLogsPerDay * 10
        ) / 10,
    };
};
