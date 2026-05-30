import { api } from "../api";

export interface VocabularyWord {
  id: number;
  word: string;
  reading: string;
  meaning_vi: string;
  example: string;
  category: string;
  difficulty: number;
}

export interface UserVocabularyWord {
  id: number;
  word: string;
  reading: string;
  meaning_vi: string;
  example: string;
  category: string;
  learned_at: string;
  next_review: string;
  ease_factor: number;
  interval_days: number;
  correct_count: number;
  wrong_count: number;
  remember_rate: number;
}

export interface VocabReviewResult {
  message: string;
  next_review: string;
  interval_days: number;
  xp_earned: number;
}

export interface VocabStats {
  totalLearned: number;
  rememberRate: number;
  newToday: number;
  studySpeed: number;
  needReview: number;
  weeklyData: { day: string; learned: number; reviewed: number }[];
  categories: { name: string; value: number; color: string }[];
  difficultWords: { word: string; meaning: string; wrongCount: number; category: string }[];
}

export const vocabularyService = {
  async getVocabulary(filters?: { category?: string; difficulty?: number; search?: string }): Promise<{ results: VocabularyWord[] }> {
    return await api.get("/api/vocabulary/", filters);
  },

  async getMyVocabulary(): Promise<{ results: UserVocabularyWord[] }> {
    return await api.get("/api/vocabulary/my/");
  },

  async reviewWord(vocabId: number, isCorrect: boolean, quality: number = 3): Promise<VocabReviewResult> {
    return await api.post("/api/vocabulary/review/", {
      vocab_id: vocabId,
      is_correct: isCorrect,
      quality,
    });
  },

  async getStats(): Promise<VocabStats> {
    return await api.get("/api/vocabulary/stats/");
  }
};
