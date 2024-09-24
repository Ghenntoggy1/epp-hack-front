import { useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/uni";
import { Flex, Stack, Heading } from "@chakra-ui/react";
import { useAuth } from "@/pages/uni/login/useAuth";
import { SignUpCard } from "@/pages/uni/login/SignUpCard";

const signup = () => {
  const { user } = useAuth();
  const { push, query } = useRouter();

  useEffect(() => {
    if (user) {
      const redirectProductId = decodeURIComponent(String(query.redirectProductId))
      if (!!redirectProductId && redirectProductId !== 'undefined') {
        push({ pathname: `/product/${redirectProductId}` })
      } else {
        push("/");
      }
    }
  }, [user]);

  return (
    <Layout title="Sign Up">
      <Flex align="center" justify="center">
        <Stack spacing={8} mx="auto" maxW="lg" px={6}>
          <Stack align="center">
            <Heading as="h1" fontSize="xx-large">
              Sign Up
            </Heading>
          </Stack>
          <SignUpCard />
        </Stack>
      </Flex>
    </Layout>
  );
};

export default signup;