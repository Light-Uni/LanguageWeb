/**
 * AI Service
 * Handles communication with the AI assistant endpoint.
 * Falls back to local keyword-based responses when backend is unavailable.
 */
import { api } from "../api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIChatRequest {
  messages: ChatMessage[];
  language?: "vi" | "en" | "ja";
  context?: "toeic" | "japanese" | "programming" | "general";
}

export interface AIChatResponse {
  reply: string;
  context?: string;
  xp_earned?: number;
}

export const aiService = {
  /**
   * POST /api/ai/chat/ — Send a message to the AI and get a reply.
   * Returns a streamed or buffered response depending on backend config.
   */
  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    return await api.post("/api/ai/chat/", request);
  },

  /**
   * GET /api/ai/suggestions/ — Fetch contextual study suggestions.
   */
  async getSuggestions(
    subject?: "toeic" | "japanese" | "programming"
  ): Promise<{ suggestions: string[] }> {
    return await api.get("/api/ai/suggestions/", subject ? { subject } : undefined);
  },

  /**
   * POST /api/ai/grammar-check/ — Submit text for grammar analysis.
   */
  async checkGrammar(
    text: string,
    language: "ja" | "en" = "en"
  ): Promise<{ corrections: { original: string; corrected: string; explanation: string }[] }> {
    return await api.post("/api/ai/grammar-check/", { text, language });
  },

  /**
   * POST /api/ai/code-review/ — Submit code snippet for AI review.
   */
  async reviewCode(
    code: string,
    language: string = "python"
  ): Promise<{ feedback: string; suggestions: string[]; score: number }> {
    return await api.post("/api/ai/code-review/", { code, language });
  },
};
