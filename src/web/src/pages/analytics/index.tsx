"use client";

import {
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    HStack,
    Text,
    VStack,
    Skeleton,
} from "@chakra-ui/react";

import {
    LuArrowLeft,
    LuChartBar,
    LuFlame,
    LuLayers,
    LuActivity,
    LuCalendarDays,
    LuTrendingUp,
} from "react-icons/lu";

import Link
    from "next/link";

import UserNavbar
    from "@/components/Navbar/UserNavbar";

import useAuthenticateUser
    from "@/hooks/useAuthenticateUser";

import useHabits
    from "@/hooks/useHabits";

import {
    getGlobalStats,
    getWeeklyTrend,
    getHeatmapData,
    getHabitStats,
    HeatmapDay,
    WeekTrend,
    HabitStat,
    addDays,
    getDateKey,
} from "@/lib/analytics";

// ========================================
// STAT CARD
// ========================================

const StatCard = ({
    icon,
    label,
    value,
    accent,
    sub,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    accent: string;
    sub?: string;
}) => (

    <Box
        p={5}
        borderRadius="2xl"
        border="1px solid"
        borderColor="rgba(148,163,184,0.22)"
        bg="white"
        _dark={{
            bg: "#111827",
        }}
        transition="0.2s"
        _hover={{
            borderColor: `${accent}44`,
        }}
    >

        <HStack
            gap={3}
            mb={3}
        >

            <Box
                p={2}
                borderRadius="xl"
                bg={`${accent}14`}
                color={accent}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {icon}
            </Box>

            <Text
                fontSize="sm"
                color="#64748B"
                _dark={{
                    color: "#94A3B8",
                }}
                fontWeight="500"
            >
                {label}
            </Text>

        </HStack>

        <Heading
            size="lg"
            color="#0F172A"
            _dark={{
                color: "#F8FAFC",
            }}
            mb={1}
        >
            {value}
        </Heading>

        {sub && (

            <Text
                fontSize="xs"
                color="#64748B"
                _dark={{
                    color: "#94A3B8",
                }}
            >
                {sub}
            </Text>
        )}

    </Box>
);

// ========================================
// TREND BARS
// ========================================

const TrendChart = ({
    data,
}: {
    data: WeekTrend[];
}) => {

    const maxCount = Math.max(
        1,
        ...data.map(d => d.count)
    );

    return (

        <Box
            p={6}
            borderRadius="2xl"
            border="1px solid"
            borderColor="rgba(148,163,184,0.22)"
            bg="white"
            _dark={{
                bg: "#111827",
            }}
        >

            <HStack
                gap={2}
                mb={6}
            >

                <Box
                    p={2}
                    borderRadius="xl"
                    bg="rgba(99,102,241,0.12)"
                    color="#6366F1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <LuTrendingUp
                        size={18}
                    />
                </Box>

                <Text
                    fontWeight="600"
                    color="#0F172A"
                    _dark={{
                        color: "#F8FAFC",
                    }}
                >
                    Weekly Activity
                </Text>

            </HStack>

            <Flex
                align="flex-end"
                justify="space-between"
                gap={3}
                h="160px"
            >

                {data.map((
                    week,
                    i
                ) => {

                    const pct =
                        (week.count /
                            maxCount) *
                        100;

                    return (

                        <VStack
                            key={i}
                            gap={2}
                            flex="1"
                            align="center"
                            justify="flex-end"
                            minW="40px"
                        >

                            <Text
                                fontSize="xs"
                                fontWeight="600"
                                color="#0F172A"
                                _dark={{
                                    color:
                                        "#F8FAFC",
                                }}
                            >
                                {week.count}
                            </Text>

                            <Box
                                w="100%"
                                maxW="36px"
                                borderRadius="lg"
                                bg="linear-gradient(180deg, #6366F1, #818CF8)"
                                opacity={
                                    week.count > 0
                                        ? 1
                                        : 0.25
                                }
                                transition="0.3s"
                                h={`${Math.max(
                                    pct,
                                    4
                                )}%`}
                                position="relative"
                                _dark={{
                                    bg: "linear-gradient(180deg, #6366F1, #818CF8)",
                                }}
                            >

                                <Box
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    right="0"
                                    h="40%"
                                    borderRadius="lg"
                                    bg="linear-gradient(180deg, rgba(255,255,255,0.20), transparent)"
                                />

                            </Box>

                            <Text
                                fontSize="10px"
                                color="#64748B"
                                _dark={{
                                    color:
                                        "#94A3B8",
                                }}
                                textAlign="center"
                                whiteSpace="nowrap"
                            >
                                {week.label}
                            </Text>

                        </VStack>
                    );
                })}

            </Flex>

        </Box>
    );
};

// ========================================
// HEATMAP
// ========================================

const Heatmap = ({
    data,
}: {
    data: HeatmapDay[];
}) => {

    const maxCount = Math.max(
        1,
        ...data.map(d => d.count)
    );

    const levels = [
        "transparent",
        "#BBF7D0",
        "#86EFAC",
        "#4ADE80",
        "#22C55E",
        "#16A34A",
    ];

    const darkLevels = [
        "transparent",
        "rgba(34,197,94,0.18)",
        "rgba(34,197,94,0.35)",
        "rgba(34,197,94,0.55)",
        "rgba(34,197,94,0.75)",
        "rgba(34,197,94,0.95)",
    ];

    const getLevel = (
        count: number
    ) => {

        if (count === 0)
            return 0;

        const ratio =
            count / maxCount;

        if (ratio <= 0.2)
            return 1;

        if (ratio <= 0.4)
            return 2;

        if (ratio <= 0.6)
            return 3;

        if (ratio <= 0.8)
            return 4;

        return 5;
    };

    const weeks: HeatmapDay[][] = [];

    let currentWeek: HeatmapDay[] = [];

    const firstDate = parseDateKey(
        data[0].date
    );

    const startDay = firstDate.getDay();

    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        currentWeek.push({
            date: "",
            count: -1,
        });
    }

    for (const day of data) {

        currentWeek.push(day);

        if (
            currentWeek.length === 7
        ) {

            weeks.push(currentWeek);

            currentWeek = [];
        }
    }

    if (currentWeek.length > 0) {

        while (
            currentWeek.length < 7
        ) {

            currentWeek.push({
                date: "",
                count: -1,
            });
        }

        weeks.push(currentWeek);
    }

    const dayLabels = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ];

    return (

        <Box
            p={6}
            borderRadius="2xl"
            border="1px solid"
            borderColor="rgba(148,163,184,0.22)"
            bg="white"
            _dark={{
                bg: "#111827",
            }}
        >

            <HStack
                gap={2}
                mb={4}
            >

                <Box
                    p={2}
                    borderRadius="xl"
                    bg="rgba(16,185,129,0.12)"
                    color="#10B981"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <LuCalendarDays
                        size={18}
                    />
                </Box>

                <Text
                    fontWeight="600"
                    color="#0F172A"
                    _dark={{
                        color: "#F8FAFC",
                    }}
                >
                    Activity Heatmap
                </Text>

                <Text
                    fontSize="xs"
                    color="#64748B"
                    _dark={{
                        color: "#94A3B8",
                    }}
                    ml="auto"
                >
                    Last 90 days
                </Text>

            </HStack>

            <Flex
                gap={1}
                overflowX="auto"
                pb={2}
            >

                <VStack
                    gap={1}
                    mr={1}
                >

                    <Box h="16px" />

                    {dayLabels.map((
                        label,
                        i
                    ) => (

                        <Text
                            key={label}
                            fontSize="9px"
                            color="#64748B"
                            _dark={{
                                color:
                                    "#94A3B8",
                            }}
                            w="16px"
                            h="16px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            {i % 2 === 0
                                ? label[0]
                                : ""}
                        </Text>
                    ))}

                </VStack>

                {weeks.map((
                    week,
                    wi
                ) => (

                    <VStack
                        key={wi}
                        gap={1}
                    >

                        {week.map((
                            day,
                            di
                        ) => {

                            const level =
                                getLevel(
                                    day.count
                                );

                            const isEmpty =
                                day.count < 0;

                            return (

                                <Box
                                    key={di}
                                    w="16px"
                                    h="16px"
                                    borderRadius="sm"
                                    bg={
                                        isEmpty
                                            ? "transparent"
                                            : levels[level]
                                    }
                                    _dark={{
                                        bg: isEmpty
                                            ? "transparent"
                                            : darkLevels[level],
                                    }}
                                    title={
                                        day.date
                                            ? `${day.date}: ${day.count} logs`
                                            : ""
                                    }
                                    cursor={
                                        day.date
                                            ? "pointer"
                                            : "default"
                                    }
                                    transition="0.15s"
                                    _hover={
                                        day.date
                                            ? {
                                                transform:
                                                    "scale(1.15)",
                                                zIndex: 1,
                                            }
                                            : undefined
                                    }
                                />
                            );
                        })}

                    </VStack>
                ))}

            </Flex>

            <HStack
                gap={2}
                mt={3}
                justify="flex-end"
            >

                <Text
                    fontSize="10px"
                    color="#64748B"
                    _dark={{
                        color: "#94A3B8",
                    }}
                >
                    Less
                </Text>

                {[
                    0, 1, 2, 3,
                    4, 5,
                ].map(l => (

                    <Box
                        key={l}
                        w="12px"
                        h="12px"
                        borderRadius="sm"
                        bg={levels[l]}
                        _dark={{
                            bg: darkLevels[l],
                        }}
                    />
                ))}

                <Text
                    fontSize="10px"
                    color="#64748B"
                    _dark={{
                        color: "#94A3B8",
                    }}
                >
                    More
                </Text>

            </HStack>

        </Box>
    );
};

const parseDateKey = (
    key: string
): Date => {

    const [
        y,
        m,
        day,
    ] = key.split("-").map(Number);

    return new Date(
        y,
        m - 1,
        day
    );
};

// ========================================
// HABIT RANKINGS
// ========================================

const HabitRankings = ({
    stats,
}: {
    stats: HabitStat[];
}) => {

    const sorted = [...stats].sort(
        (a, b) =>
            b.currentStreak -
            a.currentStreak
    );

    return (

        <Box
            p={6}
            borderRadius="2xl"
            border="1px solid"
            borderColor="rgba(148,163,184,0.22)"
            bg="white"
            _dark={{
                bg: "#111827",
            }}
        >

            <HStack
                gap={2}
                mb={5}
            >

                <Box
                    p={2}
                    borderRadius="xl"
                    bg="rgba(245,158,11,0.12)"
                    color="#F59E0B"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <LuFlame
                        size={18}
                    />
                </Box>

                <Text
                    fontWeight="600"
                    color="#0F172A"
                    _dark={{
                        color: "#F8FAFC",
                    }}
                >
                    Habit Rankings
                </Text>

            </HStack>

            <VStack
                gap={3}
                align="stretch"
            >

                {sorted.map((
                    s,
                    i
                ) => (

                    <HStack
                        key={s.habit.id}
                        gap={3}
                        p={3}
                        borderRadius="xl"
                        bg="rgba(148,163,184,0.06)"
                        _dark={{
                            bg: "rgba(148,163,184,0.08)",
                        }}
                    >

                        <Box
                            w="28px"
                            h="28px"
                            borderRadius="full"
                            bg="linear-gradient(135deg, #6366F1, #818CF8)"
                            color="white"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="xs"
                            fontWeight="700"
                        >
                            {i + 1}
                        </Box>

                        <VStack
                            gap={0}
                            align="start"
                            flex="1"
                        >

                            <Text
                                fontWeight="600"
                                fontSize="sm"
                                color="#0F172A"
                                _dark={{
                                    color:
                                        "#F8FAFC",
                                }}
                            >
                                {s.habit.name}
                            </Text>

                            <HStack
                                gap={3}
                            >

                                <Text
                                    fontSize="xs"
                                    color="#64748B"
                                    _dark={{
                                        color:
                                            "#94A3B8",
                                    }}
                                >
                                    {s.currentStreak}
                                    d streak
                                </Text>

                                <Text
                                    fontSize="xs"
                                    color="#64748B"
                                    _dark={{
                                        color:
                                            "#94A3B8",
                                    }}
                                >
                                    {s.totalLogs}{" "}
                                    total
                                </Text>

                            </HStack>

                        </VStack>

                        <Box
                            px={2}
                            py={1}
                            borderRadius="md"
                            bg="rgba(16,185,129,0.12)"
                            color="#10B981"
                            _dark={{
                                bg: "rgba(16,185,129,0.18)",
                                color: "#34D399",
                            }}
                            fontSize="xs"
                            fontWeight="600"
                        >
                            {s.thisWeekLogs}
                            this week
                        </Box>

                    </HStack>
                ))}

            </VStack>

        </Box>
    );
};

// ========================================
// PAGE
// ========================================

const AnalyticsPage = () => {

    const {
        user,
        loading: userLoading,
        logout,
    } = useAuthenticateUser();

    const {
        habits,
        loading: habitsLoading,
    } = useHabits();

    const isLoading =
        userLoading || habitsLoading;

    const globalStats = isLoading
        ? null
        : getGlobalStats(habits);

    const weeklyTrend = isLoading
        ? []
        : getWeeklyTrend(habits, 8);

    const heatmapData = isLoading
        ? []
        : getHeatmapData(habits, 90);

    const habitStats = isLoading
        ? []
        : getHabitStats(habits);

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
                currentTime={new Date()}
                logout={logout}
            />

            {/* HEADER */}

            <Box
                px={{
                    base: 6,
                    lg: 10,
                }}
                pt={6}
                pb={4}
                flexShrink={0}
            >

                <HStack
                    gap={4}
                    mb={4}
                >

                    <Link href="/dashboard">

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
                        >
                            <LuArrowLeft />
                            Dashboard
                        </Button>

                    </Link>

                </HStack>

                <HStack
                    gap={3}
                    align="center"
                >

                    <Box
                        p={2.5}
                        borderRadius="xl"
                        bg="linear-gradient(135deg, #6366F1, #818CF8)"
                        color="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <LuChartBar
                            size={22}
                        />
                    </Box>

                    <Heading
                        size="lg"
                        color="#0F172A"
                        _dark={{
                            color: "#F8FAFC",
                        }}
                    >
                        Analytics
                    </Heading>

                </HStack>

            </Box>

            {/* SCROLLABLE BODY */}

            <Box
                flex="1"
                overflowY="auto"
                px={{
                    base: 6,
                    lg: 10,
                }}
                pb={10}
            >

                {/* STATS */}

                {isLoading && (

                    <Grid
                        templateColumns={{
                            base:
                                "repeat(2,1fr)",
                            md:
                                "repeat(3,1fr)",
                            lg:
                                "repeat(6,1fr)",
                        }}
                        gap={4}
                        mb={8}
                    >

                        {[
                            1, 2, 3, 4,
                            5, 6,
                        ].map(i => (

                            <Skeleton
                                key={i}
                                h="100px"
                                borderRadius="2xl"
                            />
                        ))}

                    </Grid>
                )}

                {!isLoading &&
                    globalStats && (

                        <Grid
                            templateColumns={{
                                base:
                                    "repeat(2,1fr)",
                                md:
                                    "repeat(3,1fr)",
                                lg:
                                    "repeat(6,1fr)",
                            }}
                            gap={4}
                            mb={8}
                        >

                            <StatCard
                                icon={
                                    <LuLayers
                                        size={18}
                                    />
                                }
                                label="Total Habits"
                                value={String(
                                    globalStats.totalHabits
                                )}
                                accent="#6366F1"
                                sub={`${globalStats.activeHabits} active`}
                            />

                            <StatCard
                                icon={
                                    <LuActivity
                                        size={18}
                                    />
                                }
                                label="Total Logs"
                                value={String(
                                    globalStats.totalLogs
                                )}
                                accent="#10B981"
                            />

                            <StatCard
                                icon={
                                    <LuCalendarDays
                                        size={18}
                                    />
                                }
                                label="This Week"
                                value={String(
                                    globalStats.thisWeekLogs
                                )}
                                accent="#F59E0B"
                            />

                            <StatCard
                                icon={
                                    <LuFlame
                                        size={18}
                                    />
                                }
                                label="Best Streak"
                                value={`${globalStats.bestStreak}d`}
                                accent="#EF4444"
                            />

                            <StatCard
                                icon={
                                    <LuTrendingUp
                                        size={18}
                                    />
                                }
                                label="Avg / Day"
                                value={String(
                                    globalStats.avgLogsPerDay
                                )}
                                accent="#8B5CF6"
                            />

                            <StatCard
                                icon={
                                    <LuChartBar
                                        size={18}
                                    />
                                }
                                label="Active Rate"
                                value={`${Math.round(
                                    (globalStats.activeHabits /
                                        Math.max(
                                            1,
                                            globalStats.totalHabits
                                        )) *
                                        100
                                )}%`}
                                accent="#3B82F6"
                            />

                        </Grid>
                    )}

                {/* CHARTS + RANKINGS */}

                <Grid
                    templateColumns={{
                        base: "1fr",
                        lg: "5fr 4fr",
                    }}
                    gap={6}
                    alignItems="start"
                >

                    <VStack
                        gap={6}
                        align="stretch"
                    >

                        {isLoading ? (

                            <>

                                <Skeleton
                                    h="260px"
                                    borderRadius="2xl"
                                />

                                <Skeleton
                                    h="260px"
                                    borderRadius="2xl"
                                />

                            </>
                        ) : (

                            <>

                                <TrendChart
                                    data={weeklyTrend}
                                />

                                <Heatmap
                                    data={heatmapData}
                                />

                            </>
                        )}

                    </VStack>

                    <Box>

                        {isLoading ? (

                            <Skeleton
                                h="400px"
                                borderRadius="2xl"
                            />
                        ) : (

                            <HabitRankings
                                stats={habitStats}
                            />
                        )}

                    </Box>

                </Grid>

            </Box>

        </Box>
    );
};

export default AnalyticsPage;
