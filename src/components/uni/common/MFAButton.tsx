import { useAuth } from "@/hooks";
import { Container } from "@chakra-ui/react";
import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { Globe } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { decodeToken } from "react-jwt";

export const MFAButton = () => {
  const router = useRouter();
  const isWhite = router.pathname === "/";
  const { user, logout } = useAuth();
  const [cookies, setCookies] = useCookies(['token']);
  const [username, setUsername] = useState("");
  const [hasMFAStatus, setHasMFAStatus] = useState(false);
  useEffect(() => {
    const hasMFA = localStorage.getItem("hasMFA");
    if (hasMFA === "true") {
      setHasMFAStatus(true);
    } else {
      setHasMFAStatus(false);
    }
  }, []);
  useEffect(() => {
    if (cookies.token) {
      const decodedToken = decodeToken(cookies.token) as any;
      setUsername(decodedToken?.sub);
    }
    else {
      setUsername("Guest");
    }
  }, [cookies.token]);
  return (
    !hasMFAStatus && cookies.token && (
        <Container className="container flex h-full items-center justify-center"
          
        >
          It seems like you don't have MFA enabled. 
          <Button
            className={clsx(
              "rounded-full bg-transparent px-5 py-2 text-base font-semibold  ",
              {
                "text-gray-200 hover:bg-primary-800": isWhite,
                "text-primary-800 hover:bg-primary-100": !isWhite,
              }
            )}
          >
            Please enable it by clicking on the link.
          </Button>
        </Container>
      )
  );
};



