"use client";

import {
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
    LuPlus,
} from "react-icons/lu";

import useAuthenticateUser
    from "@/hooks/useAuthenticateUser";

import UserNavbar from "@/components/Navbar/UserNavbar";

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

    const [habitsLoading, setHabitsLoading] =
        useState(true);

    // ========================================
    // MOCK DATA
    // ========================================

    const habits = useMemo(() => [
        {
            id: 1,
            name: "Deep Work",
            description:
                "90 minutes focused coding session",
            completed: false,
            schedule: "Daily",
        },
        {
            id: 2,
            name: "Meditation",
            description:
                "15 minutes mindfulness practice",
            completed: true,
            schedule: "Daily",
        },
        {
            id: 3,
            name: "Reading",
            description:
                "Read 20 pages of Atomic Habits",
            completed: false,
            schedule: "Daily",
        },
        {
            id: 4,
            name: "Workout",
            description:
                "Strength training and cardio",
            completed: false,
            schedule: "Weekly",
        },
        {
            id: 5,
            name: "Journal",
            description:
                "Reflect and write daily thoughts",
            completed: true,
            schedule: "Daily",
        },
        {
            id: 6,
            name: "Hydration",
            description:
                "Drink 3 liters of water",
            completed: false,
            schedule: "Daily",
        },
    ], []);

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

    useEffect(() => {

        if (!userLoading) {

            const timeout =
                setTimeout(() => {
                    setHabitsLoading(false);
                }, 1400);

            return () =>
                clearTimeout(timeout);
        }

    }, [userLoading]);

    // ========================================
    // USER LOADING
    // ========================================

    if (userLoading) {

        return (
            <Flex
                minH="100dvh"
                bg="#020617"
                position="relative"
                overflow="hidden"
                align="center"
                justify="center"
            >

                {/* GLOW */}

                <Box
                    position="absolute"
                    top="-150px"
                    left="-150px"
                    w="450px"
                    h="450px"
                    bg="#6366F1"
                    opacity="0.15"
                    borderRadius="full"
                    filter="blur(120px)"
                />

                <Box
                    position="absolute"
                    bottom="-150px"
                    right="-150px"
                    w="450px"
                    h="450px"
                    bg="#6366F1"
                    opacity="0.10"
                    borderRadius="full"
                    filter="blur(120px)"
                />

                <VStack gap={6} zIndex={2}>

                    <Spinner
                        size="xl"
                        color="#6366F1"
                        borderWidth="4px"
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

            {/* ========================================
                NAVBAR
            ======================================== */}

            <UserNavbar
                userName={user?.name}
                currentTime={currentTime}
                logout={logout}
            />

            {/* ========================================
                CONTENT
            ======================================== */}

            <Box
                maxW="1600px"
                mx="auto"
                px={{
                    base: 6,
                    lg: 10,
                }}
                py={10}
            >

                {/* ========================================
                    HERO
                ======================================== */}

                <Box
                    position="relative"
                    mb={12}
                >

                    <Box
                        position="absolute"
                        top="-80px"
                        left="-80px"
                        w="320px"
                        h="320px"
                        bg="#6366F1"
                        opacity="0.10"
                        borderRadius="full"
                        filter="blur(120px)"
                    />

                    <VStack
                        align="start"
                        gap={4}
                        position="relative"
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

                        <HStack gap={4} flexWrap="wrap">

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

                </Box>

                {/* ========================================
                    STATS
                ======================================== */}

                <Grid
                    templateColumns={{
                        base: "repeat(2,1fr)",
                        lg: "repeat(4,1fr)",
                    }}
                    gap={5}
                    mb={12}
                >

                    {[
                        {
                            title:
                                "Today's Habits",
                            value: "06",
                        },
                        {
                            title:
                                "Completed",
                            value: "02",
                        },
                        {
                            title:
                                "Pending",
                            value: "04",
                        },
                        {
                            title:
                                "Completion",
                            value: "33%",
                        },
                    ].map(stat => (
                        <Box
                            key={stat.title}
                            p={6}
                            borderRadius="3xl"
                            border="1px solid"
                            borderColor="
                                rgba(148,163,184,0.16)
                            "
                            bg="white"
                            transition="0.25s"
                            _hover={{
                                transform:
                                    "translateY(-3px)",
                            }}
                            _dark={{
                                bg: "#111827",
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
                                color="#0F172A"
                                _dark={{
                                    color:
                                        "#F8FAFC",
                                }}
                            >
                                {stat.value}
                            </Heading>

                        </Box>
                    ))}

                </Grid>

                {/* ========================================
                    HEADER
                ======================================== */}

                <Flex
                    mb={6}
                    align="center"
                    justify="space-between"
                    flexWrap="wrap"
                    gap={4}
                >

                    <Heading
                        size="lg"
                        color="#0F172A"
                        _dark={{
                            color:
                                "#F8FAFC",
                        }}
                    >
                        Today&apos;s Habits
                    </Heading>

                    <Button
                        bg="#6366F1"
                        color="white"
                        borderRadius="full"
                        _hover={{
                            bg: "#5558E3",
                        }}
                    >
                        <LuPlus />
                        Create Habit
                    </Button>

                </Flex>

                {/* ========================================
                    LOADING
                ======================================== */}

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
                                        rgba(148,163,184,0.16)
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

                                    <Skeleton
                                        h="24px"
                                        w="90px"
                                    />

                                </Box>
                            ))}

                    </Grid>
                )}

                {/* ========================================
                    HABITS GRID
                ======================================== */}

                {!habitsLoading && (
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

                        {habits.map(habit => (

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
                                        borderColor="
                                            rgba(148,163,184,0.16)
                                        "
                                        bg={
                                            habit.completed
                                                ? "rgba(16,185,129,0.10)"
                                                : "white"
                                        }
                                        cursor="pointer"
                                        overflow="hidden"
                                        transition="0.25s"
                                        _hover={{
                                            transform:
                                                "translateY(-4px)",
                                            borderColor:
                                                habit.completed
                                                    ? "#10B981"
                                                    : "#6366F1",
                                        }}
                                        _dark={{
                                            bg:
                                                habit.completed
                                                    ? "rgba(16,185,129,0.10)"
                                                    : "#111827",
                                        }}
                                    >

                                        {/* GLOW */}

                                        <Box
                                            position="absolute"
                                            top="-40px"
                                            right="-40px"
                                            w="120px"
                                            h="120px"
                                            bg={
                                                habit.completed
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
                                                    bg="
                                                        rgba(99,102,241,0.12)
                                                    "
                                                    color="#6366F1"
                                                >
                                                    {habit.schedule}
                                                </Badge>

                                                <Badge
                                                    px={3}
                                                    py={1}
                                                    borderRadius="full"
                                                    bg={
                                                        habit.completed
                                                            ? "rgba(16,185,129,0.12)"
                                                            : "rgba(99,102,241,0.12)"
                                                    }
                                                    color={
                                                        habit.completed
                                                            ? "#10B981"
                                                            : "#6366F1"
                                                    }
                                                >
                                                    {habit.completed
                                                        ? "Completed"
                                                        : "Pending"}
                                                </Badge>

                                            </Flex>

                                        </Flex>

                                        {/* COMPLETE */}

                                        <IconButton
                                            aria-label="complete"
                                            size="sm"
                                            position="absolute"
                                            top={4}
                                            right={4}
                                            borderRadius="full"
                                            bg={
                                                habit.completed
                                                    ? "#10B981"
                                                    : "rgba(99,102,241,0.12)"
                                            }
                                            color={
                                                habit.completed
                                                    ? "white"
                                                    : "#6366F1"
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
                                        Mark habit as complete
                                    </Tooltip.Content>

                                </Tooltip.Positioner>

                            </Tooltip.Root>
                        ))}

                    </Grid>
                )}

                {/* ========================================
                    ANALYTICS
                ======================================== */}

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
                            rgba(148,163,184,0.16)
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

                            {[45, 70, 85, 35, 90, 65, 55]
                                .map((height, index) => (
                                    <Box
                                        key={index}
                                        flex="1"
                                        h={`${height}%`}
                                        borderRadius="2xl"
                                        bg={
                                            index === 4
                                                ? "#6366F1"
                                                : "rgba(99,102,241,0.18)"
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
                            rgba(148,163,184,0.16)
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

                            {[
                                {
                                    label:
                                        "Consistency",
                                    value: "82%",
                                },
                                {
                                    label:
                                        "Focus Score",
                                    value: "91%",
                                },
                                {
                                    label:
                                        "Completion Rate",
                                    value: "67%",
                                },
                            ].map(item => (
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
                                            color="#6366F1"
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
                                            bg="#6366F1"
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