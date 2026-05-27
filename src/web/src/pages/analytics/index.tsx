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
    LuCalendarCheck,
    LuTrendingUp,
} from "react-icons/lu";

import Link
    from "next/link";

import UserNavbar
    from "@/components/Navbar/UserNavbar";

import Footer
    from "@/components/Footer";

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

import MiniCalendar
    from "@/components/MiniCalendar";

const StatPill = ({
    icon,
    label,
    value,
    accent,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    accent: string;
}) => (
    <HStack
        gap={3}
        px={4}
        py={3}
        borderRadius="xl"
        bg="white"
        border="1px solid"
        borderColor="rgba(148,163,184,0.14)"
        flex="1"
        minW="140px"
        _dark={{
            bg: "#111827",
            borderColor:
                "rgba(255,255,255,0.06)",
        }}
    >
        <Box
            p={2}
            borderRadius="lg"
            bg={`${accent}14`}
            color={accent}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
        >
            {icon}
        </Box>

        <VStack
            gap={0}
            align="start"
        >
            <Text
                fontSize="sm"
                fontWeight="700"
                color="#0F172A"
                _dark={{
                    color:
                        "#F8FAFC",
                }}
                lineHeight="1.2"
            >
                {value}
            </Text>
            <Text
                fontSize="xs"
                color="#64748B"
                _dark={{
                    color:
                        "#94A3B8",
                }}
            >
                {label}
            </Text>
        </VStack>
    </HStack>
);

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
            borderColor="rgba(148,163,184,0.14)"
            bg="white"
            _dark={{
                bg: "#111827",
                borderColor:
                    "rgba(255,255,255,0.06)",
            }}
        >
            <HStack
                gap={2}
                mb={6}
            >
                <Box
                    p={2}
                    borderRadius="xl"
                    bg="rgba(99,102,241,0.10)"
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
                h="140px"
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
                                bg="#6366F1"
                                opacity={
                                    week.count > 0
                                        ? 1
                                        : 0.2
                                }
                                transition="0.3s"
                                h={`${Math.max(
                                    pct,
                                    4
                                )}%`}
                                position="relative"
                            >
                                <Box
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    right="0"
                                    h="35%"
                                    borderRadius="lg"
                                    bg="linear-gradient(180deg, rgba(255,255,255,0.18), transparent)"
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
        "rgba(148,163,184,0.10)",
        "rgba(16,185,129,0.18)",
        "rgba(16,185,129,0.32)",
        "rgba(16,185,129,0.48)",
        "rgba(16,185,129,0.64)",
        "rgba(16,185,129,0.82)",
    ];

    const darkLevels = [
        "rgba(148,163,184,0.10)",
        "rgba(16,185,129,0.14)",
        "rgba(16,185,129,0.28)",
        "rgba(16,185,129,0.42)",
        "rgba(16,185,129,0.58)",
        "rgba(16,185,129,0.74)",
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
            borderColor="rgba(148,163,184,0.14)"
            bg="white"
            _dark={{
                bg: "#111827",
                borderColor:
                    "rgba(255,255,255,0.06)",
            }}
        >
            <HStack
                gap={2}
                mb={4}
            >
                <Box
                    p={2}
                    borderRadius="xl"
                    bg="rgba(16,185,129,0.10)"
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
            borderColor="rgba(148,163,184,0.14)"
            bg="white"
            _dark={{
                bg: "#111827",
                borderColor:
                    "rgba(255,255,255,0.06)",
            }}
        >
            <HStack
                gap={2}
                mb={5}
            >
                <Box
                    p={2}
                    borderRadius="xl"
                    bg="rgba(245,158,11,0.10)"
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
                        bg="rgba(148,163,184,0.04)"
                        _dark={{
                            bg:
                                "rgba(148,163,184,0.06)",
                        }}
                    >
                        <Box
                            w="28px"
                            h="28px"
                            borderRadius="full"
                            bg="#6366F1"
                            color="white"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="xs"
                            fontWeight="700"
                            flexShrink={0}
                        >
                            {i + 1}
                        </Box>

                        <VStack
                            gap={0}
                            align="start"
                            flex="1"
                            minW={0}
                        >
                            <Text
                                fontWeight="600"
                                fontSize="sm"
                                color="#0F172A"
                                _dark={{
                                    color:
                                        "#F8FAFC",
                                }}
                                truncate
                            >
                                {s.habit.name}
                            </Text>

                            <HStack gap={3}>
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

                        <HStack
                            gap={1.5}
                            px={2.5}
                            py={1}
                            borderRadius="full"
                            bg="rgba(16,185,129,0.08)"
                            _dark={{
                                bg:
                                    "rgba(16,185,129,0.12)",
                            }}
                            fontSize="xs"
                            fontWeight="600"
                            flexShrink={0}
                        >
                            <LuCalendarCheck
                                size={12}
                                color="#10B981"
                            />

                            <Text
                                color="#10B981"
                                _dark={{
                                    color: "#34D399",
                                }}
                                fontSize="xs"
                                fontWeight="600"
                            >
                                {s.thisWeekLogs}
                                {" "}this week
                            </Text>
                        </HStack>
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
};

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
                currentTime={new Date()}
                logout={logout}
            />

            <Box
                px={{
                    base: 4,
                    md: 8,
                    lg: 10,
                }}
                pt={{ base: 6, md: 8 }}
                pb={4}
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
                                bg:
                                    "rgba(99,102,241,0.08)",
                                color:
                                    "#6366F1",
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
                        bg="#6366F1"
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

            <Box
                px={{
                    base: 4,
                    md: 8,
                    lg: 10,
                }}
                pb={10}
            >
                {/* STATS */}
                {isLoading && (
                    <HStack
                        gap={3}
                        mb={8}
                        flexWrap="wrap"
                    >
                        {[1, 2, 3, 4, 5, 6].map(
                            i => (
                                <Skeleton
                                    key={i}
                                    h="64px"
                                    borderRadius="xl"
                                    flex="1"
                                    minW="140px"
                                />
                            )
                        )}
                    </HStack>
                )}

                {!isLoading &&
                    globalStats && (
                        <HStack
                            gap={3}
                            mb={8}
                            flexWrap="wrap"
                        >
                            <StatPill
                                icon={
                                    <LuLayers
                                        size={16}
                                    />
                                }
                                label="Total Habits"
                                value={String(
                                    globalStats.totalHabits
                                )}
                                accent="#6366F1"
                            />

                            <StatPill
                                icon={
                                    <LuActivity
                                        size={16}
                                    />
                                }
                                label="Total Logs"
                                value={String(
                                    globalStats.totalLogs
                                )}
                                accent="#10B981"
                            />

                            <StatPill
                                icon={
                                    <LuCalendarDays
                                        size={16}
                                    />
                                }
                                label="This Week"
                                value={String(
                                    globalStats.thisWeekLogs
                                )}
                                accent="#F59E0B"
                            />

                            <StatPill
                                icon={
                                    <LuFlame
                                        size={16}
                                    />
                                }
                                label="Best Streak"
                                value={`${globalStats.bestStreak}d`}
                                accent="#EF4444"
                            />

                            <StatPill
                                icon={
                                    <LuTrendingUp
                                        size={16}
                                    />
                                }
                                label="Avg / Day"
                                value={String(
                                    globalStats.avgLogsPerDay
                                )}
                                accent="#8B5CF6"
                            />

                            <StatPill
                                icon={
                                    <LuChartBar
                                        size={16}
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
                        </HStack>
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
                                    h="240px"
                                    borderRadius="2xl"
                                />
                                <Skeleton
                                    h="240px"
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

                    <VStack
                        gap={6}
                        align="stretch"
                    >
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

                        <Box>
                            {isLoading ? (
                                <Skeleton
                                    h="260px"
                                    borderRadius="2xl"
                                />
                            ) : (
                                <MiniCalendar
                                    habits={habits}
                                />
                            )}
                        </Box>
                    </VStack>
                </Grid>
            </Box>

            <Footer />
        </Box>
    );
};

export default AnalyticsPage;
