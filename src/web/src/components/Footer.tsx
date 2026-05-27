"use client";

import {
    Box,
    Container,
    Flex,
    HStack,
    Text,
} from "@chakra-ui/react";

const Footer = () => {
    return (
        <Box
            borderTop="1px solid"
            borderColor="rgba(148,163,184,0.14)"
            py={8}
            mt="auto"
            bg="#FAFAFF"
            _dark={{
                borderColor: "rgba(255,255,255,0.06)",
                bg: "#0B0F1A",
            }}
        >
            <Container maxW="1200px">
                <Flex
                    justify="space-between"
                    align="center"
                    flexWrap="wrap"
                    gap={4}
                >
                    <HStack gap={3}>
                        <Box
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg="#6366F1"
                        />
                        <Text
                            fontSize="sm"
                            fontWeight="700"
                            color="#0F172A"
                            _dark={{
                                color: "#F8FAFC",
                            }}
                        >
                            Habitual
                        </Text>
                    </HStack>

                    <Text
                        fontSize="sm"
                        color="#94A3B8"
                    >
                        Built for people who show up.
                    </Text>
                </Flex>
            </Container>
        </Box>
    );
};

export default Footer;
