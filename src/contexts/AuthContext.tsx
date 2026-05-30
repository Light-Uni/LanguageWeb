import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService, UserInfo } from "../lib/services/authService";
import { MOCK_USER } from "../lib/mockData";

export interface User {
  id: string | number;
  name: string;
  email: string;
  initials: string;
  role: "student" | "admin";
  xp: number;
  level: number;
  streak: number;
  isOfflineFallback?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  isOffline: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapUserInfoToUser(info: UserInfo, isOffline = false): User {
  // Try to generate initials
  let initials = "US";
  if (info.username) {
    initials = info.username.slice(0, 2).toUpperCase();
  }
  return {
    id: info.id,
    name: info.username || "User",
    email: info.email,
    initials: initials,
    role: info.role === "admin" ? "admin" : "student",
    xp: info.xp_total || 0,
    level: info.level || 1,
    streak: info.streak_days || 0,
    isOfflineFallback: isOffline,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check local storage for user info on boot
    const initAuth = async () => {
      const localUser = authService.getLocalUser();
      const token = localStorage.getItem("access_token");

      if (token && localUser) {
        setUser(mapUserInfoToUser(localUser));
        // Verify token & sync in background
        try {
          const freshUser = await authService.getCurrentUser();
          setUser(mapUserInfoToUser(freshUser));
          setIsOffline(false);
        } catch (err: any) {
          console.warn("Could not sync profile on startup, using cached session", err);
          if (err.message && err.message.includes("Session expired")) {
            // Logged out
            setUser(null);
          } else {
            // Network error, mark as offline but keep cached session
            setIsOffline(true);
          }
        }
      } else {
        // Fallback for mock user if no token but mock user was logged in
        const mockStored = localStorage.getItem("lingua_user_mock");
        if (mockStored) {
          setUser(JSON.parse(mockStored));
          setIsOffline(true);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen to token refresh failures
    const handleAuthExpired = () => {
      setUser(null);
      localStorage.removeItem("lingua_user_mock");
    };

    window.addEventListener("auth_expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth_expired", handleAuthExpired);
    };
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const userInfo = await authService.login(username, password);
      setUser(mapUserInfoToUser(userInfo));
      setIsOffline(false);
      localStorage.removeItem("lingua_user_mock");
      setLoading(false);
      return true;
    } catch (err: any) {
      console.warn("Backend login failed. Falling back to mock authentication...", err);
      
      // Check if it's likely a network error or connection refused
      const isNetworkError = !err.status;
      
      if (isNetworkError) {
        // Mock authentication fallback
        await new Promise((r) => setTimeout(r, 800));
        // Use username as name, generate email
        const loggedUser: User = {
          id: MOCK_USER.id,
          name: username,
          email: username.includes("@") ? username : `${username}@email.com`,
          initials: username.slice(0, 2).toUpperCase() || "NA",
          role: username === "admin" ? "admin" : "student",
          xp: MOCK_USER.xp,
          level: MOCK_USER.level,
          streak: MOCK_USER.streak,
          isOfflineFallback: true,
        };
        setUser(loggedUser);
        setIsOffline(true);
        localStorage.setItem("lingua_user_mock", JSON.stringify(loggedUser));
        setLoading(false);
        return true;
      } else {
        // Actual auth error (e.g. 400 Bad Request, incorrect credentials)
        setLoading(false);
        throw err;
      }
    }
  };

  const logout = async () => {
    setLoading(true);
    if (user?.isOfflineFallback) {
      setUser(null);
      localStorage.removeItem("lingua_user_mock");
    } else {
      try {
        await authService.logout();
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        setUser(null);
      }
    }
    setLoading(false);
  };

  const refreshUserData = async () => {
    if (user && !user.isOfflineFallback) {
      try {
        const freshUser = await authService.getCurrentUser();
        setUser(mapUserInfoToUser(freshUser));
        setIsOffline(false);
      } catch (err) {
        console.warn("Could not refresh user details from API", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
        isOffline,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
