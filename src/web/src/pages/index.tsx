"use client";

import MarketingNavbar from "@/components/MarketingNavbar";

import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";

const HomePage = () => {

  return (
    <Box
      bg="white"
      scrollBehavior={"smooth"}
      _dark={{
        bg: "#020617",
      }}
    >

      {/* ========================================
                NAVBAR
            ======================================== */}

      <MarketingNavbar />

      {/* ========================================
                HERO
            ======================================== */}

      <Container
        maxW="7xl"
        py={{
          base: 24,
          md: 36,
        }}
        position="relative"
      >

        <Box
          position="absolute"
          top="-120px"
          left="50%"
          transform="translateX(-50%)"
          w="700px"
          h="700px"
          borderRadius="full"
          bg="#6366F1"
          opacity="0.12"
          filter="blur(140px)"
        />

        <VStack
          position="relative"
          zIndex="1"
          gap={8}
          textAlign="center"
        >

          <Heading
            maxW="1100px"
            fontSize={{
              base: "5xl",
              md: "8xl",
            }}
            lineHeight="0.9"
            fontWeight="900"
            letterSpacing="-0.06em"
            color="#0F172A"
            _dark={{
              color: "#F8FAFC",
            }}
          >
            Master your habits,
            master your life.
          </Heading>

          <Text
            maxW="760px"
            fontSize={{
              base: "lg",
              md: "2xl",
            }}
            lineHeight="1.8"
            color="#64748B"
            _dark={{
              color: "#94A3B8",
            }}
          >
            The professional-grade
            habit tracking platform
            designed for disciplined
            individuals seeking
            consistency, clarity,
            and measurable growth.
          </Text>

          <Stack
            direction={{
              base: "column",
              md: "row",
            }}
            gap={4}
            pt={4}
          >
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                borderRadius="xl"
                px={10}
                h="60px"
                _dark={{
                  borderColor:
                    "rgba(255,255,255,0.12)",
                  color: "#F8FAFC",
                }}
              >
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button
                size="lg"
                bg="#6366F1"
                color="white"
                borderRadius="xl"
                px={10}
                h="60px"
                _hover={{
                  bg: "#5558E3",
                }}
              >
                Start Tracking
              </Button>
            </Link>
          </Stack>
        </VStack>
      </Container>

      {/* ========================================
                FEATURES
            ======================================== */}

      <Container
        id="features"
        maxW="7xl"
        py={24}
      >

        <VStack
          align="start"
          mb={14}
        >
          <Text
            color="#10B981"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.25em"
          >
            Features
          </Text>

          <Heading
            size="2xl"
            color="#0F172A"
            _dark={{
              color: "#F8FAFC",
            }}
          >
            Designed for discipline
          </Heading>
        </VStack>

        <SimpleGrid
          columns={{
            base: 1,
            md: 3,
          }}
          gap={8}
        >

          {[
            {
              title:
                "Deep Analytics",
              desc:
                "Visualize streaks, progress, completion rates and trends with clarity.",
            },
            {
              title:
                "Realtime Sync",
              desc:
                "SignalR powered realtime updates across devices and platforms.",
            },
            {
              title:
                "Smart Scheduling",
              desc:
                "Daily, weekly and interval-based scheduling tailored to you.",
            },
          ].map(feature => (
            <Box
              key={feature.title}
              p={8}
              borderRadius="3xl"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              boxShadow="sm"
              transition="all 0.25s ease"
              _dark={{
                bg: "#111827",
                borderColor:
                  "rgba(255,255,255,0.08)",
              }}
              _hover={{
                borderColor:
                  "#6366F1",
                transform:
                  "translateY(-4px)",
                boxShadow: "xl",
              }}
            >
              <Heading
                size="md"
                mb={4}
                color="#0F172A"
                _dark={{
                  color: "#F8FAFC",
                }}
              >
                {feature.title}
              </Heading>

              <Text
                lineHeight="1.8"
                color="#64748B"
                _dark={{
                  color:
                    "#94A3B8",
                }}
              >
                {feature.desc}
              </Text>
            </Box>
          ))}

        </SimpleGrid>
      </Container>

      {/* ========================================
                ANALYTICS
            ======================================== */}

      <Container
        id="analytics"
        maxW="7xl"
        py={24}
      >
        <VStack
          gap={8}
          textAlign="center"
        >
          <Text
            color="#10B981"
            fontWeight="700"
            letterSpacing="0.25em"
            textTransform="uppercase"
          >
            Analytics
          </Text>

          <Heading
            maxW="800px"
            size="3xl"
            color="#0F172A"
            _dark={{
              color: "#F8FAFC",
            }}
          >
            Powerful insights into
            your behavioral patterns
          </Heading>

          <Text
            maxW="700px"
            fontSize="lg"
            color="#64748B"
            _dark={{
              color: "#94A3B8",
            }}
          >
            Habitual provides deep
            analytics, streak tracking,
            completion trends and
            realtime progress
            visualization to help you
            stay consistent.
          </Text>
        </VStack>
      </Container>

      {/* ========================================
                PRICING
            ======================================== */}

      <Container
        id="pricing"
        maxW="5xl"
        py={24}
      >

        <VStack
          gap={12}
        >

          <VStack gap={4}>
            <Text
              color="#10B981"
              fontWeight="700"
              letterSpacing="0.25em"
              textTransform="uppercase"
            >
              Pricing
            </Text>

            <Heading
              size="3xl"
              color="#0F172A"
              _dark={{
                color: "#F8FAFC",
              }}
            >
              Simple pricing
            </Heading>
          </VStack>

          <Box
            p={12}
            borderRadius="3xl"
            bg="#6366F1"
            color="white"
            w="350px"
            textAlign="center"
            boxShadow="
                            0 20px 50px rgba(99,102,241,0.35)
                        "
          >
            <Text
              fontSize="lg"
              mb={2}
              opacity={0.85}
            >
              Pro Plan
            </Text>

            <Heading
              fontSize="6xl"
              mb={4}
            >
              ₹99
            </Heading>

            <Text
              mb={8}
              opacity={0.85}
            >
              per month
            </Text>

            <VStack
              gap={3}
              mb={10}
            >
              <Text>
                Realtime Sync
              </Text>

              <Text>
                Advanced Analytics
              </Text>

              <Text>
                Cross Platform
              </Text>
            </VStack>

            <Link href="/register">
              <Button
                size="lg"
                bg="white"
                color="#6366F1"
                borderRadius="xl"
                px={10}
                _hover={{
                  bg: "gray.100",
                }}
              >
                Start Free Trial
              </Button>
            </Link>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;