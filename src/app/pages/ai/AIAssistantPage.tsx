import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  User,
  Bot,
  Brain,
  MessageSquare,
  Trash2,
  Share2,
  Code,
  Languages,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { aiService } from "../../../lib/services/aiService";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "ai",
    text: "Xin chào! Mình là **LinguaBot**, trợ lý AI thông minh của bạn. Mình có thể giúp gì cho bạn hôm nay?\n\n*   **Học Tiếng Nhật**: Phân tích cấu trúc câu, sửa lỗi ngữ pháp.\n*   **Luyện thi TOEIC**: Giải thích các chủ điểm ngữ pháp hoặc từ vựng.\n*   **Lập trình**: Review và tối ưu code, giải thích giải thuật.",
    timestamp: "21:00",
  },
];

const SUGGESTIONS = [
  {
    text: "Phân tích ngữ pháp câu: '日本語を勉強するのは楽しいです'",
    icon: Languages,
    color: "#6C63FF",
  },
  {
    text: "Giải thích phần thi Part 5 TOEIC hay bẫy ở những từ nào?",
    icon: BookOpen,
    color: "#3B82F6",
  },
  {
    text: "Viết hàm đệ quy Fibonacci bằng Python và tối ưu độ phức tạp.",
    icon: Code,
    color: "#8B5CF6",
  },
];

export function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    // If online, call the actual AI service
    if (user && !user.isOfflineFallback) {
      try {
        const chatReq = {
          messages: newMessages.map(m => ({
            role: m.sender === "user" ? "user" as const : "assistant" as const,
            content: m.text
          }))
        };
        const response = await aiService.chat(chatReq);
        const aiMsg: Message = {
          id: Date.now().toString(),
          sender: "ai",
          text: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        return;
      } catch (err) {
        console.warn("Backend AI chat failed, falling back to mock response", err);
      }
    }

    // Mock AI response fallback
    setTimeout(() => {
      let aiText = "";
      const inputLower = userMsg.text.toLowerCase();

      if (inputLower.includes("nihongo") || inputLower.includes("tiếng nhật") || inputLower.includes("勉強")) {
        aiText = "Cấu trúc câu bạn vừa hỏi: **「日本語を勉強するのは楽しいです」**\n\n*   **日本語 (Nihongo)**: Tiếng Nhật (Danh từ).\n*   **を (o)**: Trợ từ chỉ đối tượng của hành động.\n*   **勉強する (benkyou suru)**: Học tập (Động từ nhóm 3).\n*   **のは (no wa)**: Danh từ hóa động từ đứng trước, giúp động từ đóng vai trò làm chủ ngữ.\n*   **楽しいです (tanoshii desu)**: Vui vẻ, thú vị (Tính từ đuôi -i + desu lịch sự).\n\n👉 **Dịch nghĩa**: Học tiếng Nhật rất thú vị! Đây là cấu trúc câu rất thông dụng để thể hiện sở thích hay đánh giá một hoạt động.";
      } else if (inputLower.includes("toeic") || inputLower.includes("part 5")) {
        aiText = "Trong phần thi **TOEIC Part 5**, các bẫy thường gặp bao gồm:\n\n1.  **Từ loại (Word Form)**: Bẫy trạng từ đứng trước tính từ hoặc động từ phân từ. Ví dụ: *highly competitive* chứ không dùng *high competitive*.\n2.  **Đại từ (Pronouns)**: Bẫy lựa chọn giữa đại từ phản thân (*himself*) và tính từ sở hữu (*his*) trước danh từ.\n3.  **Từ vựng gây nhầm lẫn (Confusing Words)**: Phân biệt *rise* (nội động từ) và *raise* (ngoại động từ).\n\nBạn muốn làm thử một vài câu hỏi mẫu có giải thích chi tiết không?";
      } else if (inputLower.includes("python") || inputLower.includes("code") || inputLower.includes("fibonacci")) {
        aiText = "Dưới đây là cách cài đặt và tối ưu hóa hàm **Fibonacci đệ quy bằng Python**:\n\n```python\n# Đệ quy cơ bản (O(2^n)) - Dễ tràn stack nếu n lớn\ndef fib_recursive(n):\n    if n <= 1: return n\n    return fib_recursive(n-1) + fib_recursive(n-2)\n\n# Đệ quy tối ưu hóa dùng Memoization (O(n))\ndef fib_memo(n, memo={}):\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)\n    return memo[n]\n```\n\n💡 **Giải thích**: Bằng cách sử dụng một `memo` dictionary để lưu trữ các giá trị đã tính toán, chúng ta tránh việc phải tính đi tính lại cùng một giá trị, giảm độ phức tạp thời gian từ lũy thừa $O(2^n)$ xuống tuyến tính $O(n)$!";
      } else {
        aiText = `Mình đã nhận được yêu cầu: "${userMsg.text}".\n\nĐây là câu trả lời thử nghiệm từ **LinguaBot AI**. Khi hệ thống kết nối với API thực tế (OpenAI/Gemini) ở Phase 3, mình sẽ phản hồi thông minh và chính xác hơn dựa trên tất cả tài liệu học tập của bạn!`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div
      className="flex flex-col min-h-screen relative overflow-hidden"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Background gradients */}
      <div
        className="absolute top-10 left-10 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(108, 99, 255, 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Main chat window container */}
      <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto p-4 md:p-6 z-10">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 rounded-2xl mb-4 backdrop-filter backdrop-blur-md"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)",
                boxShadow: "0 0 20px rgba(108, 99, 255, 0.4)",
              }}
            >
              <Brain size={20} color="white" />
            </div>

            <div>
              <h1
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--foreground)",
                }}
              >
                Trợ lý Học tập AI
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>LinguaBot đang trực tuyến</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2.5 rounded-xl transition-all duration-200"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.15)",
                color: "#f87171",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
              }}
              title="Xóa cuộc trò chuyện"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div
          className="flex-1 flex flex-col p-4 md:p-6 rounded-2xl overflow-y-auto mb-4 custom-scrollbar"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
            minHeight: "350px",
            maxHeight: "calc(100vh - 280px)",
          }}
        >
          {messages.length === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center my-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: "var(--input)",
                  border: "1px solid var(--border)",
                }}
              >
                <Sparkles size={32} color="#8B5CF6" />
              </motion.div>
              <h2
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "var(--foreground)",
                  marginBottom: "8px",
                }}
              >
                Hỏi bất kỳ điều gì với LinguaBot
              </h2>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", maxWidth: "450px", lineHeight: 1.6 }}>
                Chọn một chủ đề gợi ý bên dưới hoặc tự đặt câu hỏi về tiếng Nhật, từ vựng TOEIC, ngữ pháp hay lập trình!
              </p>
            </div>
          )}

          {/* Messages list */}
          <div className="space-y-6 flex-1">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[85%] ${isAi ? "self-start" : "self-end flex-row-reverse ml-auto"}`}
                >
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: isAi
                        ? "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)"
                        : "linear-gradient(135deg, #8B5CF6, #EC4899)",
                      boxShadow: isAi
                        ? "0 4px 12px rgba(108, 99, 255, 0.3)"
                        : "0 4px 12px rgba(139, 92, 246, 0.3)",
                    }}
                  >
                    {isAi ? <Bot size={16} color="white" /> : <User size={16} color="white" />}
                  </div>

                  {/* Bubble */}
                  <div className="flex flex-col gap-1">
                    <div
                      className="p-4 rounded-2xl text-[0.9375rem] leading-7"
                      style={{
                        background: isAi ? "var(--popover)" : "rgba(108, 99, 255, 0.15)",
                        border: isAi ? "1px solid var(--border)" : "1px solid rgba(108, 99, 255, 0.35)",
                        color: "var(--foreground)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {/* Very simple markdown formatter for bolding and code blocks */}
                      {msg.text.split("\n").map((line, i) => {
                        // Check for bullet lists
                        if (line.startsWith("*   ")) {
                          return (
                            <div key={i} className="flex gap-2 pl-2 my-1">
                              <span className="text-[#8B5CF6]">•</span>
                              <span>
                                {line.substring(4).split("**").map((part, pIdx) =>
                                  pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-bold">{part}</strong> : part
                                )}
                              </span>
                            </div>
                          );
                        }
                        // Check for headers
                        if (line.startsWith("### ")) {
                          return (
                            <h4 key={i} className="text-white font-bold text-base mt-4 mb-2">
                              {line.substring(4)}
                            </h4>
                          );
                        }
                        // Simple code block format (mock syntax highlighted block)
                        if (line.startsWith("```")) {
                          return null; // Ignore tag lines
                        }
                        if (line.includes("def ") || line.includes("return ") || line.includes("# ")) {
                          return (
                            <pre key={i} className="p-3 my-2 rounded-lg bg-slate-950/70 border border-slate-800 text-purple-300 font-mono text-xs overflow-x-auto">
                              {line}
                            </pre>
                          );
                        }

                        // Regular line with bold bolding
                        return (
                          <p key={i} className="my-1">
                            {line.split("**").map((part, pIdx) =>
                              pIdx % 2 === 1 ? <strong key={pIdx} className="text-indigo-200 font-bold">{part}</strong> : part
                            )}
                          </p>
                        );
                      })}
                    </div>
                    <span className="text-[0.6875rem] text-muted-foreground self-end px-1">{msg.timestamp}</span>
                  </div>
                </motion.div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 max-w-[80%] self-start">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)",
                  }}
                >
                  <Bot size={16} color="white" />
                </div>
                <div
                  className="p-4 rounded-2xl flex items-center gap-1 bg-slate-900/60 border border-[#6C63FF]/15"
                  style={{ width: "fit-content" }}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {SUGGESTIONS.map((sug) => {
              const Icon = sug.icon;
              return (
                <button
                  key={sug.text}
                  onClick={() => handleSuggestionClick(sug.text)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-300 text-left text-xs text-muted-foreground cursor-pointer"
                  style={{
                    background: "rgba(108, 99, 255, 0.05)",
                    border: "1px solid var(--border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(108, 99, 255, 0.1)";
                    e.currentTarget.style.borderColor = sug.color;
                    e.currentTarget.style.color = "var(--foreground)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(108, 99, 255, 0.05)";
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--muted-foreground)";
                  }}
                >
                  <Icon size={14} color={sug.color} />
                  <span>{sug.text}</span>
                  <ChevronRight size={12} color="var(--muted-foreground)" className="shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {/* Input Bar */}
        <div
          className="flex items-center gap-2 p-2 rounded-2xl"
          style={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            boxShadow: isDark ? "0 10px 30px rgba(0, 0, 0, 0.4)" : "0 10px 30px rgba(0, 0, 0, 0.05)",
          }}
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Đặt câu hỏi cho LinguaBot..."
            className="flex-1 px-4 py-3 bg-transparent text-sm text-foreground outline-none placeholder-muted-foreground"
            style={{
              border: "none",
              fontFamily: "Inter, sans-serif",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 disabled:opacity-40 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)",
              boxShadow: inputValue.trim() ? "0 4px 14px rgba(108, 99, 255, 0.4)" : "none",
            }}
          >
            <Send size={16} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
