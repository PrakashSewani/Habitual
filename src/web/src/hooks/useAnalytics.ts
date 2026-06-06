"use client";

import { useCallback, useEffect, useState } from "react";
import useAxiosRequest from "./useAxiosRequest";
import {
  type GlobalStats,
  type DayOfWeekStat,
  type Badge,
  type DayDetail,
  type MonthComparison,
  type LeaderboardEntry,
  type MonthHeatmapDay,
  getMonthLabel,
} from "@/lib/analytics";
import { Habit } from "@/types/habit";

export type DashboardStatsResponse = {
  totalHabits: number;
  activeHabits: number;
  totalLogs: number;
  thisWeekLogs: number;
  bestStreak: number;
  avgLogsPerDay: number;
  thisWeekCompletionRate: number;
};

export type HeatmapDayResponse = {
  date: string;
  dayNum: number;
  count: number;
  isScheduled: boolean;
  completedHabitIds: string[];
};

export type LeaderboardEntryResponse = {
  habitId: string;
  habitName: string;
  rank: number;
  completionRate: number;
  scheduledDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  totalLogs: number;
  monthlyLogs: number;
};

export type DayOfWeekStatResponse = {
  day: string;
  index: number;
  scheduled: number;
  completed: number;
  rate: number;
};

export type BadgeResponse = {
  id: string;
  label: string;
  icon: string;
  earned: boolean;
  color: string;
};

export type DayHabitEntryResponse = {
  id: string;
  name: string;
  color: string;
};

export type DayDetailResponse = {
  date: string;
  completedHabits: DayHabitEntryResponse[];
  missedHabits: DayHabitEntryResponse[];
};

export type MonthSummaryResponse = {
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

export type MonthComparisonResponse = {
  currentMonth: MonthSummaryResponse;
  previousMonth: MonthSummaryResponse;
  deltaRate: number;
};

const useAnalytics = () => {
  const axiosRequest = useAxiosRequest();

  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [heatmap, setHeatmap] = useState<MonthHeatmapDay[][]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [dayOfWeekStats, setDayOfWeekStats] = useState<DayOfWeekStat[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [dayDetail, setDayDetail] = useState<DayDetail | null>(null);
  const [monthComparison, setMonthComparison] = useState<MonthComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    const resp = await axiosRequest.get("/analytics/dashboard");
    const data = resp.data.data as DashboardStatsResponse;
    setGlobalStats(data);
  }, [axiosRequest]);

  const fetchHeatmap = useCallback(async () => {
    const resp = await axiosRequest.get("/analytics/heatmap");
    const data = resp.data.data as HeatmapDayResponse[][];
    setHeatmap(
      data.map(month =>
        month.map(day => ({
          date: day.date,
          dayNum: day.dayNum,
          count: day.count,
          isScheduled: day.isScheduled,
          habitIds: day.completedHabitIds,
        }))
      )
    );
  }, [axiosRequest]);

  const fetchLeaderboard = useCallback(
    async (year: number, month: number, sortBy: string) => {
      const resp = await axiosRequest.get("/analytics/leaderboard", {
        params: { year, month, sortBy },
      });
      const data = resp.data.data as LeaderboardEntryResponse[];
      setLeaderboard(
        data.map(e => ({
          habit: {
            id: e.habitId,
            name: e.habitName,
            description: "",
            isActive: true,
            createdFrom: 0,
            createdAt: "",
            schedule: { type: 0, intervalDays: 1, daysOfWeek: [] },
            habitLogs: [],
          } as Habit,
          rank: e.rank,
          completionRate: e.completionRate,
          scheduledDays: e.scheduledDays,
          completedDays: e.completedDays,
          currentStreak: e.currentStreak,
          longestStreak: e.longestStreak,
          totalLogs: e.totalLogs,
          monthlyLogs: e.monthlyLogs,
        }))
      );
    },
    [axiosRequest]
  );

  const fetchDayOfWeekStats = useCallback(async () => {
    const resp = await axiosRequest.get("/analytics/day-of-week");
    const data = resp.data.data as DayOfWeekStatResponse[];
    setDayOfWeekStats(data);
  }, [axiosRequest]);

  const fetchBadges = useCallback(async () => {
    const resp = await axiosRequest.get("/analytics/badges");
    const data = resp.data.data as BadgeResponse[];
    setBadges(data);
  }, [axiosRequest]);

  const fetchDayDetail = useCallback(async (date: string) => {
    const resp = await axiosRequest.get("/analytics/day-detail", {
      params: { date },
    });
    const data = resp.data.data as DayDetailResponse;
    setDayDetail(data);
  }, [axiosRequest]);

  const fetchMonthComparison = useCallback(async () => {
    const resp = await axiosRequest.get("/analytics/month-comparison");
    const data = resp.data.data as MonthComparisonResponse;
    setMonthComparison(data);
  }, [axiosRequest]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchHeatmap(),
        fetchDayOfWeekStats(),
        fetchBadges(),
        fetchMonthComparison(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardStats, fetchHeatmap, fetchDayOfWeekStats, fetchBadges, fetchMonthComparison]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    globalStats,
    heatmap,
    leaderboard,
    dayOfWeekStats,
    badges,
    dayDetail,
    monthComparison,
    loading,
    error,
    fetchLeaderboard,
    fetchDayDetail,
    refetch: fetchAll,
  };
};

export default useAnalytics;
