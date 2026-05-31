"use client";

import {
    useState,
} from "react";

import {
    Badge,
    Box,
    Button,
    Checkbox,
    Dialog,
    Flex,
    HStack,
    Input,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";

import {
    LuCalendarDays,
    LuClock3,
    LuPlus,
    LuRepeat,
    LuBriefcase,
    LuCoffee,
} from "react-icons/lu";

import useAxiosRequest
    from "@/hooks/useAxiosRequest";

// ========================================
// TYPES
// ========================================

type CreateHabitDialogProps = {
    trigger?: React.ReactNode;
    onSuccess?: () => void;
};

type SchedulePreset =
    | "daily"
    | "weekdays"
    | "weekends"
    | "custom"
    | "interval";

// ========================================
// CONSTANTS
// ========================================

const DAYS_OF_WEEK = [
    { label: "Mon", value: "1" },
    { label: "Tue", value: "2" },
    { label: "Wed", value: "3" },
    { label: "Thu", value: "4" },
    { label: "Fri", value: "5" },
    { label: "Sat", value: "6" },
    { label: "Sun", value: "0" },
];

const SCHEDULE_OPTIONS: {
    label: string;
    preset: SchedulePreset;
    icon: React.ComponentType;
    color: string;
    bg: string;
    description: string;
}[] = [
    {
        label: "Daily",
        preset: "daily",
        icon: LuClock3,
        color: "#6366F1",
        bg: "rgba(99,102,241,0.12)",
        description: "Every day",
    },
    {
        label: "Weekdays",
        preset: "weekdays",
        icon: LuBriefcase,
        color: "#3B82F6",
        bg: "rgba(59,130,246,0.12)",
        description: "Mon — Fri",
    },
    {
        label: "Weekends",
        preset: "weekends",
        icon: LuCoffee,
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.12)",
        description: "Sat & Sun",
    },
    {
        label: "Custom",
        preset: "custom",
        icon: LuCalendarDays,
        color: "#8B5CF6",
        bg: "rgba(139,92,246,0.12)",
        description: "Pick days",
    },
    {
        label: "Interval",
        preset: "interval",
        icon: LuRepeat,
        color: "#10B981",
        bg: "rgba(16,185,129,0.12)",
        description: "Every X days",
    },
];

// ========================================
// COMPONENT
// ========================================

const CreateHabitDialog = ({
    trigger,
    onSuccess,
}: CreateHabitDialogProps) => {

    // ========================================
    // STATE
    // ========================================

    const [open, setOpen] =
        useState(false);

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [schedulePreset, setSchedulePreset] =
        useState<SchedulePreset>("daily");

    const [daysOfWeek, setDaysOfWeek] =
        useState<string[]>([]);

    const [intervalDays, setIntervalDays] =
        useState<string>("3");

    const [errors, setErrors] =
        useState<Record<string, string>>({});

    const [submitting, setSubmitting] =
        useState(false);

    // ========================================
    // AXIOS
    // ========================================

    const axiosRequest =
        useAxiosRequest();

    // ========================================
    // HELPERS
    // ========================================

    const resetForm = () => {
        setName("");
        setDescription("");
        setSchedulePreset("daily");
        setDaysOfWeek([]);
        setIntervalDays("3");
        setErrors({});
    };

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (!name.trim()) {
            nextErrors.name = "Habit name is required.";
        }

        if (!description.trim()) {
            nextErrors.description = "Habit description is required.";
        }

        if (schedulePreset === "custom" && daysOfWeek.length === 0) {
            nextErrors.daysOfWeek = "Select at least one day.";
        }

        if (schedulePreset === "interval") {
            const interval = parseInt(intervalDays, 10);
            if (!intervalDays || isNaN(interval) || interval < 1) {
                nextErrors.interval = "Enter a valid interval (at least 1 day).";
            }
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    // ========================================
    // HANDLERS
    // ========================================

    const handleOpenChange = (
        details: { open: boolean }
    ) => {
        setOpen(details.open);
        if (!details.open) {
            resetForm();
        }
    };

    const handleSchedulePresetChange = (
        preset: SchedulePreset
    ) => {
        setSchedulePreset(preset);
        setDaysOfWeek([]);
        setIntervalDays("3");
        setErrors(prev => {
            const next = { ...prev };
            delete next.daysOfWeek;
            delete next.interval;
            return next;
        });
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        setSubmitting(true);

        try {
            let typeNum: number;
            let finalDaysOfWeek: number[] = [];
            let finalInterval: number | null = null;

            switch (schedulePreset) {
                case "daily":
                    typeNum = 0;
                    break;
                case "weekdays":
                    typeNum = 1;
                    finalDaysOfWeek = [1, 2, 3, 4, 5];
                    break;
                case "weekends":
                    typeNum = 1;
                    finalDaysOfWeek = [0, 6];
                    break;
                case "custom":
                    typeNum = 1;
                    finalDaysOfWeek = daysOfWeek.map(Number);
                    break;
                case "interval":
                    typeNum = 2;
                    finalInterval = parseInt(intervalDays, 10);
                    break;
                default:
                    typeNum = 0;
            }

            await axiosRequest.post(
                "/Habit/create",
                {
                    name: name.trim(),
                    description: description.trim(),
                    isActive: true,
                    schedule: {
                        type: typeNum,
                        interval: finalInterval,
                        daysOfWeek: finalDaysOfWeek,
                    },
                }
            );

            setOpen(false);
            resetForm();
            onSuccess?.();
        }
        finally {
            setSubmitting(false);
        }
    };

    // ========================================
    // FLAGS
    // ========================================

    const showDaysOfWeek =
        schedulePreset === "custom";

    const showInterval =
        schedulePreset === "interval";

    // ========================================
    // RENDER
    // ========================================

    return (
        <Dialog.Root
            open={open}
            onOpenChange={handleOpenChange}
        >
            {/* TRIGGER */}
            <Dialog.Trigger asChild>
                {trigger ?? (
                    <Button
                        bg="#6366F1"
                        color="white"
                        borderRadius="full"
                        px={6}
                        _hover={{
                            bg: "#5558E3",
                            transform: "translateY(-1px)",
                        }}
                        transition="0.2s"
                    >
                        <LuPlus />
                        Create Habit
                    </Button>
                )}
            </Dialog.Trigger>

            {/* BACKDROP */}
            <Dialog.Backdrop
                backdropFilter="blur(12px)"
                bg="rgba(2,6,23,0.55)"
            />

            {/* CONTENT */}
            <Dialog.Positioner>
                <Dialog.Content
                    borderRadius="24px"
                    overflow="hidden"
                    bg="white"
                    border="1px solid"
                    borderColor="rgba(148,163,184,0.16)"
                    boxShadow="0 20px 60px rgba(0,0,0,0.12)"
                    maxW="580px"
                    w="full"
                    p={0}
                    _dark={{
                        bg: "#0F172A",
                        borderColor: "rgba(255,255,255,0.06)",
                    }}
                >
                    <Dialog.Header px={8} pt={8} pb={4}>
                        <VStack align="start" gap={3}>
                            <Badge
                                px={4}
                                py={1.5}
                                borderRadius="full"
                                bg="rgba(99,102,241,0.12)"
                                color="#6366F1"
                            >
                                Habitual
                            </Badge>
                            <Dialog.Title
                                fontSize="3xl"
                                fontWeight="800"
                                letterSpacing="-0.04em"
                                color="#0F172A"
                                _dark={{ color: "#F8FAFC" }}
                            >
                                Create New Habit
                            </Dialog.Title>
                            <Text
                                color="#64748B"
                                _dark={{ color: "#94A3B8" }}
                            >
                                Build consistency through disciplined repetition.
                            </Text>
                        </VStack>
                    </Dialog.Header>

                    {/* BODY */}
                    <Dialog.Body px={8} pb={6}>
                        <VStack align="stretch" gap={6}>
                            {/* NAME */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    mb={2}
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                >
                                    Habit Name
                                </Text>
                                <Input
                                    placeholder="Morning Run"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    borderRadius="2xl"
                                    size="lg"
                                    bg="white"
                                    _dark={{
                                        bg: "#111827",
                                        color: "#F8FAFC",
                                    }}
                                    border="1px solid"
                                    borderColor={
                                        errors.name
                                            ? "red.400"
                                            : "rgba(148,163,184,0.22)"
                                    }
                                    _hover={{ borderColor: "#6366F1" }}
                                    _focusVisible={{
                                        borderColor: "#6366F1",
                                        boxShadow: "0 0 0 4px rgba(99,102,241,0.12)",
                                    }}
                                />
                                {errors.name && (
                                    <Text fontSize="xs" color="red.400" mt={2}>
                                        {errors.name}
                                    </Text>
                                )}
                            </Box>

                            {/* DESCRIPTION */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    mb={2}
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                >
                                    Description
                                </Text>
                                <Textarea
                                    placeholder="Describe the habit and why it matters..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    borderRadius="2xl"
                                    minH="120px"
                                    resize="vertical"
                                    bg="white"
                                    _dark={{
                                        bg: "#111827",
                                        color: "#F8FAFC",
                                    }}
                                    border="1px solid"
                                    borderColor={
                                        errors.description
                                            ? "red.400"
                                            : "rgba(148,163,184,0.22)"
                                    }
                                    _hover={{ borderColor: "#6366F1" }}
                                    _focusVisible={{
                                        borderColor: "#6366F1",
                                        boxShadow: "0 0 0 4px rgba(99,102,241,0.12)",
                                    }}
                                />
                                {errors.description && (
                                    <Text fontSize="xs" color="red.400" mt={2}>
                                        {errors.description}
                                    </Text>
                                )}
                            </Box>

                            {/* SCHEDULE */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    mb={3}
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                >
                                    Schedule
                                </Text>
                                <Flex gap={3} wrap="wrap">
                                    {SCHEDULE_OPTIONS.map(option => {
                                        const isSelected =
                                            schedulePreset === option.preset;
                                        const Icon = option.icon;

                                        return (
                                            <Box
                                                key={option.preset}
                                                flex="1"
                                                minW="150px"
                                                onClick={() =>
                                                    handleSchedulePresetChange(
                                                        option.preset
                                                    )
                                                }
                                                cursor="pointer"
                                                borderRadius="2xl"
                                                p={4}
                                                border="1px solid"
                                                transition="0.2s"
                                                bg={
                                                    isSelected
                                                        ? option.bg
                                                        : "transparent"
                                                }
                                                borderColor={
                                                    isSelected
                                                        ? option.color
                                                        : "rgba(148,163,184,0.22)"
                                                }
                                                _hover={{
                                                    borderColor: option.color,
                                                    transform: "translateY(-1px)",
                                                }}
                                            >
                                                <VStack align="start" gap={2}>
                                                    <Flex
                                                        w="42px"
                                                        h="42px"
                                                        borderRadius="xl"
                                                        align="center"
                                                        justify="center"
                                                        bg={option.bg}
                                                        color={option.color}
                                                    >
                                                        <Icon />
                                                    </Flex>
                                                    <Box>
                                                        <Text
                                                            fontWeight="700"
                                                            color="#0F172A"
                                                            _dark={{
                                                                color: "#F8FAFC",
                                                            }}
                                                            lineHeight="1.2"
                                                        >
                                                            {option.label}
                                                        </Text>
                                                        <Text
                                                            fontSize="xs"
                                                            color="#64748B"
                                                            _dark={{
                                                                color: "#94A3B8",
                                                            }}
                                                            mt={0.5}
                                                        >
                                                            {option.description}
                                                        </Text>
                                                    </Box>
                                                </VStack>
                                            </Box>
                                        );
                                    })}
                                </Flex>
                            </Box>

                            {/* CUSTOM DAYS */}
                            {showDaysOfWeek && (
                                <Box>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="700"
                                        mb={3}
                                        color="#0F172A"
                                        _dark={{ color: "#F8FAFC" }}
                                    >
                                        Active Days
                                    </Text>
                                    <Checkbox.Group
                                        value={daysOfWeek}
                                        onValueChange={(value) =>
                                            setDaysOfWeek(value)
                                        }
                                    >
                                        <Flex gap={3} wrap="wrap">
                                            {DAYS_OF_WEEK.map(day => {
                                                const active =
                                                    daysOfWeek.includes(
                                                        day.value
                                                    );

                                                return (
                                                    <Checkbox.Root
                                                        key={day.value}
                                                        value={day.value}
                                                    >
                                                        <Checkbox.HiddenInput />
                                                        <Checkbox.Control
                                                            display="none"
                                                        />
                                                        <Checkbox.Label
                                                            px={4}
                                                            py={2.5}
                                                            borderRadius="full"
                                                            cursor="pointer"
                                                            border="1px solid"
                                                            transition="0.2s"
                                                            bg={
                                                                active
                                                                    ? "#6366F1"
                                                                    : "transparent"
                                                            }
                                                            color={
                                                                active
                                                                    ? "white"
                                                                    : "#64748B"
                                                            }
                                                            borderColor={
                                                                active
                                                                    ? "#6366F1"
                                                                    : "rgba(148,163,184,0.22)"
                                                            }
                                                            _dark={{
                                                                color: active
                                                                    ? "white"
                                                                    : "#94A3B8",
                                                            }}
                                                        >
                                                            {day.label}
                                                        </Checkbox.Label>
                                                    </Checkbox.Root>
                                                );
                                            })}
                                        </Flex>
                                    </Checkbox.Group>
                                    {errors.daysOfWeek && (
                                        <Text fontSize="xs" color="red.400" mt={2}>
                                            {errors.daysOfWeek}
                                        </Text>
                                    )}
                                </Box>
                            )}

                            {/* INTERVAL */}
                            {showInterval && (
                                <Box>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="700"
                                        mb={2}
                                        color="#0F172A"
                                        _dark={{ color: "#F8FAFC" }}
                                    >
                                        Repeat Every
                                    </Text>
                                    <HStack gap={3} align="center">
                                        <Input
                                            type="number"
                                            min={1}
                                            value={intervalDays}
                                            onChange={(e) =>
                                                setIntervalDays(e.target.value)
                                            }
                                            borderRadius="2xl"
                                            size="lg"
                                            w="120px"
                                            bg="white"
                                            _dark={{
                                                bg: "#111827",
                                                color: "#F8FAFC",
                                            }}
                                            border="1px solid"
                                            borderColor={
                                                errors.interval
                                                    ? "red.400"
                                                    : "rgba(148,163,184,0.22)"
                                            }
                                            _hover={{ borderColor: "#6366F1" }}
                                            _focusVisible={{
                                                borderColor: "#6366F1",
                                                boxShadow:
                                                    "0 0 0 4px rgba(99,102,241,0.12)",
                                            }}
                                        />
                                        <Text
                                            fontSize="sm"
                                            color="#64748B"
                                            _dark={{ color: "#94A3B8" }}
                                        >
                                            days
                                        </Text>
                                    </HStack>
                                    {errors.interval && (
                                        <Text fontSize="xs" color="red.400" mt={2}>
                                            {errors.interval}
                                        </Text>
                                    )}
                                </Box>
                            )}
                        </VStack>
                    </Dialog.Body>

                    {/* FOOTER */}
                    <Dialog.Footer px={8} pb={8} pt={2} gap={3}>
                        <Dialog.ActionTrigger asChild>
                            <Button
                                variant="ghost"
                                borderRadius="full"
                                px={6}
                                color="#64748B"
                                _dark={{ color: "#94A3B8" }}
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                        </Dialog.ActionTrigger>
                        <Button
                            bg="#6366F1"
                            color="white"
                            borderRadius="full"
                            px={6}
                            _hover={{ bg: "#5558E3" }}
                            loading={submitting}
                            onClick={handleSubmit}
                        >
                            Create Habit
                        </Button>
                    </Dialog.Footer>

                    <Dialog.CloseTrigger top={5} right={5} />
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default CreateHabitDialog;
