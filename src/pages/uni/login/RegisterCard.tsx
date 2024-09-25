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
  name: "",
  surname: "",
  username: "",
  email: "",
  password: "",
};

export const RegisterCard = () => {
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

  const { mutate } = useMutation({mutationFn: auth.register, 
    onSuccess: ({ data }: any) => {
      const { token } = data;
      const decodedToken = decodeToken(token) as any;
      const user = {
        id: Number(decodedToken?.user_id),
        username: formValues.username,
        name: formValues.name,
        surname: formValues.surname,
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
          <HStack>
            <Box>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input type="text" onChange={handleChange} />
              </FormControl>
            </Box>
            <Box>
              <FormControl id="surname" isRequired>
                <FormLabel>Surname</FormLabel>
                <Input type="text" onChange={handleChange} />
              </FormControl>
            </Box>
          </HStack>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input type="text" onChange={handleChange} />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type="email" onChange={handleChange} />
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
              Register
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align="center">
              Have an account?{" "}
              <Link color="brand.400" href="/login">
                Log in
              </Link>
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};