import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import api from "@/services/api";
import {
  getCurrentUser,
  loginRequest,
  logoutRequest,
  refreshRequest,
} from "@/features/auth/auth.api";
import type { LoginPayload, User } from "@/features/auth/auth.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessTokenRef = useRef<string | null>(null);

  // keeps ref (for interceptor) and state (for re-render) in sync
  const setSession = useCallback(
    async (token: string | null, mustChangePassword?: boolean) => {
      accessTokenRef.current = token;
      setAccessToken(token);

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser({
          ...currentUser,
          ...(mustChangePassword ? { must_change_password: true } : {}),
        });
      } catch {
        setUser(null);
        setAccessToken(null);
        accessTokenRef.current = null;
        throw new Error("Could not restore the current user");
      }
    },
    [],
  );

  // 1. Interceptors (declared first so they exist before the restore call runs)
  useEffect(() => {
    // request interceptor to add the access token to headers
    const reqId = api.interceptors.request.use((config) => {
      if (accessTokenRef.current) {
        config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
      }
      return config;
    });

    // response interceptor to handle 401 errors and refresh the token
    const resId = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;
        const isAuthUrl = original?.url?.includes("/auth/");

        if (error.response?.status === 401 && !original._retry && !isAuthUrl) {
          original._retry = true;
          try {
            const data = await refreshRequest();
            setSession(data.access_token);
            original.headers.Authorization = `Bearer ${data.access_token}`;
            return api(original); // retry the failed request
          } catch {
            setSession(null);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [setSession]);

  // 2.
  // Restore the session only after both token refresh and user lookup finish.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await refreshRequest();
        await setSession(data.access_token);
      } catch {
        await setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, [setSession]);

  // login
  const login = useCallback(
    async (payload: LoginPayload) => {
      const data = await loginRequest(payload);
      await setSession(data.access_token, data.must_change_password);
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest(); // clears the cookie on the server
    } finally {
      await setSession(null);
    }
  }, [setSession]);

  // memoize the context value to avoid unnecessary re-renders
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!accessToken,
      isLoading,
      login,
      logout,
    }),
    [user, accessToken, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
