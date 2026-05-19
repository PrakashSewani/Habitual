import ColorModeToggle from "@/components/ColorModeToggle";
import {
    Box,
    Container,
    Flex,
    Heading,
    HStack,
} from "@chakra-ui/react";

const HomeNavbar = () => {
    return (
        <Box
            position="sticky"
            top="0"
            zIndex="100"
            borderBottom="1px solid"
            borderColor="gray.200"
            bg="rgba(255,255,255,0.85)"
            backdropFilter="blur(12px)"
            _dark={{
                bg: "rgba(15,23,42,0.85)",
                borderColor: "whiteAlpha.200",
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
                >
                    <HStack gap={3}>
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
                                color: "white",
                            }}
                        >
                            Habitual
                        </Heading>
                    </HStack>
                    <HStack gap={8}>
                        <Box
                            fontSize="sm"
                            fontWeight="600"
                            color="#64748B"
                            cursor="pointer"
                            transition="all 0.2s ease"
                            _hover={{
                                color: "#6366F1",
                            }}
                        >
                            Features
                        </Box>
                        <Box
                            fontSize="sm"
                            fontWeight="600"
                            color="#64748B"
                            cursor="pointer"
                            transition="all 0.2s ease"
                            _hover={{
                                color: "#6366F1",
                            }}
                        >
                            Analytics
                        </Box>
                        <Box
                            fontSize="sm"
                            fontWeight="600"
                            color="#64748B"
                            cursor="pointer"
                            transition="all 0.2s ease"
                            _hover={{
                                color: "#6366F1",
                            }}
                        >
                            Pricing
                        </Box>
                        <ColorModeToggle />
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};

export default HomeNavbar;