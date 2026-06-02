"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    Skeleton,
    Spinner,
    Switch,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";

import {
    LuArrowLeft,
    LuCheck,
    LuCircleCheckBig,
    LuPencil,
    LuGlobe,
    LuPlus,
    LuRotateCcw,
    LuSearch,
    LuSmartphone,
    LuTrash2,
} from "react-icons/lu";

import Link
    from "next/link";

import useAuthenticateUser
    from "@/hooks/useAuthenticateUser";

import useAxiosRequest
    from "@/hooks/useAxiosRequest";

import useHabits
    from "@/hooks/useHabits";

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

import EditHabitDialog
    from "@/components/EditHabitDialog";

import { Habit } from "@/types/habit";

import { getScheduleLabel } from "@/lib/schedule";

import { computeLongestStreak } from "@/lib/analytics";

// ========================================
// COMPONENT
// ========================================

const HabitsPage = () => {

    const {
        user,
        loading: userLoading,
        logout,
    } = useAuthenticateUser();

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const [searchOpen, setSearchOpen] = useState(false);

    const {
        habits,
        setHabits,
        loading: habitsLoading,
        refetch,
    } = useHabits({
        search: debouncedSearch || undefined,
    });

    const axiosRequest = useAxiosRequest();
    const { onHabitUpdated } = useSignalR();

    const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    // ========================================
    // SIGNALR: Habit Updates
    // ========================================

    useEffect(() => {
        const unsubscribe = onHabitUpdated(payload => {
            setHabits(prev => {
                if (payload.action === "created" && payload.habit) {
                    // Avoid duplicates
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

    // ========================================
    // ACTIONS
    // ========================================

    const toggleActive = async (habit: Habit) => {
        setTogglingIds(prev => {
            const next = new Set(prev);
            next.add(habit.id);
            return next;
        });

        try {
            await axiosRequest.post("/Habit/update", {
                id: habit.id,
                name: habit.name,
                description: habit.description,
                isActive: !habit.isActive,
                schedule: {
                    type: habit.schedule.type,
                    interval: habit.schedule.intervalDays || null,
                    daysOfWeek: habit.schedule.daysOfWeek,
                },
            });
            // No refetch — SignalR will push the update
        } catch (err) {
            console.error("Failed to toggle habit:", err);
            // Fallback: update locally if SignalR fails
            setHabits(prev =>
                prev.map(h =>
                    h.id === habit.id ? { ...h, isActive: !h.isActive } : h
                )
            );
        } finally {
            setTogglingIds(prev => {
                const next = new Set(prev);
                next.delete(habit.id);
                return next;
            });
        }
    };

    const deleteHabit = async (habitId: string) => {
        setDeletingIds(prev => {
            const next = new Set(prev);
            next.add(habitId);
            return next;
        });

        try {
            await axiosRequest.delete(`/Habit/delete?habitId=${habitId}`);
            // No refetch — SignalR will push the update
        } catch (err) {
            console.error("Failed to delete habit:", err);
        } finally {
            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(habitId);
                return next;
            });
        }
    };

    // ========================================
    // RENDER HELPERS
    // ========================================

    const scheduleTypeColor = (type: number) => {
        switch (type) {
            case 0:
                return { bg: "rgba(99,102,241,0.12)", color: "#6366F1" };
            case 1:
                return { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" };
            case 2:
                return { bg: "rgba(16,185,129,0.12)", color: "#10B981" };
            default:
                return { bg: "rgba(148,163,184,0.12)", color: "#94A3B8" };
        }
    };

    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.isActive).length;
    const inactiveHabits = totalHabits - activeHabits;

    // ========================================
    // RENDER
    // ========================================

    if (userLoading) {
        return (
            <Flex minH="100dvh" bg="#0B0F1A" align="center" justify="center">
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
                currentTime={new Date()}
                logout={logout}
            />

            <Box
                maxW="1200px"
                mx="auto"
                w="full"
                px={{ base: 4, md: 8, lg: 10 }}
                pt={{ base: 6, md: 8 }}
                pb={20}
            >
                {/* HEADER */}
                <Box pb={4} mb={6}>
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

                    <Heading
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="800"
                        letterSpacing="-0.03em"
                        color="#0F172A"
                        _dark={{ color: "#F8FAFC" }}
                        lineHeight="1.1"
                        mb={2}
                    >
                        Manage Habits
                    </Heading>
                    <Text
                        fontSize="sm"
                        color="#64748B"
                        _dark={{ color: "#94A3B8" }}
                    >
                        {totalHabits === 0
                            ? "Build your first habit."
                            : `${activeHabits} active, ${inactiveHabits} paused. Edit, toggle, or delete any habit.`}
                    </Text>
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

                        {search !== "" && (
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
                                onClick={() => setSearch("")}
                            >
                                <LuRotateCcw />
                                Reset
                            </Button>
                        )}
                    </HStack>

                    <CreateHabitDialog onSuccess={refetch} />
                </Flex>

                {/* HABITS LIST */}
                {habitsLoading && (
                    <VStack align="stretch" gap={4} mb={12}>
                        {[1, 2, 3, 4].map(item => (
                            <Skeleton key={item} h="96px" borderRadius="2xl" />
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
                        {habits.map(habit => {
                            const scheduleColors = scheduleTypeColor(habit.schedule.type);
                            const scheduleLabel = getScheduleLabel(habit.schedule);
                            const isToggling = togglingIds.has(habit.id);
                            const isDeleting = deletingIds.has(habit.id);
                            const longestStreak = computeLongestStreak(
                                habit.habitLogs,
                                habit.schedule,
                                habit.createdAt
                            );

                            return (
                                <Flex
                                    key={habit.id}
                                    align="center"
                                    gap={4}
                                    p={4}
                                    borderRadius="2xl"
                                    border="1px solid"
                                    borderColor={
                                        habit.isActive
                                            ? "rgba(148,163,184,0.14)"
                                            : "rgba(148,163,184,0.08)"
                                    }
                                    bg={
                                        habit.isActive
                                            ? "white"
                                            : "rgba(148,163,184,0.04)"
                                    }
                                    _dark={{
                                        bg: habit.isActive
                                            ? "#111827"
                                            : "rgba(148,163,184,0.03)",
                                        borderColor: habit.isActive
                                            ? "rgba(255,255,255,0.06)"
                                            : "rgba(255,255,255,0.03)",
                                    }}
                                    transition="0.2s"
                                    opacity={habit.isActive ? 1 : 0.65}
                                    _hover={{
                                        borderColor: habit.isActive
                                            ? "rgba(99,102,241,0.25)"
                                            : "rgba(148,163,184,0.12)",
                                    }}
                                >
                                    {/* STATUS ICON */}
                                    <Box
                                        w="44px"
                                        h="44px"
                                        borderRadius="full"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                        bg={
                                            habit.isActive
                                                ? "rgba(16,185,129,0.10)"
                                                : "rgba(148,163,184,0.10)"
                                        }
                                        color={
                                            habit.isActive
                                                ? "#10B981"
                                                : "#94A3B8"
                                        }
                                        _dark={{
                                            bg: habit.isActive
                                                ? "rgba(16,185,129,0.12)"
                                                : "rgba(148,163,184,0.08)",
                                        }}
                                    >
                                        {habit.isActive ? (
                                            <LuCheck size={20} />
                                        ) : (
                                            <LuCircleCheckBig size={20} />
                                        )}
                                    </Box>

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
                                                textDecoration={
                                                    habit.isActive
                                                        ? "none"
                                                        : "line-through"
                                                }
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
                                            {!habit.isActive && (
                                                <Badge
                                                    px={2}
                                                    py={0.5}
                                                    borderRadius="full"
                                                    bg="rgba(148,163,184,0.12)"
                                                    color="#94A3B8"
                                                    fontSize="9px"
                                                    fontWeight="600"
                                                >
                                                    Paused
                                                </Badge>
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

                                        <HStack gap={3} flexWrap="wrap">
                                            <Text fontSize="10px" color="#94A3B8" _dark={{ color: "#64748B" }}>
                                                {habit.habitLogs.length} logs
                                            </Text>
                                            {longestStreak > 0 && (
                                                <Text fontSize="10px" color="#94A3B8" _dark={{ color: "#64748B" }}>
                                                    {longestStreak}d best streak
                                                </Text>
                                            )}
                                            <HStack gap={1} color="#94A3B8" _dark={{ color: "#64748B" }}>
                                                {habit.createdFrom === 2 ? (
                                                    <LuSmartphone size={10} />
                                                ) : (
                                                    <LuGlobe size={10} />
                                                )}
                                                <Text fontSize="10px">
                                                    {new Date(habit.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </Text>
                                            </HStack>
                                        </HStack>
                                    </Box>

                                    {/* ACTIONS */}
                                    <HStack gap={1} flexShrink={0} align="center">
                                        {/* ACTIVE TOGGLE */}
                                        <Tooltip.Root>
                                            <Tooltip.Trigger asChild>
                                                <IconButton
                                                    aria-label={habit.isActive ? "Pause habit" : "Resume habit"}
                                                    size="sm"
                                                    variant="ghost"
                                                    borderRadius="full"
                                                    w="36px"
                                                    h="36px"
                                                    color={habit.isActive ? "#10B981" : "#94A3B8"}
                                                    _dark={{ color: habit.isActive ? "#34D399" : "#64748B" }}
                                                    _hover={{
                                                        bg: habit.isActive
                                                            ? "rgba(16,185,129,0.10)"
                                                            : "rgba(148,163,184,0.10)",
                                                    }}
                                                    onClick={() => toggleActive(habit)}
                                                    loading={isToggling}
                                                >
                                                    {habit.isActive ? (
                                                        <LuCheck size={18} />
                                                    ) : (
                                                        <LuCircleCheckBig size={18} />
                                                    )}
                                                </IconButton>
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
                                                    {habit.isActive ? "Pause habit" : "Resume habit"}
                                                </Tooltip.Content>
                                            </Tooltip.Positioner>
                                        </Tooltip.Root>

                                        {/* EDIT */}
                                        <EditHabitDialog
                                            habit={habit}
                                            trigger={
                                                <IconButton
                                                    aria-label="edit habit"
                                                    size="sm"
                                                    variant="ghost"
                                                    borderRadius="full"
                                                    w="36px"
                                                    h="36px"
                                                    color="#64748B"
                                                    _dark={{ color: "#94A3B8" }}
                                                    _hover={{
                                                        bg: "rgba(99,102,241,0.08)",
                                                        color: "#6366F1",
                                                    }}
                                                >
                                                    <LuPencil size={18} />
                                                </IconButton>
                                            }
                                            onSuccess={() => {}}
                                        />

                                        {/* DELETE */}
                                        <Tooltip.Root>
                                            <Tooltip.Trigger asChild>
                                                <IconButton
                                                    aria-label="delete habit"
                                                    size="sm"
                                                    variant="ghost"
                                                    borderRadius="full"
                                                    w="36px"
                                                    h="36px"
                                                    color="#64748B"
                                                    _dark={{ color: "#94A3B8" }}
                                                    _hover={{
                                                        bg: "rgba(239,68,68,0.08)",
                                                        color: "#EF4444",
                                                    }}
                                                    onClick={() => deleteHabit(habit.id)}
                                                    loading={isDeleting}
                                                >
                                                    <LuTrash2 size={18} />
                                                </IconButton>
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
                                                    Delete habit
                                                </Tooltip.Content>
                                            </Tooltip.Positioner>
                                        </Tooltip.Root>
                                    </HStack>
                                </Flex>
                            );
                        })}
                    </VStack>
                )}
            </Box>

            <Footer />
        </Box>
    );
};

export default HabitsPage;
