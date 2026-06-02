"use client";

import Link from "next/link";

import {
    usePathname,
} from "next/navigation";

import {
    Avatar,
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
    Menu,
    Portal,
    Text,
} from "@chakra-ui/react";

import {
    LuChevronDown,
    LuLogOut,
    LuMoon,
    LuSparkles,
    LuSun,
    LuUser,
} from "react-icons/lu";

import {
    useTheme,
} from "next-themes";

type UserNavbarProps = {
    userName?: string;
    currentTime: Date;
    logout: () => void;
};

const UserNavbar = ({
    userName,
    currentTime,
    logout,
}: UserNavbarProps) => {

    const pathname = usePathname();

    const {
        theme,
        setTheme,
    } = useTheme();

    return (
        <Flex
            position="sticky"
            top="0"
            zIndex="999"
            h="72px"
            px={{
                base: 6,
                lg: 10,
            }}
            align="center"
            justify="space-between"
            borderBottom="1px solid"
            borderColor="
                rgba(99,102,241,0.08)
            "
            bg="
                rgba(255,255,255,0.72)
            "
            backdropFilter="blur(18px)"
            _dark={{
                bg: "rgba(2,6,23,0.72)",
                borderColor:
                    "rgba(148,163,184,0.16)",
            }}
        >

            {/* ========================================
                LEFT
            ======================================== */}

            <HStack gap={12}>

                {/* LOGO */}

                <HStack gap={3}>

                    <Box
                        w="12px"
                        h="12px"
                        bg="#6366F1"
                        borderRadius="full"
                        boxShadow="
                            0 0 18px rgba(99,102,241,0.65)
                        "
                    />

                    <Heading
                        size="md"
                        color="#6366F1"
                        letterSpacing="-0.04em"
                    >
                        Habitual
                    </Heading>

                </HStack>

                {/* NAVIGATION */}

                <HStack
                    gap={8}
                    display={{
                        base: "none",
                        lg: "flex",
                    }}
                >

                    <Link href="/dashboard">

                        <Text
                            fontWeight={
                                pathname === "/dashboard"
                                    ? "700"
                                    : "500"
                            }
                            color={
                                pathname === "/dashboard"
                                    ? "#6366F1"
                                    : "#64748B"
                            }
                            transition="0.2s"
                            cursor="pointer"
                            _hover={{
                                color: "#6366F1",
                            }}
                            _dark={{
                                color:
                                    pathname === "/dashboard"
                                        ? "#6366F1"
                                        : "#94A3B8",
                            }}
                        >
                            Dashboard
                        </Text>

                    </Link>

                    <Link href="/habits">

                        <Text
                            fontWeight={
                                pathname === "/habits"
                                    ? "700"
                                    : "500"
                            }
                            color={
                                pathname === "/habits"
                                    ? "#6366F1"
                                    : "#64748B"
                            }
                            transition="0.2s"
                            cursor="pointer"
                            _hover={{
                                color: "#6366F1",
                            }}
                            _dark={{
                                color:
                                    pathname === "/habits"
                                        ? "#6366F1"
                                        : "#94A3B8",
                            }}
                        >
                            Habits
                        </Text>

                    </Link>

                    <Link href="/analytics">

                        <HStack
                            gap={2}
                            cursor="pointer"
                        >

                            <Text
                                fontWeight={
                                    pathname === "/analytics"
                                        ? "700"
                                        : "500"
                                }
                                color={
                                    pathname === "/analytics"
                                        ? "#6366F1"
                                        : "#64748B"
                                }
                                transition="0.2s"
                                _hover={{
                                    color: "#6366F1",
                                }}
                                _dark={{
                                    color:
                                        pathname === "/analytics"
                                            ? "#6366F1"
                                            : "#94A3B8",
                                }}
                            >
                                Deep Analytics
                            </Text>

                            <Badge
                                px={2}
                                py={1}
                                borderRadius="full"
                                bg="
                                    linear-gradient(
                                        135deg,
                                        #6366F1,
                                        #8B5CF6
                                    )
                                "
                                color="white"
                                fontSize="10px"
                                textTransform="uppercase"
                                letterSpacing="0.08em"
                            >
                                PRO
                            </Badge>

                        </HStack>

                    </Link>

                </HStack>

            </HStack>

            {/* ========================================
                RIGHT
            ======================================== */}

            <HStack gap={4}>

                {/* TIME */}

                <Text
                    display={{
                        base: "none",
                        md: "block",
                    }}
                    fontSize="sm"
                    color="#64748B"
                    _dark={{
                        color: "#94A3B8",
                    }}
                >
                    {currentTime.toLocaleTimeString()}
                </Text>

                {/* THEME */}

                <IconButton
                    aria-label="toggle theme"
                    borderRadius="full"
                    bg={
                        theme === "dark"
                            ? "#111827"
                            : "white"
                    }
                    color={
                        theme === "dark"
                            ? "#F8FAFC"
                            : "#0F172A"
                    }
                    border="1px solid"
                    borderColor="
                        rgba(148,163,184,0.16)
                    "
                    onClick={() =>
                        setTheme(
                            theme === "dark"
                                ? "light"
                                : "dark"
                        )
                    }
                >
                    {theme === "dark"
                        ? <LuSun />
                        : <LuMoon />}
                </IconButton>

                {/* USER MENU */}

                <Menu.Root>

                    <Menu.Trigger asChild>

                        <Button
                            variant="ghost"
                            borderRadius="full"
                            px={2}
                            h="48px"
                            _hover={{
                                bg:
                                    "rgba(99,102,241,0.08)",
                            }}
                        >

                            <HStack gap={3}>

                                <Avatar.Root
                                    size="sm"
                                    bg="#6366F1"
                                    color="white"
                                >
                                    <Avatar.Fallback>
                                        {userName?.charAt(0)}
                                    </Avatar.Fallback>
                                </Avatar.Root>

                                <Text
                                    display={{
                                        base: "none",
                                        md: "block",
                                    }}
                                    fontWeight="600"
                                    color="#0F172A"
                                    _dark={{
                                        color:
                                            "#F8FAFC",
                                    }}
                                >
                                    {userName}
                                </Text>

                                <LuChevronDown />

                            </HStack>

                        </Button>

                    </Menu.Trigger>

                    <Portal>

                        <Menu.Positioner>

                            <Menu.Content
                                minW="240px"
                                p={2}
                                borderRadius="2xl"
                                border="1px solid"
                                borderColor="
                                    rgba(148,163,184,0.16)
                                "
                                bg="white"
                                boxShadow="
                                    0 20px 60px rgba(0,0,0,0.12)
                                "
                                _dark={{
                                    bg: "#111827",
                                }}
                            >

                                <Link href="/profile" passHref>
                                    <Menu.Item
                                        value="profile"
                                        borderRadius="xl"
                                        asChild
                                    >
                                        <HStack gap={2} cursor="pointer">
                                            <LuUser />
                                            <Text>Update Profile</Text>
                                        </HStack>
                                    </Menu.Item>
                                </Link>

                                <Menu.Item
                                    disabled
                                    value="premium"
                                    borderRadius="xl"
                                >
                                    <LuSparkles />
                                    Upgrade to Pro
                                </Menu.Item>

                                <Menu.Separator />

                                <Menu.Item
                                    value="logout"
                                    borderRadius="xl"
                                    color="red.400"
                                    onClick={logout}
                                >
                                    <LuLogOut />
                                    Logout
                                </Menu.Item>

                            </Menu.Content>

                        </Menu.Positioner>

                    </Portal>

                </Menu.Root>

            </HStack>

        </Flex>
    );
};

export default UserNavbar;