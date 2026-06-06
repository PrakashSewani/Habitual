import { Habit, HabitLog } from "@/types/habit";
import { isScheduleActiveForDate } from "@/lib/schedule";

// ========================================
// DATE HELPERS
// ========================================

export const getDateKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const parseDateKey = (key: string): Date => {
  const [y, m, day] = key.split("-").map(Number);
  return new Date(y, m - 1, day);
};

export const addDays = (d: Date, days: number): Date => {
  const result = new Date(d);
  result.setDate(d.getDate() + days);
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
  const logSet = new Set(logs.map(l => l.date));
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
    cursor = addDays(cursor, -1);
  }
  return streak;
};

export const computeLongestStreak = (
  logs: HabitLog[],
  schedule: Habit["schedule"],
  createdAt: string
): number => {
  if (logs.length === 0) return 0;
  const logSet = new Set(logs.map(l => l.date));
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
// HEATMAP (legacy 90-day)
// ========================================

export type HeatmapDay = {
  date: string;
  count: number;
};

export const getHeatmapData = (habits: Habit[], days: number = 90): HeatmapDay[] => {
  const today = new Date();
  const allLogs = habits.flatMap(h => h.habitLogs);
  const dateCounts: Record<string, number> = {};

  for (const log of allLogs) {
    dateCounts[log.date] = (dateCounts[log.date] ?? 0) + 1;
  }

  const result: HeatmapDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(today, -i);
    const key = getDateKey(d);
    result.push({ date: key, count: dateCounts[key] ?? 0 });
  }
  return result;
};

// ========================================
// MONTHLY HEATMAP
// ========================================

export type MonthHeatmapDay = {
  date: string;
  dayNum: number;
  count: number;
  isScheduled: boolean;
  habitIds?: string[];
};

export const getMonthHeatmapData = (
  habits: Habit[],
  year: number,
  month: number,
  filterHabitId?: string
): MonthHeatmapDay[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const activeHabits = habits.filter(h => h.isActive);
  const filteredHabits = filterHabitId
    ? activeHabits.filter(h => h.id === filterHabitId)
    : activeHabits;

  const result: MonthHeatmapDay[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isScheduled = activeHabits.some(h =>
      isScheduleActiveForDate(h.schedule, h.createdAt, dateStr)
    );

    const completedHabitIds: string[] = [];
    let count = 0;
    for (const h of filteredHabits) {
      if (h.habitLogs.some(l => l.date === dateStr)) {
        count++;
        completedHabitIds.push(h.id);
      }
    }

    result.push({
      date: dateStr,
      dayNum: d,
      count,
      isScheduled,
      habitIds: completedHabitIds,
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

export const getHabitStats = (habits: Habit[]): HabitStat[] => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = getDateKey(addDays(today, -diffToMonday));
  const sunday = getDateKey(addDays(addDays(today, -diffToMonday), 6));

  return habits.map(habit => {
    const totalLogs = habit.habitLogs.length;
    const currentStreak = computeCurrentStreak(
      habit.habitLogs,
      habit.schedule,
      habit.createdAt
    );
    const longestStreak = computeLongestStreak(
      habit.habitLogs,
      habit.schedule,
      habit.createdAt
    );
    const thisWeekLogs = habit.habitLogs.filter(
      l => l.date >= monday && l.date <= sunday
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
  thisWeekCompletionRate: number;
};

export const getGlobalStats = (habits: Habit[]): GlobalStats => {
  const totalHabits = habits.length;
  const activeHabits = habits.filter(h => h.isActive).length;
  const allLogs = habits.flatMap(h => h.habitLogs);
  const totalLogs = allLogs.length;

  const today = new Date();
  const day = today.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = getDateKey(addDays(today, -diffToMonday));
  const sunday = getDateKey(addDays(addDays(today, -diffToMonday), 6));

  const thisWeekLogs = allLogs.filter(l => l.date >= monday && l.date <= sunday).length;

  const bestStreak = Math.max(
    0,
    ...habits.map(h =>
      computeLongestStreak(h.habitLogs, h.schedule, h.createdAt)
    )
  );

  const uniqueDays = new Set(allLogs.map(l => l.date)).size;
  const avgLogsPerDay = uniqueDays > 0 ? totalLogs / uniqueDays : 0;

  // Compute this week's completion rate
  const activeHabitList = habits.filter(h => h.isActive);
  let weekScheduled = 0;
  let weekCompleted = 0;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - diffToMonday);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  for (const h of activeHabitList) {
    const cursor = new Date(weekStart);
    while (cursor <= weekEnd) {
      const dateStr = getDateKey(cursor);
      if (isScheduleActiveForDate(h.schedule, h.createdAt, dateStr)) {
        weekScheduled++;
        if (h.habitLogs.some(l => l.date === dateStr)) {
          weekCompleted++;
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  const thisWeekCompletionRate = weekScheduled > 0 ? Math.round((weekCompleted / weekScheduled) * 100) : 0;

  return {
    totalHabits,
    activeHabits,
    totalLogs,
    thisWeekLogs,
    bestStreak,
    avgLogsPerDay: Math.round(avgLogsPerDay * 10) / 10,
    thisWeekCompletionRate,
  };
};

// ========================================
// MONTHLY LEADERBOARD
// ========================================

export type LeaderboardEntry = {
  habit: Habit;
  rank: number;
  completionRate: number;
  scheduledDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  totalLogs: number;
  monthlyLogs: number;
};

export const getMonthlyLeaderboard = (
  habits: Habit[],
  year: number,
  month: number,
  sortBy: "completionRate" | "currentStreak" | "totalLogs" | "monthlyLogs" = "completionRate"
): LeaderboardEntry[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const activeHabits = habits.filter(h => h.isActive);

  const entries: LeaderboardEntry[] = activeHabits.map(habit => {
    let scheduledDays = 0;
    let completedDays = 0;
    let monthlyLogs = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (isScheduleActiveForDate(habit.schedule, habit.createdAt, dateStr)) {
        scheduledDays++;
        if (habit.habitLogs.some(l => l.date === dateStr)) {
          completedDays++;
          monthlyLogs++;
        }
      }
    }

    const completionRate = scheduledDays > 0 ? Math.round((completedDays / scheduledDays) * 100) : 0;
    const currentStreak = computeCurrentStreak(habit.habitLogs, habit.schedule, habit.createdAt);
    const longestStreak = computeLongestStreak(habit.habitLogs, habit.schedule, habit.createdAt);

    return {
      habit,
      rank: 0,
      completionRate,
      scheduledDays,
      completedDays,
      currentStreak,
      longestStreak,
      totalLogs: habit.habitLogs.length,
      monthlyLogs,
    };
  });

  const sorted = [...entries].sort((a, b) => {
    switch (sortBy) {
      case "completionRate":
        return b.completionRate - a.completionRate || b.monthlyLogs - a.monthlyLogs;
      case "currentStreak":
        return b.currentStreak - a.currentStreak || b.completionRate - a.completionRate;
      case "totalLogs":
        return b.totalLogs - a.totalLogs;
      case "monthlyLogs":
        return b.monthlyLogs - a.monthlyLogs;
      default:
        return 0;
    }
  });

  return sorted.map((e, i) => ({ ...e, rank: i + 1 }));
};

// ========================================
// MONTH SUMMARY
// ========================================

export type MonthSummary = {
  year: number;
  month: number;
  totalScheduledDays: number;
  totalCompletedDays: number;
  completionRate: number;
  totalLogs: number;
  activeHabitCount: number;
  bestHabitName: string;
  bestHabitRate: number;
};

export const getMonthSummary = (
  habits: Habit[],
  year: number,
  month: number,
  filterHabitId?: string
): MonthSummary => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const activeHabits = habits.filter(h => h.isActive);
  const filteredHabits = filterHabitId
    ? activeHabits.filter(h => h.id === filterHabitId)
    : activeHabits;

  let totalScheduledDays = 0;
  let totalCompletedDays = 0;
  let totalLogs = 0;

  let bestHabitName = "-";
  let bestHabitRate = 0;

  for (const habit of filteredHabits) {
    let scheduled = 0;
    let completed = 0;
    let logs = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (isScheduleActiveForDate(habit.schedule, habit.createdAt, dateStr)) {
        scheduled++;
        if (habit.habitLogs.some(l => l.date === dateStr)) {
          completed++;
          logs++;
        }
      }
    }

    totalScheduledDays += scheduled;
    totalCompletedDays += completed;
    totalLogs += logs;

    const rate = scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
    if (rate > bestHabitRate) {
      bestHabitRate = rate;
      bestHabitName = habit.name;
    }
  }

  const completionRate = totalScheduledDays > 0 ? Math.round((totalCompletedDays / totalScheduledDays) * 100) : 0;

  return {
    year,
    month,
    totalScheduledDays,
    totalCompletedDays,
    completionRate,
    totalLogs,
    activeHabitCount: activeHabits.length,
    bestHabitName,
    bestHabitRate,
  };
};

// ========================================
// FREE MONTH BOUNDARY
// ========================================

export const getFreeMonthBoundary = (): { year: number; month: number } => {
  const now = new Date();
  const boundary = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  return { year: boundary.getFullYear(), month: boundary.getMonth() };
};

export const isMonthWithinFreeWindow = (year: number, month: number): boolean => {
  const boundary = getFreeMonthBoundary();
  const target = new Date(year, month, 1);
  const boundaryDate = new Date(boundary.year, boundary.month, 1);
  return target >= boundaryDate;
};

export const getMonthLabel = (year: number, month: number): string => {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export const getMonthShortLabel = (year: number, month: number): string => {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "short" });
};

// ========================================
// DAY-OF-WEEK ANALYTICS
// ========================================

export type DayOfWeekStat = {
  day: string;
  index: number;
  scheduled: number;
  completed: number;
  rate: number;
};

export const getDayOfWeekStats = (habits: Habit[]): DayOfWeekStat[] => {
  const activeHabits = habits.filter(h => h.isActive);
  const stats: Record<number, { scheduled: number; completed: number }> = {
    0: { scheduled: 0, completed: 0 },
    1: { scheduled: 0, completed: 0 },
    2: { scheduled: 0, completed: 0 },
    3: { scheduled: 0, completed: 0 },
    4: { scheduled: 0, completed: 0 },
    5: { scheduled: 0, completed: 0 },
    6: { scheduled: 0, completed: 0 },
  };

  const today = new Date();
  const allDates = new Set<string>();
  activeHabits.forEach(h => {
    const created = new Date(h.createdAt);
    const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());
    const cursor = new Date(createdDate);
    while (cursor <= today) {
      const dateStr = getDateKey(cursor);
      if (isScheduleActiveForDate(h.schedule, h.createdAt, dateStr)) {
        allDates.add(dateStr);
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  for (const dateStr of allDates) {
    const date = parseDateKey(dateStr);
    const dayIndex = date.getDay();
    let dayCompleted = 0;
    let dayScheduled = 0;
    for (const h of activeHabits) {
      if (isScheduleActiveForDate(h.schedule, h.createdAt, dateStr)) {
        dayScheduled++;
        if (h.habitLogs.some(l => l.date === dateStr)) {
          dayCompleted++;
        }
      }
    }
    stats[dayIndex].scheduled += dayScheduled;
    stats[dayIndex].completed += dayCompleted;
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return dayLabels.map((day, i) => {
    const s = stats[i];
    return {
      day,
      index: i,
      scheduled: s.scheduled,
      completed: s.completed,
      rate: s.scheduled > 0 ? Math.round((s.completed / s.scheduled) * 100) : 0,
    };
  });
};

// ========================================
// QUARTER HEATMAP
// ========================================

export const getQuarterHeatmapData = (habits: Habit[]): MonthHeatmapDay[][] => {
  const now = new Date();
  const result: MonthHeatmapDay[][] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    result.push(getMonthHeatmapData(habits, year, month));
  }

  return result;
};

// ========================================
// HABIT SPARKLINE
// ========================================

export const getHabitSparkline = (habit: Habit, length: number = 30): boolean[] => {
  const days: boolean[] = [];
  for (let i = length - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    days.push(habit.habitLogs.some(l => l.date === key));
  }
  return days;
};

// ========================================
// DAY DETAIL
// ========================================

export type DayDetail = {
  date: string;
  completedHabits: { id: string; name: string; color: string }[];
  missedHabits: { id: string; name: string; color: string }[];
};

export const getDayDetail = (habits: Habit[], dateStr: string): DayDetail => {
  const activeHabits = habits.filter(h => h.isActive);
  const completedHabits: DayDetail["completedHabits"] = [];
  const missedHabits: DayDetail["missedHabits"] = [];

  const colors = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#3B82F6"];

  for (let i = 0; i < activeHabits.length; i++) {
    const h = activeHabits[i];
    if (isScheduleActiveForDate(h.schedule, h.createdAt, dateStr)) {
      const isCompleted = h.habitLogs.some(l => l.date === dateStr);
      const entry = { id: h.id, name: h.name, color: colors[i % colors.length] };
      if (isCompleted) {
        completedHabits.push(entry);
      } else {
        missedHabits.push(entry);
      }
    }
  }

  return { date: dateStr, completedHabits, missedHabits };
};

// ========================================
// MONTH COMPARISON
// ========================================

export type MonthComparison = {
  currentMonth: MonthSummary;
  previousMonth: MonthSummary;
  deltaRate: number;
};

export const getMonthComparison = (habits: Habit[]): MonthComparison => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthSummary = getMonthSummary(habits, currentYear, currentMonth);
  const previousMonthSummary = getMonthSummary(habits, prevYear, prevMonth);

  const deltaRate = currentMonthSummary.completionRate - previousMonthSummary.completionRate;

  return {
    currentMonth: currentMonthSummary,
    previousMonth: previousMonthSummary,
    deltaRate,
  };
};

// ========================================
// BADGES
// ========================================

export type Badge = {
  id: string;
  label: string;
  icon: string;
  earned: boolean;
  color: string;
};

export const getBadges = (habits: Habit[]): Badge[] => {
  const activeHabits = habits.filter(h => h.isActive);
  const allLogs = activeHabits.flatMap(h => h.habitLogs);
  const totalLogs = allLogs.length;

  const bestStreak = Math.max(
    0,
    ...activeHabits.map(h =>
      computeLongestStreak(h.habitLogs, h.schedule, h.createdAt)
    )
  );

  const currentStreak = Math.max(
    0,
    ...activeHabits.map(h =>
      computeCurrentStreak(h.habitLogs, h.schedule, h.createdAt)
    )
  );

  const today = getDateKey(new Date());
  const todayScheduled = activeHabits.filter(h =>
    isScheduleActiveForDate(h.schedule, h.createdAt, today)
  );
  const todayCompleted = todayScheduled.filter(h =>
    h.habitLogs.some(l => l.date === today)
  );
  const perfectDay = todayScheduled.length > 0 && todayCompleted.length === todayScheduled.length;

  return [
    {
      id: "7-day-streak",
      label: "7-Day Streak",
      icon: "flame",
      earned: currentStreak >= 7,
      color: "#F59E0B",
    },
    {
      id: "perfect-day",
      label: "Perfect Day",
      icon: "check",
      earned: perfectDay,
      color: "#10B981",
    },
    {
      id: "habit-master",
      label: "Habit Master",
      icon: "trophy",
      earned: totalLogs >= 30,
      color: "#6366F1",
    },
    {
      id: "longest-streak",
      label: `${bestStreak}d Best Streak`,
      icon: "zap",
      earned: bestStreak >= 14,
      color: "#EF4444",
    },
  ];
};
