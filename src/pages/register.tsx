import { useEffect } from "react";
import { useRouter } from "next/router";
import { LayoutAuth } from "@/components/uni";
import { Flex, Stack, Heading } from "@chakra-ui/react";
import { useAuth } from "@/hooks";
import { RegisterCard } from "@/pages/uni/login/RegisterCard";

const signup = () => {
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
    <LayoutAuth title="Sign Up">
      <Flex align="center" justify="center">
        <Stack spacing={8} mx="auto" maxW="lg" px={6}>
          <Stack align="center">
            <Heading as="h1" fontSize="xx-large">
              Register
            </Heading>
          </Stack>
          <RegisterCard />
        </Stack>
      </Flex>
    </LayoutAuth>
  );
};

export default signup;