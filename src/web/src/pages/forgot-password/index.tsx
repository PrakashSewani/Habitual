"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react";
import LoginNavbar from "@/components/Navbar/LoginNavbar";
import Footer from "@/components/Footer";
import useAxiosRequest from "@/hooks/useAxiosRequest";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState<1 | 2>(1);
    const [errors, setErrors] = useState<{ email?: string; token?: string; newPassword?: string }>({});
    const [message, setMessage] = useState("");
    const axiosRequest = useAxiosRequest();
    const router = useRouter();

    const validateEmail = (value: string) => {
        if (!value.trim()) return "Email is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Invalid email format.";
        return "";
    };

    const validatePassword = (value: string) => {
        if (!value.trim()) return "Password is required.";
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
        if (!passwordRegex.test(value)) {
            return "Password must contain at least one uppercase, one lowercase, one number, one special character, and be 8+ characters.";
        }
        return "";
    };

    const handleRequestToken = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailError = validateEmail(email);
        if (emailError) {
            setErrors({ email: emailError });
            return;
        }
        setErrors({});
        try {
            const resp = await axiosRequest.post("/user/forgot-password", { email });
            setMessage(resp.data.message || "Reset token sent. Check your email.");
            setStep(2);
        } catch (err: any) {
            setMessage(err?.message || "Failed to send reset token.");
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailError = validateEmail(email);
        const passwordError = validatePassword(newPassword);
        if (emailError || passwordError || !token) {
            setErrors({
                email: emailError,
                token: !token ? "Token is required." : undefined,
                newPassword: passwordError,
            });
            return;
        }
        setErrors({});
        try {
            const resp = await axiosRequest.post("/user/reset-password", {
                email,
                token,
                newPassword,
            });
            setMessage(resp.data.message || "Password reset successfully.");
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: any) {
            setMessage(err?.message || "Failed to reset password.");
        }
    };

    return (
        <Box h="100vh" display="flex" flexDirection="column" position="relative" overflow="hidden" bg="#FAFAFF" _dark={{ bg: "#020617" }}>
            <LoginNavbar />
            <Box position="absolute" top="-200px" left="-200px" w="500px" h="500px" borderRadius="full" bg="#6366F1" opacity="0.10" filter="blur(140px)" />
            <Box position="absolute" bottom="-200px" right="-200px" w="500px" h="500px" borderRadius="full" bg="#6366F1" opacity="0.08" filter="blur(160px)" />
            <Flex flex="1" minH="0" px={{ base: 6, md: 12 }} py={3} align="center" justify="center" overflow="auto">
                <Flex w="full" maxW="1400px" gap={20} align="center" justify="space-between">
                    <VStack flex="1" align="start" gap={10} display={{ base: "none", lg: "flex" }}>
                        <VStack align="start" gap={6}>
                            <Heading fontSize={{ base: "5xl", xl: "7xl" }} lineHeight="0.95" letterSpacing="-0.06em" color="#0F172A" _dark={{ color: "#F8FAFC" }}>
                                Reset your{" "}
                                <Text as="span" color="#6366F1">password.</Text>
                            </Heading>
                            <Text maxW="600px" fontSize="xl" lineHeight="1.9" color="#64748B" _dark={{ color: "#94A3B8" }}>
                                Enter your email to receive a reset token, then set a new password.
                            </Text>
                        </VStack>
                    </VStack>
                    <Flex flex="1" justify="center">
                        <Box as="form" onSubmit={step === 1 ? handleRequestToken : handleResetPassword} w="full" maxW="480px" p={{ base: 8, md: 10 }} borderRadius="3xl" border="1px solid" borderColor="gray.200" bg="white" boxShadow="0 20px 60px rgba(0,0,0,0.06)" _dark={{ bg: "#111827", borderColor: "rgba(148,163,184,0.16)", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
                            <VStack align="start" gap={3} mb={8}>
                                <Heading fontSize={{ base: "3xl", md: "4xl" }} letterSpacing="-0.04em" color="#0F172A" _dark={{ color: "#F8FAFC" }}>
                                    {step === 1 ? "Forgot password?" : "Reset password"}
                                </Heading>
                                <Text color="#64748B" lineHeight="1.8" _dark={{ color: "#94A3B8" }}>
                                    {step === 1
                                        ? "Enter your email to receive a reset token."
                                        : "Enter the token and your new password."}
                                </Text>
                            </VStack>
                            <VStack gap={5} align="stretch">
                                <VStack align="stretch" gap={3}>
                                    <Text fontSize="sm" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="#64748B" _dark={{ color: "#94A3B8" }}>
                                        Email address
                                    </Text>
                                    <Input
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        h="56px"
                                        borderRadius="xl"
                                        borderColor={errors.email ? "red.400" : "rgba(99,102,241,0.15)"}
                                        placeholder="name@company.com"
                                        bg="white"
                                        color="#0F172A"
                                        _dark={{ bg: "#020617", borderColor: errors.email ? "red.400" : "rgba(148,163,184,0.16)", color: "#F8FAFC" }}
                                        _placeholder={{ color: "#94A3B8" }}
                                        _focusVisible={{ borderColor: "#6366F1", boxShadow: "0 0 0 4px rgba(99,102,241,0.12)" }}
                                    />
                                    {errors.email && <Text fontSize="sm" color="red.400">{errors.email}</Text>}
                                </VStack>
                                {step === 2 && (
                                    <>
                                        <VStack align="stretch" gap={3}>
                                            <Text fontSize="sm" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="#64748B" _dark={{ color: "#94A3B8" }}>
                                                Reset token
                                            </Text>
                                            <Input
                                                value={token}
                                                onChange={e => setToken(e.target.value)}
                                                h="56px"
                                                borderRadius="xl"
                                                borderColor={errors.token ? "red.400" : "rgba(99,102,241,0.15)"}
                                                placeholder="123456"
                                                bg="white"
                                                color="#0F172A"
                                                _dark={{ bg: "#020617", borderColor: errors.token ? "red.400" : "rgba(148,163,184,0.16)", color: "#F8FAFC" }}
                                                _placeholder={{ color: "#94A3B8" }}
                                                _focusVisible={{ borderColor: "#6366F1", boxShadow: "0 0 0 4px rgba(99,102,241,0.12)" }}
                                            />
                                            {errors.token && <Text fontSize="sm" color="red.400">{errors.token}</Text>}
                                        </VStack>
                                        <VStack align="stretch" gap={3}>
                                            <Text fontSize="sm" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="#64748B" _dark={{ color: "#94A3B8" }}>
                                                New password
                                            </Text>
                                            <Input
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                h="56px"
                                                type="password"
                                                borderRadius="xl"
                                                borderColor={errors.newPassword ? "red.400" : "rgba(99,102,241,0.15)"}
                                                placeholder="••••••••"
                                                bg="white"
                                                color="#0F172A"
                                                _dark={{ bg: "#020617", borderColor: errors.newPassword ? "red.400" : "rgba(148,163,184,0.16)", color: "#F8FAFC" }}
                                                _placeholder={{ color: "#94A3B8" }}
                                                _focusVisible={{ borderColor: "#6366F1", boxShadow: "0 0 0 4px rgba(99,102,241,0.12)" }}
                                            />
                                            {errors.newPassword && <Text fontSize="sm" color="red.400" whiteSpace="pre-line">{errors.newPassword}</Text>}
                                        </VStack>
                                    </>
                                )}
                                {message && (
                                    <Text fontSize="sm" color="#6366F1" fontWeight="600">
                                        {message}
                                    </Text>
                                )}
                                <Button type="submit" h="60px" bg="#6366F1" color="white" borderRadius="xl" fontWeight="700" fontSize="md" boxShadow="0 10px 30px rgba(99,102,241,0.35)" _hover={{ bg: "#5558E3", transform: "translateY(-1px)" }}>
                                    {step === 1 ? "Send reset token" : "Reset password"}
                                </Button>
                            </VStack>
                            <VStack mt={8} pt={6} borderTop="1px solid" borderColor="rgba(99,102,241,0.08)" gap={3}>
                                <Text color="#64748B" _dark={{ color: "#94A3B8" }}>
                                    Remember your password?
                                </Text>
                                <Link href="/login">
                                    <Text color="#6366F1" fontWeight="700" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                                        Log in
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

export default ForgotPasswordPage;
