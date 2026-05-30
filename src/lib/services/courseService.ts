import { api } from "../api";

export interface Course {
  id: number;
  title: string;
  description: string;
  category: "toeic" | "japanese" | "programming";
  level: string;
  thumbnail: string | null;
  duration_days: number;
  lesson_count: number;
  enrolled: boolean;
  progress_pct: number;
}

export interface Lesson {
  id: number;
  course: number;
  title: string;
  order: number;
  lesson_type: "text" | "video" | "quiz";
}

export interface Question {
  id: number;
  lesson: number | null;
  part: number | null;
  content: string;
  options_json: string[] | any;
  correct_answer: string;
  explanation: string;
  q_type: "multiple_choice" | "fill_in_blank" | "code";
  audio: string | null;
  image: string | null;
}

export interface LessonDetail extends Lesson {
  content: string;
  questions: Question[];
}

export interface CourseDetail extends Course {
  lessons: Lesson[];
}

export interface QuestionSubmissionResult {
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
  xp_earned: number;
  progress_pct: number | null;
}

export const courseService = {
  async getCourses(category?: string): Promise<Course[]> {
    return await api.get("/api/courses/", category ? { category } : undefined);
  },

  async getCourseDetail(id: number): Promise<CourseDetail> {
    return await api.get(`/api/courses/${id}/`);
  },

  async enrollInCourse(id: number): Promise<{ message: string; xp_earned: number }> {
    return await api.post(`/api/courses/${id}/enroll/`);
  },

  async getLessonDetail(id: number): Promise<LessonDetail> {
    return await api.get(`/api/courses/lessons/${id}/`);
  },

  async submitAnswer(
    questionId: number, 
    selectedAnswer: string, 
    timeTakenSec: number = 0
  ): Promise<QuestionSubmissionResult> {
    return await api.post("/api/courses/questions/submit/", {
      question_id: questionId,
      selected_answer: selectedAnswer,
      time_taken_sec: timeTakenSec,
    });
  }
};
