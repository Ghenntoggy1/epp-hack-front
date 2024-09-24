import { FormEvent, useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { auth } from "@/api/auth";
import Link from "next/link";

const initialFormValues = {
  name: "",
  surname: "",
  username: "",
  email: "",
  password: "",
};

export const SignUpCard = () => {
  const router = useRouter();
  const toast = useToast();

  const [formValues, setFormValues] = useState(initialFormValues);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    // check for password length and characters and email format
    const { password } = formValues;
    if (password.length < 8) {
      toast({
        title: "Something went wrong.",
        description: "Password must be at least 8 characters long.",
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const re = /[0-9]/;
    if (!re.test(password)) {
      toast({
        title: "Something went wrong.",
        description: "Password must contain at least one number (0-9).",
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const re2 = /[a-z]/;
    if (!re2.test(password)) {
      toast({
        title: "Something went wrong.",
        description: "Password must contain at least one lowercase letter (a-z).",
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const re3 = /[A-Z]/;
    if (!re3.test(password)) {
      toast({
        title: "Something went wrong.",
        description: "Password must contain at least one uppercase letter (A-Z).",
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const email = formValues.email;
    const re4 = /\S+@\S+\.\S+/;
    if (!re4.test(email)) {
      toast({
       title: "Something went wrong.",
        description: "Email must be in the correct format.",
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    mutate(formValues);
  };

  const { mutate } = useMutation({ mutationFn: auth.signup, 
    onSuccess: ({ data }: any) => {
      if (data.success) {
        router.push("/email-confirm");
        return;
      }

      const {message} = data;

      toast({
        title: "Something went wrong.",
        description: message,
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
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
              <FormControl id="surname">
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
              backgroundColor='blue.500'
              padding= '5px'
              borderRadius="10"
              borderColor= 'black'
              _hover={{
                bg: "blue.600",
              }}
              type="submit"
            >
              Sign up
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align="center">
              Already a user?{" "}
              <Link  href="/login">
                <Text color="brand.500" as="span">Log In</Text>
              </Link>
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};