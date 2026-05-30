import { api } from "../api";

export interface AdminUser {
  id: string | number;
  username: string;
  email: string;
  role: "student" | "teacher" | "admin";
  is_active: boolean;
  date_joined: string;
}

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  coursesTotal: number;
  revenueMonth: number;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    return await api.get("/api/admin-panel/stats/");
  },

  async getUsers(): Promise<AdminUser[]> {
    return await api.get("/api/admin-panel/users/");
  },

  async updateUser(id: number | string, data: Partial<AdminUser>): Promise<AdminUser> {
    return await api.put(`/api/admin-panel/users/${id}/`, data);
  },

  async deleteUser(id: number | string): Promise<void> {
    return await api.delete(`/api/admin-panel/users/${id}/`);
  }
};
