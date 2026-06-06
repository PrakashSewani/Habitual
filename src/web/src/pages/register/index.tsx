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
    Progress,
    Text,
    VStack,
} from "@chakra-ui/react";

import {
    LuEye,
    LuEyeOff,
    LuX,
    LuCheck,
    LuUpload,
    LuUser,
} from "react-icons/lu";

import { useEffect, useState, useCallback } from "react";

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
        avatar?: string;
    }>({});

    const [touched, setTouched] = useState<{
        name?: boolean;
        email?: boolean;
        password?: boolean;
        confirmPassword?: boolean;
        phoneNumber?: boolean;
        dateOfBirth?: boolean;
    }>({});

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const axiosRequest =
        useAxiosRequest();

    const router =
        useRouter();

    // ========================================
    // PASSWORD STRENGTH
    // ========================================

    const getPasswordStrength = (value: string) => {
        if (!value) return { score: 0, label: "", color: "gray" };
        let score = 0;
        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/\d/.test(value)) score++;
        if (/[^\da-zA-Z]/.test(value)) score++;

        const levels = [
            { label: "Too weak", color: "red" },
            { label: "Weak", color: "orange" },
            { label: "Fair", color: "yellow" },
            { label: "Good", color: "blue" },
            { label: "Strong", color: "green" },
        ];
        return { score, label: levels[score - 1]?.label || "", color: levels[score - 1]?.color || "gray" };
    };

    const passwordStrength = getPasswordStrength(password);

    // ========================================
    // FORM PROGRESS
    // ========================================

    const getFormProgress = useCallback(() => {
        let filled = 0;
        const total = 6;
        if (name.trim()) filled++;
        if (email.trim()) filled++;
        if (password.trim()) filled++;
        if (confirmPassword.trim()) filled++;
        if (phoneNumber.trim()) filled++;
        if (dateOfBirth.trim()) filled++;
        return (filled / total) * 100;
    }, [name, email, password, confirmPassword, phoneNumber, dateOfBirth]);

    const formProgress = getFormProgress();

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

    const validateAvatar = (
        file: File | null
    ) => {
        if (!file) return "";
        if (file.size > 2 * 1024 * 1024) {
            return "Image must be under 2MB.";
        }
        const allowedTypes = ["image/png", "image/jpeg"];
        if (!allowedTypes.includes(file.type)) {
            return "Only PNG or JPG images allowed.";
        }
        return "";
    };

    // ========================================
    // REAL-TIME VALIDATION
    // ========================================

    const validateField = useCallback((field: string, value: string) => {
        switch (field) {
            case "name":
                return validateName(value);
            case "email":
                return validateEmail(value);
            case "password":
                return validatePassword(value);
            case "confirmPassword":
                return validateConfirmPassword(value);
            case "phoneNumber":
                return validatePhoneNumber(value);
            case "dateOfBirth":
                return validateDateOfBirth(value);
            default:
                return "";
        }
    }, [password]);

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, 
            field === "name" ? name :
            field === "email" ? email :
            field === "password" ? password :
            field === "confirmPassword" ? confirmPassword :
            field === "phoneNumber" ? phoneNumber :
            field === "dateOfBirth" ? dateOfBirth : ""
        );
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    // ========================================
    // AVATAR HANDLERS
    // ========================================

    const handleAvatarChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const error = validateAvatar(file);
            if (error) {
                setErrors(prev => ({ ...prev, avatar: error }));
                return;
            }
            setErrors(prev => ({ ...prev, avatar: undefined }));
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setAvatarFile(null);
            setAvatarPreview(null);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        setErrors(prev => ({ ...prev, avatar: undefined }));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0] || null;
        if (file) {
            const error = validateAvatar(file);
            if (error) {
                setErrors(prev => ({ ...prev, avatar: error }));
                return;
            }
            setErrors(prev => ({ ...prev, avatar: undefined }));
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // ========================================
    // HANDLERS
    // ========================================

    const handleRegister = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        // Mark all as touched
        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
            phoneNumber: true,
            dateOfBirth: true,
        });

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

        const avatarError =
            validateAvatar(avatarFile);

        if (
            nameError ||
            emailError ||
            passwordError ||
            confirmPasswordError ||
            phoneNumberError ||
            dateOfBirthError ||
            avatarError
        ) {
            setErrors({
                name: nameError,
                email: emailError,
                password: passwordError,
                confirmPassword: confirmPasswordError,
                phoneNumber: phoneNumberError,
                dateOfBirth: dateOfBirthError,
                avatar: avatarError,
            });

            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            // Register
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
                // Auto-login
                const loginResp = await axiosRequest.post(
                    "/user/login",
                    {
                        email,
                        password,
                        source: 1,
                    }
                );

                const loginData = loginResp.data;
                if (loginData?.success) {
                    sessionStorage.setItem(
                        "token",
                        loginData.data.token
                    );
                    sessionStorage.setItem(
                        "refreshToken",
                        loginData.data.refreshToken
                    );

                    // Upload avatar if selected
                    if (avatarFile) {
                        const formData = new FormData();
                        formData.append("file", avatarFile);
                        await axiosRequest.post(
                            "/user/avatar",
                            formData
                        );
                    }

                    router.push("/dashboard");
                } else {
                    router.push("/login");
                }
            }
        } catch {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            minH="100dvh"
            display="flex"
            flexDirection="column"
            overflow="auto"
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
                    gap={{
                        base: 0,
                        lg: 12,
                        xl: 20,
                    }}
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
                            borderRadius="2xl"
                            border="1px solid"
                            borderColor="gray.200"
                            bg="white"
                            boxShadow="
                                0 10px 40px rgba(0,0,0,0.06)
                            "
                            _dark={{
                                bg: "#111827",
                                borderColor:
                                    "rgba(148,163,184,0.16)",
                                boxShadow:
                                    "0 10px 40px rgba(0,0,0,0.35)",
                            }}
                        >

                            <VStack
                                align="stretch"
                                gap={4}
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
                                        px={3}
                                        py={1.5}
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
                                    h="120px"
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
                                                transition="height 0.5s ease"
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
                                base: 5,
                                md: 6,
                            }}
                            borderRadius="2xl"
                            border="1px solid"
                            borderColor="gray.200"
                            bg="white"
                            boxShadow="
                                0 10px 40px rgba(0,0,0,0.06)
                            "
                            _dark={{
                                bg: "#111827",
                                borderColor:
                                    "rgba(148,163,184,0.16)",
                                boxShadow:
                                    "0 10px 40px rgba(0,0,0,0.35)",
                            }}
                        >

                            {/* HEADER */}

                            <VStack
                                align="start"
                                gap={2}
                                mb={4}
                            >

                                <Heading
                                    fontSize={{
                                        base: "2xl",
                                        md: "3xl",
                                    }}
                                    letterSpacing="-0.03em"
                                    color="#0F172A"
                                    _dark={{
                                        color: "#F8FAFC",
                                    }}
                                >
                                    Create account
                                </Heading>

                                <Text
                                    fontSize="sm"
                                    color="#64748B"
                                    lineHeight="1.6"
                                    _dark={{
                                        color: "#94A3B8",
                                    }}
                                >
                                    Enter your details
                                    to begin building
                                    consistency.
                                </Text>

                            </VStack>

                            {/* PROGRESS BAR */}
                            <VStack align="stretch" gap={1} mb={4}>
                                <HStack justify="space-between">
                                    <Text fontSize="xs" fontWeight="600" color="#64748B" _dark={{ color: "#94A3B8" }}>
                                        Form completion
                                    </Text>
                                    <Text fontSize="xs" fontWeight="700" color="#6366F1">
                                        {Math.round(formProgress)}%
                                    </Text>
                                </HStack>
                                <Box
                                    h="6px"
                                    borderRadius="full"
                                    bg="rgba(99,102,241,0.08)"
                                    overflow="hidden"
                                >
                                    <Box
                                        h="full"
                                        borderRadius="full"
                                        bg="#6366F1"
                                        transition="width 0.4s ease"
                                        w={`${formProgress}%`}
                                    />
                                </Box>
                            </VStack>

                            {/* FORM */}

                            <VStack
                                gap={3}
                                align="stretch"
                            >

                                {/* AVATAR */}
                                <VStack align="center" gap={2}>
                                    <Box
                                        w="80px"
                                        h="80px"
                                        borderRadius="full"
                                        bg={isDragging ? "rgba(99,102,241,0.20)" : "rgba(99,102,241,0.10)"}
                                        overflow="hidden"
                                        border="2px dashed"
                                        borderColor={isDragging ? "#6366F1" : errors.avatar ? "red.400" : "rgba(99,102,241,0.30)"}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        position="relative"
                                        transition="all 0.2s ease"
                                        cursor="pointer"
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById("avatar-input")?.click()}
                                    >
                                        {avatarPreview ? (
                                            <>
                                                <img
                                                    src={avatarPreview}
                                                    alt="Avatar preview"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <Box
                                                    position="absolute"
                                                    top="0"
                                                    right="0"
                                                    bg="rgba(0,0,0,0.5)"
                                                    borderRadius="full"
                                                    p="2px"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveAvatar();
                                                    }}
                                                >
                                                    <LuX size="12" color="white" />
                                                </Box>
                                            </>
                                        ) : (
                                            <VStack gap={0} align="center">
                                                {isDragging ? (
                                                    <LuUpload size="20" color="#6366F1" />
                                                ) : (
                                                    <LuUser size="20" color="#6366F1" />
                                                )}
                                                <Text fontSize="10px" color="#6366F1" fontWeight="600">
                                                    {isDragging ? "Drop here" : "Click or drag"}
                                                </Text>
                                            </VStack>
                                        )}
                                    </Box>
                                    <Input
                                        id="avatar-input"
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={handleAvatarChange}
                                        display="none"
                                    />
                                    {avatarFile && (
                                        <HStack gap={1}>
                                            <Text fontSize="xs" color="#64748B" _dark={{ color: "#94A3B8" }}>
                                                {avatarFile.name}
                                            </Text>
                                            <IconButton
                                                aria-label="remove avatar"
                                                size="xs"
                                                variant="ghost"
                                                onClick={handleRemoveAvatar}
                                            >
                                                <LuX size="14" />
                                            </IconButton>
                                        </HStack>
                                    )}
                                    {errors.avatar && (
                                        <Text fontSize="sm" color="red.400">
                                            {errors.avatar}
                                        </Text>
                                    )}
                                    <Text fontSize="xs" color="#94A3B8" _dark={{ color: "#64748B" }}>
                                        Optional. PNG or JPG, max 2MB.
                                    </Text>
                                </VStack>

                                {/* NAME + EMAIL */}

                                <HStack
                                    align="start"
                                    gap={4}
                                >

                                    <VStack
                                        align="stretch"
                                        gap={2}
                                        flex="1"
                                    >

                                        <Text
                                            fontSize="xs"
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
                                            onBlur={() => handleBlur("name")}
                                            h="48px"
                                            borderRadius="xl"
                                            borderColor={
                                                touched.name && errors.name
                                                    ? "red.400"
                                                    : touched.name && !errors.name && name
                                                        ? "#10B981"
                                                        : "rgba(99,102,241,0.15)"
                                            }
                                            placeholder="John Doe"
                                            bg="white"
                                            color="#0F172A"
                                            _dark={{
                                                bg: "#020617",
                                                borderColor:
                                                    touched.name && errors.name
                                                        ? "red.400"
                                                        : touched.name && !errors.name && name
                                                            ? "#10B981"
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

                                        {touched.name && errors.name && (
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
                                        gap={2}
                                        flex="1"
                                    >

                                        <Text
                                            fontSize="xs"
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
                                            onBlur={() => handleBlur("email")}
                                            h="48px"
                                            borderRadius="xl"
                                            borderColor={
                                                touched.email && errors.email
                                                    ? "red.400"
                                                    : touched.email && !errors.email && email
                                                        ? "#10B981"
                                                        : "rgba(99,102,241,0.15)"
                                            }
                                            placeholder="name@company.com"
                                            bg="white"
                                            color="#0F172A"
                                            _dark={{
                                                bg: "#020617",
                                                borderColor:
                                                    touched.email && errors.email
                                                        ? "red.400"
                                                        : touched.email && !errors.email && email
                                                            ? "#10B981"
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

                                        {touched.email && errors.email && (
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
                                    gap={2}
                                >

                                    <Text
                                        fontSize="xs"
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
                                            onBlur={() => handleBlur("password")}
                                            h="48px"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            borderRadius="xl"
                                            borderColor={
                                                touched.password && errors.password
                                                    ? "red.400"
                                                    : touched.password && !errors.password && password
                                                        ? "#10B981"
                                                        : "rgba(99,102,241,0.15)"
                                            }
                                            placeholder="••••••••"
                                            bg="white"
                                            color="#0F172A"
                                            _dark={{
                                                bg: "#020617",
                                                borderColor:
                                                    touched.password && errors.password
                                                        ? "red.400"
                                                        : touched.password && !errors.password && password
                                                            ? "#10B981"
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

                                    {/* Password Strength */}
                                    {password && (
                                        <VStack align="stretch" gap={1}>
                                            <HStack justify="space-between">
                                                <Text fontSize="xs" fontWeight="600" color={passwordStrength.color === "gray" ? "#94A3B8" : passwordStrength.color}>
                                                    {passwordStrength.label}
                                                </Text>
                                                <Text fontSize="xs" color="#94A3B8">
                                                    {passwordStrength.score}/5
                                                </Text>
                                            </HStack>
                                            <HStack gap={1}>
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <Box
                                                        key={level}
                                                        flex="1"
                                                        h="4px"
                                                        borderRadius="full"
                                                        bg={
                                                            level <= passwordStrength.score
                                                                ? passwordStrength.color === "red" ? "#EF4444"
                                                                    : passwordStrength.color === "orange" ? "#F97316"
                                                                        : passwordStrength.color === "yellow" ? "#EAB308"
                                                                            : passwordStrength.color === "blue" ? "#3B82F6"
                                                                                : "#10B981"
                                                                : "rgba(99,102,241,0.08)"
                                                        }
                                                        transition="all 0.3s ease"
                                                    />
                                                ))}
                                            </HStack>
                                            <HStack gap={2} wrap="wrap">
                                                {[
                                                    { label: "8+ chars", met: password.length >= 8 },
                                                    { label: "Uppercase", met: /[A-Z]/.test(password) },
                                                    { label: "Lowercase", met: /[a-z]/.test(password) },
                                                    { label: "Number", met: /\d/.test(password) },
                                                    { label: "Special", met: /[^\da-zA-Z]/.test(password) },
                                                ].map((req) => (
                                                    <HStack key={req.label} gap={1}>
                                                        <Box
                                                            w="14px"
                                                            h="14px"
                                                            borderRadius="full"
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            bg={req.met ? "#10B981" : "rgba(148,163,184,0.20)"}
                                                            transition="all 0.2s ease"
                                                        >
                                                            {req.met && <LuCheck size="10" color="white" />}
                                                        </Box>
                                                        <Text fontSize="10px" color={req.met ? "#10B981" : "#94A3B8"} fontWeight={req.met ? "600" : "400"}>
                                                            {req.label}
                                                        </Text>
                                                    </HStack>
                                                ))}
                                            </HStack>
                                        </VStack>
                                    )}

                                    {touched.password && errors.password && (
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
                                    gap={2}
                                >

                                    <Text
                                        fontSize="xs"
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
                                            onBlur={() => handleBlur("confirmPassword")}
                                            h="48px"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            borderRadius="xl"
                                            borderColor={
                                                touched.confirmPassword && errors.confirmPassword
                                                    ? "red.400"
                                                    : touched.confirmPassword && !errors.confirmPassword && confirmPassword
                                                        ? "#10B981"
                                                        : "rgba(99,102,241,0.15)"
                                            }
                                            placeholder="••••••••"
                                            bg="white"
                                            color="#0F172A"
                                            _dark={{
                                                bg: "#020617",
                                                borderColor:
                                                    touched.confirmPassword && errors.confirmPassword
                                                        ? "red.400"
                                                        : touched.confirmPassword && !errors.confirmPassword && confirmPassword
                                                            ? "#10B981"
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

                                    {touched.confirmPassword && errors.confirmPassword && (
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
                                        gap={2}
                                        flex="1"
                                    >

                                        <Text
                                            fontSize="xs"
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
                                            onBlur={() => handleBlur("phoneNumber")}
                                            h="48px"
                                            borderRadius="xl"
                                            borderColor={
                                                touched.phoneNumber && errors.phoneNumber
                                                    ? "red.400"
                                                    : touched.phoneNumber && !errors.phoneNumber && phoneNumber
                                                        ? "#10B981"
                                                        : "rgba(99,102,241,0.15)"
                                            }
                                            placeholder="+1234567890"
                                            bg="white"
                                            color="#0F172A"
                                            _dark={{
                                                bg: "#020617",
                                                borderColor:
                                                    touched.phoneNumber && errors.phoneNumber
                                                        ? "red.400"
                                                        : touched.phoneNumber && !errors.phoneNumber && phoneNumber
                                                            ? "#10B981"
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

                                        {touched.phoneNumber && errors.phoneNumber && (
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
                                        gap={2}
                                        flex="1"
                                    >

                                        <Text
                                            fontSize="xs"
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
                                            onBlur={() => handleBlur("dateOfBirth")}
                                            h="48px"
                                            borderRadius="xl"
                                            borderColor={
                                                touched.dateOfBirth && errors.dateOfBirth
                                                    ? "red.400"
                                                    : touched.dateOfBirth && !errors.dateOfBirth && dateOfBirth
                                                        ? "#10B981"
                                                        : "rgba(99,102,241,0.15)"
                                            }
                                            type="date"
                                            bg="white"
                                            color="#0F172A"
                                            _dark={{
                                                bg: "#020617",
                                                borderColor:
                                                    touched.dateOfBirth && errors.dateOfBirth
                                                        ? "red.400"
                                                        : touched.dateOfBirth && !errors.dateOfBirth && dateOfBirth
                                                            ? "#10B981"
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

                                        {touched.dateOfBirth && errors.dateOfBirth && (
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
                                    h="52px"
                                    bg="#6366F1"
                                    color="white"
                                    borderRadius="xl"
                                    fontWeight="700"
                                    fontSize="md"
                                    boxShadow="
                                        0 8px 24px rgba(99,102,241,0.35)
                                    "
                                    _hover={{
                                        bg: "#5558E3",
                                        transform:
                                            "translateY(-1px)",
                                    }}
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    Create account
                                </Button>

                            </VStack>

                            {/* FOOTER */}

                            <VStack
                                mt={4}
                                pt={4}
                                borderTop="1px solid"
                                borderColor="
                                    rgba(99,102,241,0.08)
                                "
                                gap={2}
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
