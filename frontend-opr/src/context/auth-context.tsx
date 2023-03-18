import { UserProps } from "common/types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

type AuthContextType = {
  user: UserProps;
  handleSetUser: (user: UserProps) => void;
  handleSetToken: (token: string) => void;
  logout: () => void;
};

const authContextDefaultValues: AuthContextType = {
  user: {
    id: 0,
    name: "",
    email: "",
    role: "",
    isActive: false,
    createdAt: "",
    updatedAt: "",
  },
  handleSetToken: (token: string) => {},
  handleSetUser: (user: UserProps) => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: Props) {
  const DEFAULT_USER = {
    id: 0,
    name: "",
    email: "",
    role: "",
    isActive: false,
    createdAt: "",
    updatedAt: "",
  };
  const [user, setUser] = useState<AuthContextType["user"]>(DEFAULT_USER);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const handleSetToken = (token: string) => {
    localStorage.setItem("token", token);
  };

  const handleSetUser = (user: UserProps) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    location.replace("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(DEFAULT_USER);
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          handleSetUser,
          handleSetToken,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
