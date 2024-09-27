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

  // Effect to handle redirection after 15 seconds when QR code is shown
  useEffect(() => {
    if (qrCode) {
      const timer = setTimeout(() => {
        router.push({ pathname: "/MFAVerify", query: { username: formValues.username } }); // Redirect to another page, e.g., login page after 15 seconds
      }, 10000); // 15 seconds delay

      return () => clearTimeout(timer); // Cleanup the timer on unmount or QR code change
    }
  }, [qrCode, router]);

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
