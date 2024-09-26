import ComparisonInitializer from "@/components/uni/offer/ComparisonInitializer";
import { AuthProvider } from "@/context";
import { AppStore, makeStore } from "@/lib/store";
import "@/styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import clsx from "clsx";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { useRef } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

const queryClient = new QueryClient();

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const theme = extendTheme({
  colors: {
    white: "#FFFFFF",
    black: "#1A1A1A",
    brand: {
      100: "rgb(14, 176, 133, 0.1)",
      400: "#004493",
      500: "#002e62",
      600: "#0b8e6b",
    },
    accent: {
      200: "#fcdfcf",
      500: "#F7A072",
    },
  }
});

export default function App({ Component, pageProps }: AppProps) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <ComparisonInitializer>
        <QueryClientProvider client={queryClient}>
          <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="light">
              <ChakraProvider theme={theme}>
                <AuthProvider>
                  <div className={clsx(inter.className, inter.variable)}>
                    <Toaster
                      position="top-right"
                      reverseOrder={false}
                      toastOptions={{ duration: 3000 }}
                    />
                    <Component {...pageProps} />
                  </div>
                </AuthProvider>
              </ChakraProvider>
            </NextThemesProvider>
          </NextUIProvider>
        </QueryClientProvider>
      </ComparisonInitializer>
    </Provider>
  );
}
