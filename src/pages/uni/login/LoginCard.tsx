import { FormEvent, useState } from "react";
import { decodeToken } from "react-jwt";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Text,
  Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { auth } from "@/api";
import { useAuth } from "@/hooks";

const initialFormValues = {
  username: "",
  password: "",
};

export const LoginCard = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const [formValues, setFormValues] = useState(initialFormValues);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    mutate(formValues);
  };

  const { mutate } = useMutation({mutationFn: auth.login, 
    onSuccess: ({ data }: any) => {
      const { token } = data;
      const decodedToken = decodeToken(token) as any;
      const user = {
        id: Number(decodedToken?.user_id),
        name: decodedToken?.firstName,
        surname: decodedToken?.lastName,
        username: formValues.username,
        token,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <Stack spacing={4} mx="auto" maxW="lg" px={6}>
      <Box
        rounded="lg"
        borderWidth={1}
        borderColor="gray.100"
        boxShadow="sm"
        p={8}
        as="form"
        onSubmit={handleSubmit}
      >
        <Stack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input type="text" onChange={handleChange} />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input type={showPassword ? "text" : "password"} onChange={handleChange} />
              <InputRightElement h="full">
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword((showPassword) => !showPassword)}
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing={10} pt={2}>
            <Button
              loadingText="Submitting"
              size="lg"
              bg="brand.400"
              color="white"
              _hover={{
                bg: "brand.500",
              }}
              type="submit"
            >
              Log in
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align="center">
              Don't have an account?{" "}
              <Link color="brand.400" href="/register">
                Register
              </Link>
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};