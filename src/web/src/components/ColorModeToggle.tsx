"use client";
import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

const ColorModeToggle = () => {
    const { theme, setTheme } = useTheme();

    const toggleColorMode = () => {
        setTheme(
            theme === "light"
                ? "dark"
                : "light"
        );
    };

    const isDark =
        theme === "dark";

    return (
        <IconButton
            aria-label="Toggle color mode"
            onClick={toggleColorMode}
            variant="solid"
            size="md"
            borderRadius="xl"
            transition="all 0.2s ease"
            bg={
                isDark
                    ? "#6366F1"
                    : "white"
            }
            color={
                isDark
                    ? "white"
                    : "#0F172A"
            }
            border="1px solid"
            borderColor={
                isDark
                    ? "#6366F1"
                    : "gray.200"
            }
            boxShadow={
                isDark
                    ? "0 0 20px rgba(99,102,241,0.35)"
                    : "sm"
            }
            _hover={{
                transform: "translateY(-1px)",
                bg: isDark
                    ? "#5558E3"
                    : "gray.50",
            }}
            _active={{
                transform: "scale(0.97)",
            }}
        >
            {isDark
                ? <LuSun />
                : <LuMoon />}
        </IconButton>
    );
};

export default ColorModeToggle;