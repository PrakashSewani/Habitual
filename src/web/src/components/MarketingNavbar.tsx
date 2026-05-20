"use client";

import Link from "next/link";

import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    Text,
} from "@chakra-ui/react";

import ColorModeToggle from "./ColorModeToggle";

const MarketingNavbar = () => {

    return (
        <Box
            position="sticky"
            top="0"
            zIndex="9999"
            w="full"
            borderBottom="1px solid"
            borderColor="gray.200"
            bg="rgba(255,255,255,0.75)"
            backdropFilter="blur(16px)"
            transition="
                background 0.2s ease,
                border-color 0.2s ease
            "
            _dark={{
                bg: "rgba(2,6,23,0.75)",
                borderColor:
                    "rgba(255,255,255,0.08)",
            }}
        >
            <Container
                maxW="8xl"
                h="72px"
            >
                <Flex
                    h="full"
                    align="center"
                    justify="space-between"
                    position="relative"
                >

                    {/* ========================================
                        BRAND
                    ======================================== */}

                    <Link href="/">
                        <HStack
                            gap={3}
                            cursor="pointer"
                        >
                            <Box
                                w="12px"
                                h="12px"
                                borderRadius="full"
                                bg="#6366F1"
                                boxShadow="
                                    0 0 20px rgba(99,102,241,0.5)
                                "
                            />

                            <Heading
                                size="lg"
                                fontWeight="800"
                                letterSpacing="-0.04em"
                                color="#0F172A"
                                _dark={{
                                    color: "#F8FAFC",
                                }}
                            >
                                Habitual
                            </Heading>
                        </HStack>
                    </Link>

                    {/* ========================================
                        CENTER NAVIGATION
                    ======================================== */}

                    <HStack
                        gap={10}
                        position="absolute"
                        left="48%"
                        transform="translateX(-50%)"
                        display={{
                            base: "none",
                            md: "flex",
                        }}
                    >

                        <Link href="#features">
                            <Text
                                fontWeight="600"
                                color="#64748B"
                                cursor="pointer"
                                transition="
                                    color 0.2s ease
                                "
                                _dark={{
                                    color: "#94A3B8",
                                }}
                                _hover={{
                                    color: "#6366F1",
                                }}
                            >
                                Features
                            </Text>
                        </Link>

                        <Link href="#analytics">
                            <Text
                                fontWeight="600"
                                color="#64748B"
                                cursor="pointer"
                                transition="
                                    color 0.2s ease
                                "
                                _dark={{
                                    color: "#94A3B8",
                                }}
                                _hover={{
                                    color: "#6366F1",
                                }}
                            >
                                Analytics
                            </Text>
                        </Link>

                        <Link href="#pricing">
                            <Text
                                fontWeight="600"
                                color="#64748B"
                                cursor="pointer"
                                transition="
                                    color 0.2s ease
                                "
                                _dark={{
                                    color: "#94A3B8",
                                }}
                                _hover={{
                                    color: "#6366F1",
                                }}
                            >
                                Pricing
                            </Text>
                        </Link>
                    </HStack>

                    {/* ========================================
                        ACTIONS
                    ======================================== */}

                    <HStack gap={4}>

                        <ColorModeToggle />

                        <Link href="/login">
                            <Button
                                variant="ghost"
                                borderRadius="xl"
                                fontWeight="600"
                                color="#0F172A"
                                _dark={{
                                    color: "#F8FAFC",
                                }}
                                _hover={{
                                    bg: "blackAlpha.50",
                                }}
                            >
                                Login
                            </Button>
                        </Link>

                        <Link href="/register">
                            <Button
                                bg="#6366F1"
                                color="white"
                                borderRadius="xl"
                                px={6}
                                boxShadow="
                                    0 10px 30px rgba(99,102,241,0.35)
                                "
                                _hover={{
                                    bg: "#5558E3",
                                    transform:
                                        "translateY(-1px)",
                                }}
                            >
                                Start Tracking
                            </Button>
                        </Link>

                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};

export default MarketingNavbar;