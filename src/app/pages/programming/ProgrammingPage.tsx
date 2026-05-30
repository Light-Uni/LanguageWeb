import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code2, Play, RotateCcw, Sparkles, BookOpen, ChevronRight, Terminal } from "lucide-react";
import { PROGRAMMING_LESSONS } from "../../../lib/mockData";

const LANGUAGES = [
  { id: "python", label: "Python", color: "#3B82F6", icon: "🐍", ext: ".py" },
  { id: "javascript", label: "JavaScript", color: "#F59E0B", icon: "🟨", ext: ".js" },
  { id: "java", label: "Java", color: "#EC4899", icon: "☕", ext: ".java" },
  { id: "cpp", label: "C++", color: "#10B981", icon: "⚙️", ext: ".cpp" },
];

export function ProgrammingPage() {
  const [lang, setLang] = useState("python");
  const [lessonIdx, setLessonIdx] = useState(0);
  const [code, setCode] = useState(PROGRAMMING_LESSONS.python[0].starterCode);
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [view, setView] = useState<"lessons" | "editor">("lessons");

  const currentLang = LANGUAGES.find((l) => l.id === lang)!;
  const lessons = PROGRAMMING_LESSONS[lang as keyof typeof PROGRAMMING_LESSONS] || [];
  const lesson = lessons[lessonIdx];

  const selectLang = (l: string) => {
    setLang(l);
    setLessonIdx(0);
    const newLessons = PROGRAMMING_LESSONS[l as keyof typeof PROGRAMMING_LESSONS] || [];
    setCode(newLessons[0]?.starterCode || "");
    setOutput(null);
    setAiReview(null);
    setView("lessons");
  };

  const runCode = async () => {
    setRunning(true);
    setOutput(null);
    await new Promise((r) => setTimeout(r, 800));
    setOutput(lesson?.expectedOutput || "Code executed successfully!");
    setRunning(false);
  };

  const getAIReview = async () => {
    setReviewing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setAiReview(`✅ Code của bạn trông tốt!\n\n📌 Nhận xét:\n• Logic đúng và rõ ràng\n• Đặt tên biến descriptive — tốt!\n• Có thể thêm comment để code dễ đọc hơn\n\n💡 Gợi ý cải thiện:\n• Dùng f-string thay vì concatenation\n• Thêm type hints: def greet(name: str) -> str\n\n🏆 Điểm: 85/100 — Code tốt, tiếp tục phát huy!`);
    setReviewing(false);
  };

  return (
    <div className="px-8 py-8" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
          <span style={{ color: "#10B981", fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em" }}>💻 PROGRAMMING</span>
        </div>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem,3vw,2rem)", color: "#f0f4ff", letterSpacing: "-0.03em" }}>
          Học Lập trình với{" "}
          <span style={{ background: "linear-gradient(135deg,#10B981,#3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            AI Code Review
          </span>
        </h1>
        <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.9375rem", marginTop: 6 }}>
          Python · JavaScript · Java · C++ · Code Editor Online
        </p>
      </motion.div>

      {/* Language selector */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            onClick={() => selectLang(l.id)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all duration-200"
            style={{
              background: lang === l.id ? `${l.color}18` : "rgba(11,16,35,0.6)",
              border: lang === l.id ? `2px solid ${l.color}55` : "1px solid rgba(108,99,255,0.15)",
              color: lang === l.id ? "#f0f4ff" : "#6b7fa3",
              fontFamily: "Sora, sans-serif", fontWeight: lang === l.id ? 700 : 500, fontSize: "0.9rem",
              cursor: "pointer", boxShadow: lang === l.id ? `0 0 24px ${l.color}25` : "none",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{l.icon}</span>
            {l.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lessons panel */}
        <div className="lg:col-span-1">
          <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "#f0f4ff", fontSize: "0.9375rem", marginBottom: 12 }}>
            <BookOpen size={16} style={{ display: "inline", marginRight: 8, color: currentLang.color }} />
            Bài học {currentLang.label}
          </h2>
          <div className="flex flex-col gap-3">
            {lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={() => { setLessonIdx(i); setCode(lesson.starterCode); setOutput(null); setAiReview(null); setView("editor"); }}
                className="flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 w-full"
                style={{
                  background: lessonIdx === i ? `${currentLang.color}14` : "rgba(11,16,35,0.6)",
                  border: lessonIdx === i ? `1px solid ${currentLang.color}40` : "1px solid rgba(108,99,255,0.15)",
                  cursor: "pointer",
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${currentLang.color}20`, border: `1px solid ${currentLang.color}35` }}
                >
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: currentLang.color, fontSize: "0.75rem" }}>{i + 1}</span>
                </div>
                <div>
                  <p style={{ color: "#f0f4ff", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.875rem", marginBottom: 4 }}>{lesson.title}</p>
                  <span style={{ background: `${currentLang.color}15`, color: currentLang.color, fontFamily: "JetBrains Mono, monospace", fontSize: "0.625rem", fontWeight: 600, padding: "2px 8px", borderRadius: 99 }}>
                    {lesson.level}
                  </span>
                </div>
                {lessonIdx === i && <ChevronRight size={16} color={currentLang.color} style={{ marginLeft: "auto", alignSelf: "center" }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Editor & Content */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {lesson && (
            <>
              {/* Lesson content */}
              <div className="p-6 rounded-2xl" style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.15)" }}>
                <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "#f0f4ff", fontSize: "1rem", marginBottom: 16 }}>{lesson.title}</h3>
                <div
                  style={{
                    color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                    background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "16px 20px",
                    border: "1px solid rgba(255,255,255,0.04)",
                    maxHeight: 200, overflowY: "auto",
                  }}
                >
                  {lesson.content}
                </div>
              </div>

              {/* Code editor */}
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(108,99,255,0.2)" }}>
                {/* Editor header */}
                <div className="flex items-center justify-between px-5 py-3" style={{ background: "rgba(6,10,26,0.95)", borderBottom: "1px solid rgba(108,99,255,0.15)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
                    </div>
                    <span style={{ color: "#6b7fa3", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem" }}>main{currentLang.ext}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setCode(lesson.starterCode); setOutput(null); setAiReview(null); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200"
                      style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.2)", color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", cursor: "pointer" }}
                    >
                      <RotateCcw size={12} /> Reset
                    </button>
                    <button
                      onClick={getAIReview}
                      disabled={reviewing}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200"
                      style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: "#8B5CF6", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", cursor: "pointer" }}
                    >
                      <Sparkles size={12} /> {reviewing ? "Reviewing..." : "AI Review"}
                    </button>
                    <button
                      onClick={runCode}
                      disabled={running}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all duration-200"
                      style={{ background: running ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", color: "#10B981", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.75rem", cursor: running ? "not-allowed" : "pointer", boxShadow: running ? "none" : "0 0 12px rgba(16,185,129,0.2)" }}
                    >
                      <Play size={12} fill="#10B981" /> {running ? "Running..." : "Run"}
                    </button>
                  </div>
                </div>

                {/* Code area */}
                <div className="relative">
                  {/* Line numbers */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col pt-4 pb-4 px-3 select-none" style={{ background: "rgba(4,6,18,0.9)", borderRight: "1px solid rgba(108,99,255,0.1)", minWidth: 40 }}>
                    {code.split("\n").map((_, i) => (
                      <span key={i} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: "#2a3a5a", lineHeight: "1.6rem" }}>{i + 1}</span>
                    ))}
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    style={{
                      display: "block", width: "100%", fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.875rem", lineHeight: "1.6rem", color: "#c4cfea",
                      background: "rgba(4,6,18,0.95)", border: "none", outline: "none",
                      padding: "16px 16px 16px 56px", minHeight: 200, resize: "vertical",
                      tabSize: 2, boxSizing: "border-box",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") {
                        e.preventDefault();
                        const start = e.currentTarget.selectionStart;
                        const end = e.currentTarget.selectionEnd;
                        const newCode = code.slice(0, start) + "  " + code.slice(end);
                        setCode(newCode);
                        setTimeout(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2; }, 0);
                      }
                    }}
                  />
                </div>

                {/* Output */}
                <AnimatePresence>
                  {(output || running) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ borderTop: "1px solid rgba(108,99,255,0.15)" }}
                    >
                      <div className="flex items-center gap-2 px-5 py-2" style={{ background: "rgba(6,10,26,0.9)", borderBottom: "1px solid rgba(108,99,255,0.1)" }}>
                        <Terminal size={13} color="#10B981" />
                        <span style={{ color: "#6b7fa3", fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem" }}>Output</span>
                      </div>
                      <div style={{ background: "rgba(2,4,12,0.98)", padding: "16px 20px 16px 56px" }}>
                        {running ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10B981" }} />
                            <span style={{ color: "#6b7fa3", fontFamily: "JetBrains Mono, monospace", fontSize: "0.8125rem" }}>Running...</span>
                          </div>
                        ) : (
                          <pre style={{ color: "#10B981", fontFamily: "JetBrains Mono, monospace", fontSize: "0.8125rem", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
                            {output}
                          </pre>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Review */}
              <AnimatePresence>
                {aiReview && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={16} color="#8B5CF6" />
                      <span style={{ color: "#8B5CF6", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>AI Code Review</span>
                    </div>
                    <pre style={{ color: "#c4cfea", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>{aiReview}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {lessons.length === 0 && (
            <div className="p-8 rounded-2xl text-center" style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.15)" }}>
              <Code2 size={40} color="#6b7fa3" style={{ margin: "0 auto 12px" }} />
              <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif" }}>Bài học đang được cập nhật...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
