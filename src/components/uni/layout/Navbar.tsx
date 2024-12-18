import clsx from "clsx";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent, Button, Input } from "@nextui-org/react";

import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { Box, Search } from "lucide-react";
import { LanguageSwitcher, MFAButton } from "../common";
import { useComparison } from "@/lib/hooks";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks";
import { Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Container } from "@chakra-ui/react";
import { decodeToken } from "react-jwt";
import { auth } from "@/api";
import { useCookies } from "react-cookie";
import { set } from "react-hook-form";
import { TokenType } from "@/types";
import { commonApi } from "@/api";
import { AuthContext } from "@/context/AuthContext";


const authLinks = [
  {
    title: "Login",
    href: "/login"
  },
  {
    title: "Register",
    href: "/register"
  }
]

const loggedLinks = [
  {
    title: "Profile",
    href: "/profile"
  }
]

export const Navbar = () => {
  const router = useRouter();
  const { offers } = useComparison();
  const { user, logout } = useAuth();
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
  
  const { mutate: getUsernameMutate } = useMutation({
    mutationFn: commonApi.getUsername, 
    onSuccess: (response: any) => {
      if (response?.username) {
        setUsername(response.username);
      } else {
        console.warn("Response does not contain data.");
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (user) {
      getUsernameMutate();
    }
  }, [user]);
  

  const links = [
    {
      title: "Home",
      href: "/"
    },
    {
      title: "Opportunities",
      href: "/opportunities",
      submenu: [
        {
          title: "All",
          href: "/opportunities"
        },
        {
          title: "Comparison",
          href: "/opportunities/comparison",
          badge: offers.length.toString()
        }
      ]
    },
    {
      title: "Success stories",
      href: "/success-stories"
    }
  ];

  const isWhite = router.pathname === "/";

  return (
    <div
      className={clsx("z-1 relative h-[64px] border-b border-gray-300", {
        "text-white": isWhite
      })}
    >
      <nav className="container flex h-full items-center justify-between">
        <Link href="/">
          <p className="h-fit font-bold">Erasmus++</p>
        </Link>
        <ul className="flex items-center space-x-6">
          {links.map((link, index) => {
            if (link?.submenu) {
              return (
                <Popover placement="bottom">
                  <PopoverTrigger>
                    <Button
                      className={clsx(
                        "rounded-full bg-transparent px-5 py-2 text-base font-semibold  ",
                        {
                          "text-gray-200 hover:bg-primary-800": isWhite,
                          "text-primary-800 hover:bg-primary-100": !isWhite,
                          "!bg-primary-100 text-primary-800": router.pathname.includes(link.href)
                        }
                      )}
                    >
                      {link.title}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-4 py-2">
                      <ul>
                        {link.submenu.map((submenuLink, index) => (
                          <li
                            key={index}
                            className={clsx(
                              "font-inter flex py-1 text-base text-primary-800 hover:text-primary-700",
                              { underline: router.pathname === submenuLink.href }
                            )}
                          >
                            <Link
                              href={submenuLink.href}
                              className={clsx({ underline: router.pathname === submenuLink.href })}
                            >
                              {submenuLink.title}
                            </Link>
                            {submenuLink.badge && (
                              <span
                                className={clsx(
                                  "ml-3 rounded-full bg-primary-600 px-2 py-1 text-xs text-white"
                                )}
                              >
                                {submenuLink.badge}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <li
                key={index}
                className={clsx("rounded-full px-5 py-2 font-semibold text-gray-200", {
                  "bg-primary-800": router.pathname === link.href && isWhite,
                  "text-primary-800 hover:bg-primary-100":
                    router.pathname === link.href && !isWhite,
                  "hover:bg-primary-800": router.pathname !== link.href && isWhite,
                  "text-primary-800 hover:bg-primary-100 ": !isWhite
                })}
              >
                <Link href={link.href}>{link.title}</Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center space-x-5">
          <Input
            placeholder="Quick search..."
            startContent={
              <Search className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
            }
          />

        {user ? 
          (
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="ghost"
                cursor={"pointer"}
                w="40px"
                minW={0}
                p={0}
              >
                <Avatar
                  w="40px"
                  h="40px"
                  name={username}
                  colorScheme="brand"
                  bg="brand.500"
                  color="white"
                  
                />
              </MenuButton>
              <MenuList>
                {loggedLinks.map((item) => (
                  <MenuItem key={item.title} color="brand.500">
                    <Link href={item.href}>{item.title}</Link>
                  </MenuItem>
                ))}
                <MenuDivider />
                <MenuItem
                  color="brand.500"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  Log out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <ul className="flex items-center space-x-6">
              {authLinks.map((link, index) => {
                return (
                  <li
                    key={index}
                    className={clsx("rounded-full px-5 py-2 font-semibold text-gray-200", {
                      "bg-primary-800": router.pathname === link.href && isWhite,
                      "text-primary-800 hover:bg-primary-100":
                        router.pathname === link.href && !isWhite,
                      "hover:bg-primary-800": router.pathname !== link.href && isWhite,
                      "text-primary-800 hover:bg-primary-100 ": !isWhite
                    })}
                  >
                    <Link href={link.href}>{link.title}</Link>
                  </li>
                );
              })}
            </ul>
          )}
          <LanguageSwitcher />
        </div>
      </nav>
      {/* <MFAButton /> */}
    </div>
  );
};
