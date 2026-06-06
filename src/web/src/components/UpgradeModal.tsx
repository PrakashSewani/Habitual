"use client";

import {
  Box,
  Button,
  Dialog,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  LuZap,
  LuX,
} from "react-icons/lu";

import Link from "next/link";

type UpgradeModalProps = {
  open: boolean;
  onClose: () => void;
};

export const UpgradeModal = ({ open, onClose }: UpgradeModalProps) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open: o }) => {
        if (!o) onClose();
      }}
    >
      <Dialog.Backdrop
        bg="rgba(0,0,0,0.45)"
        backdropFilter="blur(6px)"
      />
      <Dialog.Positioner>
        <Dialog.Content
          borderRadius="2xl"
          border="1px solid"
          borderColor="rgba(148,163,184,0.16)"
          bg="white"
          _dark={{ bg: "#111827", borderColor: "rgba(255,255,255,0.06)" }}
          maxW="420px"
          w="full"
          p={0}
          overflow="hidden"
        >
          {/* Header close */}
          <Flex justify="flex-end" p={4} pb={0}>
            <Button
              size="sm"
              variant="ghost"
              borderRadius="full"
              color="#64748B"
              _dark={{ color: "#94A3B8" }}
              onClick={onClose}
              aria-label="Close"
            >
              <LuX size={18} />
            </Button>
          </Flex>

          <VStack gap={6} px={8} pb={8} align="center" textAlign="center">
            {/* Badge */}
            <Box
              px={4}
              py={1.5}
              borderRadius="full"
              bg="rgba(99,102,241,0.10)"
              color="#6366F1"
              fontSize="sm"
              fontWeight="600"
            >
              Pro Plan
            </Box>

            {/* Price */}
            <HStack gap={1} align="baseline" justify="center">
              <Text
                fontSize="5xl"
                fontWeight="800"
                color="#0F172A"
                _dark={{ color: "#F8FAFC" }}
                lineHeight="1"
              >
                ₹99
              </Text>
              <Text
                color="#64748B"
                _dark={{ color: "#94A3B8" }}
                fontSize="sm"
              >
                / month
              </Text>
            </HStack>

            {/* Pitch */}
            <Text
              fontSize="sm"
              color="#64748B"
              _dark={{ color: "#94A3B8" }}
              maxW="320px"
            >
              Unlock unlimited history, custom date ranges, and deeper insights.
            </Text>

            {/* Features */}
            <VStack gap={3} align="start" w="full" px={4}>
              {[
                "Unlimited history & custom ranges",
                "Deep analytics & insights",
                "Export your data anytime",
                "Priority support",
              ].map(feature => (
                <HStack key={feature} gap={3}>
                  <Box color="#10B981" flexShrink={0}>
                    <LuZap size={16} />
                  </Box>
                  <Text
                    fontSize="sm"
                    color="#64748B"
                    _dark={{ color: "#94A3B8" }}
                  >
                    {feature}
                  </Text>
                </HStack>
              ))}
            </VStack>

            {/* CTA */}
            <Link href="/register" style={{ width: "100%" }}>
              <Button
                w="full"
                size="lg"
                bg="#6366F1"
                color="white"
                borderRadius="xl"
                h="52px"
                fontWeight="700"
                _hover={{ bg: "#5558E3" }}
                onClick={onClose}
              >
                Start free trial
              </Button>
            </Link>

            <Text fontSize="xs" color="#94A3B8">
              14 days free. Cancel anytime.
            </Text>
          </VStack>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default UpgradeModal;
