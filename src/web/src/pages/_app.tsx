"use client";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import {
  Box,
  ChakraProvider,
  defaultSystem,
} from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import ClientOnly from "@/components/ClientOnly";
import {
  ToastContainer
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const App = ({
  Component,
  pageProps,
}: AppProps) => {

  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
      >
        <ClientOnly>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
          <Box
            className={`${inter.variable}`}
            minH="100vh"
            bg="white"
            _dark={{
              bg: "#0F172A",
            }}
            color="gray.900"
          >
            <Box
              minH="100vh"
            >
              <Component {...pageProps} />
            </Box>
          </Box>
        </ClientOnly>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;