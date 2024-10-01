import { useState, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { decodeToken } from "react-jwt";
import { useRouter } from "next/router";
import { CookiesProvider, useCookies } from 'react-cookie'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Text,
  cookieStorageManager,
} from "@chakra-ui/react";

import { useAuth } from "@/hooks";
import { auth } from "@/api";
import { TokenType } from "@/types";
 
const inputForm = {
  username: "",
  code: 0,
};

const initialFormValues = {
  name: "",
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  phone: "",
  enabled: false,
  mfaEnabled: false,
  token: "",
};

const MFAVerify = () => {
  const [mfaCode, setMfaCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const [cookies, setCookie] = useCookies(['token'])

  const { mutate } = useMutation({
    mutationFn: auth.validate,
    onSuccess: ({ data }: any) => {
      const  tokenType : TokenType = data;

      console.log("Token:", tokenType);
      setCookie('token', tokenType.token, { path: '/', expires: new Date(tokenType.exp * 1000), sameSite: 'strict', secure: true });
      
      localStorage.setItem("hasMFA", "true");
      router.push("/");
    },
    onError: (error: any) => {
      setErrorMessage("Invalid code, please try again.");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message
    if (mfaCode.trim().length !== 6) {
      setErrorMessage("Code must be 6 digits long");
      return;
    }
    inputForm.code = Number(mfaCode);
    if (!user) {
      inputForm.username = router.query.username as string;
    };
    mutate(inputForm);
  };

  return (
    <Box maxW="sm" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Enter 6-Digit Code from Google Authenticator</FormLabel>
            <Input
              type="text"
              placeholder="123456"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
            />
          </FormControl>
          {errorMessage && <Text color="red.500">{errorMessage}</Text>}
          <Button type="submit" colorScheme="blue" size="lg" w="full">
            Verify
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default MFAVerify;
