"use client";

import MarketingNavbar from "@/components/Navbar/MarketingNavbar";

import Footer from "@/components/Footer";

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import Link from "next/link";

import {
  LuActivity,
  LuCalendarDays,
  LuCircleCheckBig,
  LuRadio,
  LuSparkles,
  LuZap,
} from "react-icons/lu";

const HomePage = () => {

  return (
    <Box
      bg="#FAFAFF"
      scrollBehavior="smooth"
      _dark={{
        bg: "#0B0F1A",
      }}
    >
      <MarketingNavbar />

      {/* HERO */}
      <Container
        maxW="7xl"
        py={{
          base: 20,
          md: 32,
        }}
        position="relative"
      >
        <VStack
          gap={8}
          textAlign="center"
          position="relative"
          zIndex="1"
        >
          <HStack
            gap={2}
            px={4}
            py={2}
            borderRadius="full"
            bg="rgba(99,102,241,0.08)"
            color="#6366F1"
            fontSize="sm"
            fontWeight="600"
          >
            <LuSparkles size={14} />
            <Text>
              Now with deep analytics
            </Text>
          </HStack>

          <Heading
            maxW="900px"
            fontSize={{
              base: "4xl",
              md: "7xl",
            }}
            lineHeight="0.95"
            fontWeight="800"
            letterSpacing="-0.04em"
            color="#0F172A"
            _dark={{
              color: "#F8FAFC",
            }}
          >
            Small actions, done
            daily, create
            extraordinary
            change.
          </Heading>

          <Text
            maxW="600px"
            fontSize={{
              base: "lg",
              md: "xl",
            }}
            lineHeight="1.8"
            color="#64748B"
            _dark={{
              color: "#94A3B8",
            }}
          >
            Habitual is a quiet space
            to track what matters,
            celebrate showing up,
            and watch consistency
            compound over time.
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
                h="56px"
                borderColor="rgba(148,163,184,0.30)"
                color="#0F172A"
                _dark={{
                  borderColor:
                    "rgba(255,255,255,0.12)",
                  color: "#F8FAFC",
                }}
                _hover={{
                  bg:
                    "rgba(99,102,241,0.04)",
                  borderColor:
                    "#6366F1",
                }}
              >
                Sign in
              </Button>
            </Link>

            <Link href="/register">
              <Button
                size="lg"
                bg="#6366F1"
                color="white"
                borderRadius="xl"
                px={10}
                h="56px"
                _hover={{
                  bg: "#5558E3",
                }}
              >
                Start tracking free
              </Button>
            </Link>
          </Stack>
        </VStack>
      </Container>

      {/* FEATURES */}
      <Container
        id="features"
        maxW="7xl"
        py={24}
      >
        <VStack
          align="start"
          mb={16}
          gap={3}
        >
          <Text
            color="#6366F1"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.25em"
            fontSize="sm"
          >
            Features
          </Text>

          <Heading
            size="2xl"
            color="#0F172A"
            _dark={{
              color: "#F8FAFC",
            }}
            maxW="500px"
          >
            Built for the long game
          </Heading>
        </VStack>

        <Grid
          templateColumns={{
            base: "1fr",
            md:
              "repeat(2, 1fr)",
          }}
          gap={6}
        >
          {/* FEATURE 1: LARGE */}
          <Box
            gridColumn={{
              md:
                "span 2",
            }}
            p={10}
            borderRadius="3xl"
            border="1px solid"
            borderColor="rgba(148,163,184,0.16)"
            bg="white"
            _dark={{
              bg:
                "#111827",
              borderColor:
                "rgba(255,255,255,0.06)",
            }}
          >
            <Flex
              gap={10}
              align="center"
              flexWrap="wrap"
            >
              <VStack
                align="start"
                gap={4}
                flex="1"
                minW="280px"
              >
                <Box
                  p={3}
                  borderRadius="xl"
                  bg="rgba(99,102,241,0.10)"
                  color="#6366F1"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <LuActivity
                    size={22}
                  />
                </Box>

                <Heading
                  size="lg"
                  color="#0F172A"
                  _dark={{
                    color:
                      "#F8FAFC",
                  }}
                >
                  Clarity through
                  calm analytics
                </Heading>

                <Text
                  lineHeight="1.8"
                  color="#64748B"
                  _dark={{
                    color:
                      "#94A3B8",
                  }}
                  maxW="460px"
                >
                  No overwhelming dashboards.
                  Just streaks, completion
                  patterns, and gentle
                  insights that help you
                  understand your rhythm
                  without the pressure.
                </Text>

                <HStack
                  gap={3}
                  flexWrap="wrap"
                >
                  {[
                    "Streak tracking",
                    "Weekly trends",
                    "Activity heatmap",
                  ].map(
                                                    tag => (
                                                        <Badge
                                                            key={tag}
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                            bg="rgba(99,102,241,0.08)"
                                                            color="#6366F1"
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    )
                                                )}
                </HStack>
              </VStack>

              <Box
                flex="1"
                minW="280px"
                h="200px"
                borderRadius="2xl"
                bg="rgba(99,102,241,0.06)"
                _dark={{
                  bg:
                    "rgba(99,102,241,0.10)",
                }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={6}
              >
                <HStack
                  align="end"
                  gap={3}
                  h="120px"
                  w="full"
                  maxW="320px"
                >
                  {[35, 55, 45, 80, 65, 95, 75].map(
                    (h, i) => (
                      <Box
                        key={i}
                        flex="1"
                        h={`${h}%`}
                        borderRadius="lg"
                        bg={
                          i === 5
                            ? "#6366F1"
                            : "rgba(99,102,241,0.20)"
                        }
                        transition="0.3s"
                      />
                    )
                  )}
                </HStack>
              </Box>
            </Flex>
          </Box>

          {/* FEATURE 2 */}
          <Box
            p={8}
            borderRadius="3xl"
            border="1px solid"
            borderColor="rgba(148,163,184,0.16)"
            bg="white"
            _dark={{
              bg:
                "#111827",
              borderColor:
                "rgba(255,255,255,0.06)",
            }}
          >
            <VStack
              align="start"
              gap={4}
            >
              <Box
                p={3}
                borderRadius="xl"
                bg="rgba(16,185,129,0.10)"
                color="#10B981"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <LuRadio
                  size={22}
                />
              </Box>

              <Heading
                size="md"
                color="#0F172A"
                _dark={{
                  color:
                    "#F8FAFC",
                }}
              >
                Realtime sync
              </Heading>

              <Text
                lineHeight="1.8"
                color="#64748B"
                _dark={{
                  color:
                    "#94A3B8",
                }}
              >
                Check off a habit on your
                phone, see it update
                instantly on your laptop.
                SignalR keeps everything
                in sync without a refresh.
              </Text>

              <HStack
                gap={2}
                flexWrap="wrap"
              >
                {[
                  "Cross-device",
                  "Instant",
                ].map(
                                                tag => (
                                                    <Badge
                                                        key={tag}
                                                        px={3}
                                                        py={1}
                                                        borderRadius="full"
                                                        bg="rgba(16,185,129,0.08)"
                                                        color="#10B981"
                                                        fontSize="xs"
                                                        fontWeight="600"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                )
                                            )}
              </HStack>
            </VStack>
          </Box>

          {/* FEATURE 3 */}
          <Box
            p={8}
            borderRadius="3xl"
            border="1px solid"
            borderColor="rgba(148,163,184,0.16)"
            bg="white"
            _dark={{
              bg:
                "#111827",
              borderColor:
                "rgba(255,255,255,0.06)",
            }}
          >
            <VStack
              align="start"
              gap={4}
            >
              <Box
                p={3}
                borderRadius="xl"
                bg="rgba(245,158,11,0.10)"
                color="#F59E0B"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <LuCalendarDays
                  size={22}
                />
              </Box>

              <Heading
                size="md"
                color="#0F172A"
                _dark={{
                  color:
                    "#F8FAFC",
                }}
              >
                Smart scheduling
              </Heading>

              <Text
                lineHeight="1.8"
                color="#64748B"
                _dark={{
                  color:
                    "#94A3B8",
                }}
              >
                Daily, weekly, or
                custom interval-based
                schedules. Set habits
                that fit your actual
                life, not an idealized
                version of it.
              </Text>

              <HStack
                gap={2}
                flexWrap="wrap"
              >
                {[
                  "Daily",
                  "Weekly",
                  "Custom",
                ].map(
                                                tag => (
                                                    <Badge
                                                        key={tag}
                                                        px={3}
                                                        py={1}
                                                        borderRadius="full"
                                                        bg="rgba(245,158,11,0.08)"
                                                        color="#F59E0B"
                                                        fontSize="xs"
                                                        fontWeight="600"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                )
                                            )}
              </HStack>
            </VStack>
          </Box>
        </Grid>
      </Container>

      {/* SOCIAL PROOF / TRUST */}
      <Container
        maxW="7xl"
        py={20}
      >
        <VStack
          gap={8}
          textAlign="center"
        >
          <Text
            color="#6366F1"
            fontWeight="700"
            letterSpacing="0.25em"
            textTransform="uppercase"
            fontSize="sm"
          >
            Philosophy
          </Text>

          <Heading
            maxW="700px"
            size="3xl"
            color="#0F172A"
            _dark={{
              color: "#F8FAFC",
            }}
          >
            Consistency over intensity.
            Progress over perfection.
          </Heading>

          <VStack
            gap={4}
            maxW="560px"
          >
            <HStack
              gap={3}
              align="start"
            >
              <Box
                mt={1}
                color="#10B981"
                flexShrink={0}
              >
                <LuCircleCheckBig
                  size={18}
                />
              </Box>
              <Text
                fontSize="lg"
                color="#64748B"
                _dark={{
                  color:
                    "#94A3B8",
                }}
                lineHeight="1.7"
                textAlign="left"
              >
                One missed day does not
                break a streak. It is
                part of the process.
              </Text>
            </HStack>

            <HStack
              gap={3}
              align="start"
            >
              <Box
                mt={1}
                color="#10B981"
                flexShrink={0}
              >
                <LuCircleCheckBig
                  size={18}
                />
              </Box>
              <Text
                fontSize="lg"
                color="#64748B"
                _dark={{
                  color:
                    "#94A3B8",
                }}
                lineHeight="1.7"
                textAlign="left"
              >
                Small habits compound.
                Reading 5 pages a day
                is 1,825 pages a year.
              </Text>
            </HStack>

            <HStack
              gap={3}
              align="start"
            >
              <Box
                mt={1}
                color="#10B981"
                flexShrink={0}
              >
                <LuCircleCheckBig
                  size={18}
                />
              </Box>
              <Text
                fontSize="lg"
                color="#64748B"
                _dark={{
                  color:
                    "#94A3B8",
                }}
                lineHeight="1.7"
                textAlign="left"
              >
                Track what matters to
                you, not what looks
                impressive to others.
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Container>

      {/* PRICING */}
      <Container
        id="pricing"
        maxW="5xl"
        py={24}
      >
        <VStack
          gap={12}
          align="center"
        >
          <VStack gap={4}
            textAlign="center"
          >
            <Text
              color="#6366F1"
              fontWeight="700"
              letterSpacing="0.25em"
              textTransform="uppercase"
              fontSize="sm"
            >
              Pricing
            </Text>

            <Heading
              size="3xl"
              color="#0F172A"
              _dark={{
                color:
                  "#F8FAFC",
              }}
            >
              Simple and honest
            </Heading>

            <Text
              color="#64748B"
              _dark={{
                color:
                  "#94A3B8",
              }}
              maxW="460px"
            >
              One plan. Everything
              included. No feature
              gates, no surprises.
            </Text>
          </VStack>

          <Box
            p={10}
            borderRadius="3xl"
            bg="white"
            border="1px solid"
            borderColor="rgba(148,163,184,0.16)"
            _dark={{
              bg:
                "#111827",
              borderColor:
                "rgba(255,255,255,0.06)",
            }}
            w="full"
            maxW="420px"
            textAlign="center"
          >
            <VStack gap={6}>
              <Box
                px={4}
                py={1.5}
                borderRadius="full"
                bg="rgba(99,102,241,0.08)"
                color="#6366F1"
                fontSize="sm"
                fontWeight="600"
              >
                Pro Plan
              </Box>

              <HStack
                gap={1}
                align="baseline"
                justify="center"
              >
                <Text
                  fontSize="5xl"
                  fontWeight="800"
                  color="#0F172A"
                  _dark={{
                    color:
                      "#F8FAFC",
                  }}
                  lineHeight="1"
                >
                  ₹99
                </Text>
                <Text
                  color="#64748B"
                  _dark={{
                    color:
                      "#94A3B8",
                  }}
                  fontSize="sm"
                >
                  / month
                </Text>
              </HStack>

              <VStack
                gap={3}
                align="start"
                w="full"
                px={4}
              >
                {[
                  "Unlimited habits",
                  "Realtime sync across devices",
                  "Deep analytics & insights",
                  "Export your data anytime",
                  "Priority support",
                ].map(
                                                feature => (
                                                    <HStack
                                                        key={feature}
                                                        gap={3}
                                                    >
                                                        <Box
                                                            color="#10B981"
                                                            flexShrink={0}
                                                        >
                                                            <LuZap
                                                                size={16}
                                                            />
                                                        </Box>
                                                        <Text
                                                            fontSize="sm"
                                                            color="#64748B"
                                                            _dark={{
                                                                color:
                                                                    "#94A3B8",
                                                            }}
                                                        >
                                                            {feature}
                                                        </Text>
                                                    </HStack>
                                                )
                                            )}
              </VStack>

              <Link
                href="/register"
                style={{
                  width:
                    "100%",
                }}
              >
                <Button
                  w="full"
                  size="lg"
                  bg="#6366F1"
                  color="white"
                  borderRadius="xl"
                  h="56px"
                  fontWeight="700"
                  _hover={{
                    bg:
                      "#5558E3",
                  }}
                >
                  Start free trial
                </Button>
              </Link>

              <Text
                fontSize="xs"
                color="#94A3B8"
              >
                14 days free. Cancel
                anytime.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default HomePage;
