"use client";

import {
    Box,
    Grid,
    HStack,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";

import {
    Habit,
} from "@/types/habit";

// ========================================
// HELPERS
// ========================================

const getMonthDays = (
    year: number,
    month: number,
    habits: Habit[]
) => {
    const daysInMonth =
        new Date(year, month + 1, 0).getDate();

    const firstDay =
        new Date(year, month, 1);
    const firstDayOfWeek =
        (firstDay.getDay() + 6) % 7;

    const leadingEmpty = firstDayOfWeek;
    const trailingEmpty =
        (7 -
            ((leadingEmpty + daysInMonth) % 7)) %
        7;

    const totalHabits = habits.length;

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

        const completed = habits.reduce(
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
            totalHabits > 0
                ? Math.round(
                    (completed / totalHabits) *
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
};

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
// COMPONENT
// ========================================

type MiniCalendarProps = {
    habits: Habit[];
};

const MiniCalendar = ({
    habits,
}: MiniCalendarProps) => {
    const now = new Date();
    const months = [];

    for (let i = 2; i >= 0; i--) {
        const d = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
        );
        months.push({
            label: d.toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    year: "numeric",
                }
            ),
            days: getMonthDays(
                d.getFullYear(),
                d.getMonth(),
                habits
            ),
        });
    }

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
            <HStack gap={2} mb={4}>
                <Text
                    fontWeight="600"
                    color="#0F172A"
                    _dark={{
                        color: "#F8FAFC",
                    }}
                >
                    Quarter Overview
                </Text>
                <Text
                    fontSize="xs"
                    color="#64748B"
                    _dark={{
                        color: "#94A3B8",
                    }}
                    ml="auto"
                >
                    Last 3 months
                </Text>
            </HStack>

            <VStack align="stretch" gap={5}>
                {months.map(month => (
                    <Box key={month.label}>
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="#0F172A"
                            _dark={{
                                color: "#F8FAFC",
                            }}
                            mb={2}
                        >
                            {month.label}
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
                            ].map((label, i) => (
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
                            ))}

                            {month.days.map(
                                (day, index) => {
                                    if (!day) {
                                        return (
                                            <Box
                                                key={`${month.label}-e-${index}`}
                                                aspectRatio="1"
                                            />
                                        );
                                    }

                                    const colors =
                                        dayColor(day.rate);

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
                                                    cursor="default"
                                                    transition="0.2s"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
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
                                }
                            )}
                        </Grid>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default MiniCalendar;
