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
    SkeletonText,
    Spinner,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";

import {
    LuArrowRight,
    LuChartNoAxesCombined,
    LuChevronLeft,
    LuChevronRight,
    LuCircleCheckBig,
    LuPlus,
    LuRotateCcw,
    LuSearch,
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

import UserNavbar
    from "@/components/Navbar/UserNavbar";

import CreateHabitDialog
    from "@/components/CreateHabitDialog";

const Dashboard = () => {

    // ========================================
    // HELPERS
    // ========================================

    const formatDate = (
        date: Date
    ) =>
        date.toISOString()
            .split("T")[0];

    // ========================================
    // USER
    // ========================================

    const {
        user,
        loading: userLoading,
        logout,
    } = useAuthenticateUser();

    // ========================================
    // STATE
    // ========================================

    const [currentTime, setCurrentTime] =
        useState(new Date());

    // ========================================
    // FILTERS
    // ========================================

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

    // ========================================
    // DATA
    // ========================================

    const {
        habits,
        loading: habitsLoading,
        refetch,
    } = useHabits({
        search:
            debouncedSearch ||
            undefined,
    });

    // ========================================
    // HABIT LOG
    // ========================================

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

            const next =
                new Set(prev);

            next.add(habitId);

            return next;
        });

        try {

            await axiosRequest.put(
                `/HabitLog?habitId=${habitId}&date=${selectedDate}`
            );

            await refetch();
        }
        finally {

            setTogglingIds(prev => {

                const next =
                    new Set(prev);

                next.delete(habitId);

                return next;
            });
        }
    };

    // ========================================
    // FILTER HELPERS
    // ========================================

    const isCustomFilter =
        selectedDate !== todayString ||
        search !== "";

    const resetFilters = () => {

        setSearch("");
        setSelectedDate(todayString);
        const w = getWeekBounds();
        setFrom(w.from);
        setTo(w.to);
    };

    // ========================================
    // EFFECTS
    // ========================================

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

    // ========================================
    // HELPERS
    // ========================================

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

    const statCards = [
        {
            title: "Habits",
            value: totalHabits
                .toString()
                .padStart(2, "0"),
            color: "#6366F1",
            bg: "rgba(99,102,241,0.10)",
        },
        {
            title: "Completed",
            value: completedSelectedDate
                .toString()
                .padStart(2, "0"),
            color: "#10B981",
            bg: "rgba(16,185,129,0.10)",
        },
        {
            title: "Pending",
            value: pendingSelectedDate
                .toString()
                .padStart(2, "0"),
            color: "#F59E0B",
            bg: "rgba(245,158,11,0.10)",
        },
        {
            title: "Completion",
            value: `${completionRate}%`,
            color: "#8B5CF6",
            bg: "rgba(139,92,246,0.10)",
        },
    ];

    // ========================================
    // ANALYTICS HELPERS
    // ========================================

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

            const date =
                new Date(sorted[i]);

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

    const analytics = [
        {
            label: "Consistency",
            value: `${consistency}%`,
            color: "#10B981",
        },
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            color: "#8B5CF6",
        },
    ];

    const getMonthlyDays = useCallback(
        () => {

            const now =
                new Date();

            const year =
                now.getFullYear();

            const month =
                now.getMonth();

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

    const monthlyDays =
        useMemo(
            () =>
                getMonthlyDays(),
            [getMonthlyDays]
        );

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

    // ========================================
    // USER LOADING
    // ========================================

    if (userLoading) {

        return (
            <Flex
                minH="100dvh"
                bg="#020617"
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

    // ========================================
    // MAIN
    // ========================================

    return (
        <Box
            h="100dvh"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            bg="#FAFAFF"
            _dark={{
                bg: "#020617",
            }}
        >

            <UserNavbar
                userName={user?.name}
                currentTime={currentTime}
                logout={logout}
            />

            <Box
                flex="1"
                overflow="hidden"
                display="flex"
                flexDirection="column"
                maxW="1600px"
                mx="auto"
                px={{
                    base: 6,
                    lg: 10,
                }}
                py={6}
            >

                {/* HERO */}

                <Flex
                    justify="space-between"
                    align="flex-start"
                    flexWrap="wrap"
                    gap={4}
                    mb={10}
                >

                    <VStack
                        align="start"
                        gap={4}
                        flex="1"
                        minW="280px"
                    >

                        <Heading
                            fontSize={{
                                base: "4xl",
                                lg: "6xl",
                            }}
                            letterSpacing="-0.06em"
                            color="#0F172A"
                            _dark={{
                                color: "#F8FAFC",
                            }}
                        >
                            Hello, {user?.name}
                        </Heading>

                        <Text
                            fontSize="lg"
                            color="#64748B"
                            _dark={{
                                color: "#94A3B8",
                            }}
                        >
                            Consistency compounds
                            into greatness.
                        </Text>

                        <HStack gap={4}>

                            <Badge
                                px={4}
                                py={2}
                                borderRadius="full"
                                bg="
                                    rgba(99,102,241,0.12)
                                "
                                color="#6366F1"
                            >
                                {currentTime.toLocaleDateString()}
                            </Badge>

                            <Badge
                                px={4}
                                py={2}
                                borderRadius="full"
                                bg="
                                    rgba(16,185,129,0.12)
                                "
                                color="#10B981"
                            >
                                {currentTime.toLocaleTimeString()}
                            </Badge>

                        </HStack>

                    </VStack>

                    {/* STAT INDICATORS */}

                    <HStack
                        gap={3}
                        flexWrap="wrap"
                        align="center"
                    >

                        {statCards.map(
                            stat => (

                                <Tooltip.Root
                                    key={stat.title}
                                >

                                    <Tooltip.Trigger
                                        asChild
                                    >

                                        <HStack
                                            gap={2.5}
                                            align="center"
                                            px={3}
                                            py={2}
                                            borderRadius="full"
                                            bg={stat.bg}
                                            border="1px solid"
                                            borderColor={stat.bg}
                                            cursor="default"
                                            transition="0.2s"
                                            _hover={{
                                                transform:
                                                    "translateY(-2px)",
                                            }}
                                        >

                                            <Flex
                                                w="32px"
                                                h="32px"
                                                borderRadius="full"
                                                bg={stat.color}
                                                color="white"
                                                align="center"
                                                justify="center"
                                                fontSize="xs"
                                                fontWeight="700"
                                            >
                                                {stat.value.replace(
                                                    "%",
                                                    ""
                                                )}
                                            </Flex>

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
                                                {stat.title}
                                            </Text>

                                        </HStack>

                                    </Tooltip.Trigger>

                                    <Tooltip.Positioner>

                                        <Tooltip.Content
                                            bg="#111827"
                                            color="white"
                                            borderRadius="xl"
                                            px={4}
                                            py={2}
                                            fontSize="sm"
                                        >
                                            {stat.title}: {stat.value}
                                        </Tooltip.Content>

                                    </Tooltip.Positioner>

                                </Tooltip.Root>
                            )
                        )}

                    </HStack>

                </Flex>

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

                        {/* EXPANDABLE SEARCH */}

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
                                    color: "#94A3B8",
                                }}
                                _hover={{
                                    bg: "rgba(99,102,241,0.08)",
                                    color: "#6366F1",
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
                                transition="all 0.3s ease"
                                w={
                                    searchOpen
                                        ? "240px"
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
                                    w="240px"
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
                                        bg: "#111827",
                                        borderColor: "rgba(148,163,184,0.22)",
                                        color: "#F8FAFC",
                                        _placeholder: {
                                            color: "#94A3B8",
                                        },
                                    }}
                                />

                            </Box>

                        </HStack>

                        {/* STATUS BADGE */}

                        {isCustomFilter ? (

                            <Badge
                                px={3}
                                py={1}
                                borderRadius="full"
                                bg="rgba(245,158,11,0.15)"
                                color="#F59E0B"
                                _dark={{
                                    bg: "rgba(245,158,11,0.22)",
                                    color: "#FBBF24",
                                }}
                                fontSize="xs"
                                fontWeight="600"
                            >
                                Custom Week
                            </Badge>
                        ) : (

                            <Badge
                                px={3}
                                py={1}
                                borderRadius="full"
                                bg="rgba(16,185,129,0.12)"
                                color="#10B981"
                                _dark={{
                                    bg: "rgba(16,185,129,0.18)",
                                    color: "#34D399",
                                }}
                                fontSize="xs"
                                fontWeight="600"
                            >
                                Current Week
                            </Badge>
                        )}

                    </HStack>

                    <Button
                        size="sm"
                        variant="ghost"
                        borderRadius="full"
                        color="#64748B"
                        _dark={{
                            color: "#94A3B8",
                        }}
                        _hover={{
                            bg: "rgba(99,102,241,0.08)",
                            color: "#6366F1",
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

                </Flex>

                {/* MAIN CONTENT */}

                <Grid
                    templateColumns={{
                        base: "1fr",
                        lg: "7fr 5fr",
                    }}
                    gap={6}
                    flex="1"
                    overflow="hidden"
                    alignItems="stretch"
                >

                    {/* LEFT: HABITS */}

                    <Box
                        overflowY="auto"
                        pr={2}
                        pb={4}
                    >

                        {/* LOADING */}

                        {habitsLoading && (
                            <Grid
                                templateColumns={{
                                    base:
                                        "repeat(2,1fr)",
                                    lg:
                                        "repeat(2,1fr)",
                                    "2xl":
                                        "repeat(3,1fr)",
                                }}
                                gap={5}
                                mb={12}
                            >

                                {[1, 2, 3, 4]
                                    .map(item => (
                                        <Box
                                            key={item}
                                            p={5}
                                            minH="180px"
                                            borderRadius="3xl"
                                            border="1px solid"
                                            borderColor="
                                                rgba(148,163,184,0.22)
                                            "
                                            bg="white"
                                            _dark={{
                                                bg:
                                                    "#111827",
                                            }}
                                        >

                                            <Skeleton
                                                h="22px"
                                                mb={4}
                                            />

                                            <SkeletonText
                                                noOfLines={3}
                                                mb={6}
                                            />

                                        </Box>
                                    ))}

                            </Grid>
                        )}

                        {/* EMPTY */}

                        {!habitsLoading &&
                            habits.length === 0 && (

                                <VStack py={24}>

                                    <Heading
                                        size="lg"
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
                                    >
                                        Start building
                                        consistency today.
                                    </Text>

                                </VStack>
                            )}

                        {/* HABITS */}

                        {!habitsLoading &&
                            habits.length > 0 && (

                                <Grid
                                    templateColumns={{
                                        base:
                                            "repeat(2,1fr)",
                                        lg:
                                            "repeat(2,1fr)",
                                        "2xl":
                                            "repeat(3,1fr)",
                                    }}
                                    gap={5}
                                    mb={12}
                                >

                            {habits.map(habit => {

                                const isCompletedSelected =
                                    habit.habitLogs.some(
                                        l =>
                                            l.date ===
                                            selectedDate
                                    );

                                const scheduleColors =
                                    scheduleTypeColor(
                                        habit.schedule.type
                                    );

                                return (

                                    <Tooltip.Root
                                        key={habit.id}
                                    >

                                        <Tooltip.Trigger
                                            asChild
                                        >

                                            <Box
                                                position="relative"
                                                p={5}
                                                minH="180px"
                                                borderRadius="3xl"
                                                border="1px solid"
                                                borderColor={
                                                    isCompletedSelected
                                                        ? "rgba(16,185,129,0.16)"
                                                        : "rgba(148,163,184,0.22)"
                                                }
                                                bg={
                                                    isCompletedSelected
                                                        ? "rgba(16,185,129,0.08)"
                                                        : "white"
                                                }
                                                boxShadow={
                                                    isCompletedSelected
                                                        ? "0 0 0 1px rgba(16,185,129,0.16)"
                                                        : "none"
                                                }
                                                cursor="pointer"
                                                overflow="hidden"
                                                transition="0.25s"
                                                _hover={{
                                                    transform:
                                                        "translateY(-4px)",
                                                }}
                                                _dark={{
                                                    bg:
                                                        isCompletedSelected
                                                            ? "rgba(16,185,129,0.08)"
                                                            : "#111827",
                                                }}
                                            >

                                                <Box
                                                    position="absolute"
                                                    top="-40px"
                                                    right="-40px"
                                                    w="120px"
                                                    h="120px"
                                                    bg={
                                                        isCompletedSelected
                                                            ? "#10B981"
                                                            : "#6366F1"
                                                    }
                                                    opacity="0.08"
                                                    borderRadius="full"
                                                    filter="blur(40px)"
                                                />

                                                <Flex
                                                    direction="column"
                                                    justify="space-between"
                                                    h="full"
                                                >

                                                    <Box>

                                                        <Heading
                                                            size="sm"
                                                            mb={3}
                                                            color="#0F172A"
                                                            _dark={{
                                                                color:
                                                                    "#F8FAFC",
                                                            }}
                                                            truncate
                                                            title={habit.name}
                                                        >
                                                            {habit.name}
                                                        </Heading>

                                                        <Text
                                                            fontSize="sm"
                                                            lineClamp={4}
                                                            color="#64748B"
                                                            _dark={{
                                                                color:
                                                                    "#94A3B8",
                                                            }}
                                                        >
                                                            {habit.description}
                                                        </Text>

                                                    </Box>

                                                    <Flex
                                                        align="center"
                                                        justify="space-between"
                                                    >

                                                        <Badge
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                            bg={
                                                                scheduleColors.bg
                                                            }
                                                            color={
                                                                scheduleColors.color
                                                            }
                                                        >
                                                            {scheduleTypeLabel(
                                                                habit.schedule.type
                                                            )}
                                                        </Badge>

                                                        <Badge
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                            bg={
                                                                isCompletedSelected
                                                                    ? "rgba(16,185,129,0.12)"
                                                                    : "rgba(245,158,11,0.12)"
                                                            }
                                                            color={
                                                                isCompletedSelected
                                                                    ? "#10B981"
                                                                    : "#F59E0B"
                                                            }
                                                        >
                                                            {isCompletedSelected
                                                                ? "Completed"
                                                                : "Pending"}
                                                        </Badge>

                                                    </Flex>

                                                </Flex>

                                                <IconButton
                                                    aria-label="complete"
                                                    size="sm"
                                                    position="absolute"
                                                    top={4}
                                                    right={4}
                                                    borderRadius="full"
                                                    bg={
                                                        isCompletedSelected
                                                            ? "#10B981"
                                                            : "rgba(245,158,11,0.12)"
                                                    }
                                                    color={
                                                        isCompletedSelected
                                                            ? "white"
                                                            : "#F59E0B"
                                                    }
                                                    loading={
                                                        togglingIds.has(
                                                            habit.id
                                                        )
                                                    }
                                                    onClick={() =>
                                                        toggleHabitLog(
                                                            habit.id
                                                        )
                                                    }
                                                >
                                                    <LuCircleCheckBig />
                                                </IconButton>

                                            </Box>

                                        </Tooltip.Trigger>

                                        <Tooltip.Positioner>

                                            <Tooltip.Content
                                                bg="#111827"
                                                color="white"
                                                borderRadius="xl"
                                                px={4}
                                                py={2}
                                                fontSize="sm"
                                            >
                                                Mark habit as
                                                complete
                                            </Tooltip.Content>

                                        </Tooltip.Positioner>

                                    </Tooltip.Root>
                                );
                            })}

                            {/* CREATE HABIT CARD */}

                            <CreateHabitDialog
                                onSuccess={refetch}
                                trigger={(

                                    <Box
                                        position="relative"
                                        p={5}
                                        minH="180px"
                                        borderRadius="3xl"
                                        border="1px dashed"
                                        borderColor="rgba(99,102,241,0.30)"
                                        bg="transparent"
                                        cursor="pointer"
                                        overflow="hidden"
                                        transition="0.25s"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        _hover={{
                                            bg: "rgba(99,102,241,0.04)",
                                            borderColor:
                                                "#6366F1",
                                            transform:
                                                "translateY(-4px)",
                                        }}
                                        _dark={{
                                            borderColor:
                                                "rgba(99,102,241,0.35)",
                                            _hover: {
                                                bg: "rgba(99,102,241,0.06)",
                                            },
                                        }}
                                    >

                                        <VStack
                                            gap={3}
                                            align="center"
                                        >

                                            <Box
                                                w="48px"
                                                h="48px"
                                                borderRadius="full"
                                                bg="rgba(99,102,241,0.10)"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                color="#6366F1"
                                            >
                                                <LuPlus
                                                    size={24}
                                                />
                                            </Box>

                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="#6366F1"
                                            >
                                                Create Habit
                                            </Text>

                                        </VStack>

                                    </Box>
                                )}
                            />

                        </Grid>
                    )}

                    </Box>

                    {/* RIGHT: ANALYTICS */}

                    <Box
                        overflowY="auto"
                        pr={2}
                        pb={4}
                    >

                        <Box
                            p={7}
                            borderRadius="3xl"
                            border="1px solid"
                            borderColor="rgba(148,163,184,0.22)"
                            bg="white"
                            _dark={{
                                bg: "#111827",
                            }}
                        >

                    {/* HEADER + TOGGLE */}

                    <Flex
                        justify="space-between"
                        align="center"
                        mb={8}
                        flexWrap="wrap"
                        gap={4}
                    >

                        <Heading
                            size="md"
                            color="#0F172A"
                            _dark={{
                                color:
                                    "#F8FAFC",
                            }}
                        >
                            Analytics Overview
                        </Heading>

                        <HStack gap={1}>

                            <Button
                                size="sm"
                                borderRadius="full"
                                px={4}
                                py={1.5}
                                fontSize="sm"
                                fontWeight="600"
                                bg={
                                    analyticsView ===
                                    "weekly"
                                        ? "#6366F1"
                                        : "transparent"
                                }
                                color={
                                    analyticsView ===
                                    "weekly"
                                        ? "white"
                                        : "#64748B"
                                }
                                _dark={{
                                    color:
                                        analyticsView ===
                                            "weekly"
                                            ? "white"
                                            : "#94A3B8",
                                }}
                                border="1px solid"
                                borderColor={
                                    analyticsView ===
                                    "weekly"
                                        ? "#6366F1"
                                        : "rgba(148,163,184,0.24)"
                                }
                                _hover={{
                                    borderColor:
                                        "#6366F1",
                                }}
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
                                size="sm"
                                borderRadius="full"
                                px={4}
                                py={1.5}
                                fontSize="sm"
                                fontWeight="600"
                                bg={
                                    analyticsView ===
                                    "monthly"
                                        ? "#6366F1"
                                        : "transparent"
                                }
                                color={
                                    analyticsView ===
                                    "monthly"
                                        ? "white"
                                        : "#64748B"
                                }
                                _dark={{
                                    color:
                                        analyticsView ===
                                            "monthly"
                                            ? "white"
                                            : "#94A3B8",
                                }}
                                border="1px solid"
                                borderColor={
                                    analyticsView ===
                                    "monthly"
                                        ? "#6366F1"
                                        : "rgba(148,163,184,0.24)"
                                }
                                _hover={{
                                    borderColor:
                                        "#6366F1",
                                }}
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
                                mb={8}
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
                                        gap={0}
                                        align="center"
                                    >

                                        <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            color="#0F172A"
                                            _dark={{
                                                color:
                                                    "#F8FAFC",
                                            }}
                                        >
                                            {from} — {to}
                                        </Text>

                                        <Text
                                            fontSize="xs"
                                            color="#64748B"
                                            _dark={{
                                                color:
                                                    "#94A3B8",
                                            }}
                                        >
                                            Selected: {selectedDate}
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
                                    h="220px"
                                    gap={4}
                                >

                                    {weeklyProgress.map(
                                        (
                                            height,
                                            index
                                        ) => (

                                            <Tooltip.Root
                                                key={index}
                                            >

                                                <Tooltip.Trigger
                                                    asChild
                                                >

                                                    <Box
                                                        flex="1"
                                                        h={`${height}%`}
                                                        borderRadius="2xl"
                                                        bg={
                                                            height >= 80
                                                                ? "#10B981"
                                                                : height >= 50
                                                                    ? "#6366F1"
                                                                    : "#F59E0B"
                                                        }
                                                        transition="0.3s"
                                                        position="relative"
                                                        cursor="pointer"
                                                    >

                                                        {height > 0 && (

                                                            <Text
                                                                position="absolute"
                                                                top="8px"
                                                                left="50%"
                                                                transform="translateX(-50%)"
                                                                fontSize="10px"
                                                                fontWeight="700"
                                                                color="white"
                                                            >
                                                                {height}%
                                                            </Text>
                                                        )}

                                                        <Text
                                                            position="absolute"
                                                            bottom="-24px"
                                                            left="50%"
                                                            transform="translateX(-50%)"
                                                            fontSize="10px"
                                                            color="#64748B"
                                                            _dark={{
                                                                color:
                                                                    "#94A3B8",
                                                            }}
                                                            textTransform="uppercase"
                                                            letterSpacing="0.08em"
                                                        >
                                                            {
                                                                [
                                                                    "Mon",
                                                                    "Tue",
                                                                    "Wed",
                                                                    "Thu",
                                                                    "Fri",
                                                                    "Sat",
                                                                    "Sun",
                                                                ][index]
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
                                                            analyticsWeekDays[index]
                                                        }
                                                        : {
                                                            height
                                                        }%
                                                    </Tooltip.Content>

                                                </Tooltip.Positioner>

                                            </Tooltip.Root>
                                        )
                                    )}

                                </HStack>

                            </VStack>
                        )}

                    {/* MONTHLY VIEW */}

                    {analyticsView ===
                        "monthly" && (

                            <Grid
                                templateColumns="repeat(7, 1fr)"
                                gap={2}
                                mb={8}
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
                                    )
                                )}

                                {monthlyDays.map(
                                    (
                                        day,
                                        index
                                    ) => {

                                        if (!day) {

                                            return (

                                                <Box
                                                    key={`empty-${index}`}
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
                                                        borderRadius="xl"
                                                        bg={colors.bg}
                                                        _dark={{
                                                            bg: colors._dark_bg,
                                                        }}
                                                        cursor="pointer"
                                                        transition="0.2s"
                                                        _hover={{
                                                            transform:
                                                                "scale(1.1)",
                                                        }}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        onClick={() => {

                                                            const week =
                                                                getWeekBoundsForDate(
                                                                    day.date
                                                                );

                                                            setSelectedDate(
                                                                day.date
                                                            );
                                                            setFrom(week.from);
                                                            setTo(week.to);
                                                            setAnalyticsView(
                                                                "weekly"
                                                            );
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
                                                        : {
                                                            day.rate
                                                        }%
                                                    </Tooltip.Content>

                                                </Tooltip.Positioner>

                                            </Tooltip.Root>
                                        );
                                    }
                                )}

                            </Grid>
                        )}

                    {/* STATS */}

                    <VStack
                        align="stretch"
                        gap={6}
                        mb={8}
                    >

                        {analytics.map(
                            item => (

                                <Box
                                    key={item.label}
                                >

                                    <Flex
                                        justify="space-between"
                                        mb={3}
                                    >

                                        <Text
                                            color="#64748B"
                                            _dark={{
                                                color:
                                                    "#94A3B8",
                                            }}
                                        >
                                            {
                                                item.label
                                            }
                                        </Text>

                                        <Text
                                            fontWeight="700"
                                            color={item.color}
                                        >
                                            {
                                                item.value
                                            }
                                        </Text>

                                    </Flex>

                                    <Box
                                        h="10px"
                                        borderRadius="full"
                                        overflow="hidden"
                                        bg="rgba(99,102,241,0.08)"
                                        _dark={{
                                            bg: "rgba(99,102,241,0.12)",
                                        }}
                                    >

                                        <Box
                                            h="full"
                                            w={item.value}
                                            bg={item.color}
                                            borderRadius="full"
                                            transition="0.3s"
                                        />

                                    </Box>

                                </Box>
                            )
                        )}

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
                            color: "#818CF8",
                        }}
                        color="#6366F1"
                        fontWeight="600"
                        fontSize="sm"
                        gap={2}
                        transition="0.2s"
                        _hover={{
                            bg: "rgba(99,102,241,0.06)",
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
}

export default Dashboard;