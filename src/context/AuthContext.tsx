import { createContext, useEffect, useState } from "react";
import { User } from "@/types";
import { useCookies } from "react-cookie";
import { decodeToken } from "react-jwt";
import { auth, commonApi } from "@/api";

type AuthState = {
  user: null | User;
};

type AuthContextType = AuthState & {
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  login: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => Promise.resolve(),
  login: () => {},
});

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState<null | User>(null);

  const logout = async () => {
    await auth.logout();
    setUser(null);    
  };

  useEffect(() => {
    commonApi.getUsername().then((user: User) => {
      if (user) {
        setUser(user);
      }
    }).catch(error => {
      console.error("Error getting user data:", error);
      setUser(null);
    });
  }, []);

  const login = async () => {
    commonApi.getUsername().then((user: User) => {
      if (user) {
        setUser(user);
      }
    }).catch(error => {
      console.error("Error getting user data:", error);
      setUser(null);
    });
  }

  return <AuthContext.Provider value={{ user, setUser, logout, login }}>{children}</AuthContext.Provider>;
};