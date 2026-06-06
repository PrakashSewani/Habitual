"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Skeleton,
  Spinner,
  Tabs,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";

// ========================================
// SHIMMER LOADING COMPONENTS
// ========================================

const ShimmerBox = ({ height, width = "100%", borderRadius = "xl", mb = 0, flex = undefined, minW = undefined }: { height: string; width?: string; borderRadius?: string; mb?: number; flex?: number | string; minW?: string }) => (
  <Box
    h={height}
    w={width}
    borderRadius={borderRadius}
    mb={mb}
    flex={flex}
    minW={minW}
    bg="rgba(148,163,184,0.12)"
    _dark={{ bg: "rgba(148,163,184,0.08)" }}
    overflow="hidden"
    position="relative"
    style={{
      position: "relative",
    }}
  >
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
      _dark={{ bg: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
      animation="shimmer 1.5s infinite"
    />
    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </Box>
);

const HeroStatSkeleton = () => (
  <Box
    flex="1"
    textAlign="center"
    p={5}
    borderRadius="2xl"
    bg="white"
    border="1px solid"
    borderColor="rgba(148,163,184,0.14)"
    _dark={{ bg: "#111827", borderColor: "rgba(255,255,255,0.06)" }}
    minW="160px"
  >
    <Box mx="auto" mb={2} w="40px" h="40px" borderRadius="full" overflow="hidden" position="relative">
      <ShimmerBox height="40px" width="40px" borderRadius="full" />
    </Box>
    <Box mx="auto" mb={1} w="60px" h="28px" borderRadius="md" overflow="hidden" position="relative">
      <ShimmerBox height="28px" width="60px" borderRadius="md" />
    </Box>
    <Box mx="auto" w="80px" h="14px" borderRadius="md" overflow="hidden" position="relative">
      <ShimmerBox height="14px" width="80px" borderRadius="md" />
    </Box>
  </Box>
);

const HeatmapSkeleton = () => (
  <VStack gap={3} align="stretch">
    <HStack gap={3} justify="space-between">
      <ShimmerBox height="24px" width="120px" borderRadius="md" />
      <ShimmerBox height="24px" width="80px" borderRadius="md" />
    </HStack>
    <Grid templateColumns="repeat(7, 1fr)" gap={1}>
      {Array.from({ length: 28 }).map((_, i) => (
        <Box key={i} h="28px" borderRadius="sm" overflow="hidden" position="relative">
          <ShimmerBox height="28px" borderRadius="sm" />
        </Box>
      ))}
    </Grid>
    <HStack gap={2} justify="flex-end">
      <ShimmerBox height="10px" width="30px" borderRadius="md" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Box key={i} w="10px" h="10px" borderRadius="sm" overflow="hidden" position="relative">
          <ShimmerBox height="10px" width="10px" borderRadius="sm" />
        </Box>
      ))}
      <ShimmerBox height="10px" width="30px" borderRadius="md" />
    </HStack>
  </VStack>
);

const DayOfWeekSkeleton = () => (
  <VStack gap={3} align="stretch">
    <HStack gap={2} justify="space-between">
      {Array.from({ length: 7 }).map((_, i) => (
        <Box key={i} flex="1" overflow="hidden" position="relative">
          <ShimmerBox height="80px" borderRadius="lg" />
        </Box>
      ))}
    </HStack>
    <HStack gap={2} justify="center">
      {Array.from({ length: 7 }).map((_, i) => (
        <Box key={i} w="40px" h="12px" borderRadius="md" overflow="hidden" position="relative">
          <ShimmerBox height="12px" width="40px" borderRadius="md" />
        </Box>
      ))}
    </HStack>
  </VStack>
);

const BadgeSkeleton = () => (
  <HStack gap={3} flexWrap="wrap">
    {Array.from({ length: 4 }).map((_, i) => (
      <Box key={i} px={3} py={2} borderRadius="xl" border="1px solid" borderColor="rgba(148,163,184,0.14)" overflow="hidden" position="relative">
        <ShimmerBox height="24px" width="100px" borderRadius="md" />
      </Box>
    ))}
  </HStack>
);

const LeaderboardSkeleton = () => (
  <VStack gap={3} align="stretch">
    <HStack gap={1} bg="rgba(148,163,184,0.06)" _dark={{ bg: "rgba(148,163,184,0.08)" }} p={1} borderRadius="xl">
      {Array.from({ length: 4 }).map((_, i) => (
        <Box key={i} flex="1" h="28px" borderRadius="lg" overflow="hidden" position="relative">
          <ShimmerBox height="28px" borderRadius="lg" />
        </Box>
      ))}
    </HStack>
    {Array.from({ length: 5 }).map((_, i) => (
      <HStack key={i} gap={3} p={3} borderRadius="xl">
        <Box w="28px" h="28px" borderRadius="full" overflow="hidden" position="relative">
          <ShimmerBox height="28px" width="28px" borderRadius="full" />
        </Box>
        <Box flex="1" h="16px" borderRadius="md" overflow="hidden" position="relative">
          <ShimmerBox height="16px" borderRadius="md" />
        </Box>
        <Box w="50px" h="16px" borderRadius="md" overflow="hidden" position="relative">
          <ShimmerBox height="16px" width="50px" borderRadius="md" />
        </Box>
      </HStack>
    ))}
  </VStack>
);

import {
  LuArrowLeft,
  LuArrowRight,
  LuCalendarDays,
  LuChartBar,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuFlame,
  LuLock,
  LuMedal,
  LuTrophy,
  LuX,
  LuZap,
} from "react-icons/lu";

import Link from "next/link";

import UserNavbar from "@/components/Navbar/UserNavbar";
import Footer from "@/components/Footer";
import UpgradeModal from "@/components/UpgradeModal";
import useAuthenticateUser from "@/hooks/useAuthenticateUser";
import useAnalytics from "@/hooks/useAnalytics";

import {
  getFreeMonthBoundary,
  isMonthWithinFreeWindow,
  getMonthLabel,
  getMonthShortLabel,
  type MonthHeatmapDay,
  type LeaderboardEntry,
  type DayOfWeekStat,
  type DayDetail,
  type Badge,
  type GlobalStats,
} from "@/lib/analytics";

// ========================================
// HERO STAT
// ========================================

const HeroStat = ({
  value,
  label,
  accent,
  icon,
  subtext,
}: {
  value: string;
  label: string;
  accent: string;
  icon: React.ReactNode;
  subtext?: string;
}) => (
  <Box
    flex="1"
    textAlign="center"
    p={5}
    borderRadius="2xl"
    bg="white"
    border="1px solid"
    borderColor="rgba(148,163,184,0.14)"
    _dark={{
      bg: "#111827",
      borderColor: "rgba(255,255,255,0.06)",
    }}
    minW="160px"
  >
    <Box
      color={accent}
      display="flex"
      alignItems="center"
      justifyContent="center"
      mb={2}
    >
      {icon}
    </Box>
    <Text
      fontSize={{ base: "2xl", md: "3xl" }}
      fontWeight="800"
      color={accent}
      lineHeight="1.1"
    >
      {value}
    </Text>
    <Text
      fontSize="xs"
      fontWeight="600"
      color="#64748B"
      _dark={{ color: "#94A3B8" }}
      mt={1}
    >
      {label}
    </Text>
    {subtext && (
      <Text
        fontSize="10px"
        color="#94A3B8"
        _dark={{ color: "#64748B" }}
        mt={0.5}
      >
        {subtext}
      </Text>
    )}
  </Box>
);

// ========================================
// COMPLETION RING (large)
// ========================================

const CompletionRing = ({ rate }: { rate: number }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <Box position="relative" w="80px" h="80px" display="flex" alignItems="center" justifyContent="center">
      <svg height="80" width="80" style={{ transform: "rotate(-90deg)" }}>
        <circle stroke="rgba(148,163,184,0.12)" fill="transparent" strokeWidth="5" r={radius} cx="40" cy="40" />
        <circle
          stroke={rate >= 80 ? "#10B981" : rate >= 50 ? "#6366F1" : "#F59E0B"}
          fill="transparent"
          strokeWidth="5"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.25, 1, 0.5, 1)" }}
          r={radius}
          cx="40"
          cy="40"
        />
      </svg>
      <Box position="absolute" textAlign="center">
        <Text fontSize="lg" fontWeight="800" color="#0F172A" _dark={{ color: "#F8FAFC" }} lineHeight="1">
          {rate}
          <Text as="span" fontSize="10px">%</Text>
        </Text>
      </Box>
    </Box>
  );
};

// ========================================
// QUARTER HEATMAP (purple scale)
// ========================================

const QuarterHeatmap = ({
  data,
  onDayClick,
  selectedDay,
  onUpgrade,
}: {
  data: MonthHeatmapDay[][];
  onDayClick: (date: string) => void;
  selectedDay: string | null;
  onUpgrade: () => void;
}) => {
  const maxCount = useMemo(() => {
    let max = 1;
    for (const month of data) {
      for (const day of month) {
        max = Math.max(max, day.count);
      }
    }
    return max;
  }, [data]);

  const levels = ["#EEF2FF", "#C7D2FE", "#A5B4FC", "#818CF8", "#6366F1", "#4F46E5"];
  const darkLevels = ["#1E1B4B", "#312E81", "#4338CA", "#4F46E5", "#6366F1", "#818CF8"];

  const getLevel = (count: number) => {
    if (count === 0) return 0;
    const ratio = count / maxCount;
    if (ratio <= 0.2) return 1;
    if (ratio <= 0.4) return 2;
    if (ratio <= 0.6) return 3;
    if (ratio <= 0.8) return 4;
    return 5;
  };

  const FREE_MONTH_COUNT = 3;
  const olderMonths = data.slice(0, data.length - FREE_MONTH_COUNT);
  const latestMonths = data.slice(data.length - FREE_MONTH_COUNT);
  const hasLocked = olderMonths.length > 0;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollLeft = el.scrollWidth;
    }
  }, [data]);

  const renderMonth = (month: MonthHeatmapDay[], mi: number, isLocked: boolean) => {
    const firstDayOfWeek = new Date(
      month[0]?.date || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`
    ).getDay();
    const leadingEmpty = (firstDayOfWeek + 6) % 7;
    const monthDate = new Date(month[0]?.date || new Date());

    return (
      <VStack key={mi} gap={3} align="start" flexShrink={0}>
        <Text
          fontSize="xs"
          fontWeight={isLocked ? "500" : "700"}
          color={isLocked ? "#94A3B8" : "#0F172A"}
          _dark={{ color: isLocked ? "#64748B" : "#F8FAFC" }}
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          {getMonthShortLabel(monthDate.getFullYear(), monthDate.getMonth())}
        </Text>

        <Grid templateColumns="repeat(7, 1fr)" gap="4px">
          {month.map((day, di) => {
            const isLeading = di < leadingEmpty;
            if (isLeading) {
              return <Box key={`empty-${di}`} w="20px" h="20px" />;
            }
            const level = getLevel(day.count);
            const isSelected = selectedDay === day.date;

            return (
              <Tooltip.Root key={day.date}>
                <Tooltip.Trigger asChild>
                  <Box
                    w="20px"
                    h="20px"
                    borderRadius="sm"
                    bg={levels[level]}
                    _dark={{ bg: darkLevels[level] }}
                    cursor={isLocked ? "not-allowed" : "pointer"}
                    transition="0.15s"
                    outline={isSelected && !isLocked ? "2px solid #6366F1" : "none"}
                    outlineOffset={isSelected && !isLocked ? "1px" : "0"}
                    opacity={isLocked ? 0.5 : 1}
                    _hover={
                      isLocked
                        ? {}
                        : {
                            transform: "scale(1.2)",
                            zIndex: 1,
                          }
                    }
                    onClick={() => !isLocked && onDayClick(day.date)}
                  />
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
                    {isLocked
                      ? `${day.date}: Unlock to view`
                      : `${day.date}: ${day.count} ${day.count === 1 ? "log" : "logs"}`}
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Tooltip.Root>
            );
          })}
        </Grid>
      </VStack>
    );
  };

  return (
    <HStack gap={6} align="start">
      {/* Scrollable older months with overlay */}
      {olderMonths.length > 0 && (
        <Box position="relative" flexShrink={1} minW={0}>
          <Box ref={scrollRef} overflowX="auto" pb={2}>
            <HStack gap={6} align="start" flexShrink={0}>
              {olderMonths.map((month, mi) => renderMonth(month, mi, hasLocked))}
            </HStack>
          </Box>

          {/* Locked overlay */}
          {hasLocked && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom="6px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="rgba(15,23,42,0.65)"
              _dark={{ bg: "rgba(2,6,23,0.75)" }}
              borderRadius="md"
              pointerEvents="none"
              zIndex={2}
            >
              <Box
                color="#6366F1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={3}
                borderRadius="full"
                bg="rgba(99,102,241,0.25)"
                _dark={{ bg: "rgba(99,102,241,0.35)" }}
                border="1px solid rgba(99,102,241,0.4)"
                pointerEvents="auto"
                cursor="pointer"
                onClick={onUpgrade}
                transition="0.2s"
                _hover={{
                  bg: "rgba(99,102,241,0.4)",
                  _dark: { bg: "rgba(99,102,241,0.5)" },
                }}
              >
                <LuLock size={20} />
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Pinned latest months (always visible) */}
      <HStack gap={6} align="start" flexShrink={0}>
        {latestMonths.map((month, mi) => renderMonth(month, olderMonths.length + mi, false))}
      </HStack>
    </HStack>
  );
};

// ========================================
// DAY-OF-WEEK BREAKDOWN
// ========================================

const DayOfWeekChart = ({ data }: { data: DayOfWeekStat[] }) => {
  const maxRate = Math.max(1, ...data.map(d => d.rate));
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];

  return (
    <Box h="100px">
      <HStack gap={3} align="flex-end" h="full" justify="space-between">
        {dayOrder.map(i => {
          const d = data[i];
          const pct = (d.rate / maxRate) * 100;
          const barHeight = Math.max(pct * 0.6, 4);
          return (
            <VStack key={d.day} gap={1} flex="1" h="full" align="center" justify="flex-end">
              <Text fontSize="xs" fontWeight="600" color="#0F172A" _dark={{ color: "#F8FAFC" }}>
                {d.rate}%
              </Text>
              <Box
                w="100%"
                maxW="28px"
                borderRadius="lg"
                bg={d.rate >= 70 ? "#6366F1" : d.rate >= 40 ? "#818CF8" : "#C7D2FE"}
                _dark={{
                  bg: d.rate >= 70 ? "#6366F1" : d.rate >= 40 ? "#818CF8" : "#4338CA",
                }}
                opacity={d.rate > 0 ? 1 : 0.2}
                transition="0.3s"
                h={`${barHeight}px`}
              />
              <Text fontSize="10px" color="#64748B" _dark={{ color: "#94A3B8" }}>
                {d.day}
              </Text>
            </VStack>
          );
        })}
      </HStack>
    </Box>
  );
};

// ========================================
// LEADERBOARD
// ========================================

const Leaderboard = ({
  entries,
  sortBy,
  onHabitClick,
  selectedHabitId,
}: {
  entries: LeaderboardEntry[];
  sortBy: "completionRate" | "currentStreak" | "totalLogs" | "monthlyLogs";
  onHabitClick: (id: string | undefined) => void;
  selectedHabitId?: string;
}) => {
  const rankColors = ["#F59E0B", "#94A3B8", "#B45309"];
  const rankDarkColors = ["#FBBF24", "#94A3B8", "#D97706"];

  const valueMap = {
    completionRate: (e: LeaderboardEntry) => `${e.completionRate}%`,
    currentStreak: (e: LeaderboardEntry) => `${e.currentStreak}d`,
    totalLogs: (e: LeaderboardEntry) => `${e.totalLogs}`,
    monthlyLogs: (e: LeaderboardEntry) => `${e.monthlyLogs}`,
  };

  const subValueMap = {
    completionRate: (e: LeaderboardEntry) =>
      `${e.completedDays} / ${e.scheduledDays} days`,
    currentStreak: (e: LeaderboardEntry) =>
      `Best: ${e.longestStreak}d`,
    totalLogs: (e: LeaderboardEntry) =>
      `${e.monthlyLogs} this month`,
    monthlyLogs: (e: LeaderboardEntry) =>
      `${e.completionRate}% completion`,
  };

  return (
    <VStack gap={3} align="stretch">
      {entries.slice(0, 5).map((entry, i) => {
        const isTop3 = i < 3;
        const isSelected = selectedHabitId === entry.habit.id;

        return (
          <HStack
            key={entry.habit.id}
            gap={3}
            p={3}
            borderRadius="xl"
            bg={
              isSelected
                ? "rgba(99,102,241,0.10)"
                : isTop3
                  ? "rgba(99,102,241,0.04)"
                  : "rgba(148,163,184,0.04)"
            }
            border="1px solid"
            borderColor={
              isSelected
                ? "rgba(99,102,241,0.30)"
                : isTop3
                  ? "rgba(99,102,241,0.12)"
                  : "transparent"
            }
            _dark={{
              bg: isSelected
                ? "rgba(99,102,241,0.14)"
                : isTop3
                  ? "rgba(99,102,241,0.06)"
                  : "rgba(148,163,184,0.06)",
              borderColor: isSelected
                ? "rgba(99,102,241,0.40)"
                : isTop3
                  ? "rgba(99,102,241,0.18)"
                  : "transparent",
            }}
            cursor="pointer"
            transition="0.2s"
            _hover={{
              bg: isSelected
                ? "rgba(99,102,241,0.12)"
                : "rgba(99,102,241,0.06)",
            }}
            onClick={() => onHabitClick(isSelected ? undefined : entry.habit.id)}
          >
            <Box
              w="28px"
              h="28px"
              borderRadius="full"
              bg={isTop3 ? rankColors[i] : "rgba(148,163,184,0.12)"}
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="700"
              flexShrink={0}
              _dark={{
                bg: isTop3 ? rankDarkColors[i] : "rgba(148,163,184,0.18)",
              }}
            >
              {isTop3 ? <LuMedal size={14} /> : i + 1}
            </Box>

            <VStack gap={0} align="start" flex="1" minW={0}>
              <Text
                fontWeight="600"
                fontSize="sm"
                color="#0F172A"
                _dark={{ color: "#F8FAFC" }}
                truncate
              >
                {entry.habit.name}
              </Text>
              <Text
                fontSize="xs"
                color="#64748B"
                _dark={{ color: "#94A3B8" }}
              >
                {subValueMap[sortBy](entry)}
              </Text>
            </VStack>

            <HStack
              gap={1.5}
              px={2.5}
              py={1}
              borderRadius="full"
              bg="rgba(99,102,241,0.08)"
              _dark={{ bg: "rgba(99,102,241,0.12)" }}
              fontSize="xs"
              fontWeight="600"
              flexShrink={0}
            >
              <Text
                color="#6366F1"
                _dark={{ color: "#818CF8" }}
                fontSize="xs"
                fontWeight="600"
              >
                {valueMap[sortBy](entry)}
              </Text>
            </HStack>
          </HStack>
        );
      })}
    </VStack>
  );
};

// ========================================
// DAY DETAIL PANEL
// ========================================

const DayDetailPanel = ({
  detail,
  onClose,
}: {
  detail: DayDetail;
  onClose: () => void;
}) => {
  return (
    <Box
      p={4}
      borderRadius="xl"
      bg="rgba(99,102,241,0.04)"
      border="1px solid"
      borderColor="rgba(99,102,241,0.15)"
      _dark={{
        bg: "rgba(99,102,241,0.06)",
        borderColor: "rgba(99,102,241,0.20)",
      }}
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="600" fontSize="sm" color="#0F172A" _dark={{ color: "#F8FAFC" }}>
          {detail.date}
        </Text>
        <Button
          size="xs"
          variant="ghost"
          borderRadius="full"
          color="#64748B"
          _dark={{ color: "#94A3B8" }}
          onClick={onClose}
        >
          <LuX size={14} />
        </Button>
      </Flex>

      {detail.completedHabits.length > 0 && (
        <VStack gap={1} align="stretch" mb={detail.missedHabits.length > 0 ? 3 : 0}>
          <Text fontSize="xs" fontWeight="600" color="#10B981" _dark={{ color: "#34D399" }}>
            Completed ({detail.completedHabits.length})
          </Text>
          {detail.completedHabits.map(h => (
            <HStack key={h.id} gap={2}>
              <Box w="6px" h="6px" borderRadius="full" bg={h.color} />
              <Text fontSize="xs" color="#0F172A" _dark={{ color: "#F8FAFC" }}>
                {h.name}
              </Text>
            </HStack>
          ))}
        </VStack>
      )}

      {detail.missedHabits.length > 0 && (
        <VStack gap={1} align="stretch">
          <Text fontSize="xs" fontWeight="600" color="#F59E0B" _dark={{ color: "#FBBF24" }}>
            Missed ({detail.missedHabits.length})
          </Text>
          {detail.missedHabits.map(h => (
            <HStack key={h.id} gap={2}>
              <Box w="6px" h="6px" borderRadius="full" bg={h.color} />
              <Text fontSize="xs" color="#64748B" _dark={{ color: "#94A3B8" }}>
                {h.name}
              </Text>
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
};

// ========================================
// BADGES
// ========================================

const Badges = ({ badges }: { badges: Badge[] }) => (
  <HStack gap={2} flexWrap="wrap">
    {badges.map(badge => (
      <Box
        key={badge.id}
        px={3}
        py={1.5}
        borderRadius="full"
        bg={badge.earned ? `${badge.color}14` : "rgba(148,163,184,0.08)"}
        border="1px solid"
        borderColor={badge.earned ? `${badge.color}30` : "rgba(148,163,184,0.12)"}
        display="flex"
        alignItems="center"
        gap={1.5}
        opacity={badge.earned ? 1 : 0.5}
        _dark={{
          bg: badge.earned ? `${badge.color}18` : "rgba(148,163,184,0.10)",
          borderColor: badge.earned ? `${badge.color}40` : "rgba(148,163,184,0.14)",
        }}
      >
        <Box color={badge.earned ? badge.color : "#94A3B8"} display="flex">
          {badge.icon === "flame" && <LuFlame size={12} />}
          {badge.icon === "check" && <LuCheck size={12} />}
          {badge.icon === "trophy" && <LuTrophy size={12} />}
          {badge.icon === "zap" && <LuZap size={12} />}
        </Box>
        <Text fontSize="xs" fontWeight="600" color={badge.earned ? badge.color : "#94A3B8"}>
          {badge.label}
        </Text>
      </Box>
    ))}
  </HStack>
);

// ========================================
// PAYWALL OVERLAY
// ========================================

const PaywallOverlay = ({
  onUpgrade,
  onReset,
}: {
  onUpgrade: () => void;
  onReset: () => void;
}) => (
  <Box
    position="absolute"
    inset={0}
    zIndex={10}
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="2xl"
    bg="rgba(255,255,255,0.45)"
    _dark={{ bg: "rgba(2,6,23,0.55)" }}
    backdropFilter="blur(8px)"
    flexDirection="column"
    gap={4}
  >
    <Box
      w="56px"
      h="56px"
      borderRadius="full"
      bg="rgba(99,102,241,0.10)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="#6366F1"
    >
      <LuLock size={24} />
    </Box>
    <Text
      fontWeight="700"
      fontSize="md"
      color="#0F172A"
      _dark={{ color: "#F8FAFC" }}
    >
      Unlock full history
    </Text>
    <Text
      fontSize="sm"
      color="#64748B"
      _dark={{ color: "#94A3B8" }}
      textAlign="center"
      maxW="280px"
    >
      Upgrade to Pro to view data beyond your last 3 months.
    </Text>
    <VStack gap={2}>
      <Button
        bg="#6366F1"
        color="white"
        borderRadius="xl"
        px={6}
        fontWeight="600"
        _hover={{ bg: "#5558E3" }}
        onClick={onUpgrade}
      >
        Upgrade to Pro
      </Button>
      <Button
        variant="ghost"
        borderRadius="xl"
        color="#64748B"
        _dark={{ color: "#94A3B8" }}
        fontWeight="500"
        fontSize="sm"
        _hover={{ bg: "rgba(99,102,241,0.08)", color: "#6366F1" }}
        onClick={onReset}
      >
        Reset to free window
      </Button>
    </VStack>
  </Box>
);

// ========================================
// MAIN PAGE
// ========================================

const AnalyticsPage = () => {
  const { user, loading: userLoading, logout } = useAuthenticateUser();
  const {
    globalStats,
    heatmap: quarterHeatmap,
    leaderboard,
    dayOfWeekStats,
    badges,
    dayDetail,
    monthComparison,
    loading: analyticsLoading,
    fetchLeaderboard,
    fetchDayDetail,
  } = useAnalytics();

  const isLoading = userLoading || analyticsLoading;

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const [leaderboardTab, setLeaderboardTab] = useState<
    "completionRate" | "currentStreak" | "totalLogs" | "monthlyLogs"
  >("completionRate");

  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchLeaderboard(viewYear, viewMonth, leaderboardTab);
  }, [fetchLeaderboard, viewYear, viewMonth, leaderboardTab]);

  useEffect(() => {
    if (selectedDay) {
      fetchDayDetail(selectedDay);
    }
  }, [fetchDayDetail, selectedDay]);

  const monthLabel = getMonthLabel(viewYear, viewMonth);
  const isFree = isMonthWithinFreeWindow(viewYear, viewMonth);
  const freeBoundary = getFreeMonthBoundary();

  const shiftMonth = (dir: number) => {
    const d = new Date(viewYear, viewMonth + dir, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setSelectedDay(null);
  };

  const resetToCurrent = () => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedHabitId(undefined);
    setSelectedDay(null);
  };

  const handleHabitClick = (id: string | undefined) => {
    setSelectedHabitId(id);
    setSelectedDay(null);
  };

  const handleDayClick = (date: string) => {
    setSelectedDay(prev => (prev === date ? null : date));
  };

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
        currentTime={new Date()}
        logout={logout}
      />

      {/* HEADER */}
      <Box
        px={{ base: 4, md: 8, lg: 10 }}
        pt={{ base: 6, md: 8 }}
        pb={4}
      >
        <HStack gap={4} mb={4}>
          <Link href="/dashboard">
            <Button
              size="sm"
              variant="ghost"
              borderRadius="full"
              color="#64748B"
              _dark={{ color: "#94A3B8" }}
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

        {isLoading ? (
          <HStack gap={3} align="center" flexWrap="wrap">
            <Box p={2.5} borderRadius="xl" overflow="hidden" position="relative" w="45px" h="45px">
              <ShimmerBox height="45px" width="45px" borderRadius="xl" />
            </Box>
            <Box w="120px" h="32px" borderRadius="md" overflow="hidden" position="relative">
              <ShimmerBox height="32px" width="120px" borderRadius="md" />
            </Box>
          </HStack>
        ) : (
          <HStack gap={3} align="center" flexWrap="wrap">
            <Box
              p={2.5}
              borderRadius="xl"
              bg="#6366F1"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LuChartBar size={22} />
            </Box>
            <Heading
              size="lg"
              color="#0F172A"
              _dark={{ color: "#F8FAFC" }}
            >
              Analytics
            </Heading>
          </HStack>
        )}
      </Box>

      {/* MAIN CONTENT */}
      <Box
        px={{ base: 4, md: 8, lg: 10 }}
        pb={10}
      >
        {/* LOADING INDICATOR */}
        {isLoading && (
          <HStack gap={2} mb={4} opacity={0.6}>
            <Spinner size="sm" color="#6366F1" />
            <Text fontSize="sm" color="#64748B" _dark={{ color: "#94A3B8" }} fontWeight="500">
              Loading analytics data...
            </Text>
          </HStack>
        )}

        {/* 3 HERO STATS */}
        {isLoading && (
          <Flex gap={3} mb={8} flexWrap="wrap">
            <HeroStatSkeleton />
            <HeroStatSkeleton />
            <HeroStatSkeleton />
          </Flex>
        )}

        {!isLoading && globalStats && (
          <Flex
            gap={3}
            mb={8}
            flexWrap="wrap"
            opacity={mounted ? 1 : 0}
            transform={mounted ? "translateY(0)" : "translateY(8px)"}
            transition="0.5s cubic-bezier(0.25, 1, 0.5, 1)"
          >
            <HeroStat
              value={`${globalStats.thisWeekCompletionRate}%`}
              label="This Week Completion"
              accent="#6366F1"
              icon={<CompletionRing rate={globalStats.thisWeekCompletionRate} />}
              subtext={`${globalStats.thisWeekLogs} logs logged`}
            />
            <HeroStat
              value={String(globalStats.totalLogs)}
              label="Total Logs"
              accent="#10B981"
              icon={<LuZap size={20} />}
            />
            <HeroStat
              value={`${globalStats.bestStreak}d`}
              label="Best Streak"
              accent="#EF4444"
              icon={<LuFlame size={20} />}
            />
          </Flex>
        )}

        {/* QUARTER HEATMAP - FULL WIDTH */}
        <Box
          p={6}
          borderRadius="2xl"
          border="1px solid"
          borderColor="rgba(148,163,184,0.14)"
          bg="white"
          _dark={{
            bg: "#111827",
            borderColor: "rgba(255,255,255,0.06)",
          }}
          mb={6}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(12px)"}
          transition="0.6s cubic-bezier(0.25, 1, 0.5, 1) 0.1s"
        >
          <Flex
            justify="space-between"
            align="center"
            mb={4}
            flexWrap="wrap"
            gap={3}
          >
            <HStack gap={2}>
              <Box
                p={2}
                borderRadius="xl"
                bg="rgba(99,102,241,0.10)"
                color="#6366F1"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <LuCalendarDays size={18} />
              </Box>
              <Text
                fontWeight="600"
                color="#0F172A"
                _dark={{ color: "#F8FAFC" }}
              >
                Activity
              </Text>
              {selectedHabitId && (
                <Box
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  bg="rgba(99,102,241,0.10)"
                  color="#6366F1"
                  fontSize="10px"
                  fontWeight="600"
                >
                  Filtered
                </Box>
              )}
            </HStack>

            {monthComparison && (
              <HStack gap={1} fontSize="xs">
                <Text color="#64748B" _dark={{ color: "#94A3B8" }}>
                  This month:
                </Text>
                <Text fontWeight="700" color="#6366F1">
                  {monthComparison.currentMonth.completionRate}%
                </Text>
                <Text color="#64748B" _dark={{ color: "#94A3B8" }}>
                  vs last:
                </Text>
                <Text
                  fontWeight="700"
                  color={monthComparison.deltaRate >= 0 ? "#10B981" : "#F59E0B"}
                  _dark={{
                    color: monthComparison.deltaRate >= 0 ? "#34D399" : "#FBBF24",
                  }}
                >
                  {monthComparison.deltaRate >= 0 ? "+" : ""}
                  {monthComparison.deltaRate}%
                </Text>
              </HStack>
            )}
          </Flex>

          {isLoading ? (
            <HeatmapSkeleton />
          ) : (
            <>
              <QuarterHeatmap
                data={quarterHeatmap}
                onDayClick={handleDayClick}
                selectedDay={selectedDay}
                onUpgrade={() => setUpgradeOpen(true)}
              />

              {/* Legend */}
              <HStack gap={2} mt={3} justify="flex-end">
                <Text fontSize="10px" color="#64748B" _dark={{ color: "#94A3B8" }}>
                  Less
                </Text>
                {[
                  "#EEF2FF",
                  "#C7D2FE",
                  "#A5B4FC",
                  "#818CF8",
                  "#6366F1",
                  "#4F46E5",
                ].map((c, i) => (
                  <Box key={i} w="10px" h="10px" borderRadius="sm" bg={c} />
                ))}
                <Text fontSize="10px" color="#64748B" _dark={{ color: "#94A3B8" }}>
                  More
                </Text>
              </HStack>
            </>
          )}

          {/* Day detail */}
          {dayDetail && (
            <Box mt={4}>
              <DayDetailPanel detail={dayDetail} onClose={() => setSelectedDay(null)} />
            </Box>
          )}
        </Box>

        {/* Custom range hint */}
        <Button
          w="full"
          py={3}
          mb={6}
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
          variant="ghost"
          transition="0.2s"
          _hover={{
            bg: "rgba(99,102,241,0.06)",
            borderColor: "#6366F1",
          }}
          onClick={() => setUpgradeOpen(true)}
        >
          <LuArrowRight />
          Pick a custom date range
        </Button>

        {/* 2-COLUMN GRID: DAY-OF-WEEK + LEADERBOARD */}
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "1fr 1fr",
          }}
          gap={6}
          alignItems="start"
        >
          <VStack gap={6} align="stretch">
            {/* DAY-OF-WEEK */}
            <Box
              p={6}
              borderRadius="2xl"
              border="1px solid"
              borderColor="rgba(148,163,184,0.14)"
              bg="white"
              _dark={{
                bg: "#111827",
                borderColor: "rgba(255,255,255,0.06)",
              }}
              opacity={mounted ? 1 : 0}
              transform={mounted ? "translateY(0)" : "translateY(12px)"}
              transition="0.6s cubic-bezier(0.25, 1, 0.5, 1) 0.2s"
            >
              <HStack gap={2} mb={4}>
                <Box
                  p={2}
                  borderRadius="xl"
                  bg="rgba(139,92,246,0.10)"
                  color="#8B5CF6"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <LuChartBar size={18} />
                </Box>
                <Text
                  fontWeight="600"
                  color="#0F172A"
                  _dark={{ color: "#F8FAFC" }}
                >
                  Day-of-Week
                </Text>
              </HStack>

              {isLoading ? (
                <DayOfWeekSkeleton />
              ) : (
                <DayOfWeekChart data={dayOfWeekStats} />
              )}
            </Box>

            {/* BADGES */}
            <Box
              p={6}
              borderRadius="2xl"
              border="1px solid"
              borderColor="rgba(148,163,184,0.14)"
              bg="white"
              _dark={{
                bg: "#111827",
                borderColor: "rgba(255,255,255,0.06)",
              }}
              opacity={mounted ? 1 : 0}
              transform={mounted ? "translateY(0)" : "translateY(12px)"}
              transition="0.6s cubic-bezier(0.25, 1, 0.5, 1) 0.3s"
            >
              <HStack gap={2} mb={4}>
                <Box
                  p={2}
                  borderRadius="xl"
                  bg="rgba(16,185,129,0.10)"
                  color="#10B981"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <LuMedal size={18} />
                </Box>
                <Text
                  fontWeight="600"
                  color="#0F172A"
                  _dark={{ color: "#F8FAFC" }}
                >
                  Achievements
                </Text>
              </HStack>

              {isLoading ? (
                <BadgeSkeleton />
              ) : (
                <Badges badges={badges} />
              )}
            </Box>
          </VStack>

          <VStack gap={6} align="stretch">
            {/* LEADERBOARD */}
            <Box
              p={6}
              borderRadius="2xl"
              border="1px solid"
              borderColor="rgba(148,163,184,0.14)"
              bg="white"
              _dark={{
                bg: "#111827",
                borderColor: "rgba(255,255,255,0.06)",
              }}
              position="relative"
              opacity={mounted ? 1 : 0}
              transform={mounted ? "translateY(0)" : "translateY(12px)"}
              transition="0.6s cubic-bezier(0.25, 1, 0.5, 1) 0.15s"
            >
              <HStack gap={2} mb={4} justify="space-between">
                <HStack gap={2}>
                  <Box
                    p={2}
                    borderRadius="xl"
                    bg="rgba(245,158,11,0.10)"
                    color="#F59E0B"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <LuTrophy size={18} />
                  </Box>
                  <Text
                    fontWeight="600"
                    color="#0F172A"
                    _dark={{ color: "#F8FAFC" }}
                  >
                    Leaderboard
                  </Text>
                </HStack>

                {/* Month selector */}
                <HStack gap={1}>
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
                    onClick={() => shiftMonth(-1)}
                  >
                    <LuChevronLeft size={16} />
                  </Button>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="#0F172A"
                    _dark={{ color: "#F8FAFC" }}
                    minW="80px"
                    textAlign="center"
                  >
                    {monthLabel}
                  </Text>
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
                    onClick={() => shiftMonth(1)}
                    disabled={
                      viewYear === now.getFullYear() &&
                      viewMonth === now.getMonth()
                    }
                    opacity={
                      viewYear === now.getFullYear() &&
                      viewMonth === now.getMonth()
                        ? 0.3
                        : 1
                    }
                  >
                    <LuChevronRight size={16} />
                  </Button>
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
                    onClick={resetToCurrent}
                  >
                    <Text fontSize="10px" fontWeight="600">
                      Today
                    </Text>
                  </Button>
                </HStack>
              </HStack>

              {isLoading ? (
                <LeaderboardSkeleton />
              ) : (
                <>
                  <Tabs.Root
                    value={leaderboardTab}
                    onValueChange={(details: { value: string }) =>
                      setLeaderboardTab(
                        details.value as typeof leaderboardTab
                      )
                    }
                    mb={4}
                  >
                    <Tabs.List
                      gap={1}
                      bg="rgba(148,163,184,0.06)"
                      _dark={{ bg: "rgba(148,163,184,0.08)" }}
                      p={1}
                      borderRadius="xl"
                      overflowX="auto"
                    >
                      {(
                        [
                          ["completionRate", "Completion"],
                          ["currentStreak", "Streak"],
                          ["totalLogs", "All-time"],
                          ["monthlyLogs", "Monthly"],
                        ] as const
                      ).map(([key, label]) => (
                        <Tabs.Trigger
                          key={key}
                          value={key}
                          px={3}
                          py={1.5}
                          borderRadius="lg"
                          fontSize="xs"
                          fontWeight="600"
                          color="#64748B"
                          _dark={{ color: "#94A3B8" }}
                          _selected={{
                            bg: "white",
                            color: "#0F172A",
                            boxShadow:
                              "0 1px 3px rgba(0,0,0,0.08)",
                            _dark: {
                              bg: "#1E293B",
                              color: "#F8FAFC",
                              boxShadow:
                                "0 1px 3px rgba(0,0,0,0.25)",
                            },
                          }}
                        >
                          {label}
                        </Tabs.Trigger>
                      ))}
                    </Tabs.List>
                  </Tabs.Root>

                  <Leaderboard
                    entries={leaderboard}
                    sortBy={leaderboardTab}
                    onHabitClick={handleHabitClick}
                    selectedHabitId={selectedHabitId}
                  />
                </>
              )}

              {!isFree && (
                <PaywallOverlay
                  onUpgrade={() => setUpgradeOpen(true)}
                  onReset={resetToCurrent}
                />
              )}
            </Box>

            {/* Free window indicator */}
            <Box
              p={4}
              borderRadius="2xl"
              border="1px solid"
              borderColor={isFree ? "rgba(148,163,184,0.14)" : "rgba(245,158,11,0.20)"}
              bg="white"
              _dark={{
                bg: "#111827",
                borderColor: isFree ? "rgba(255,255,255,0.06)" : "rgba(245,158,11,0.25)",
              }}
              opacity={mounted ? 1 : 0}
              transform={mounted ? "translateY(0)" : "translateY(12px)"}
              transition="0.6s cubic-bezier(0.25, 1, 0.5, 1) 0.35s"
            >
              <HStack gap={2} mb={2}>
                <Box w="8px" h="8px" borderRadius="full" bg={isFree ? "#10B981" : "#F59E0B"} />
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="#64748B"
                  _dark={{ color: "#94A3B8" }}
                >
                  {isFree ? "Free window" : "Out of free range"}
                </Text>
              </HStack>
              <Text
                fontSize="xs"
                color="#94A3B8"
                _dark={{ color: "#64748B" }}
              >
                Viewing {getMonthLabel(freeBoundary.year, freeBoundary.month)} to{" "}
                {getMonthLabel(now.getFullYear(), now.getMonth())}. Upgrade to
                Pro for unlimited history.
              </Text>
              {!isFree && (
                <Button
                  mt={3}
                  size="xs"
                  variant="ghost"
                  borderRadius="full"
                  color="#F59E0B"
                  fontWeight="600"
                  _hover={{ bg: "rgba(245,158,11,0.08)" }}
                  onClick={resetToCurrent}
                >
                  Reset to free window
                </Button>
              )}
            </Box>
          </VStack>
        </Grid>
      </Box>

      <Footer />

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </Box>
  );
};

export default AnalyticsPage;
