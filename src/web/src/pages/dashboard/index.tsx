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
    Skeleton,
    SkeletonText,
    Spinner,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";

import {
    LuChartNoAxesCombined,
    LuCircleCheckBig,
    LuRotateCcw,
} from "react-icons/lu";

import useAuthenticateUser
    from "@/hooks/useAuthenticateUser";

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

    const debouncedSearch =
        useDebounce(search, 400);

    // ========================================
    // DATA
    // ========================================

    const {
        habits,
        loading: habitsLoading,
        refetch,
    } = useHabits({
        from,
        to,
        search:
            debouncedSearch ||
            undefined,
    });

    // ========================================
    // FILTER HELPERS
    // ========================================

    const isCustomFilter =
        from !== week.from ||
        to !== week.to ||
        search !== "";

    const resetFilters = () => {

        setSearch("");
        setFrom(week.from);
        setTo(week.to);
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

    const formatDate = (
        date: Date
    ) =>
        date.toISOString()
            .split("T")[0];

    const todayString =
        formatDate(new Date());

    const totalHabits =
        habits.length;

    const completedToday =
        habits.filter(h =>
            h.habitLogs.some(
                l => l.date === todayString
            )
        ).length;

    const pendingToday =
        totalHabits -
        completedToday;

    const completionRate =
        totalHabits > 0
            ? Math.round(
                (completedToday /
                    totalHabits) *
                100
            )
            : 0;

    const getWeekDays =
        useCallback(() => {

            const now =
                new Date();

            const day =
                now.getDay();

            const diffToMonday =
                (day + 6) % 7;

            const days: string[] =
                [];

            for (
                let i = 0;
                i < 7;
                i++
            ) {

                const d =
                    new Date(now);

                d.setDate(
                    now.getDate() -
                    diffToMonday +
                    i
                );

                days.push(
                    formatDate(d)
                );
            }

            return days;

        }, []);

    const weekDays =
        useMemo(
            () =>
                getWeekDays(),
            [getWeekDays]
        );

    const weeklyProgress =
        useMemo(
            () =>
                weekDays.map(
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
                weekDays,
                totalHabits,
            ]
        );

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
            title: "Today's Habits",
            value: totalHabits
                .toString()
                .padStart(2, "0"),
            color: "#6366F1",
            bg: "rgba(99,102,241,0.10)",
        },
        {
            title: "Completed",
            value: completedToday
                .toString()
                .padStart(2, "0"),
            color: "#10B981",
            bg: "rgba(16,185,129,0.10)",
        },
        {
            title: "Pending",
            value: pendingToday
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

    const analytics = [
        {
            label: "Consistency",
            value: "82%",
            color: "#10B981",
        },
        {
            label: "Focus Score",
            value: "91%",
            color: "#6366F1",
        },
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            color: "#8B5CF6",
        },
    ];

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
            minH="100dvh"
            overflowY="auto"
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
                maxW="1600px"
                mx="auto"
                px={{
                    base: 6,
                    lg: 10,
                }}
                py={10}
            >

                {/* HERO */}

                <VStack
                    align="start"
                    gap={4}
                    mb={12}
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

                {/* STATS */}

                <Grid
                    templateColumns={{
                        base: "repeat(2,1fr)",
                        lg: "repeat(4,1fr)",
                    }}
                    gap={5}
                    mb={12}
                >

                    {statCards.map(stat => (

                        <Box
                            key={stat.title}
                            p={6}
                            borderRadius="3xl"
                            border="1px solid"
                            borderColor={stat.bg}
                            bg="white"
                            transition="0.25s"
                            _hover={{
                                transform:
                                    "translateY(-3px)",
                            }}
                            _dark={{
                                bg: "#111827",
                                borderColor:
                                    "rgba(148,163,184,0.22)",
                            }}
                        >

                            <Text
                                fontSize="xs"
                                textTransform="uppercase"
                                letterSpacing="0.12em"
                                color="#64748B"
                                mb={3}
                                _dark={{
                                    color:
                                        "#94A3B8",
                                }}
                            >
                                {stat.title}
                            </Text>

                            <Heading
                                fontSize={{
                                    base: "3xl",
                                    lg: "4xl",
                                }}
                                color={stat.color}
                            >
                                {stat.value}
                            </Heading>

                        </Box>
                    ))}

                </Grid>

                {/* FILTERS */}

                <Flex
                    mb={10}
                    align="center"
                    justify="space-between"
                    flexWrap="wrap"
                    gap={4}
                    p={5}
                    borderRadius="3xl"
                    border="1px solid"
                    borderColor={
                        isCustomFilter
                            ? "rgba(245,158,11,0.35)"
                            : "rgba(139,92,246,0.18)"
                    }
                    _dark={{
                        borderColor: isCustomFilter
                            ? "rgba(245,158,11,0.50)"
                            : "rgba(99,102,241,0.35)",
                        bg: isCustomFilter
                            ? "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.12))"
                            : "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))",
                    }}
                    bg={
                        isCustomFilter
                            ? "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.08))"
                            : "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))"
                    }
                    transition="0.3s"
                    position="relative"
                    overflow="hidden"
                >

                    {/* CUSTOM FILTER GLOW */}

                    {isCustomFilter && (

                        <Box
                            position="absolute"
                            top="-40px"
                            right="-40px"
                            w="160px"
                            h="160px"
                            bg="#F59E0B"
                            opacity="0.10"
                            borderRadius="full"
                            filter="blur(60px)"
                            pointerEvents="none"
                        />
                    )}

                    <HStack
                        gap={3}
                        flexWrap="wrap"
                        align="center"
                    >

                        <Input
                            placeholder="Search habits..."
                            size="sm"
                            borderRadius="full"
                            w="260px"
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

                        <Input
                            type="date"
                            size="sm"
                            borderRadius="full"
                            w="160px"
                            value={from}
                            onChange={(
                                e
                            ) =>
                                setFrom(
                                    e.target.value
                                )
                            }
                            borderColor="rgba(148,163,184,0.24)"
                            _dark={{
                                bg: "#111827",
                                borderColor: "rgba(148,163,184,0.22)",
                                color: "#F8FAFC",
                            }}
                        />

                        <Input
                            type="date"
                            size="sm"
                            borderRadius="full"
                            w="160px"
                            value={to}
                            onChange={(
                                e
                            ) =>
                                setTo(
                                    e.target.value
                                )
                            }
                            borderColor="rgba(148,163,184,0.24)"
                            _dark={{
                                bg: "#111827",
                                borderColor: "rgba(148,163,184,0.22)",
                                color: "#F8FAFC",
                            }}
                        />

                        {/* CUSTOM FILTER INDICATOR */}

                        {isCustomFilter && (

                            <HStack
                                gap={2}
                                align="center"
                            >

                                <Box
                                    w="8px"
                                    h="8px"
                                    borderRadius="full"
                                    bg="#F59E0B"
                                    boxShadow="0 0 8px rgba(245,158,11,0.6)"
                                    animation="pulse 2s infinite"
                                />

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
                                    Custom Filter
                                </Badge>

                            </HStack>
                        )}

                        {!isCustomFilter && (

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

                    <HStack
                        gap={3}
                    >

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

                        <CreateHabitDialog
                            onSuccess={
                                refetch
                            }
                        />

                    </HStack>

                </Flex>

                {/* LOADING */}

                {habitsLoading && (
                    <Grid
                        templateColumns={{
                            base:
                                "repeat(2,1fr)",
                            lg:
                                "repeat(3,1fr)",
                            "2xl":
                                "repeat(4,1fr)",
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
                                    "repeat(3,1fr)",
                                "2xl":
                                    "repeat(4,1fr)",
                            }}
                            gap={5}
                            mb={12}
                        >

                            {habits.map(habit => {

                                const isCompletedToday =
                                    habit.habitLogs.some(
                                        l =>
                                            l.date ===
                                            todayString
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
                                                    isCompletedToday
                                                        ? "rgba(16,185,129,0.16)"
                                                        : "rgba(148,163,184,0.22)"
                                                }
                                                bg={
                                                    isCompletedToday
                                                        ? "rgba(16,185,129,0.08)"
                                                        : "white"
                                                }
                                                boxShadow={
                                                    isCompletedToday
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
                                                        isCompletedToday
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
                                                        isCompletedToday
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
                                                                isCompletedToday
                                                                    ? "rgba(16,185,129,0.12)"
                                                                    : "rgba(245,158,11,0.12)"
                                                            }
                                                            color={
                                                                isCompletedToday
                                                                    ? "#10B981"
                                                                    : "#F59E0B"
                                                            }
                                                        >
                                                            {isCompletedToday
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
                                                        isCompletedToday
                                                            ? "#10B981"
                                                            : "rgba(245,158,11,0.12)"
                                                    }
                                                    color={
                                                        isCompletedToday
                                                            ? "white"
                                                            : "#F59E0B"
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

                        </Grid>
                    )}

                {/* ANALYTICS */}

                <Grid
                    templateColumns={{
                        base: "1fr",
                        lg: "repeat(2,1fr)",
                    }}
                    gap={6}
                >

                    {/* WEEKLY */}

                    <Box
                        p={7}
                        borderRadius="3xl"
                        border="1px solid"
                        borderColor="
                            rgba(148,163,184,0.22)
                        "
                        bg="white"
                        _dark={{
                            bg: "#111827",
                        }}
                    >

                        <Flex
                            justify="space-between"
                            align="center"
                            mb={8}
                        >

                            <Heading
                                size="md"
                                color="#0F172A"
                                _dark={{
                                    color:
                                        "#F8FAFC",
                                }}
                            >
                                Weekly Progress
                            </Heading>

                            <LuChartNoAxesCombined />

                        </Flex>

                        <HStack
                            align="end"
                            h="220px"
                            gap={4}
                        >

                            {weeklyProgress
                                .map((height, index) => (

                                    <Box
                                        key={index}
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
                                    />
                                ))}

                        </HStack>

                    </Box>

                    {/* ANALYTICS */}

                    <Box
                        p={7}
                        borderRadius="3xl"
                        border="1px solid"
                        borderColor="
                            rgba(148,163,184,0.22)
                        "
                        bg="white"
                        _dark={{
                            bg: "#111827",
                        }}
                    >

                        <Heading
                            size="md"
                            mb={8}
                            color="#0F172A"
                            _dark={{
                                color:
                                    "#F8FAFC",
                            }}
                        >
                            Analytics
                        </Heading>

                        <VStack
                            align="stretch"
                            gap={6}
                        >

                            {analytics.map(item => (

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
                                            {item.label}
                                        </Text>

                                        <Text
                                            fontWeight="700"
                                            color={item.color}
                                        >
                                            {item.value}
                                        </Text>

                                    </Flex>

                                    <Box
                                        h="10px"
                                        borderRadius="full"
                                        overflow="hidden"
                                        bg="
                                            rgba(99,102,241,0.08)
                                        "
                                    >

                                        <Box
                                            h="full"
                                            w={item.value}
                                            bg={item.color}
                                            borderRadius="full"
                                        />

                                    </Box>

                                </Box>
                            ))}

                        </VStack>

                    </Box>

                </Grid>

            </Box>

        </Box>
    );
};

export default Dashboard;