import { api } from "../api";

export interface StudyTask {
  id: number;
  title: string;
  subject: "TOEIC" | "Japanese" | "Programming" | "Other";
  scheduled_date: string;
  time_slot: string | null;
  duration_min: number;
  color: string;
  is_completed: boolean;
  notes: string;
}

export const plannerService = {
  async getTasks(date?: string): Promise<StudyTask[]> {
    return await api.get("/api/planner/tasks/", date ? { date } : undefined);
  },

  async createTask(task: Omit<StudyTask, "id">): Promise<StudyTask> {
    return await api.post("/api/planner/tasks/", task);
  },

  async updateTask(id: number, task: Partial<StudyTask>): Promise<StudyTask> {
    return await api.put(`/api/planner/tasks/${id}/`, task);
  },

  async patchTask(id: number, data: Partial<StudyTask>): Promise<StudyTask> {
    return await api.patch(`/api/planner/tasks/${id}/`, data);
  },

  async toggleComplete(id: number, is_completed: boolean): Promise<StudyTask> {
    return await api.patch(`/api/planner/tasks/${id}/`, { is_completed });
  },

  async deleteTask(id: number): Promise<{ message: string }> {
    return await api.delete(`/api/planner/tasks/${id}/`);
  }
};
