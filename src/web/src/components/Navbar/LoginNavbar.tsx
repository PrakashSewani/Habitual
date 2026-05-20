"use client";

import Link from "next/link";

import {
    Box,
    Flex,
    Heading,
    HStack,
} from "@chakra-ui/react";

import ColorModeToggle
    from "../ColorModeToggle";

const LoginNavbar = () => {

    return (
        <Box
            position="sticky"
            top="0"
            zIndex="999"
            borderBottom="1px solid"
            borderColor="rgba(99,102,241,0.08)"
            bg="rgba(255,255,255,0.72)"
            backdropFilter="blur(16px)"
            _dark={{
                bg: "rgba(2,6,23,0.72)",
                borderColor:
                    "rgba(255,255,255,0.08)",
            }}
        >

            <Flex
                h="72px"
                px={{
                    base: 6,
                    md: 10,
                }}
                align="center"
                justify="space-between"
            >

                {/* LOGO */}

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
                                0 0 20px rgba(99,102,241,0.45)
                            "
                        />

                        <Heading
                            size="md"
                            fontWeight="900"
                            letterSpacing="-0.04em"
                            color="#6366F1"
                        >
                            Habitual
                        </Heading>

                    </HStack>
                </Link>

                {/* ACTIONS */}

                <ColorModeToggle />

            </Flex>
        </Box>
    );
};

export default LoginNavbar;