import { api } from "../api";
import { UserInfo } from "./authService";

export const profileService = {
  async getProfile(): Promise<UserInfo> {
    return await api.get("/api/profile/");
  },

  async updateProfile(data: Partial<UserInfo>): Promise<UserInfo> {
    return await api.put("/api/profile/", data);
  }
};
