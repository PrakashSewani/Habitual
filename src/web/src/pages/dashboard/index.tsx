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

import CreateHabitDialog
    from "@/components/CreateHabitDialog";

import {
    computeLongestStreak,
} from "@/lib/analytics";

const Dashboard = () => {

    const formatDate = (
        date: Date
    ) => {
        const y =
            date.getFullYear();

        const m = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const d = String(
            date.getDate()
        ).padStart(2, "0");

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
        analyticsView,
        setAnalyticsView,
    ] = useState<
        "weekly" | "monthly"
    >("weekly");

    const [
        searchOpen,
        setSearchOpen,
    ] = useState(false);

    const {
        habits,
        setHabits,
        loading: habitsLoading,
        refetch,
    } = useHabits({
        search:
            debouncedSearch ||
            undefined,
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
                    if (h.id !== habitId) {
                        return h;
                    }

                    const logs = [
                        ...h.habitLogs,
                    ];

                    const idx = logs.findIndex(
                        l =>
                            l.date ===
                            selectedDate
                    );

                    if (completed && idx < 0) {
                        logs.push({
                            id: `${habitId}-${selectedDate}`,
                            date: selectedDate,
                        });
                    }
                    else if (
                        !completed &&
                        idx >= 0
                    ) {
                        logs.splice(idx, 1);
                    }

                    return {
                        ...h,
                        habitLogs: logs,
                    };
                })
            );
        }
        finally {
            setTogglingIds(prev => {
                const next = new Set(prev);
                next.delete(habitId);
                return next;
            });
        }
    };

    const { onHabitLogUpdated } =
        useSignalR();

    useEffect(() => {
        const unsubscribe =
            onHabitLogUpdated(
                payload => {
                    setHabits(prev =>
                        prev.map(h => {
                            if (
                                h.id !==
                                payload.habitId
                            ) {
                                return h;
                            }

                            const logs = [
                                ...h.habitLogs,
                            ];

                            const idx = logs.findIndex(
                                l =>
                                    l.date ===
                                    payload.date
                            );

                            if (
                                payload.completed &&
                                idx < 0
                            ) {
                                logs.push({
                                    id: `${payload.habitId}-${payload.date}`,
                                    date: payload.date,
                                });
                            }
                            else if (
                                !payload.completed &&
                                idx >= 0
                            ) {
                                logs.splice(idx, 1);
                            }

                            return {
                                ...h,
                                habitLogs: logs,
                            };
                        })
                    );
                }
            );

        return unsubscribe;
    }, [
        onHabitLogUpdated,
        setHabits,
    ]);

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

    useEffect(() => {
        const timer =
            setInterval(() => {
                setCurrentTime(
                    new Date()
                );
            }, 1000);

        return () =>
            clearInterval(timer);
    }, []);

    const getWeekBoundsForDate = (
        dateStr: string
    ) => {
        const date =
            new Date(dateStr);
        const day =
            date.getDay();
        const diffToMonday =
            (day + 6) % 7;

        const monday =
            new Date(date);
        monday.setDate(
            date.getDate() -
            diffToMonday
        );

        const sunday =
            new Date(monday);
        sunday.setDate(
            monday.getDate() + 6
        );

        return {
            from: formatDate(monday),
            to: formatDate(sunday),
            days: Array.from(
                { length: 7 },
                (_, i) => {
                    const d =
                        new Date(monday);
                    d.setDate(
                        monday.getDate() + i
                    );
                    return formatDate(d);
                }
            ),
        };
    };

    const totalHabits =
        habits.length;

    const completedSelectedDate =
        habits.filter(h =>
            h.habitLogs.some(
                l => l.date === selectedDate
            )
        ).length;

    const pendingSelectedDate =
        totalHabits -
        completedSelectedDate;

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
                const start =
                    new Date(startDate);
                const days: string[] =
                    [];

                for (
                    let i = 0;
                    i < 7;
                    i++
                ) {
                    const d =
                        new Date(start);
                    d.setDate(
                        start.getDate() + i
                    );
                    days.push(
                        formatDate(d)
                    );
                }

                return days;
            },
            []
        );

    const analyticsWeekDays =
        useMemo(
            () =>
                getWeekDaysForRange(
                    from
                ),
            [from, getWeekDaysForRange]
        );

    const weeklyProgress =
        useMemo(
            () =>
                analyticsWeekDays.map(
                    day => {
                        const completed =
                            habits.reduce(
                                (
                                    sum,
                                    h
                                ) =>
                                    sum +
                                    (h.habitLogs.some(
                                        l =>
                                            l.date ===
                                            day
                                    )
                                        ? 1
                                        : 0),
                                0
                            );

                        return totalHabits > 0
                            ? Math.round(
                                (completed /
                                    totalHabits) *
                                100
                            )
                            : 0;
                    }
                ),
            [
                habits,
                analyticsWeekDays,
                totalHabits,
            ]
        );

    const shiftWeek = (
        direction: number
    ) => {
        const currentFrom =
            new Date(from);
        currentFrom.setDate(
            currentFrom.getDate() +
            direction * 7
        );

        const currentTo =
            new Date(currentFrom);
        currentTo.setDate(
            currentTo.getDate() + 6
        );

        setFrom(formatDate(currentFrom));
        setTo(formatDate(currentTo));
        setSelectedDate(
            formatDate(currentTo)
        );
    };

    const scheduleTypeLabel = (
        type: number
    ) => {
        const labels:
            Record<number, string> =
        {
            0: "Daily",
            1: "Weekly",
            2: "Interval",
        };
        return labels[type] ??
            "Unknown";
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
        const allDates =
            new Set<string>();

        habits.forEach(h =>
            h.habitLogs.forEach(l =>
                allDates.add(l.date)
            )
        );

        const sorted =
            Array.from(allDates).sort();

        let maxStreak = 0;
        let current = 0;

        for (
            let i = 0;
            i < sorted.length;
            i++
        ) {
            const completed =
                habits.filter(h =>
                    h.habitLogs.some(
                        l =>
                            l.date ===
                            sorted[i]
                    )
                ).length;

            const rate =
                habits.length > 0
                    ? completed /
                    habits.length
                    : 0;

            if (rate >= 1) {
                current++;
                maxStreak = Math.max(
                    maxStreak,
                    current
                );
            }
            else {
                current = 0;
            }
        }

        return habits.length > 0
            ? Math.round(
                (maxStreak /
                    habits.length) *
                100
            )
            : 0;
    };

    const consistency =
        computeConsistency();

    const bestStreak = useMemo(() => {
        if (habits.length === 0) return 0;
        return Math.max(
            0,
            ...habits.map(h =>
                computeLongestStreak(
                    h.habitLogs
                )
            )
        );
    }, [habits]);

    const getMonthDays = useCallback(
        (year: number, month: number) => {
            const daysInMonth =
                new Date(
                    year,
                    month + 1,
                    0
                ).getDate();

            const firstDay =
                new Date(year, month, 1);
            const firstDayOfWeek =
                (firstDay.getDay() + 6) % 7;

            const leadingEmpty =
                firstDayOfWeek;
            const trailingEmpty =
                (7 -
                    ((leadingEmpty +
                        daysInMonth) %
                        7)) %
                7;

            const days: (
                | {
                    date: string;
                    dayNum: number;
                    rate: number;
                }
                | null
            )[] = [];

            for (
                let i = 0;
                i < leadingEmpty;
                i++
            ) {
                days.push(null);
            }

            for (
                let d = 1;
                d <= daysInMonth;
                d++
            ) {
                const dateStr =
                    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

                const completed =
                    habits.reduce(
                        (
                            sum,
                            h
                        ) =>
                            sum +
                            (h.habitLogs.some(
                                l =>
                                    l.date ===
                                    dateStr
                            )
                                ? 1
                                : 0),
                        0
                    );

                const rate =
                    totalHabits > 0
                        ? Math.round(
                            (completed /
                                totalHabits) *
                            100
                        )
                        : 0;

                days.push({
                    date: dateStr,
                    dayNum: d,
                    rate,
                });
            }

            for (
                let i = 0;
                i < trailingEmpty;
                i++
            ) {
                days.push(null);
            }

            return days;
        },
        [habits, totalHabits]
    );

    const quarterMonths = useMemo(() => {
        const now = new Date();
        const months = [];
        for (let i = 2; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
                days: getMonthDays(d.getFullYear(), d.getMonth()),
            });
        }
        return months;
    }, [getMonthDays]);

    const dayColor = (rate: number) => {
        if (rate === 0)
            return {
                bg: "rgba(148,163,184,0.10)",
                _dark_bg:
                    "rgba(148,163,184,0.12)",
            };
        if (rate >= 80)
            return {
                bg: "rgba(16,185,129,0.35)",
                _dark_bg:
                    "rgba(16,185,129,0.45)",
            };
        if (rate >= 50)
            return {
                bg: "rgba(99,102,241,0.35)",
                _dark_bg:
                    "rgba(99,102,241,0.45)",
            };
        return {
            bg: "rgba(245,158,11,0.35)",
            _dark_bg:
                "rgba(245,158,11,0.45)",
        };
    };

    const weekDays =
        getWeekBoundsForDate(selectedDate).days;

    const weekDayLabels = [
        "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
    ];

    const goToToday = () => {
        setSearch("");
        setSelectedDate(todayString);
        const w = getWeekBounds();
        setFrom(w.from);
        setTo(w.to);
    };

    if (userLoading) {
        return (
            <Flex
                minH="100dvh"
                bg="#0B0F1A"
                align="center"
                justify="center"
            >
                <VStack gap={6}>
                    <Spinner
                        size="xl"
                        color="#6366F1"
                    />
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
            _dark={{
                bg: "#0B0F1A",
            }}
        >
            <UserNavbar
                userName={user?.name}
                currentTime={currentTime}
                logout={logout}
            />

            <Box
                maxW="1400px"
                mx="auto"
                w="full"
                px={{
                    base: 4,
                    md: 8,
                    lg: 10,
                }}
                py={6}
                pb={10}
            >
                {/* HEADER */}
                <Flex
                    justify="space-between"
                    align="center"
                    flexWrap="wrap"
                    gap={6}
                    mb={8}
                >
                    <VStack
                        align="start"
                        gap={1}
                    >
                        <Heading
                            fontSize={{
                                base: "2xl",
                                lg: "3xl",
                            }}
                            letterSpacing="-0.03em"
                            color="#0F172A"
                            _dark={{
                                color: "#F8FAFC",
                            }}
                            fontWeight="700"
                        >
                            Hello, {user?.name}
                        </Heading>
                        <Text
                            fontSize="sm"
                            color="#64748B"
                            _dark={{
                                color: "#94A3B8",
                            }}
                        >
                            {currentTime.toLocaleDateString(
                                undefined,
                                {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}
                        </Text>
                    </VStack>

                    <HStack
                        gap={6}
                        align="center"
                    >
                        {/* Progress Ring */}
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <HStack
                                    gap={3}
                                    align="center"
                                    cursor="default"
                                >
                                    <Box
                                        position="relative"
                                        w="72px"
                                        h="72px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                    >
                                        <svg
                                            height="72"
                                            width="72"
                                            style={{
                                                transform:
                                                    "rotate(-90deg)",
                                            }}
                                        >
                                            <circle
                                                stroke="rgba(148,163,184,0.15)"
                                                fill="transparent"
                                                strokeWidth="5"
                                                r="30"
                                                cx="36"
                                                cy="36"
                                            />
                                            <circle
                                                stroke={
                                                    completionRate === 100
                                                        ? "#10B981"
                                                        : "#6366F1"
                                                }
                                                fill="transparent"
                                                strokeWidth="5"
                                                strokeDasharray={`${30 * 2 * Math.PI} ${30 * 2 * Math.PI}`}
                                                strokeDashoffset={
                                                    30 * 2 * Math.PI -
                                                    (completionRate / 100) *
                                                    (30 * 2 * Math.PI)
                                                }
                                                strokeLinecap="round"
                                                style={{
                                                    transition:
                                                        "stroke-dashoffset 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                                                }}
                                                r="30"
                                                cx="36"
                                                cy="36"
                                            />
                                        </svg>
                                        <Box
                                            position="absolute"
                                            textAlign="center"
                                        >
                                            <Text
                                                fontSize="sm"
                                                fontWeight="800"
                                                color="#0F172A"
                                                _dark={{
                                                    color:
                                                        "#F8FAFC",
                                                }}
                                                lineHeight="1"
                                            >
                                                {completionRate}
                                                <Text
                                                    as="span"
                                                    fontSize="10px"
                                                >
                                                    %
                                                </Text>
                                            </Text>
                                        </Box>
                                    </Box>

                                    <VStack
                                        align="start"
                                        gap={0}
                                    >
                                        <Text
                                            fontSize="xs"
                                            fontWeight="600"
                                            color="#64748B"
                                            _dark={{
                                                color:
                                                    "#94A3B8",
                                            }}
                                            textTransform="uppercase"
                                            letterSpacing="0.06em"
                                        >
                                            Today
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="700"
                                            color="#0F172A"
                                            _dark={{
                                                color:
                                                    "#F8FAFC",
                                            }}
                                        >
                                            {completedSelectedDate}
                                            {" "}
                                            <Text
                                                as="span"
                                                fontWeight="500"
                                                color="#64748B"
                                                _dark={{
                                                    color:
                                                        "#94A3B8",
                                                }}
                                            >
                                                of{" "}
                                                {totalHabits}
                                            </Text>
                                        </Text>
                                    </VStack>
                                </HStack>
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
                                    {completedSelectedDate} of{" "}
                                    {totalHabits} habits completed today
                                </Tooltip.Content>
                            </Tooltip.Positioner>
                        </Tooltip.Root>

                        {/* Streak */}
                        {bestStreak > 0 && (
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <HStack
                                        gap={2}
                                        px={3}
                                        py={2}
                                        borderRadius="full"
                                        bg="rgba(245,158,11,0.10)"
                                        _dark={{
                                            bg:
                                                "rgba(245,158,11,0.14)",
                                        }}
                                        cursor="default"
                                    >
                                        <Box
                                            color="#F59E0B"
                                            display="flex"
                                            alignItems="center"
                                        >
                                            <LuFlame
                                                size={16}
                                            />
                                        </Box>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="700"
                                            color="#B45309"
                                            _dark={{
                                                color:
                                                    "#FBBF24",
                                            }}
                                        >
                                            {bestStreak}d
                                        </Text>
                                    </HStack>
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
                                        Best streak: {bestStreak} days
                                    </Tooltip.Content>
                                </Tooltip.Positioner>
                            </Tooltip.Root>
                        )}
                    </HStack>
                </Flex>

                {/* WEEK STRIP */}
                <Box mb={6}>
                    <HStack
                        gap={2}
                        justify="center"
                        flexWrap="wrap"
                    >
                        <IconButton
                            aria-label="previous week"
                            size="sm"
                            variant="ghost"
                            borderRadius="full"
                            color="#64748B"
                            _dark={{
                                color:
                                    "#94A3B8",
                            }}
                            _hover={{
                                bg:
                                    "rgba(99,102,241,0.08)",
                                color:
                                    "#6366F1",
                            }}
                            onClick={() =>
                                shiftWeek(-1)
                            }
                        >
                            <LuChevronLeft />
                        </IconButton>

                        {weekDays.map(
                            (
                                day,
                                index
                            ) => {
                                const isSelected =
                                    day ===
                                    selectedDate;

                                const isToday =
                                    day ===
                                    todayString;

                                const dayDate =
                                    new Date(day);

                                const completion =
                                    weeklyProgress[index];

                                return (
                                    <Tooltip.Root key={day}>
                                        <Tooltip.Trigger asChild>
                                            <VStack
                                                gap={1.5}
                                                align="center"
                                                cursor="pointer"
                                                onClick={() =>
                                                    setSelectedDate(
                                                        day
                                                    )
                                                }
                                                p={2}
                                                minW="52px"
                                                borderRadius="xl"
                                                transition="0.2s"
                                                bg={
                                                    isSelected
                                                        ? "rgba(99,102,241,0.08)"
                                                        : "transparent"
                                                }
                                                _hover={{
                                                    bg:
                                                        "rgba(99,102,241,0.06)",
                                                }}
                                                border="2px solid"
                                                borderColor={
                                                    isSelected
                                                        ? "#6366F1"
                                                        : "transparent"
                                                }
                                                _dark={{
                                                    borderColor:
                                                        isSelected
                                                            ? "#818CF8"
                                                            : "transparent",
                                                }}
                                            >
                                                <Text
                                                    fontSize="10px"
                                                    fontWeight="600"
                                                    textTransform="uppercase"
                                                    color="#94A3B8"
                                                    letterSpacing="0.06em"
                                                >
                                                    {
                                                        weekDayLabels[index]
                                                    }
                                                </Text>

                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="700"
                                                    color={
                                                        isSelected
                                                            ? "#6366F1"
                                                            : isToday
                                                                ? "#10B981"
                                                                : "#0F172A"
                                                    }
                                                    _dark={{
                                                        color:
                                                            isSelected
                                                                ? "#818CF8"
                                                                : isToday
                                                                    ? "#34D399"
                                                                    : "#F8FAFC",
                                                    }}
                                                    lineHeight="1"
                                                >
                                                    {dayDate.getDate()}
                                                </Text>

                                                <Box
                                                    w="6px"
                                                    h="6px"
                                                    borderRadius="full"
                                                    bg={
                                                        completion ===
                                                            100
                                                            ? "#10B981"
                                                            : completion >
                                                                0
                                                                ? "#6366F1"
                                                                : "transparent"
                                                    }
                                                    transition="0.2s"
                                                />
                                            </VStack>
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
                                                {day}: {completion}% completed
                                            </Tooltip.Content>
                                        </Tooltip.Positioner>
                                    </Tooltip.Root>
                                );
                            }
                        )}

                        <IconButton
                            aria-label="next week"
                            size="sm"
                            variant="ghost"
                            borderRadius="full"
                            color="#64748B"
                            _dark={{
                                color:
                                    "#94A3B8",
                            }}
                            _hover={{
                                bg:
                                    "rgba(99,102,241,0.08)",
                                color:
                                    "#6366F1",
                            }}
                            onClick={() =>
                                shiftWeek(1)
                            }
                        >
                            <LuChevronRight />
                        </IconButton>
                    </HStack>
                </Box>

                {/* TOOLBAR */}
                <Flex
                    mb={4}
                    align="center"
                    justify="space-between"
                    flexWrap="wrap"
                    gap={3}
                >
                    <HStack
                        gap={3}
                        flexWrap="wrap"
                        align="center"
                    >
                        <HStack
                            gap={0}
                            align="center"
                        >
                            <IconButton
                                aria-label="search"
                                size="sm"
                                variant="ghost"
                                borderRadius="full"
                                color="#64748B"
                                _dark={{
                                    color:
                                        "#94A3B8",
                                }}
                                _hover={{
                                    bg:
                                        "rgba(99,102,241,0.08)",
                                    color:
                                        "#6366F1",
                                }}
                                onClick={() =>
                                    setSearchOpen(
                                        !searchOpen
                                    )
                                }
                            >
                                <LuSearch />
                            </IconButton>

                            <Box
                                overflow="hidden"
                                transition="all 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
                                w={
                                    searchOpen
                                        ? "220px"
                                        : "0px"
                                }
                                opacity={
                                    searchOpen
                                        ? 1
                                        : 0
                                }
                            >
                                <Input
                                    placeholder="Search habits..."
                                    size="sm"
                                    borderRadius="full"
                                    w="220px"
                                    value={search}
                                    onChange={(
                                        e
                                    ) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    borderColor="rgba(148,163,184,0.24)"
                                    _dark={{
                                        bg:
                                            "#111827",
                                        borderColor:
                                            "rgba(148,163,184,0.22)",
                                        color:
                                            "#F8FAFC",
                                        _placeholder:
                                            {
                                                color:
                                                    "#94A3B8",
                                            },
                                    }}
                                />
                            </Box>
                        </HStack>

                        {isCustomFilter ? (
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <HStack
                                        gap={2}
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        bg="rgba(245,158,11,0.12)"
                                        border="1px solid"
                                        borderColor="rgba(245,158,11,0.25)"
                                        _dark={{
                                            bg:
                                                "rgba(245,158,11,0.16)",
                                            borderColor:
                                                "rgba(245,158,11,0.30)",
                                        }}
                                        cursor="default"
                                    >
                                        <Box
                                            w="6px"
                                            h="6px"
                                            borderRadius="full"
                                            bg="#F59E0B"
                                        />
                                        <Text
                                            fontSize="xs"
                                            fontWeight="600"
                                            color="#B45309"
                                            _dark={{
                                                color:
                                                    "#FBBF24",
                                            }}
                                        >
                                            Custom Week
                                        </Text>
                                    </HStack>
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
                                        You are viewing a filtered or past week
                                    </Tooltip.Content>
                                </Tooltip.Positioner>
                            </Tooltip.Root>
                        ) : (
                            <Badge
                                px={3}
                                py={1}
                                borderRadius="full"
                                bg="rgba(16,185,129,0.12)"
                                color="#10B981"
                                _dark={{
                                    bg:
                                        "rgba(16,185,129,0.18)",
                                    color:
                                        "#34D399",
                                }}
                                fontSize="xs"
                                fontWeight="600"
                            >
                                Current Week
                            </Badge>
                        )}
                    </HStack>

                    <HStack gap={3}>
                        <Button
                            size="sm"
                            variant="ghost"
                            borderRadius="full"
                            color="#64748B"
                            _dark={{
                                color: "#94A3B8",
                            }}
                            _hover={{
                                bg:
                                    "rgba(99,102,241,0.08)",
                                color:
                                    "#6366F1",
                            }}
                            onClick={
                                resetFilters
                            }
                            disabled={
                                !isCustomFilter
                            }
                            opacity={
                                isCustomFilter
                                    ? 1
                                    : 0.4
                            }
                            _disabled={{
                                cursor:
                                    "not-allowed",
                            }}
                        >
                            <LuRotateCcw />
                            Reset
                        </Button>

                        <CreateHabitDialog
                            onSuccess={
                                refetch
                            }
                        />
                    </HStack>
                </Flex>

                {/* MAIN CONTENT */}
                <Grid
                    templateColumns={{
                        base: "1fr",
                        lg: "7fr 4fr",
                    }}
                    gap={6}
                    alignItems="start"
                >
                    {/* LEFT: HABITS */}
                    <Box
                        pr={2}
                        pb={4}
                    >
                        {/* LOADING */}
                        {habitsLoading && (
                            <VStack
                                align="stretch"
                                gap={3}
                            >
                                {[1, 2, 3, 4]
                                    .map(
                                        item => (
                                            <Skeleton
                                                key={item}
                                                h="80px"
                                                borderRadius="2xl"
                                            />
                                        )
                                    )}
                            </VStack>
                        )}

                        {/* EMPTY */}
                        {!habitsLoading &&
                            habits.length ===
                                0 && (
                                <VStack
                                    py={20}
                                    gap={4}
                                >
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
                                        <LuPlus
                                            size={28}
                                        />
                                    </Box>
                                    <Heading
                                        size="md"
                                        color="#0F172A"
                                        _dark={{
                                            color:
                                                "#F8FAFC",
                                        }}
                                    >
                                        No habits yet
                                    </Heading>
                                    <Text
                                        color="#64748B"
                                        _dark={{
                                            color:
                                                "#94A3B8",
                                        }}
                                        textAlign="center"
                                        maxW="360px"
                                    >
                                        Start with
                                        one small
                                        habit.
                                        Consistency
                                        compounds
                                        into
                                        greatness.
                                    </Text>
                                    <CreateHabitDialog
                                        onSuccess={
                                            refetch
                                        }
                                    />
                                </VStack>
                            )}

                        {/* HABITS LIST */}
                        {!habitsLoading &&
                            habits.length >
                                0 && (
                                <VStack
                                    align="stretch"
                                    gap={3}
                                >
                                    {habits.map(
                                        habit => {
                                            const isCompleted =
                                                habit.habitLogs.some(
                                                    l =>
                                                        l.date ===
                                                        selectedDate
                                                );

                                            const scheduleColors =
                                                scheduleTypeColor(
                                                    habit.schedule.type
                                                );

                                            const isToggling =
                                                togglingIds.has(
                                                    habit.id
                                                );

                                            return (
                                                <Box
                                                    key={
                                                        habit.id
                                                    }
                                                    p={4}
                                                    borderRadius="2xl"
                                                    border="1px solid"
                                                    borderColor={
                                                        isCompleted
                                                            ? "rgba(16,185,129,0.16)"
                                                            : "rgba(148,163,184,0.14)"
                                                    }
                                                    bg={
                                                        isCompleted
                                                            ? "rgba(16,185,129,0.03)"
                                                            : "white"
                                                    }
                                                    _dark={{
                                                        bg:
                                                            isCompleted
                                                                ? "rgba(16,185,129,0.05)"
                                                                : "#111827",
                                                    }}
                                                    transition="0.2s"
                                                    display="flex"
                                                    alignItems="center"
                                                    gap={4}
                                                    _hover={{
                                                        borderColor:
                                                            isCompleted
                                                                ? "rgba(16,185,129,0.28)"
                                                                : "rgba(99,102,241,0.20)",
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
                                                                onClick={() =>
                                                                    toggleHabitLog(
                                                                        habit.id
                                                                    )
                                                                }
                                                                opacity={
                                                                    isToggling
                                                                        ? 0.5
                                                                        : 1
                                                                }
                                                                pointerEvents={
                                                                    isToggling
                                                                        ? "none"
                                                                        : "auto"
                                                                }
                                                                w="40px"
                                                                h="40px"
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
                                                                    bg:
                                                                        isCompleted
                                                                            ? "#059669"
                                                                            : "rgba(99,102,241,0.15)",
                                                                    color:
                                                                        isCompleted
                                                                            ? "white"
                                                                            : "#6366F1",
                                                                    transform:
                                                                        "scale(1.05)",
                                                                }}
                                                                _dark={{
                                                                    bg:
                                                                        isCompleted
                                                                            ? "#10B981"
                                                                            : "rgba(148,163,184,0.18)",
                                                                    color:
                                                                        isCompleted
                                                                            ? "white"
                                                                            : "#64748B",
                                                                }}
                                                            >
                                                                {isCompleted ? (
                                                                    <LuCheck
                                                                        size={20}
                                                                    />
                                                                ) : (
                                                                    <LuCircleCheckBig
                                                                        size={20}
                                                                    />
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
                                                                {isCompleted
                                                                    ? "Mark incomplete"
                                                                    : "Mark complete"}
                                                            </Tooltip.Content>
                                                        </Tooltip.Positioner>
                                                    </Tooltip.Root>

                                                    {/* INFO */}
                                                    <Box
                                                        flex="1"
                                                        minW={0}
                                                    >
                                                        <Text
                                                            fontWeight="600"
                                                            color="#0F172A"
                                                            _dark={{
                                                                color:
                                                                    "#F8FAFC",
                                                            }}
                                                            truncate
                                                            fontSize="sm"
                                                            mb={0.5}
                                                        >
                                                            {
                                                                habit.name
                                                            }
                                                        </Text>
                                                        <Text
                                                            fontSize="xs"
                                                            color="#64748B"
                                                            _dark={{
                                                                color:
                                                                    "#94A3B8",
                                                            }}
                                                            truncate
                                                        >
                                                            {
                                                                habit.description
                                                            }
                                                        </Text>
                                                    </Box>

                                                    {/* META */}
                                                    <HStack
                                                        gap={2}
                                                        flexShrink={0}
                                                    >
                                                        <Tooltip.Root>
                                                            <Tooltip.Trigger asChild>
                                                                <Badge
                                                                    px={2.5}
                                                                    py={0.5}
                                                                    borderRadius="full"
                                                                    bg={
                                                                        scheduleColors.bg
                                                                    }
                                                                    color={
                                                                        scheduleColors.color
                                                                    }
                                                                    fontSize="10px"
                                                                    fontWeight="600"
                                                                    cursor="default"
                                                                >
                                                                    {scheduleTypeLabel(
                                                                        habit.schedule.type
                                                                    )}
                                                                </Badge>
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
                                                                    {scheduleTypeLabel(
                                                                        habit.schedule.type
                                                                    )} schedule
                                                                </Tooltip.Content>
                                                            </Tooltip.Positioner>
                                                        </Tooltip.Root>

                                                        <Tooltip.Root>
                                                            <Tooltip.Trigger asChild>
                                                                <Box
                                                                    color="#94A3B8"
                                                                    _dark={{
                                                                        color:
                                                                            "#64748B",
                                                                    }}
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    cursor="default"
                                                                >
                                                                    {habit.createdFrom ===
                                                                        2 ? (
                                                                        <LuSmartphone
                                                                            size={12}
                                                                        />
                                                                    ) : (
                                                                        <LuGlobe
                                                                            size={12}
                                                                        />
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
                                                                    {habit.createdFrom === 2
                                                                        ? "mobile"
                                                                        : "web"}
                                                                </Tooltip.Content>
                                                            </Tooltip.Positioner>
                                                        </Tooltip.Root>
                                                    </HStack>
                                                </Box>
                                            );
                                        }
                                    )}

                                    {/* CREATE TRIGGER */}
                                    <CreateHabitDialog
                                        onSuccess={
                                            refetch
                                        }
                                        trigger={(
                                            <Box
                                                as="button"
                                                w="full"
                                                p={4}
                                                borderRadius="2xl"
                                                border="1px dashed"
                                                borderColor="rgba(99,102,241,0.25)"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                gap={2}
                                                color="#6366F1"
                                                cursor="pointer"
                                                transition="0.2s"
                                                _hover={{
                                                    bg:
                                                        "rgba(99,102,241,0.04)",
                                                    borderColor:
                                                        "#6366F1",
                                                }}
                                                _dark={{
                                                    borderColor:
                                                        "rgba(99,102,241,0.35)",
                                                    _hover:
                                                        {
                                                            bg:
                                                                "rgba(99,102,241,0.06)",
                                                        },
                                                }}
                                            >
                                                <LuPlus
                                                    size={18}
                                                />
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                >
                                                    Create New
                                                    Habit
                                                </Text>
                                            </Box>
                                        )}
                                    />
                                </VStack>
                            )}
                    </Box>

                    {/* RIGHT: ANALYTICS */}
                    <Box
                        pr={2}
                        pb={4}
                    >
                        <Box
                            p={6}
                            borderRadius="3xl"
                            border="1px solid"
                            borderColor="rgba(148,163,184,0.16)"
                            bg="white"
                            _dark={{
                                bg:
                                    "#111827",
                            }}
                        >
                            {/* HEADER + TOGGLE */}
                            <Flex
                                justify="space-between"
                                align="center"
                                mb={6}
                                flexWrap="wrap"
                                gap={4}
                            >
                                <Heading
                                    size="sm"
                                    color="#0F172A"
                                    _dark={{
                                        color:
                                            "#F8FAFC",
                                    }}
                                >
                                    Analytics
                                </Heading>

                                <HStack
                                    gap={1}
                                    p={0.5}
                                    borderRadius="full"
                                    bg="rgba(148,163,184,0.08)"
                                    _dark={{
                                        bg:
                                            "rgba(148,163,184,0.10)",
                                    }}
                                >
                                    <Button
                                        size="xs"
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                        fontSize="xs"
                                        fontWeight="600"
                                        bg={
                                            analyticsView ===
                                                "weekly"
                                                ? "white"
                                                : "transparent"
                                        }
                                        color={
                                            analyticsView ===
                                                "weekly"
                                                ? "#0F172A"
                                                : "#64748B"
                                        }
                                        _dark={{
                                            bg:
                                                analyticsView ===
                                                    "weekly"
                                                    ? "#1F2937"
                                                    : "transparent",
                                            color:
                                                analyticsView ===
                                                    "weekly"
                                                    ? "#F8FAFC"
                                                    : "#94A3B8",
                                        }}
                                        boxShadow={
                                            analyticsView ===
                                                "weekly"
                                                ? "0 1px 3px rgba(0,0,0,0.08)"
                                                : "none"
                                        }
                                        transition="0.2s"
                                        onClick={() =>
                                            setAnalyticsView(
                                                "weekly"
                                            )
                                        }
                                    >
                                        Weekly
                                    </Button>

                                    <Button
                                        size="xs"
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                        fontSize="xs"
                                        fontWeight="600"
                                        bg={
                                            analyticsView ===
                                                "monthly"
                                                ? "white"
                                                : "transparent"
                                        }
                                        color={
                                            analyticsView ===
                                                "monthly"
                                                ? "#0F172A"
                                                : "#64748B"
                                        }
                                        _dark={{
                                            bg:
                                                analyticsView ===
                                                    "monthly"
                                                    ? "#1F2937"
                                                    : "transparent",
                                            color:
                                                analyticsView ===
                                                    "monthly"
                                                    ? "#F8FAFC"
                                                    : "#94A3B8",
                                        }}
                                        boxShadow={
                                            analyticsView ===
                                                "monthly"
                                                ? "0 1px 3px rgba(0,0,0,0.08)"
                                                : "none"
                                        }
                                        transition="0.2s"
                                        onClick={() =>
                                            setAnalyticsView(
                                                "monthly"
                                            )
                                        }
                                    >
                                        Monthly
                                    </Button>
                                </HStack>
                            </Flex>

                            {/* WEEKLY VIEW */}
                            {analyticsView ===
                                "weekly" && (
                                <VStack
                                    align="stretch"
                                    gap={4}
                                    mb={6}
                                >
                                    <Flex
                                        align="center"
                                        justify="space-between"
                                    >
                                        <IconButton
                                            aria-label="previous week"
                                            size="sm"
                                            variant="ghost"
                                            borderRadius="full"
                                            onClick={() =>
                                                shiftWeek(
                                                    -1
                                                )
                                            }
                                        >
                                            <LuChevronLeft />
                                        </IconButton>

                                        <VStack
                                            gap={0.5}
                                            align="center"
                                        >
                                            <HStack gap={2}>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                    color="#0F172A"
                                                    _dark={{
                                                        color:
                                                            "#F8FAFC",
                                                    }}
                                                >
                                                    {from}{" "}
                                                    —{" "}
                                                    {to}
                                                </Text>

                                                {selectedDate ===
                                                    todayString && (
                                                    <Badge
                                                        px={2}
                                                        py={0.5}
                                                        borderRadius="full"
                                                        bg="rgba(16,185,129,0.15)"
                                                        color="#10B981"
                                                        _dark={{
                                                            bg:
                                                                "rgba(16,185,129,0.20)",
                                                            color:
                                                                "#34D399",
                                                        }}
                                                        fontSize="10px"
                                                        fontWeight="700"
                                                        cursor="pointer"
                                                        onClick={goToToday}
                                                        title="Go to today"
                                                    >
                                                        TODAY
                                                    </Badge>
                                                )}
                                            </HStack>

                                            <Text
                                                fontSize="xs"
                                                color="#64748B"
                                                _dark={{
                                                    color:
                                                        "#94A3B8",
                                                }}
                                            >
                                                {new Date(
                                                    selectedDate
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        weekday:
                                                            "long",
                                                        month:
                                                            "short",
                                                        day:
                                                            "numeric",
                                                    }
                                                )}
                                            </Text>
                                        </VStack>

                                        <IconButton
                                            aria-label="next week"
                                            size="sm"
                                            variant="ghost"
                                            borderRadius="full"
                                            onClick={() =>
                                                shiftWeek(
                                                    1
                                                )
                                            }
                                        >
                                            <LuChevronRight />
                                        </IconButton>
                                    </Flex>

                                    <HStack
                                        align="end"
                                        h="160px"
                                        gap={3}
                                        px={2}
                                    >
                                        {weeklyProgress.map(
                                            (
                                                height,
                                                index
                                            ) => {
                                                const isSelected =
                                                    analyticsWeekDays[index] ===
                                                    selectedDate;

                                                const isTodayBar =
                                                    analyticsWeekDays[index] ===
                                                    todayString;

                                                const barColor =
                                                    height >= 80
                                                        ? "#10B981"
                                                        : height >= 50
                                                            ? "#6366F1"
                                                            : "#F59E0B";

                                                return (
                                                    <Tooltip.Root
                                                        key={index}
                                                    >
                                                        <Tooltip.Trigger
                                                            asChild
                                                        >
                                                            <VStack
                                                                gap={2}
                                                                flex="1"
                                                                align="center"
                                                                justify="flex-end"
                                                                cursor="pointer"
                                                                onClick={() =>
                                                                    setSelectedDate(
                                                                        analyticsWeekDays[index]
                                                                    )
                                                                }
                                                            >
                                                                <Text
                                                                    fontSize="10px"
                                                                    fontWeight="700"
                                                                    color={
                                                                        isSelected
                                                                            ? "#6366F1"
                                                                            : "#64748B"
                                                                    }
                                                                    _dark={{
                                                                        color:
                                                                            isSelected
                                                                                ? "#818CF8"
                                                                                : "#94A3B8",
                                                                    }}
                                                                    transition="0.2s"
                                                                >
                                                                    {
                                                                        height
                                                                    }
                                                                    %
                                                                </Text>

                                                                <Box
                                                                    w="100%"
                                                                    maxW="36px"
                                                                    h={`${Math.max(
                                                                        height,
                                                                        4
                                                                    )}%`}
                                                                    minH="4px"
                                                                    borderRadius="xl"
                                                                    bg={
                                                                        barColor
                                                                    }
                                                                    opacity={
                                                                        height > 0
                                                                            ? 1
                                                                            : 0.25
                                                                    }
                                                                    transition="0.4s cubic-bezier(0.25, 1, 0.5, 1)"
                                                                    position="relative"
                                                                    overflow="hidden"
                                                                    boxShadow={
                                                                        isSelected
                                                                            ? `0 0 10px ${barColor}44`
                                                                            : "none"
                                                                    }
                                                                    border={
                                                                        isSelected
                                                                            ? "2px solid"
                                                                            : "none"
                                                                    }
                                                                    borderColor={
                                                                        isSelected
                                                                            ? barColor
                                                                            : "transparent"
                                                                    }
                                                                >
                                                                    <Box
                                                                        position="absolute"
                                                                        top="0"
                                                                        left="0"
                                                                        right="0"
                                                                        h="35%"
                                                                        bg="linear-gradient(180deg, rgba(255,255,255,0.20), transparent)"
                                                                        borderRadius="xl"
                                                                    />
                                                                </Box>

                                                                <HStack
                                                                    gap={1}
                                                                    align="center"
                                                                >
                                                                    {isTodayBar && (
                                                                        <Box
                                                                            w="5px"
                                                                            h="5px"
                                                                            borderRadius="full"
                                                                            bg="#10B981"
                                                                        />
                                                                    )}

                                                                    <Text
                                                                        fontSize="9px"
                                                                        fontWeight="600"
                                                                        color={
                                                                            isSelected
                                                                                ? "#6366F1"
                                                                                : isTodayBar
                                                                                    ? "#10B981"
                                                                                    : "#94A3B8"
                                                                        }
                                                                        _dark={{
                                                                            color:
                                                                                isSelected
                                                                                    ? "#818CF8"
                                                                                    : isTodayBar
                                                                                        ? "#34D399"
                                                                                        : "#64748B",
                                                                        }}
                                                                        textTransform="uppercase"
                                                                        letterSpacing="0.06em"
                                                                        transition="0.2s"
                                                                    >
                                                                        {
                                                                            [
                                                                                "M",
                                                                                "T",
                                                                                "W",
                                                                                "T",
                                                                                "F",
                                                                                "S",
                                                                                "S",
                                                                            ][index]
                                                                        }
                                                                    </Text>
                                                                </HStack>
                                                            </VStack>
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
                                                                {
                                                                    analyticsWeekDays[index]
                                                                }
                                                                :{" "}
                                                                {
                                                                    height
                                                                }
                                                                %
                                                            </Tooltip.Content>
                                                        </Tooltip.Positioner>
                                                    </Tooltip.Root>
                                                );
                                            }
                                        )}
                                    </HStack>
                                </VStack>
                            )}

                            {/* MONTHLY VIEW — 3 months */}
                            {analyticsView ===
                                "monthly" && (
                                <VStack
                                    align="stretch"
                                    gap={6}
                                    mb={6}
                                >
                                    {quarterMonths.map(
                                        (
                                            month
                                        ) => (
                                            <Box
                                                key={month.label}
                                            >
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                    color="#0F172A"
                                                    _dark={{
                                                        color:
                                                            "#F8FAFC",
                                                    }}
                                                    mb={2}
                                                >
                                                    {
                                                        month.label
                                                    }
                                                </Text>
                                                <Grid
                                                    templateColumns="repeat(7, 1fr)"
                                                    gap={1.5}
                                                >
                                                    {[
                                                        "M",
                                                        "T",
                                                        "W",
                                                        "T",
                                                        "F",
                                                        "S",
                                                        "S",
                                                    ].map(
                                                        (
                                                            label,
                                                            i
                                                        ) => (
                                                            <Text
                                                                key={`${month.label}-h-${i}`}
                                                                textAlign="center"
                                                                fontSize="9px"
                                                                fontWeight="600"
                                                                color="#94A3B8"
                                                                textTransform="uppercase"
                                                                letterSpacing="0.08em"
                                                                mb={0.5}
                                                            >
                                                                {label}
                                                            </Text>
                                                        )
                                                    )}

                                                    {month.days.map(
                                                        (
                                                            day,
                                                            index
                                                        ) => {
                                                            if (
                                                                !day
                                                            ) {
                                                                return (
                                                                    <Box
                                                                        key={`${month.label}-e-${index}`}
                                                                        aspectRatio="1"
                                                                    />
                                                                );
                                                            }

                                                            const colors =
                                                                dayColor(
                                                                    day.rate
                                                                );

                                                            return (
                                                                <Tooltip.Root
                                                                    key={day.date}
                                                                >
                                                                    <Tooltip.Trigger
                                                                        asChild
                                                                    >
                                                                        <Box
                                                                            aspectRatio="1"
                                                                            borderRadius="md"
                                                                            bg={colors.bg}
                                                                            _dark={{
                                                                                bg: colors._dark_bg,
                                                                            }}
                                                                            cursor="pointer"
                                                                            transition="0.2s"
                                                                            _hover={{
                                                                                transform:
                                                                                    "scale(1.15)",
                                                                                zIndex: 1,
                                                                            }}
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            justifyContent="center"
                                                                            onClick={() => {
                                                                                const wk =
                                                                                    getWeekBoundsForDate(
                                                                                        day.date
                                                                                    );
                                                                                setSelectedDate(
                                                                                    day.date
                                                                                );
                                                                                setFrom(
                                                                                    wk.from
                                                                                );
                                                                                setTo(
                                                                                    wk.to
                                                                                );
                                                                                setAnalyticsView(
                                                                                    "weekly"
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Text
                                                                                fontSize="10px"
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
                                                                                {
                                                                                    day.dayNum
                                                                                }
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
                                                                            {
                                                                                day.date
                                                                            }
                                                                            :{" "}
                                                                            {
                                                                                day.rate
                                                                            }
                                                                            %
                                                                        </Tooltip.Content>
                                                                    </Tooltip.Positioner>
                                                                </Tooltip.Root>
                                                            );
                                                        }
                                                    )}
                                                </Grid>
                                            </Box>
                                        )
                                    )}
                                </VStack>
                            )}

                            {/* STATS */}
                            <VStack
                                align="stretch"
                                gap={4}
                                mb={6}
                            >
                                <Box
                                    p={3}
                                    borderRadius="xl"
                                    bg="rgba(148,163,184,0.04)"
                                    _dark={{
                                        bg:
                                            "rgba(148,163,184,0.06)",
                                    }}
                                >
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                        mb={2}
                                    >
                                        <HStack gap={2}>
                                            <Box
                                                w="8px"
                                                h="8px"
                                                borderRadius="full"
                                                bg="#10B981"
                                            />
                                            <Text
                                                fontSize="sm"
                                                fontWeight="500"
                                                color="#64748B"
                                                _dark={{
                                                    color:
                                                        "#94A3B8",
                                                }}
                                            >
                                                Consistency
                                            </Text>
                                        </HStack>

                                        <Text
                                            fontSize="md"
                                            fontWeight="700"
                                            color="#10B981"
                                        >
                                            {
                                                consistency
                                            }
                                            %
                                        </Text>
                                    </Flex>

                                    <Box
                                        h="6px"
                                        borderRadius="full"
                                        overflow="hidden"
                                        bg="rgba(16,185,129,0.10)"
                                        _dark={{
                                            bg:
                                                "rgba(16,185,129,0.14)",
                                        }}
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
                            </VStack>

                            {/* DEEP ANALYTICS LINK */}
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
                                    borderColor:
                                        "rgba(99,102,241,0.35)",
                                    color:
                                        "#818CF8",
                                }}
                                color="#6366F1"
                                fontWeight="600"
                                fontSize="sm"
                                gap={2}
                                transition="0.2s"
                                _hover={{
                                    bg:
                                        "rgba(99,102,241,0.06)",
                                    borderColor:
                                        "#6366F1",
                                }}
                            >
                                <LuChartNoAxesCombined />
                                View Deep Analytics
                                <LuArrowRight />
                            </Link>
                        </Box>
                    </Box>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
