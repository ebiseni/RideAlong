import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  refresh as refreshApi,
  getCurrentUser,
} from "../api/auth";

import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "../api/auth";

import {
  setAccessToken as saveAccessToken,
  clearAccessToken,
} from "../api/token";


interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider = ({
  children,
}: AuthProviderProps) => {

  const [user, setUser] = useState<AuthUser | null>(null);

  const [accessToken, setAccessToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);


  const restoreSession = async () => {

    try {

      const refreshResponse =
        await refreshApi();


      setAccessToken(
        refreshResponse.accessToken
      );


      saveAccessToken(
        refreshResponse.accessToken
      );


      const currentUser =
        await getCurrentUser();


      setUser(currentUser);


    } catch {

      setUser(null);

      setAccessToken(null);

      clearAccessToken();

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    restoreSession();

  }, []);



  const login = async (
    data: LoginRequest
  ) => {

    const response =
      await loginApi(data);


    setAccessToken(
      response.accessToken
    );


    saveAccessToken(
      response.accessToken
    );


    setUser(response.user);

  };



  const register = async (
    data: RegisterRequest
  ) => {

    const response =
      await registerApi(data);


    setAccessToken(
      response.accessToken
    );


    saveAccessToken(
      response.accessToken
    );


    setUser(response.user);

  };



  const logout = async () => {

    try {

      await logoutApi();

    } finally {

      setUser(null);

      setAccessToken(null);

      clearAccessToken();

    }

  };



  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};



export const useAuthContext = () => {

  const context =
    useContext(AuthContext);


  if (!context) {

    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );

  }


  return context;

};