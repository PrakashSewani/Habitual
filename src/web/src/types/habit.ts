export type HabitLog = {
    id: string;
    date: string;
};

export type HabitSchedule = {
    type: number;
    intervalDays: number;
    daysOfWeek: number[];
};

export type Habit = {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdFrom: number;
    createdAt: string;
    schedule: HabitSchedule;
    habitLogs: HabitLog[];
};
