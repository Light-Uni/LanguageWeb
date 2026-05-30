import { api } from "../api";

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: "student" | "teacher" | "admin";
  avatar: string | null;
  bio: string;
  xp_total: number;
  streak_days: number;
  toeic_target: number;
  jlpt_target: string;
  level?: number;
}

export const authService = {
  async login(username: string, password: string): Promise<UserInfo> {
    const data = await api.post("/api/auth/login/", { username, password });
    
    // Store JWT tokens
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    
    // Fetch profile details
    return await this.getCurrentUser();
  },

  async register(username: string, email: string, password: string): Promise<UserInfo> {
    await api.post("/api/auth/register/", { username, email, password });
    // Automatically log in after registration
    return await this.login(username, password);
  },

  async logout(): Promise<void> {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      try {
        await api.post("/api/auth/logout/", { refresh });
      } catch (err) {
        console.error("Error blacklisting token on logout:", err);
      }
    }
    
    // Clear storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_info");
  },

  async getCurrentUser(): Promise<UserInfo> {
    const profile = await api.get("/api/profile/");
    // Calculate level based on XP: 1 level per 500 XP, minimum 1
    const xp = profile.xp_total || 0;
    const user: UserInfo = {
      ...profile,
      level: Math.max(1, Math.floor(xp / 500) + 1),
    };
    localStorage.setItem("user_info", JSON.stringify(user));
    return user;
  },

  async updateProfile(data: Partial<UserInfo>): Promise<UserInfo> {
    const updated = await api.put("/api/profile/", data);
    const xp = updated.xp_total || 0;
    const user: UserInfo = {
      ...updated,
      level: Math.max(1, Math.floor(xp / 500) + 1),
    };
    localStorage.setItem("user_info", JSON.stringify(user));
    return user;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  },

  getLocalUser(): UserInfo | null {
    const stored = localStorage.getItem("user_info");
    return stored ? JSON.parse(stored) : null;
  }
};
