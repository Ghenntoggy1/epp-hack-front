import { PropsWithChildren } from "react";
import Head from "next/head";
import { Container, VStack } from "@chakra-ui/react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  title?: string;
}

export const LayoutAuth = ({ title, children }: PropsWithChildren<LayoutProps>) => {
  return (
    <>
      <Head>
        <title>{`${title} | Erasmus++`}</title>
      </Head>

      <VStack
        minH="100vh"
        position="relative"
        overflowX="hidden"
        width="100%"
        spacing={0}
        align="stretch"
        justifyContent="space-between"
        bg="whiteAlpha.900"
      >
        <Navbar />
        <Container
          maxW={["container.sm", "container.md", "container.lg", "8xl"]}
          h="full"
          flex="1"
          py={10}
          as="main"
        >
          {children}
        </Container>

      </VStack>
    </>
  );
};