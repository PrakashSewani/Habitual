"use client";

import Link from "next/link";

import {
    Box,
    Button,
    Checkbox,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    Text,
    VStack,
} from "@chakra-ui/react";

import {
    LuEye,
    LuEyeOff,
} from "react-icons/lu";

import { useState } from "react";

import LoginNavbar from "@/components/Navbar/LoginNavbar";

import Footer from "@/components/Footer";

import useAxiosRequest from "@/hooks/useAxiosRequest";

import { useRouter } from "next/router";

const LoginPage = () => {

    // ========================================
    // STATE
    // ========================================

    const [showPassword, setShowPassword] =
        useState(false);

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const axiosRequest =
        useAxiosRequest();

    const router =
        useRouter();

    // ========================================
    // VALIDATORS
    // ========================================

    const validateEmail = (
        value: string
    ) => {

        if (!value.trim()) {
            return "Email is required.";
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            return "Invalid email format.";
        }

        return "";
    };

    const validatePassword = (
        value: string
    ) => {

        if (!value.trim()) {
            return "Password is required.";
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

        if (
            !passwordRegex.test(value)
        ) {
            return `
Password must contain at least:
• one uppercase letter
• one lowercase letter
• one number
• one special character
• minimum 8 characters
            `;
        }

        return "";
    };

    // ========================================
    // HANDLERS
    // ========================================

    const handleLogin = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        const emailError =
            validateEmail(email);

        const passwordError =
            validatePassword(password);

        if (
            emailError ||
            passwordError
        ) {
            setErrors({
                email: emailError,
                password: passwordError,
            });

            return;
        }

        setErrors({});

        const resp = await axiosRequest.post(
            "/user/login",
            {
                email,
                password,
            }
        );

        const data = resp.data;

        sessionStorage.setItem(
            "token",
            data.data.token
        );

        sessionStorage.setItem(
            "refreshToken",
            data.data.refreshToken
        );

        router.push("/dashboard");
    };

    return (
        <Box
            h="100vh"
            display="flex"
            flexDirection="column"
            position="relative"
            overflow="hidden"
            bg="#FAFAFF"
            _dark={{
                bg: "#020617",
            }}
        >

            {/* ========================================
                NAVBAR
            ======================================== */}

            <LoginNavbar />

            {/* ========================================
                AMBIENT GLOW
            ======================================== */}

            <Box
                position="absolute"
                top="-200px"
                left="-200px"
                w="500px"
                h="500px"
                borderRadius="full"
                bg="#6366F1"
                opacity="0.10"
                filter="blur(140px)"
            />

            <Box
                position="absolute"
                bottom="-200px"
                right="-200px"
                w="500px"
                h="500px"
                borderRadius="full"
                bg="#6366F1"
                opacity="0.08"
                filter="blur(160px)"
            />

            {/* ========================================
                MAIN CONTENT
            ======================================== */}

            <Flex
                flex="1"
                minH="0"
                px={{
                    base: 6,
                    md: 12,
                }}
                py={3}
                align="center"
                justify="center"
                overflow="auto"
            >

                <Flex
                    w="full"
                    maxW="1400px"
                    gap={20}
                    align="center"
                    justify="space-between"
                >

                    {/* ========================================
                        LEFT SIDE
                    ======================================== */}

                    <VStack
                        flex="1"
                        align="start"
                        gap={10}
                        display={{
                            base: "none",
                            lg: "flex",
                        }}
                    >

                        <VStack
                            align="start"
                            gap={6}
                        >

                            <Heading
                                fontSize={{
                                    base: "5xl",
                                    xl: "7xl",
                                }}
                                lineHeight="0.95"
                                letterSpacing="-0.06em"
                                color="#0F172A"
                                _dark={{
                                    color: "#F8FAFC",
                                }}
                            >
                                Master your habits
                                with{" "}
                                <Text
                                    as="span"
                                    color="#6366F1"
                                >
                                    clarity.
                                </Text>
                            </Heading>

                            <Text
                                maxW="600px"
                                fontSize="xl"
                                lineHeight="1.9"
                                color="#64748B"
                                _dark={{
                                    color: "#94A3B8",
                                }}
                            >
                                A professional
                                environment designed
                                for disciplined
                                individuals seeking
                                consistency, focus,
                                and measurable
                                growth.
                            </Text>

                        </VStack>

                        {/* DASHBOARD */}

                        <Box
                            w="full"
                            maxW="650px"
                            p={8}
                            borderRadius="3xl"
                            border="1px solid"
                            borderColor="gray.200"
                            bg="white"
                            boxShadow="
                                0 20px 60px rgba(0,0,0,0.06)
                            "
                            _dark={{
                                bg: "#111827",
                                borderColor:
                                    "rgba(148,163,184,0.16)",
                                boxShadow:
                                    "0 20px 60px rgba(0,0,0,0.35)",
                            }}
                        >

                            <VStack
                                align="stretch"
                                gap={6}
                            >

                                <HStack
                                    justify="space-between"
                                >

                                    <VStack
                                        align="start"
                                        gap={0}
                                    >

                                        <Text
                                            fontWeight="700"
                                            color="#0F172A"
                                            _dark={{
                                                color:
                                                    "#F8FAFC",
                                            }}
                                        >
                                            Weekly Progress
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            color="#64748B"
                                            _dark={{
                                                color:
                                                    "#94A3B8",
                                            }}
                                        >
                                            Consistency Analytics
                                        </Text>

                                    </VStack>

                                    <Box
                                        px={4}
                                        py={2}
                                        borderRadius="full"
                                        bg="
                                            rgba(16,185,129,0.12)
                                        "
                                    >
                                        <Text
                                            fontSize="sm"
                                            fontWeight="700"
                                            color="#10B981"
                                        >
                                            +18%
                                        </Text>
                                    </Box>

                                </HStack>

                                <HStack
                                    align="end"
                                    gap={3}
                                    h="160px"
                                >

                                    {[40, 65, 55, 85, 75, 100, 90]
                                        .map((height, index) => (
                                            <Box
                                                key={index}
                                                flex="1"
                                                h={`${height}%`}
                                                borderRadius="xl"
                                                bg={
                                                    index === 5
                                                        ? "#6366F1"
                                                        : "rgba(99,102,241,0.18)"
                                                }
                                            />
                                        ))}

                                </HStack>

                            </VStack>
                        </Box>
                    </VStack>

                    {/* ========================================
                        LOGIN CARD
                    ======================================== */}

                    <Flex
                        flex="1"
                        justify="center"
                    >

                        <Box
                            as="form"
                            onSubmit={handleLogin}
                            w="full"
                            maxW="480px"
                            p={{
                                base: 8,
                                md: 10,
                            }}
                            borderRadius="3xl"
                            border="1px solid"
                            borderColor="gray.200"
                            bg="white"
                            boxShadow="
                                0 20px 60px rgba(0,0,0,0.06)
                            "
                            _dark={{
                                bg: "#111827",
                                borderColor:
                                    "rgba(148,163,184,0.16)",
                                boxShadow:
                                    "0 20px 60px rgba(0,0,0,0.35)",
                            }}
                        >

                            {/* HEADER */}

                            <VStack
                                align="start"
                                gap={3}
                                mb={8}
                            >

                                <Heading
                                    fontSize={{
                                        base: "3xl",
                                        md: "4xl",
                                    }}
                                    letterSpacing="-0.04em"
                                    color="#0F172A"
                                    _dark={{
                                        color: "#F8FAFC",
                                    }}
                                >
                                    Welcome back
                                </Heading>

                                <Text
                                    color="#64748B"
                                    lineHeight="1.8"
                                    _dark={{
                                        color: "#94A3B8",
                                    }}
                                >
                                    Enter your credentials
                                    to continue building
                                    consistency.
                                </Text>

                            </VStack>

                            {/* FORM */}

                            <VStack
                                gap={5}
                                align="stretch"
                            >

                                {/* EMAIL */}

                                <VStack
                                    align="stretch"
                                    gap={3}
                                >

                                    <Text
                                        fontSize="sm"
                                        fontWeight="700"
                                        textTransform="uppercase"
                                        letterSpacing="0.08em"
                                        color="#64748B"
                                        _dark={{
                                            color:
                                                "#94A3B8",
                                        }}
                                    >
                                        Email address
                                    </Text>

                                    <Input
                                        value={email}
                                        onChange={e =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        h="56px"
                                        borderRadius="xl"
                                        borderColor={
                                            errors.email
                                                ? "red.400"
                                                : "rgba(99,102,241,0.15)"
                                        }
                                        placeholder="name@company.com"
                                        bg="white"
                                        color="#0F172A"
                                        _dark={{
                                            bg: "#020617",
                                            borderColor:
                                                errors.email
                                                    ? "red.400"
                                                    : "rgba(148,163,184,0.16)",
                                            color: "#F8FAFC",
                                        }}
                                        _placeholder={{
                                            color: "#94A3B8",
                                        }}
                                        _focusVisible={{
                                            borderColor:
                                                "#6366F1",
                                            boxShadow:
                                                "0 0 0 4px rgba(99,102,241,0.12)",
                                        }}
                                    />

                                    {errors.email && (
                                        <Text
                                            fontSize="sm"
                                            color="red.400"
                                        >
                                            {errors.email}
                                        </Text>
                                    )}

                                </VStack>

                                {/* PASSWORD */}

                                <VStack
                                    align="stretch"
                                    gap={3}
                                >

                                    <HStack
                                        justify="space-between"
                                    >

                                        <Text
                                            fontSize="sm"
                                            fontWeight="700"
                                            textTransform="uppercase"
                                            letterSpacing="0.08em"
                                            color="#64748B"
                                            _dark={{
                                                color:
                                                    "#94A3B8",
                                            }}
                                        >
                                            Password
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            color="#6366F1"
                                            cursor="pointer"
                                            fontWeight="600"
                                        >
                                            Forgot password?
                                        </Text>

                                    </HStack>

                                    <InputGroup
                                        endElement={
                                            <IconButton
                                                aria-label="toggle password"
                                                variant="ghost"
                                                onClick={() =>
                                                    setShowPassword(
                                                        prev => !prev
                                                    )
                                                }
                                            >
                                                {showPassword
                                                    ? <LuEyeOff />
                                                    : <LuEye />}
                                            </IconButton>
                                        }
                                    >

                                        <Input
                                            value={password}
                                            onChange={e =>
                                                setPassword(
                                                    e.target.value
                                                )
                                            }
                                            h="56px"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            borderRadius="xl"
                                            borderColor={
                                                errors.password
                                                    ? "red.400"
                                                    : "rgba(99,102,241,0.15)"
                                            }
                                            placeholder="••••••••"
                                            bg="white"
                                            color="#0F172A"
                                            _dark={{
                                                bg: "#020617",
                                                borderColor:
                                                    errors.password
                                                        ? "red.400"
                                                        : "rgba(148,163,184,0.16)",
                                                color: "#F8FAFC",
                                            }}
                                            _placeholder={{
                                                color: "#94A3B8",
                                            }}
                                            _focusVisible={{
                                                borderColor:
                                                    "#6366F1",
                                                boxShadow:
                                                    "0 0 0 4px rgba(99,102,241,0.12)",
                                            }}
                                        />

                                    </InputGroup>

                                    {errors.password && (
                                        <Text
                                            whiteSpace="pre-line"
                                            fontSize="sm"
                                            color="red.400"
                                        >
                                            {errors.password}
                                        </Text>
                                    )}

                                </VStack>

                                {/* REMEMBER */}

                                <Checkbox.Root>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label
                                        color="#64748B"
                                        _dark={{
                                            color:
                                                "#94A3B8",
                                        }}
                                    >
                                        Remember me for
                                        30 days
                                    </Checkbox.Label>
                                </Checkbox.Root>

                                {/* BUTTON */}

                                <Button
                                    type="submit"
                                    h="60px"
                                    bg="#6366F1"
                                    color="white"
                                    borderRadius="xl"
                                    fontWeight="700"
                                    fontSize="md"
                                    boxShadow="
                                        0 10px 30px rgba(99,102,241,0.35)
                                    "
                                    _hover={{
                                        bg: "#5558E3",
                                        transform:
                                            "translateY(-1px)",
                                    }}
                                >
                                    Log in
                                </Button>

                            </VStack>

                            {/* FOOTER */}

                            <VStack
                                mt={8}
                                pt={6}
                                borderTop="1px solid"
                                borderColor="
                                    rgba(99,102,241,0.08)
                                "
                                gap={3}
                            >

                                <Text
                                    color="#64748B"
                                    _dark={{
                                        color: "#94A3B8",
                                    }}
                                >
                                    Don&apos;t have an
                                    account?
                                </Text>

                                <Link href="/register">

                                    <Text
                                        color="#6366F1"
                                        fontWeight="700"
                                        cursor="pointer"
                                        _hover={{
                                            textDecoration:
                                                "underline",
                                        }}
                                    >
                                        Sign up for Habitual
                                    </Text>

                                </Link>

                            </VStack>

                        </Box>
                    </Flex>

                </Flex>
            </Flex>

            <Footer />
        </Box>
    );
};

export default LoginPage;