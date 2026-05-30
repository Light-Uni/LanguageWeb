import { api } from "../api";

export interface DashboardStats {
  totalHours: number;
  streak: number;
  wordsLearned: number;
  xpTotal: number;
  toeicProgress: number;
  japaneseProgress: number;
  programmingProgress: number;
  weakSkills: string[];
  level: number;
  role: string;
}

export interface HeatmapItem {
  date: string;
  count: number;
}

export interface TodayScheduleItem {
  id: string | number;
  time?: string;
  time_slot?: string;
  title?: string;
  subject: string;
  duration_min?: number;
  duration?: number;
  color: string;
  is_completed?: boolean;
  done?: boolean;
}

export interface WeeklyProgressItem {
  day: string;
  toeic: number;
  japanese: number;
  programming: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    return await api.get("/api/dashboard/stats/");
  },

  async getHeatmap(): Promise<HeatmapItem[]> {
    return await api.get("/api/dashboard/heatmap/");
  },

  async getSchedule(): Promise<TodayScheduleItem[]> {
    return await api.get("/api/dashboard/schedule/");
  },

  async getWeeklyProgress(): Promise<WeeklyProgressItem[]> {
    return await api.get("/api/dashboard/weekly-progress/");
  }
};
