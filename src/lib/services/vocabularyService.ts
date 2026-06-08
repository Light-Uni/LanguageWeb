import { api } from "../api";

export interface VocabularyWord {
  id: number;
  word: string;
  reading: string;
  pos: string;
  meaning_vi: string;
  definition_en: string;
  example: string;
  audio_url: string;
  category: string;
  difficulty: number;
}

export interface UserVocabularyWord {
  id: number;
  word: string;
  reading: string;
  pos: string;
  meaning_vi: string;
  definition_en: string;
  example: string;
  audio_url: string;
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

/** Result from the live dictionary lookup endpoint */
export interface DictionaryLookupResult {
  word: string;
  reading?: string;
  pos: string;
  definition_en: string;
  example?: string;
  audio_url?: string;
  /** true when the data was served from the database cache */
  cached?: boolean;
  // Full VocabularyWord fields also present when cached=true
  meaning_vi?: string;
  category?: string;
  difficulty?: number;
}

export const vocabularyService = {
  /** GET /api/vocabulary/?category=TOEIC&difficulty=2&search=... */
  async getVocabulary(filters?: { category?: string; difficulty?: number; search?: string }): Promise<{ results: VocabularyWord[] }> {
    return await api.get("/api/vocabulary/", filters);
  },

  /** GET /api/vocabulary/my/ — words the current user has learned */
  async getMyVocabulary(): Promise<{ results: UserVocabularyWord[] }> {
    return await api.get("/api/vocabulary/my/");
  },

  /** POST /api/vocabulary/review/ — record an SM-2 review result */
  async reviewWord(vocabId: number, isCorrect: boolean, quality: number = 3): Promise<VocabReviewResult> {
    return await api.post("/api/vocabulary/review/", {
      vocab_id: vocabId,
      is_correct: isCorrect,
      quality,
    });
  },

  /** GET /api/vocabulary/stats/ — aggregated stats for the dashboard */
  async getStats(): Promise<VocabStats> {
    return await api.get("/api/vocabulary/stats/");
  },

  /**
   * GET /api/vocabulary/lookup/?word=X&lang=en|ja
   *
   * Live dictionary lookup. Calls the Free Dictionary API (Cambridge-sourced)
   * for English words or Jisho API for Japanese words. The backend caches the
   * result in the database so subsequent lookups are instant.
   *
   * @param word  The word to look up.
   * @param lang  'en' for English (default), 'ja' for Japanese.
   */
  async lookupWord(word: string, lang: "en" | "ja" = "en"): Promise<DictionaryLookupResult> {
    return await api.get("/api/vocabulary/lookup/", { word, lang });
  },
};
