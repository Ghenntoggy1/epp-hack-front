import { useEffect } from "react";
import { useRouter } from "next/router";
import { LayoutAuth } from "@/components/uni";
import { Flex, Stack, Heading } from "@chakra-ui/react";
import { useAuth } from "@/hooks";
import { LoginCard } from "@/pages/uni/login/LoginCard";

const login = () => {
  const { user } = useAuth();
  const { push, query } = useRouter();

  useEffect(() => {
    if (user) {
      const offerId = decodeURIComponent(String(query.offerId))
      if (!!offerId && offerId !== 'undefined') {
        push({ pathname: `/offers/${offerId}` })
      } else {
        push("/");
      }
    }
  }, [user]);

  return (
    <LayoutAuth title="Log In">
      <Flex align="center" justify="center">
        <Stack spacing={8} mx="auto" maxW="lg" px={6}>
          <Stack align="center">
            <Heading as="h1" fontSize="xx-large">
              Log In
            </Heading>
          </Stack>
          <LoginCard />
        </Stack>
      </Flex>
    </LayoutAuth>
  );
};

export default login;