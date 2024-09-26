import { createContext, useEffect, useState } from "react";
import { User } from "@/types";
import { useCookies } from "react-cookie";
import { decodeToken } from "react-jwt";

type AuthState = {
  user: null | User;
};

type AuthContextType = AuthState & {
  setUser: (user: User) => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState<null | User>(null);
  const [cookies, setCookie] = useCookies(["token"]);

  const logout = async () => {
    setUser(null);
    setCookie("token", null, { path: "/" });
  };

  useEffect(() => {
    const user = decodeToken(cookies.token) as User;
    if (user) {
      setUser(user);
    }
    console.log(user);
  }, [cookies.token]);

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};