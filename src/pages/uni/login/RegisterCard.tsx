import { FormEvent, useEffect, useState } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import MfaPrompt from "./MFAModal";

import { auth } from "@/api";
import { useAuth } from "@/hooks";
import { useCookies } from "react-cookie";

const initialFormValues = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  phone: "",
  enabled: false,
  mfaEnabled: false,
};

const inputFormMFA = {
  username: "",
  code: 0,
};

export const RegisterCard = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [cookie, setCookie] = useCookies(['token']);

  const [formValues, setFormValues] = useState(initialFormValues);
  const [showPassword, setShowPassword] = useState(false);
  const [isMfaPromptOpen, setMfaPromptOpen] = useState(false); // State to control MFA prompt
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [qrCode, setQrCode] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  
  const handleSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    mutate(formValues);
  };

  const { mutate } = useMutation({
    mutationFn: auth.register,
    onSuccess: ({ data }: any) => {
      if (data.qrCode) {
        setQrCode(data.qrCode); 
        console.log("QR code:", data.qrCode);
        setMfaPromptOpen(false); 
        onOpen();
      }
      else {
        const token = data.token;
        const decodedToken = decodeToken(token) as any;
        const user = {
          username: decodedToken?.sub,
        };
        setCookie("token", token, { path: "/" });
        router.push("/");
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });


  const [mfaCode, setMfaCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();

  const { mutate: mutateMFA } = useMutation({
    mutationFn: auth.validate,
    onSuccess: ({ data }: any) => {
      const { token } = data;
      console.log("Token:", token); 
      setCookie('token', token, { path: '/' });
      localStorage.setItem("hasMFA", "true");
      router.push("/");
    },
    onError: (error: any) => {
      setErrorMessage("Invalid code, please try again.");
    },
  });

  const handleSubmitMFA = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message
    if (mfaCode.trim().length !== 6) {
      setErrorMessage("Code must be 6 digits long");
      return;
    }
    inputFormMFA.code = Number(mfaCode);
    inputFormMFA.username = formValues.username;
    mutateMFA(inputFormMFA);
  };

  const handleMfaSetup = () => {
    console.log("Setting up MFA for:", formValues.phone);
    formValues.mfaEnabled = true;
  };
  return (
    <>
      <Stack spacing={4} mx="auto" maxW="lg" px={6}>
        <Box
          rounded="lg"
          borderWidth={1}
          borderColor="gray.100"
          boxShadow="sm"
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" onChange={handleChange} />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="firstName" isRequired>
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
            <FormControl id="phone" isRequired>
              <FormLabel>Phone number</FormLabel>
              <Input type="tel" onChange={handleChange} />
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
                type="button" // Change to button to prevent form submission here
                onClick={() => setMfaPromptOpen(true)} // Open MFA prompt
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
      <MfaPrompt
        isOpen={isMfaPromptOpen}
        onClose={() => setMfaPromptOpen(false)}
        onConfirm={() => {
          handleMfaSetup();
          handleSubmit({ preventDefault: () => {} } as FormEvent<HTMLDivElement>);
        }}
        onDeny={() => handleSubmit({ preventDefault: () => {} } as FormEvent<HTMLDivElement>)}
      />
      {/* Modal to display QR code */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>MFA QR Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {qrCode ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image src={qrCode} alt="MFA QR Code" />
                <form onSubmit={handleSubmitMFA}>
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
            ) : (
              <Text>No QR code available</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
