"use client";

import Link from "next/link";

import {
    Box,
    Button,
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

const RegisterPage = () => {

    // ========================================
    // STATE
    // ========================================

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [phoneNumber, setPhoneNumber] =
        useState("");

    const [dateOfBirth, setDateOfBirth] =
        useState("");

    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        phoneNumber?: string;
        dateOfBirth?: string;
    }>({});

    const axiosRequest =
        useAxiosRequest();

    const router =
        useRouter();

    // ========================================
    // VALIDATORS
    // ========================================

    const validateName = (
        value: string
    ) => {

        if (!value.trim()) {
            return "Name is required.";
        }

        if (value.length > 100) {
            return "Name must not exceed 100 characters.";
        }

        return "";
    };

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

    const validatePhoneNumber = (
        value: string
    ) => {

        if (!value.trim()) {
            return "Phone number is required.";
        }

        const phoneRegex =
            /^\+?[1-9]\d{1,14}$/;

        if (!phoneRegex.test(value)) {
            return "Invalid phone number format.";
        }

        return "";
    };

    const validateDateOfBirth = (
        value: string
    ) => {

        if (!value.trim()) {
            return "Date of birth is required.";
        }

        return "";
    };

    const validateConfirmPassword = (
        value: string
    ) => {

        if (!value.trim()) {
            return "Confirm password is required.";
        }

        if (value !== password) {
            return "Passwords do not match.";
        }

        return "";
    };

    // ========================================
    // HANDLERS
    // ========================================

    const handleRegister = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        const nameError =
            validateName(name);

        const emailError =
            validateEmail(email);

        const passwordError =
            validatePassword(password);

        const confirmPasswordError =
            validateConfirmPassword(confirmPassword);

        const phoneNumberError =
            validatePhoneNumber(phoneNumber);

        const dateOfBirthError =
            validateDateOfBirth(dateOfBirth);

        if (
            nameError ||
            emailError ||
            passwordError ||
            confirmPasswordError ||
            phoneNumberError ||
            dateOfBirthError
        ) {
            setErrors({
                name: nameError,
                email: emailError,
                password: passwordError,
                confirmPassword: confirmPasswordError,
                phoneNumber: phoneNumberError,
                dateOfBirth: dateOfBirthError,
            });

            return;
        }

        setErrors({});

        const resp = await axiosRequest.post(
            "/user/create",
            {
                name,
                email,
                password,
                phoneNumber,
                dateOfBirth,
            }
        );

        const data = resp.data;

        if (data?.success) {
            router.push("/login");
        }
    };

    return (
        <Box
            h="100vh"
            display="flex"
            flexDirection="column"
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
                                Start building
                                better{" "}
                                <Text
                                    as="span"
                                    color="#6366F1"
                                >
                                    habits.
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
                        REGISTER CARD
                    ======================================== */}

                    <Flex
                        flex="1"
                        justify="center"
                    >

                        <Box
                            as="form"
                            onSubmit={handleRegister}
                            w="full"
                            maxW="480px"
                            p={{
                                base: 6,
                                md: 8,
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
                                mb={6}
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
                                    Create account
                                </Heading>

                                <Text
                                    color="#64748B"
                                    lineHeight="1.8"
                                    _dark={{
                                        color: "#94A3B8",
                                    }}
                                >
                                    Enter your details
                                    to begin building
                                    consistency.
                                </Text>

                            </VStack>

                            {/* FORM */}

                            <VStack
                                gap={4}
                                align="stretch"
                            >

                                {/* NAME + EMAIL */}

                                <HStack
                                    align="start"
                                    gap={4}
                                >

                                    <VStack
                                        align="stretch"
                                        gap={3}
                                        flex="1"
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
                                            Full name
                                        </Text>

                                        <Input
                                            value={name}
                                            onChange={e =>
                                                setName(
                                                    e.target.value
                                                )
                                            }
                                            h="56px"
                                            borderRadius="xl"
                                            borderColor={
                                                errors.name
                                                    ? "red.400"
                                                    : "rgba(99,102,241,0.15)"
                                            }
                                            placeholder="John Doe"
                                            bg="white"
                                            color="#0F172A"
                                            _dark={{
                                                bg: "#020617",
                                                borderColor:
                                                    errors.name
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

                                        {errors.name && (
                                            <Text
                                                fontSize="sm"
                                                color="red.400"
                                            >
                                                {errors.name}
                                            </Text>
                                        )}

                                    </VStack>

                                    <VStack
                                        align="stretch"
                                        gap={3}
                                        flex="1"
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

                                </HStack>

                                {/* PASSWORD */}

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
                                        Password
                                    </Text>

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

                                {/* CONFIRM PASSWORD */}

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
                                        Confirm password
                                    </Text>

                                    <InputGroup
                                        endElement={
                                            <IconButton
                                                aria-label="toggle confirm password"
                                                variant="ghost"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        prev => !prev
                                                    )
                                                }
                                            >
                                                {showConfirmPassword
                                                    ? <LuEyeOff />
                                                    : <LuEye />}
                                            </IconButton>
                                        }
                                    >

                                        <Input
                                            value={confirmPassword}
                                            onChange={e =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            h="56px"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            borderRadius="xl"
                                            borderColor={
                                                errors.confirmPassword
                                                    ? "red.400"
                                                    : "rgba(99,102,241,0.15)"
                                            }
                                            placeholder="••••••••"
                                            bg="white"
                                            color="#0F172A"
                                            _dark={{
                                                bg: "#020617",
                                                borderColor:
                                                    errors.confirmPassword
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

                                    {errors.confirmPassword && (
                                        <Text
                                            fontSize="sm"
                                            color="red.400"
                                        >
                                            {errors.confirmPassword}
                                        </Text>
                                    )}

                                </VStack>

                                {/* PHONE NUMBER + DATE OF BIRTH */}

                                <HStack
                                    align="start"
                                    gap={4}
                                >

                                    <VStack
                                        align="stretch"
                                        gap={3}
                                        flex="1"
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
                                            Phone number
                                        </Text>

                                        <Input
                                            value={phoneNumber}
                                            onChange={e =>
                                                setPhoneNumber(
                                                    e.target.value
                                                )
                                            }
                                            h="56px"
                                            borderRadius="xl"
                                            borderColor={
                                                errors.phoneNumber
                                                    ? "red.400"
                                                    : "rgba(99,102,241,0.15)"
                                            }
                                            placeholder="+1234567890"
                                            bg="white"
                                            color="#0F172A"
                                            _dark={{
                                                bg: "#020617",
                                                borderColor:
                                                    errors.phoneNumber
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

                                        {errors.phoneNumber && (
                                            <Text
                                                fontSize="sm"
                                                color="red.400"
                                            >
                                                {errors.phoneNumber}
                                            </Text>
                                        )}

                                    </VStack>

                                    <VStack
                                        align="stretch"
                                        gap={3}
                                        flex="1"
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
                                            Date of birth
                                        </Text>

                                        <Input
                                            value={dateOfBirth}
                                            onChange={e =>
                                                setDateOfBirth(
                                                    e.target.value
                                                )
                                            }
                                            h="56px"
                                            borderRadius="xl"
                                            borderColor={
                                                errors.dateOfBirth
                                                    ? "red.400"
                                                    : "rgba(99,102,241,0.15)"
                                            }
                                            type="date"
                                            bg="white"
                                            color="#0F172A"
                                            _dark={{
                                                bg: "#020617",
                                                borderColor:
                                                    errors.dateOfBirth
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

                                        {errors.dateOfBirth && (
                                            <Text
                                                fontSize="sm"
                                                color="red.400"
                                            >
                                                {errors.dateOfBirth}
                                            </Text>
                                        )}

                                    </VStack>

                                </HStack>

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
                                    Create account
                                </Button>

                            </VStack>

                            {/* FOOTER */}

                            <VStack
                                mt={6}
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
                                    Already have an
                                    account?
                                </Text>

                                <Link href="/login">

                                    <Text
                                        color="#6366F1"
                                        fontWeight="700"
                                        cursor="pointer"
                                        _hover={{
                                            textDecoration:
                                                "underline",
                                        }}
                                    >
                                        Log in to Habitual
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

export default RegisterPage;
