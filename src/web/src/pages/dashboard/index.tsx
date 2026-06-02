"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Badge,
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    HStack,
    IconButton,
    Input,
    Link,
    Skeleton,
    Spinner,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";

import {
    LuArrowRight,
    LuArrowUp,
    LuChartNoAxesCombined,
    LuCheck,
    LuChevronLeft,
    LuChevronRight,
    LuCircleCheckBig,
    LuFlame,
    LuGlobe,
    LuPlus,
    LuRotateCcw,
    LuSearch,
    LuSmartphone,
    LuTrendingUp,
} from "react-icons/lu";

import useAuthenticateUser
    from "@/hooks/useAuthenticateUser";

import useAxiosRequest
    from "@/hooks/useAxiosRequest";

import useHabits, {
    getWeekBounds,
} from "@/hooks/useHabits";

import useDebounce
    from "@/hooks/useDebounce";

import useSignalR
    from "@/hooks/useSignalR";

import UserNavbar
    from "@/components/Navbar/UserNavbar";

import Footer
    from "@/components/Footer";

import CreateHabitDialog
    from "@/components/CreateHabitDialog";

import {
    computeLongestStreak,
} from "@/lib/analytics";

import {
    isHabitScheduledForDate,
    getScheduleLabel,
} from "@/lib/schedule";

import { Habit } from "@/types/habit";

// ========================================
// COMPONENT
// ========================================

const Dashboard = () => {

    const formatDate = (
        date: Date
    ) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const {
        user,
        loading: userLoading,
        logout,
    } = useAuthenticateUser();

    const [currentTime, setCurrentTime] =
        useState(new Date());

    const week = getWeekBounds();

    const [search, setSearch] =
        useState("");

    const [from, setFrom] =
        useState(week.from);

    const [to, setTo] =
        useState(week.to);

    const todayString =
        formatDate(new Date());

    const [
        selectedDate,
        setSelectedDate,
    ] = useState(todayString);

    const debouncedSearch =
        useDebounce(search, 400);

    const [
        searchOpen,
        setSearchOpen,
    ] = useState(false);

    const [
        showScrollTop,
        setShowScrollTop,
    ] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setShowScrollTop(
                window.scrollY > 400
            );
        };
        window.addEventListener("scroll", onScroll);
        return () =>
            window.removeEventListener("scroll", onScroll);
    }, []);

    const {
        habits,
        setHabits,
        loading: habitsLoading,
        refetch,
    } = useHabits({
        search: debouncedSearch || undefined,
    });

    const axiosRequest =
        useAxiosRequest();

    const [
        togglingIds,
        setTogglingIds,
    ] = useState<Set<string>>(
        new Set()
    );

    const toggleHabitLog = async (
        habitId: string
    ) => {
        setTogglingIds(prev => {
            const next = new Set(prev);
            next.add(habitId);
            return next;
        });

        try {
            const response =
                await axiosRequest.put(
                    `/HabitLog?habitId=${habitId}&date=${selectedDate}`
                );
            const completed =
                response.data.data as boolean;

            setHabits(prev =>
                prev.map(h => {
                    if (h.id !== habitId) return h;
                    const logs = [...h.habitLogs];
                    const idx = logs.findIndex(
                        l => l.date === selectedDate
                    );
                    if (completed && idx < 0) {
                        logs.push({
                            id: `${habitId}-${selectedDate}`,
                            date: selectedDate,
                        });
                    } else if (!completed && idx >= 0) {
                        logs.splice(idx, 1);
                    }
                    return { ...h, habitLogs: logs };
                })
            );
        } finally {
            setTogglingIds(prev => {
                const next = new Set(prev);
                next.delete(habitId);
                return next;
            });
        }
    };

    const { onHabitLogUpdated, onHabitUpdated } =
        useSignalR();

    useEffect(() => {
        const unsubscribe =
            onHabitLogUpdated(
                payload => {
                    setHabits(prev =>
                        prev.map(h => {
                            if (h.id !== payload.habitId) return h;
                            const logs = [...h.habitLogs];
                            const idx = logs.findIndex(
                                l => l.date === payload.date
                            );
                            if (payload.completed && idx < 0) {
                                logs.push({
                                    id: `${payload.habitId}-${payload.date}`,
                                    date: payload.date,
                                });
                            } else if (!payload.completed && idx >= 0) {
                                logs.splice(idx, 1);
                            }
                            return { ...h, habitLogs: logs };
                        })
                    );
                }
            );
        return unsubscribe;
    }, [onHabitLogUpdated, setHabits]);

    useEffect(() => {
        const unsubscribe = onHabitUpdated(payload => {
            setHabits(prev => {
                if (payload.action === "created" && payload.habit) {
                    if (prev.some(h => h.id === payload.habitId)) return prev;
                    return [payload.habit, ...prev];
                }
                if (payload.action === "updated" && payload.habit) {
                    return prev.map(h =>
                        h.id === payload.habitId ? payload.habit : h
                    ) as Habit[];
                }
                if (payload.action === "deleted") {
                    return prev.filter(h => h.id !== payload.habitId);
                }
                return prev;
            });
        });
        return unsubscribe;
    }, [onHabitUpdated, setHabits]);

    const currentWeekBounds =
        getWeekBounds();

    const isCustomFilter =
        selectedDate < currentWeekBounds.from ||
        selectedDate > currentWeekBounds.to ||
        search !== "";

    const resetFilters = () => {
        setSearch("");
        setSelectedDate(todayString);
        const w = getWeekBounds();
        setFrom(w.from);
        setTo(w.to);
    };

    const goToToday = () => {
        setSearch("");
        setSelectedDate(todayString);
        const w = getWeekBounds();
        setFrom(w.from);
        setTo(w.to);
    };

    useEffect(() => {
        const timer =
            setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getWeekBoundsForDate = (
        dateStr: string
    ) => {
        const date = new Date(dateStr);
        const day = date.getDay();
        const diffToMonday = (day + 6) % 7;
        const monday = new Date(date);
        monday.setDate(date.getDate() - diffToMonday);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return {
            from: formatDate(monday),
            to: formatDate(sunday),
            days: Array.from(
                { length: 7 },
                (_, i) => {
                    const d = new Date(monday);
                    d.setDate(monday.getDate() + i);
                    return formatDate(d);
                }
            ),
        };
    };

    const scheduledHabits =
        habits.filter(h =>
            h.isActive &&
            isHabitScheduledForDate(h, selectedDate)
        );

    const totalHabits = scheduledHabits.length;

    const completedSelectedDate =
        scheduledHabits.filter(h =>
            h.habitLogs.some(
                l => l.date === selectedDate
            )
        ).length;

    const completionRate =
        totalHabits > 0
            ? Math.round(
                (completedSelectedDate /
                    totalHabits) *
                100
            )
            : 0;

    const getWeekDaysForRange =
        useCallback(
            (startDate: string) => {
                const start = new Date(startDate);
                const days: string[] = [];
                for (let i = 0; i < 7; i++) {
                    const d = new Date(start);
                    d.setDate(start.getDate() + i);
                    days.push(formatDate(d));
                }
                return days;
            },
            []
        );

    const analyticsWeekDays =
        useMemo(
            () => getWeekDaysForRange(from),
            [from, getWeekDaysForRange]
        );

    const weeklyProgress =
        useMemo(
            () =>
                analyticsWeekDays.map(
                    day => {
                        const dayScheduled =
                            habits.filter(h =>
                                h.isActive &&
                                isHabitScheduledForDate(h, day)
                            );
                        const completed =
                            dayScheduled.reduce(
                                (sum, h) =>
                                    sum +
                                    (h.habitLogs.some(
                                        l => l.date === day
                                    )
                                        ? 1
                                        : 0),
                                0
                            );
                        return dayScheduled.length > 0
                            ? Math.round(
                                (completed /
                                    dayScheduled.length) *
                                100
                            )
                            : 0;
                    }
                ),
            [habits, analyticsWeekDays]
        );

    const shiftWeek = (
        direction: number
    ) => {
        const currentFrom = new Date(from);
        currentFrom.setDate(
            currentFrom.getDate() +
            direction * 7
        );
        const currentTo = new Date(currentFrom);
        currentTo.setDate(
            currentTo.getDate() + 6
        );
        setFrom(formatDate(currentFrom));
        setTo(formatDate(currentTo));
        setSelectedDate(formatDate(currentTo));
    };

    const scheduleTypeLabel = (
        type: number
    ) => {
        const labels: Record<number, string> =
        {
            0: "Daily",
            1: "Weekly",
            2: "Interval",
        };
        return labels[type] ?? "Unknown";
    };

    const scheduleTypeColor = (
        type: number
    ) => {
        switch (type) {
            case 0:
                return {
                    bg: "rgba(99,102,241,0.12)",
                    color: "#6366F1",
                };
            case 1:
                return {
                    bg: "rgba(245,158,11,0.12)",
                    color: "#F59E0B",
                };
            case 2:
                return {
                    bg: "rgba(139,92,246,0.12)",
                    color: "#8B5CF6",
                };
            default:
                return {
                    bg: "rgba(148,163,184,0.12)",
                    color: "#94A3B8",
                };
        }
    };

    const computeConsistency = () => {
        const activeHabits = habits.filter(h => h.isActive);
        const allDates = new Set<string>();
        activeHabits.forEach(h => {
            const created = new Date(h.createdAt);
            const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());
            const today = new Date();
            const cursor = new Date(createdDate);
            while (cursor <= today) {
                const dateStr = formatDate(cursor);
                if (isHabitScheduledForDate(h, dateStr)) {
                    allDates.add(dateStr);
                }
                cursor.setDate(cursor.getDate() + 1);
            }
        });
        const sorted = Array.from(allDates).sort();
        let maxStreak = 0;
        let current = 0;
        for (let i = 0; i < sorted.length; i++) {
            const dayScheduled = activeHabits.filter(h =>
                isHabitScheduledForDate(h, sorted[i])
            );
            const completed = dayScheduled.filter(h =>
                h.habitLogs.some(
                    l => l.date === sorted[i]
                )
            ).length;
            const rate =
                dayScheduled.length > 0
                    ? completed / dayScheduled.length
                    : 0;
            if (rate >= 1) {
                current++;
                maxStreak = Math.max(maxStreak, current);
            } else {
                current = 0;
            }
        }
        return activeHabits.length > 0
            ? Math.round(
                (maxStreak /
                    activeHabits.length) *
                100
            )
            : 0;
    };

    const consistency = computeConsistency();

    const bestStreak = useMemo(() => {
        const activeHabits = habits.filter(h => h.isActive);
        if (activeHabits.length === 0) return 0;
        return Math.max(
            0,
            ...activeHabits.map(h =>
                computeLongestStreak(
                    h.habitLogs,
                    h.schedule,
                    h.createdAt
                )
            )
        );
    }, [habits]);

    const weekInsights = useMemo(() => {
        const activeHabits = habits.filter(h => h.isActive);
        if (activeHabits.length === 0) return null;

        const habitRates = activeHabits.map(h => {
            const scheduledDays = analyticsWeekDays.filter(d =>
                isHabitScheduledForDate(h, d)
            );
            const done = scheduledDays.filter(d =>
                h.habitLogs.some(l => l.date === d)
            ).length;
            const rate = scheduledDays.length > 0
                ? Math.round((done / scheduledDays.length) * 100)
                : 0;
            return { habit: h, rate };
        });

        const sorted = [...habitRates].sort((a, b) => b.rate - a.rate);
        const best = sorted[0];
        const needsAttention = [...sorted].reverse().find(h => h.rate < 100);

        const lastWeekDays = analyticsWeekDays.map(d => {
            const date = new Date(d);
            date.setDate(date.getDate() - 7);
            return formatDate(date);
        });
        const lastWeekAvg = lastWeekDays.length > 0
            ? Math.round(
                lastWeekDays.reduce((sum, day) => {
                    const dayScheduled = activeHabits.filter(h =>
                        isHabitScheduledForDate(h, day)
                    );
                    const completed = dayScheduled.reduce(
                        (s, h) =>
                            s +
                            (h.habitLogs.some(l => l.date === day)
                                ? 1
                                : 0),
                        0
                    );
                    return (
                        sum +
                        (dayScheduled.length > 0
                            ? (completed / dayScheduled.length) * 100
                            : 0)
                    );
                }, 0) / 7
            )
            : 0;
        const thisWeekAvg = Math.round(
            weeklyProgress.reduce((a, b) => a + b, 0) / 7
        );
        const delta = thisWeekAvg - lastWeekAvg;

        return { best, needsAttention, thisWeekAvg, lastWeekAvg, delta };
    }, [habits, analyticsWeekDays, weeklyProgress]);

    const getMonthlyDays = useCallback(
        () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const daysInMonth =
                new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1);
            const firstDayOfWeek =
                (firstDay.getDay() + 6) % 7;
            const leadingEmpty = firstDayOfWeek;
            const trailingEmpty =
                (7 -
                    ((leadingEmpty + daysInMonth) % 7)) %
                7;
            const days: (
                | {
                    date: string;
                    dayNum: number;
                    rate: number;
                }
                | null
            )[] = [];
            for (let i = 0; i < leadingEmpty; i++) {
                days.push(null);
            }
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr =
                    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                const dayScheduled = habits.filter(h =>
                    h.isActive &&
                    isHabitScheduledForDate(h, dateStr)
                );
                const completed = dayScheduled.reduce(
                    (sum, h) =>
                        sum +
                        (h.habitLogs.some(
                            l => l.date === dateStr
                        )
                            ? 1
                            : 0),
                    0
                );
                const rate =
                    dayScheduled.length > 0
                        ? Math.round(
                            (completed / dayScheduled.length) *
                            100
                        )
                        : 0;
                days.push({
                    date: dateStr,
                    dayNum: d,
                    rate,
                });
            }
            for (let i = 0; i < trailingEmpty; i++) {
                days.push(null);
            }
            return days;
        },
        [habits]
    );

    const monthlyDays =
        useMemo(
            () => getMonthlyDays(),
            [getMonthlyDays]
        );

    const dayColor = (rate: number) => {
        if (rate === 0)
            return {
                bg: "rgba(148,163,184,0.10)",
                _dark_bg: "rgba(148,163,184,0.12)",
            };
        if (rate >= 80)
            return {
                bg: "rgba(16,185,129,0.35)",
                _dark_bg: "rgba(16,185,129,0.45)",
            };
        if (rate >= 50)
            return {
                bg: "rgba(99,102,241,0.35)",
                _dark_bg: "rgba(99,102,241,0.45)",
            };
        return {
            bg: "rgba(245,158,11,0.35)",
            _dark_bg: "rgba(245,158,11,0.45)",
        };
    };

    // ========================================
    // SPARKLINES
    // ========================================

    const getHabitSparkline = (
        habit: typeof habits[0],
        length: number = 14
    ) => {
        const days: boolean[] = [];
        for (let i = length - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = formatDate(d);
            days.push(
                habit.habitLogs.some(
                    l => l.date === key
                )
            );
        }
        return days;
    };

    const getHabitStreakText = (
        habit: typeof habits[0]
    ) => {
        const streak = computeLongestStreak(
            habit.habitLogs,
            habit.schedule,
            habit.createdAt
        );
        if (streak === 0) return null;
        return `${streak}d best`;
    };

    // ========================================
    // RENDER HELPERS
    // ========================================

    const weekDays =
        getWeekBoundsForDate(selectedDate).days;

    const weekDayLabels = [
        "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
    ];

    const selectedDateObj = new Date(selectedDate);
    const isToday = selectedDate === todayString;

    // ========================================
    // RENDER
    // ========================================

    if (userLoading) {
        return (
            <Flex
                minH="100dvh"
                bg="#0B0F1A"
                align="center"
                justify="center"
            >
                <VStack gap={6}>
                    <Spinner size="xl" color="#6366F1" />
                    <Text
                        color="#F8FAFC"
                        fontSize="sm"
                        textTransform="uppercase"
                        letterSpacing="0.18em"
                    >
                        Authenticating...
                    </Text>
                </VStack>
            </Flex>
        );
    }

    return (
        <Box
            minH="100dvh"
            display="flex"
            flexDirection="column"
            bg="#FAFAFF"
            _dark={{ bg: "#0B0F1A" }}
        >
            <UserNavbar
                userName={user?.name}
                currentTime={currentTime}
                logout={logout}
            />

            {/* MAIN LAYOUT */}
            <Box
                maxW="1200px"
                mx="auto"
                w="full"
                px={{ base: 4, md: 8, lg: 10 }}
                pt={{ base: 6, md: 8 }}
                pb={20}
            >
                <Flex
                    gap={{ base: 0, md: 8 }}
                    align="start"
                    direction={{ base: "column", md: "row" }}
                >

                    {/* LEFT SIDEBAR: VERTICAL WEEK */}
                    <Box
                        w={{ base: "full", md: "240px" }}
                        flexShrink={0}
                        position={{ base: "relative", md: "sticky" }}
                        top={{ base: "auto", md: "88px" }}
                        mb={{ base: 6, md: 0 }}
                    >
                        <Flex
                            justify="space-between"
                            align="center"
                            mb={3}
                        >
                            <IconButton
                                aria-label="previous week"
                                size="sm"
                                variant="ghost"
                                borderRadius="full"
                                color="#64748B"
                                _dark={{ color: "#94A3B8" }}
                                _hover={{
                                    bg: "rgba(99,102,241,0.08)",
                                    color: "#6366F1",
                                }}
                                onClick={() => shiftWeek(-1)}
                            >
                                <LuChevronLeft />
                            </IconButton>
                            <Text
                                fontSize="xs"
                                fontWeight="600"
                                color="#64748B"
                                _dark={{ color: "#94A3B8" }}
                            >
                                {new Date(from).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}
                                {" to "}
                                {new Date(to).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}
                            </Text>
                            <IconButton
                                aria-label="next week"
                                size="sm"
                                variant="ghost"
                                borderRadius="full"
                                color="#64748B"
                                _dark={{ color: "#94A3B8" }}
                                _hover={{
                                    bg: "rgba(99,102,241,0.08)",
                                    color: "#6366F1",
                                }}
                                onClick={() => shiftWeek(1)}
                            >
                                <LuChevronRight />
                            </IconButton>
                        </Flex>

                        <VStack align="stretch" gap={1}>
                            {weekDays.map((day, index) => {
                                const sel = day === selectedDate;
                                const today = day === todayString;
                                const dd = new Date(day);
                                const prog = weeklyProgress[index];
                                const barColor = prog >= 80 ? "#10B981" : prog >= 50 ? "#6366F1" : "#F59E0B";

                                return (
                                    <Tooltip.Root key={day}>
                                        <Tooltip.Trigger asChild>
                                            <Flex
                                                align="center"
                                                gap={3}
                                                p={3}
                                                borderRadius="xl"
                                                cursor="pointer"
                                                transition="0.2s"
                                                bg={sel ? "rgba(99,102,241,0.08)" : "transparent"}
                                                _hover={{ bg: sel ? "rgba(99,102,241,0.10)" : "rgba(148,163,184,0.06)" }}
                                                border="1px solid"
                                                borderColor={sel ? "rgba(99,102,241,0.25)" : "transparent"}
                                                _dark={{
                                                    borderColor: sel ? "rgba(99,102,241,0.35)" : "transparent",
                                                    bg: sel ? "rgba(99,102,241,0.10)" : "transparent",
                                                    _hover: { bg: sel ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.04)" },
                                                }}
                                                onClick={() => setSelectedDate(day)}
                                            >
                                                <VStack align="center" gap={0} minW="36px">
                                                    <Text
                                                        fontSize="10px"
                                                        fontWeight="600"
                                                        textTransform="uppercase"
                                                        color="#94A3B8"
                                                        letterSpacing="0.06em"
                                                    >
                                                        {weekDayLabels[index]}
                                                    </Text>
                                                    <Text
                                                        fontSize="md"
                                                        fontWeight="700"
                                                        lineHeight="1"
                                                        color={sel ? "#6366F1" : today ? "#10B981" : "#0F172A"}
                                                        _dark={{
                                                            color: sel ? "#818CF8" : today ? "#34D399" : "#F8FAFC",
                                                        }}
                                                    >
                                                        {dd.getDate()}
                                                    </Text>
                                                </VStack>
                                                <Box flex={1}>
                                                    <Box
                                                        h="4px"
                                                        borderRadius="full"
                                                        bg="rgba(148,163,184,0.12)"
                                                        _dark={{ bg: "rgba(148,163,184,0.18)" }}
                                                        overflow="hidden"
                                                    >
                                                        <Box
                                                            h="full"
                                                            w={`${prog}%`}
                                                            bg={prog === 0 ? "transparent" : barColor}
                                                            transition="0.4s cubic-bezier(0.25, 1, 0.5, 1)"
                                                            borderRadius="full"
                                                        />
                                                    </Box>
                                                </Box>
                                                {today && (
                                                    <Box
                                                        w="6px"
                                                        h="6px"
                                                        borderRadius="full"
                                                        bg="#10B981"
                                                        flexShrink={0}
                                                    />
                                                )}
                                            </Flex>
                                        </Tooltip.Trigger>
                                        <Tooltip.Positioner>
                                            <Tooltip.Content
                                                bg="#111827"
                                                color="white"
                                                borderRadius="xl"
                                                px={3}
                                                py={1.5}
                                                fontSize="xs"
                                            >
                                                {day}: {prog}% completed
                                            </Tooltip.Content>
                                        </Tooltip.Positioner>
                                    </Tooltip.Root>
                                );
                            })}
                        </VStack>

                        {habits.length > 0 && (
                            <Box
                                mt={6}
                                p={4}
                                borderRadius="2xl"
                                bg="white"
                                _dark={{
                                    bg: "#111827",
                                    borderColor: "rgba(255,255,255,0.06)",
                                }}
                                border="1px solid"
                                borderColor="rgba(148,163,184,0.14)"
                            >
                                <Text
                                    fontSize="xs"
                                    fontWeight="600"
                                    color="#64748B"
                                    _dark={{ color: "#94A3B8" }}
                                    textTransform="uppercase"
                                    letterSpacing="0.08em"
                                    mb={3}
                                >
                                    This Week
                                </Text>
                                <Flex justify="space-between" align="center">
                                    <Box>
                                        <Text
                                            fontSize="lg"
                                            fontWeight="700"
                                            color="#0F172A"
                                            _dark={{ color: "#F8FAFC" }}
                                            lineHeight="1"
                                        >
                                            {Math.round(weeklyProgress.reduce((a, b) => a + b, 0) / 7)}%
                                        </Text>
                                        <Text
                                            fontSize="10px"
                                            color="#64748B"
                                            _dark={{ color: "#94A3B8" }}
                                        >
                                            daily average
                                        </Text>
                                    </Box>
                                    <Box
                                        w="40px"
                                        h="40px"
                                        borderRadius="full"
                                        bg="rgba(99,102,241,0.08)"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        color="#6366F1"
                                    >
                                        <LuTrendingUp size={18} />
                                    </Box>
                                </Flex>
                            </Box>
                        )}
                    </Box>

                    {/* RIGHT COLUMN */}
                    <Box flex={1} minW={0} maxW="720px" mx="auto">
                        {/* GREETING */}
                        <Box pb={4} mb={6}>
                            <Heading
                                fontSize={{ base: "2xl", md: "3xl" }}
                                fontWeight="800"
                                letterSpacing="-0.03em"
                                color="#0F172A"
                                _dark={{ color: "#F8FAFC" }}
                                lineHeight="1.1"
                                mb={2}
                            >
                                {(() => {
                                    const hour = currentTime.getHours();
                                    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
                                    return `${greeting}, ${user?.name?.split(" ")[0] || "there"}`;
                                })()}
                            </Heading>
                            <Text
                                fontSize="sm"
                                color="#64748B"
                                _dark={{ color: "#94A3B8" }}
                            >
                                {(() => {
                                    const activeHabits = habits.filter(h => h.isActive);
                                    if (activeHabits.length === 0) return "Ready to build something new?";
                                    if (completionRate === 100) return "All habits complete. A satisfying day.";
                                    if (completionRate > 0) return `${completedSelectedDate} of ${totalHabits} done today. Keep the momentum going.`;
                                    return `${totalHabits} habits waiting. One small step is all it takes.`;
                                })()}
                            </Text>
                        </Box>
                            {/* DATE HEADER */}
                            <Box mb={10}>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="#64748B"
                                    _dark={{ color: "#94A3B8" }}
                                    textTransform="uppercase"
                                    letterSpacing="0.08em"
                                    mb={2}
                                >
                                    {isToday ? "Today" : "Selected Day"}
                                </Text>
                                <Heading
                                    fontSize={{ base: "3xl", md: "4xl" }}
                                    fontWeight="800"
                                    letterSpacing="-0.03em"
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                    lineHeight="1.1"
                                    mb={4}
                                >
                        {selectedDateObj.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </Heading>

                    {/* PROGRESS */}
                    {habits.length > 0 && (
                        <Flex align="center" gap={4} flexWrap="wrap">
                            <HStack gap={3} align="center">
                                <Box
                                    position="relative"
                                    w="56px"
                                    h="56px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    flexShrink={0}
                                >
                                    <svg height="56" width="56" style={{ transform: "rotate(-90deg)" }}>
                                        <circle
                                            stroke="rgba(148,163,184,0.15)"
                                            fill="transparent"
                                            strokeWidth="4"
                                            r="24"
                                            cx="28"
                                            cy="28"
                                        />
                                        <circle
                                            stroke={completionRate === 100 ? "#10B981" : "#6366F1"}
                                            fill="transparent"
                                            strokeWidth="4"
                                            strokeDasharray={`${24 * 2 * Math.PI} ${24 * 2 * Math.PI}`}
                                            strokeDashoffset={
                                                24 * 2 * Math.PI -
                                                (completionRate / 100) * (24 * 2 * Math.PI)
                                            }
                                            strokeLinecap="round"
                                            style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.25, 1, 0.5, 1)" }}
                                            r="24"
                                            cx="28"
                                            cy="28"
                                        />
                                    </svg>
                                    <Box position="absolute" textAlign="center">
                                        <Text
                                            fontSize="xs"
                                            fontWeight="800"
                                            color="#0F172A"
                                            _dark={{ color: "#F8FAFC" }}
                                            lineHeight="1"
                                        >
                                            {completionRate}
                                            <Text as="span" fontSize="8px">%</Text>
                                        </Text>
                                    </Box>
                                </Box>
                                <VStack align="start" gap={0}>
                                    <Text fontSize="sm" fontWeight="700" color="#0F172A" _dark={{ color: "#F8FAFC" }}>
                                        {completedSelectedDate} of {totalHabits}
                                    </Text>
                                    <Text fontSize="xs" color="#64748B" _dark={{ color: "#94A3B8" }}>
                                        {totalHabits - completedSelectedDate} remaining
                                    </Text>
                                </VStack>
                            </HStack>

                            {bestStreak > 0 && (
                                <HStack
                                    gap={2}
                                    px={3}
                                    py={2}
                                    borderRadius="full"
                                    bg="rgba(245,158,11,0.10)"
                                    _dark={{ bg: "rgba(245,158,11,0.14)" }}
                                >
                                    <Box color="#F59E0B" display="flex" alignItems="center">
                                        <LuFlame size={14} />
                                    </Box>
                                    <Text fontSize="xs" fontWeight="700" color="#B45309" _dark={{ color: "#FBBF24" }}>
                                        {bestStreak}d best streak
                                    </Text>
                                </HStack>
                            )}
                        </Flex>
                    )}
                </Box>

                {/* TOOLBAR */}
                <Flex
                    mb={8}
                    align="center"
                    justify="space-between"
                    flexWrap="wrap"
                    gap={3}
                >
                    <HStack gap={2} flexWrap="wrap" align="center">
                        <IconButton
                            aria-label="search"
                            size="sm"
                            variant="ghost"
                            borderRadius="full"
                            color="#64748B"
                            _dark={{ color: "#94A3B8" }}
                            _hover={{
                                bg: "rgba(99,102,241,0.08)",
                                color: "#6366F1",
                            }}
                            onClick={() => setSearchOpen(!searchOpen)}
                        >
                            <LuSearch />
                        </IconButton>

                        <Box
                            overflow="hidden"
                            transition="all 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
                            w={searchOpen ? "200px" : "0px"}
                            opacity={searchOpen ? 1 : 0}
                        >
                            <Input
                                placeholder="Search..."
                                size="sm"
                                borderRadius="full"
                                w="200px"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                borderColor="rgba(148,163,184,0.24)"
                                _dark={{
                                    bg: "#111827",
                                    borderColor: "rgba(148,163,184,0.22)",
                                    color: "#F8FAFC",
                                    _placeholder: { color: "#94A3B8" },
                                }}
                            />
                        </Box>

                        {isCustomFilter && (
                            <Button
                                size="xs"
                                variant="ghost"
                                borderRadius="full"
                                color="#64748B"
                                _dark={{ color: "#94A3B8" }}
                                _hover={{
                                    bg: "rgba(99,102,241,0.08)",
                                    color: "#6366F1",
                                }}
                                onClick={resetFilters}
                            >
                                <LuRotateCcw />
                                Reset
                            </Button>
                        )}
                    </HStack>

                    <CreateHabitDialog onSuccess={refetch} />
                </Flex>

                {/* HABITS */}
                {habitsLoading && (
                    <VStack align="stretch" gap={4} mb={12}>
                        {[1, 2, 3, 4].map(item => (
                            <Skeleton key={item} h="72px" borderRadius="2xl" />
                        ))}
                    </VStack>
                )}

                {!habitsLoading && habits.length === 0 && (
                    <VStack py={20} gap={4} mb={12}>
                        <Box
                            w="64px"
                            h="64px"
                            borderRadius="full"
                            bg="rgba(99,102,241,0.08)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color="#6366F1"
                        >
                            <LuPlus size={28} />
                        </Box>
                        <Heading size="md" color="#0F172A" _dark={{ color: "#F8FAFC" }}>
                            No habits yet
                        </Heading>
                        <Text color="#64748B" _dark={{ color: "#94A3B8" }} textAlign="center" maxW="360px">
                            Start with one small habit. Consistency compounds into greatness.
                        </Text>
                    </VStack>
                )}

                {!habitsLoading && habits.length > 0 && (
                    <VStack align="stretch" gap={4} mb={16}>
                        {habits
                            .filter(habit =>
                                habit.isActive &&
                                isHabitScheduledForDate(habit, selectedDate)
                            )
                            .map(habit => {
                                const isCompleted =
                                    habit.habitLogs.some(
                                        l => l.date === selectedDate
                                    );
                                const scheduleColors =
                                    scheduleTypeColor(
                                        habit.schedule.type
                                    );
                                const isToggling =
                                    togglingIds.has(habit.id);
                                const sparkline =
                                    getHabitSparkline(habit, 14);
                                const streakText =
                                    getHabitStreakText(habit);
                                const scheduleLabel =
                                    getScheduleLabel(habit.schedule);

                                return (
                                    <Flex
                                        key={habit.id}
                                        align="center"
                                        gap={4}
                                        p={4}
                                        borderRadius="2xl"
                                        border="1px solid"
                                        borderColor={
                                            isCompleted
                                                ? "rgba(16,185,129,0.20)"
                                                : "rgba(148,163,184,0.14)"
                                        }
                                        bg={
                                            isCompleted
                                                ? "rgba(16,185,129,0.03)"
                                                : "white"
                                        }
                                        _dark={{
                                            bg: isCompleted
                                                ? "rgba(16,185,129,0.05)"
                                                : "#111827",
                                        }}
                                        transition="0.2s"
                                        _hover={{
                                            borderColor: isCompleted
                                                ? "rgba(16,185,129,0.30)"
                                                : "rgba(99,102,241,0.25)",
                                        }}
                                    >
                                    {/* TOGGLE */}
                                    <Tooltip.Root>
                                        <Tooltip.Trigger asChild>
                                            <Box
                                                as="button"
                                                aria-label={
                                                    isCompleted
                                                        ? "Mark incomplete"
                                                        : "Mark complete"
                                                }
                                                onClick={() => toggleHabitLog(habit.id)}
                                                opacity={isToggling ? 0.5 : 1}
                                                pointerEvents={isToggling ? "none" : "auto"}
                                                w="44px"
                                                h="44px"
                                                borderRadius="full"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                flexShrink={0}
                                                cursor="pointer"
                                                transition="0.2s"
                                                bg={
                                                    isCompleted
                                                        ? "#10B981"
                                                        : "rgba(148,163,184,0.12)"
                                                }
                                                color={
                                                    isCompleted
                                                        ? "white"
                                                        : "#94A3B8"
                                                }
                                                _hover={{
                                                    bg: isCompleted
                                                        ? "#059669"
                                                        : "rgba(99,102,241,0.15)",
                                                    color: isCompleted
                                                        ? "white"
                                                        : "#6366F1",
                                                    transform: "scale(1.05)",
                                                }}
                                                _dark={{
                                                    bg: isCompleted
                                                        ? "#10B981"
                                                        : "rgba(148,163,184,0.18)",
                                                    color: isCompleted
                                                        ? "white"
                                                        : "#64748B",
                                                }}
                                            >
                                                {isCompleted ? (
                                                    <LuCheck size={20} />
                                                ) : (
                                                    <LuCircleCheckBig size={20} />
                                                )}
                                            </Box>
                                        </Tooltip.Trigger>
                                        <Tooltip.Positioner>
                                            <Tooltip.Content
                                                bg="#111827"
                                                color="white"
                                                borderRadius="xl"
                                                px={3}
                                                py={1.5}
                                                fontSize="xs"
                                            >
                                                {isCompleted ? "Mark incomplete" : "Mark complete"}
                                            </Tooltip.Content>
                                        </Tooltip.Positioner>
                                    </Tooltip.Root>

                                    {/* INFO */}
                                    <Box flex="1" minW={0}>
                                        <Flex
                                            align="center"
                                            gap={2}
                                            mb={1}
                                            flexWrap="wrap"
                                        >
                                            <Text
                                                fontWeight="600"
                                                fontSize="sm"
                                                color="#0F172A"
                                                _dark={{ color: "#F8FAFC" }}
                                                truncate
                                            >
                                                {habit.name}
                                            </Text>
                                            <Badge
                                                px={2}
                                                py={0.5}
                                                borderRadius="full"
                                                bg={scheduleColors.bg}
                                                color={scheduleColors.color}
                                                fontSize="9px"
                                                fontWeight="600"
                                            >
                                                {scheduleLabel}
                                            </Badge>
                                            {streakText && (
                                                <Text
                                                    fontSize="10px"
                                                    color="#64748B"
                                                    _dark={{ color: "#94A3B8" }}
                                                >
                                                    {streakText}
                                                </Text>
                                            )}
                                        </Flex>

                                        <Text
                                            fontSize="xs"
                                            color="#64748B"
                                            _dark={{ color: "#94A3B8" }}
                                            truncate
                                            mb={2}
                                        >
                                            {habit.description}
                                        </Text>

                                        {/* 14-DAY BAR */}
                                        <HStack gap="3px" align="center">
                                            {sparkline.map((done, i) => (
                                                <Box
                                                    key={i}
                                                    flex="1"
                                                    h="6px"
                                                    borderRadius="full"
                                                    bg={
                                                        done
                                                            ? "#10B981"
                                                            : "rgba(148,163,184,0.20)"
                                                    }
                                                    _dark={{
                                                        bg: done
                                                            ? "#34D399"
                                                            : "rgba(148,163,184,0.25)",
                                                    }}
                                                    transition="0.2s"
                                                    maxW="20px"
                                                />
                                            ))}
                                        </HStack>
                                    </Box>

                                    {/* SOURCE ICON */}
                                    <Tooltip.Root>
                                        <Tooltip.Trigger asChild>
                                            <Box
                                                color="#94A3B8"
                                                _dark={{ color: "#64748B" }}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                cursor="default"
                                                flexShrink={0}
                                            >
                                                {habit.createdFrom === 2 ? (
                                                    <LuSmartphone size={12} />
                                                ) : (
                                                    <LuGlobe size={12} />
                                                )}
                                            </Box>
                                        </Tooltip.Trigger>
                                        <Tooltip.Positioner>
                                            <Tooltip.Content
                                                bg="#111827"
                                                color="white"
                                                borderRadius="xl"
                                                px={3}
                                                py={1.5}
                                                fontSize="xs"
                                            >
                                                Created from{" "}
                                                {habit.createdFrom === 2 ? "mobile" : "web"}
                                            </Tooltip.Content>
                                        </Tooltip.Positioner>
                                    </Tooltip.Root>
                                </Flex>
                            );
                        })}


                    </VStack>
                )}

                {/* WEEK IN FOCUS */}
                {habits.length > 0 && weekInsights && (
                    <Box mb={16}>
                        <Flex
                            justify="space-between"
                            align="baseline"
                            mb={4}
                            flexWrap="wrap"
                            gap={2}
                        >
                            <Text
                                fontSize="xs"
                                fontWeight="600"
                                color="#64748B"
                                _dark={{ color: "#94A3B8" }}
                                textTransform="uppercase"
                                letterSpacing="0.08em"
                            >
                                Week in Focus
                            </Text>
                            {weekInsights.delta !== 0 && (
                                <Text
                                    fontSize="xs"
                                    fontWeight="600"
                                    color={weekInsights.delta > 0 ? "#10B981" : "#F59E0B"}
                                    _dark={{
                                        color: weekInsights.delta > 0 ? "#34D399" : "#FBBF24",
                                    }}
                                >
                                    {weekInsights.delta > 0 ? "+" : ""}
                                    {weekInsights.delta}% vs last week
                                </Text>
                            )}
                        </Flex>

                        <Flex
                            gap={4}
                            direction={{ base: "column", md: "row" }}
                        >
                            {/* Best performer */}
                            <Box
                                flex={1}
                                p={4}
                                borderRadius="2xl"
                                bg="rgba(16,185,129,0.06)"
                                border="1px solid"
                                borderColor="rgba(16,185,129,0.15)"
                                _dark={{
                                    bg: "rgba(16,185,129,0.08)",
                                    borderColor: "rgba(16,185,129,0.20)",
                                }}
                            >
                                <Text
                                    fontSize="10px"
                                    fontWeight="600"
                                    color="#64748B"
                                    _dark={{ color: "#94A3B8" }}
                                    textTransform="uppercase"
                                    letterSpacing="0.08em"
                                    mb={2}
                                >
                                    Best this week
                                </Text>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                    truncate
                                    mb={1}
                                >
                                    {weekInsights.best.habit.name}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    fontWeight="600"
                                    color="#10B981"
                                    _dark={{ color: "#34D399" }}
                                >
                                    {weekInsights.best.rate}% completion
                                </Text>
                            </Box>

                            {/* Needs attention or on track */}
                            <Box
                                flex={1}
                                p={4}
                                borderRadius="2xl"
                                bg={
                                    weekInsights.needsAttention
                                        ? "rgba(245,158,11,0.06)"
                                        : "rgba(16,185,129,0.06)"
                                }
                                border="1px solid"
                                borderColor={
                                    weekInsights.needsAttention
                                        ? "rgba(245,158,11,0.15)"
                                        : "rgba(16,185,129,0.15)"
                                }
                                _dark={{
                                    bg: weekInsights.needsAttention
                                        ? "rgba(245,158,11,0.08)"
                                        : "rgba(16,185,129,0.08)",
                                    borderColor: weekInsights.needsAttention
                                        ? "rgba(245,158,11,0.20)"
                                        : "rgba(16,185,129,0.20)",
                                }}
                            >
                                <Text
                                    fontSize="10px"
                                    fontWeight="600"
                                    color="#64748B"
                                    _dark={{ color: "#94A3B8" }}
                                    textTransform="uppercase"
                                    letterSpacing="0.08em"
                                    mb={2}
                                >
                                    {weekInsights.needsAttention
                                        ? "Needs attention"
                                        : "On track"}
                                </Text>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                    truncate
                                    mb={1}
                                >
                                    {weekInsights.needsAttention
                                        ? weekInsights.needsAttention.habit.name
                                        : "All habits perfect"}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    fontWeight="600"
                                    color={
                                        weekInsights.needsAttention
                                            ? "#F59E0B"
                                            : "#10B981"
                                    }
                                    _dark={{
                                        color: weekInsights.needsAttention
                                            ? "#FBBF24"
                                            : "#34D399",
                                    }}
                                >
                                    {weekInsights.needsAttention
                                        ? `${weekInsights.needsAttention.rate}% completion`
                                        : "Keep it up"}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                )}

                {/* MONTHLY GRID */}
                {habits.length > 0 && (
                    <Box mb={16}>
                        <Text
                            fontSize="xs"
                            fontWeight="600"
                            color="#64748B"
                            _dark={{ color: "#94A3B8" }}
                            textTransform="uppercase"
                            letterSpacing="0.08em"
                            mb={4}
                        >
                            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </Text>

                        <Grid
                            templateColumns="repeat(7, 1fr)"
                            gap={2}
                        >
                            {[
                                "M", "T", "W", "T", "F", "S", "S",
                            ].map((label, i) => (
                                <Text
                                    key={i}
                                    textAlign="center"
                                    fontSize="10px"
                                    fontWeight="600"
                                    color="#94A3B8"
                                    textTransform="uppercase"
                                    letterSpacing="0.08em"
                                    mb={1}
                                >
                                    {label}
                                </Text>
                            ))}

                            {monthlyDays.map((day, index) => {
                                if (!day) {
                                    return (
                                        <Box
                                            key={`empty-${index}`}
                                            aspectRatio="1"
                                        />
                                    );
                                }

                                const colors = dayColor(day.rate);

                                return (
                                    <Tooltip.Root key={day.date}>
                                        <Tooltip.Trigger asChild>
                                            <Box
                                                aspectRatio="1"
                                                borderRadius="xl"
                                                bg={colors.bg}
                                                _dark={{ bg: colors._dark_bg }}
                                                cursor="pointer"
                                                transition="0.2s"
                                                _hover={{
                                                    transform: "scale(1.1)",
                                                }}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                onClick={() => {
                                                    const wk =
                                                        getWeekBoundsForDate(
                                                            day.date
                                                        );
                                                    setSelectedDate(day.date);
                                                    setFrom(wk.from);
                                                    setTo(wk.to);
                                                }}
                                            >
                                                <Text
                                                    fontSize="xs"
                                                    fontWeight="600"
                                                    color={
                                                        day.rate > 0
                                                            ? "#0F172A"
                                                            : "#94A3B8"
                                                    }
                                                    _dark={{
                                                        color:
                                                            day.rate > 0
                                                                ? "#F8FAFC"
                                                                : "#64748B",
                                                    }}
                                                >
                                                    {day.dayNum}
                                                </Text>
                                            </Box>
                                        </Tooltip.Trigger>
                                        <Tooltip.Positioner>
                                            <Tooltip.Content
                                                bg="#111827"
                                                color="white"
                                                borderRadius="xl"
                                                px={3}
                                                py={1.5}
                                                fontSize="xs"
                                            >
                                                {day.date}: {day.rate}%
                                            </Tooltip.Content>
                                        </Tooltip.Positioner>
                                    </Tooltip.Root>
                                );
                            })}
                        </Grid>
                    </Box>
                )}

                {/* CONSISTENCY + DEEP LINK */}
                {habits.length > 0 && (
                    <VStack align="stretch" gap={4}>
                        <Box
                            p={4}
                            borderRadius="2xl"
                            bg="rgba(148,163,184,0.04)"
                            _dark={{ bg: "rgba(148,163,184,0.06)" }}
                        >
                            <Flex
                                justify="space-between"
                                align="center"
                                mb={2}
                            >
                                <HStack gap={2}>
                                    <Box w="8px" h="8px" borderRadius="full" bg="#10B981" />
                                    <Text
                                        fontSize="sm"
                                        fontWeight="500"
                                        color="#64748B"
                                        _dark={{ color: "#94A3B8" }}
                                    >
                                        Consistency Score
                                    </Text>
                                </HStack>
                                <Text fontSize="md" fontWeight="700" color="#10B981">
                                    {consistency}%
                                </Text>
                            </Flex>
                            <Box
                                h="6px"
                                borderRadius="full"
                                overflow="hidden"
                                bg="rgba(16,185,129,0.10)"
                                _dark={{ bg: "rgba(16,185,129,0.14)" }}
                            >
                                <Box
                                    h="full"
                                    w={`${consistency}%`}
                                    bg="#10B981"
                                    borderRadius="full"
                                    transition="0.5s cubic-bezier(0.25, 1, 0.5, 1)"
                                />
                            </Box>
                        </Box>

                        <Link
                            href="/analytics"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            w="full"
                            py={3}
                            borderRadius="2xl"
                            border="1px dashed"
                            borderColor="rgba(99,102,241,0.25)"
                            _dark={{
                                borderColor: "rgba(99,102,241,0.35)",
                                color: "#818CF8",
                            }}
                            color="#6366F1"
                            fontWeight="600"
                            fontSize="sm"
                            gap={2}
                            transition="0.2s"
                            _hover={{
                                bg: "rgba(99,102,241,0.06)",
                                borderColor: "#6366F1",
                            }}
                        >
                            <LuChartNoAxesCombined />
                            View Deep Analytics
                            <LuArrowRight />
                        </Link>
                    </VStack>
                )}
                    </Box>
                </Flex>
            </Box>

            <Footer />

            {/* SCROLL TO TOP */}
            {showScrollTop && (
                <Box
                    position="fixed"
                    bottom={6}
                    right={6}
                    zIndex={1000}
                >
                    <IconButton
                        aria-label="scroll to top"
                        size="md"
                        borderRadius="full"
                        bg="#6366F1"
                        color="white"
                        boxShadow="0 4px 14px rgba(99,102,241,0.35)"
                        _hover={{
                            bg: "#5558E3",
                            transform: "translateY(-2px)",
                        }}
                        transition="0.2s"
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                    >
                        <LuArrowUp />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;
