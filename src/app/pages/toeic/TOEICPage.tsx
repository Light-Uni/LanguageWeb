import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Headphones, BookOpen, Brain, FileText, Play, Pause,
  ChevronRight, CheckCircle2, XCircle, RotateCcw, Clock, Trophy,
} from "lucide-react";
import {
  TOEIC_LISTENING_QUESTIONS, TOEIC_READING_PASSAGES, TOEIC_VOCABULARY, MOCK_TEST_INFO
} from "../../../lib/mockData";

/* ─── Tabs ────────────────────────────────────────────────────────────────────*/
const TABS = [
  { id: "listening", label: "Listening", icon: Headphones, color: "#3B82F6" },
  { id: "reading", label: "Reading", icon: BookOpen, color: "#8B5CF6" },
  { id: "vocabulary", label: "Vocabulary", icon: Brain, color: "#10B981" },
  { id: "mocktest", label: "Mock Test", icon: FileText, color: "#EC4899" },
];

/* ─── FlashCard ───────────────────────────────────────────────────────────────*/
function FlashCard({ word, meaning, example, level }: { word: string; meaning: string; example: string; level: string }) {
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<null | boolean>(null);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="cursor-pointer w-full"
        style={{ perspective: 1000, maxWidth: 480, height: 280 }}
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ width: "100%", height: "100%", transformStyle: "preserve-3d", position: "relative" }}
        >
          {/* Front */}
          <div
            style={{
              position: "absolute", inset: 0, backfaceVisibility: "hidden",
              background: "rgba(11,16,35,0.8)", border: "1px solid rgba(108,99,255,0.25)",
              borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: 32,
              boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(108,99,255,0.1)",
            }}
          >
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#4a5a7a", letterSpacing: "0.08em", marginBottom: 16 }}>{level}</span>
            <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "2.5rem", color: "#f0f4ff", letterSpacing: "-0.02em", textAlign: "center" }}>{word}</p>
            <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", marginTop: 16, textAlign: "center" }}>Nhấn để xem nghĩa →</p>
          </div>
          {/* Back */}
          <div
            style={{
              position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)",
              background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.35)",
              borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: 32,
              boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(108,99,255,0.15)",
            }}
          >
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#6C63FF", letterSpacing: "0.08em", marginBottom: 12 }}>NGHĨA</span>
            <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1.375rem", color: "#f0f4ff", textAlign: "center", marginBottom: 16 }}>{meaning}</p>
            <div className="px-4 py-3 rounded-xl w-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ color: "#8B5CF6", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", fontStyle: "italic", textAlign: "center", lineHeight: 1.6 }}>"{example}"</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      {flipped && known === null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
          <button
            onClick={() => setKnown(false)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-200"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          >
            <XCircle size={18} /> Chưa nhớ
          </button>
          <button
            onClick={() => setKnown(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-200"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.1)"; }}
          >
            <CheckCircle2 size={18} /> Đã nhớ!
          </button>
        </motion.div>
      )}
      {known !== null && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl ${known ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}
            style={{ border: `1px solid ${known ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}` }}>
            <span style={{ color: known ? "#10B981" : "#ef4444", fontFamily: "Sora, sans-serif", fontWeight: 600 }}>
              {known ? "✅ Tuyệt!" : "📚 Ôn lại sau"}
            </span>
          </div>
          <button onClick={() => { setFlipped(false); setKnown(null); }} className="p-2 rounded-xl" style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.2)", cursor: "pointer" }}>
            <RotateCcw size={16} color="#6C63FF" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Listening Tab ───────────────────────────────────────────────────────────*/
function ListeningTab() {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const q = TOEIC_LISTENING_QUESTIONS[qIdx];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span style={{ color: "#6b7fa3", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem" }}>
          Câu {qIdx + 1}/{TOEIC_LISTENING_QUESTIONS.length} · Part {q.part}
        </span>
        <div className="flex gap-1">
          {TOEIC_LISTENING_QUESTIONS.map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === qIdx ? "#3B82F6" : "rgba(255,255,255,0.1)", cursor: "pointer" }} onClick={() => { setQIdx(i); setSelected(null); setSubmitted(false); }} />
          ))}
        </div>
      </div>

      {/* Audio player mockup */}
      <div className="p-5 rounded-2xl mb-6" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPlaying(!playing)}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: "linear-gradient(135deg,#3B82F6,#6C63FF)", boxShadow: playing ? "0 0 24px rgba(59,130,246,0.5)" : "none" }}
          >
            {playing ? <Pause size={20} color="white" /> : <Play size={20} color="white" fill="white" />}
          </button>
          <div className="flex-1">
            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div style={{ height: "100%", width: playing ? "45%" : "0%", background: "linear-gradient(90deg,#3B82F6,#6C63FF)", borderRadius: 99, transition: "width 0.3s" }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span style={{ color: "#6b7fa3", fontFamily: "JetBrains Mono, monospace", fontSize: "0.625rem" }}>0:12</span>
              <span style={{ color: "#6b7fa3", fontFamily: "JetBrains Mono, monospace", fontSize: "0.625rem" }}>0:28</span>
            </div>
          </div>
        </div>
        {q.imageDesc && (
          <div className="mt-4 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", fontStyle: "italic" }}>📷 {q.imageDesc}</p>
          </div>
        )}
      </div>

      <p style={{ color: "#f0f4ff", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "1rem", marginBottom: 16 }}>{q.question}</p>

      <div className="flex flex-col gap-3 mb-6">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isSelected = selected === i;
          let bg = "rgba(255,255,255,0.03)";
          let border = "rgba(108,99,255,0.15)";
          let color = "#c4cfea";
          if (submitted) {
            if (isCorrect) { bg = "rgba(16,185,129,0.1)"; border = "rgba(16,185,129,0.4)"; color = "#10B981"; }
            else if (isSelected) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.4)"; color = "#ef4444"; }
          } else if (isSelected) { bg = "rgba(108,99,255,0.15)"; border = "rgba(108,99,255,0.5)"; color = "#f0f4ff"; }

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-200"
              style={{ background: bg, border: `1px solid ${border}`, cursor: submitted ? "default" : "pointer" }}
            >
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color, fontSize: "0.75rem", minWidth: 20 }}>
                {["A", "B", "C", "D"][i]}
              </span>
              <span style={{ color, fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }}>{opt}</span>
              {submitted && isCorrect && <CheckCircle2 size={16} color="#10B981" style={{ marginLeft: "auto" }} />}
              {submitted && isSelected && !isCorrect && <XCircle size={16} color="#ef4444" style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={() => selected !== null && setSubmitted(true)}
          disabled={selected === null}
          className="w-full py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background: selected !== null ? "linear-gradient(135deg,#3B82F6,#6C63FF)" : "rgba(108,99,255,0.2)",
            color: "white", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.9375rem",
            border: "none", cursor: selected !== null ? "pointer" : "not-allowed",
            boxShadow: selected !== null ? "0 0 24px rgba(59,130,246,0.4)" : "none",
          }}
        >
          Kiểm tra đáp án
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)" }}>
            <p style={{ color: "#a78bfa", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", lineHeight: 1.6 }}>
              💡 <strong>Giải thích:</strong> {q.explanation}
            </p>
          </div>
          <button
            onClick={() => { const next = (qIdx + 1) % TOEIC_LISTENING_QUESTIONS.length; setQIdx(next); setSelected(null); setSubmitted(false); setPlaying(false); }}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#3B82F6,#6C63FF)", color: "white", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.9375rem", border: "none", cursor: "pointer" }}
          >
            Câu tiếp theo <ChevronRight size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Reading Tab ─────────────────────────────────────────────────────────────*/
function ReadingTab() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const p = TOEIC_READING_PASSAGES[0];

  const score = p.questions.filter((q) => answers[q.id] === q.correct).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Passage */}
      <div className="p-6 rounded-2xl" style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.15)" }}>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} color="#8B5CF6" />
          <span style={{ color: "#8B5CF6", fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em" }}>PART 7 · PASSAGE</span>
        </div>
        <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f4ff", marginBottom: 16 }}>{p.title}</h3>
        <pre style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "#8899bb", lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {p.passage}
        </pre>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-4">
        {p.questions.map((q, qi) => (
          <div key={q.id} className="p-5 rounded-2xl" style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.15)" }}>
            <p style={{ color: "#f0f4ff", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.9rem", marginBottom: 12 }}>
              {qi + 1}. {q.question}
            </p>
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct;
              const isSelected = answers[q.id] === i;
              let border = "rgba(108,99,255,0.15)";
              let bg = "transparent";
              let color = "#8899bb";
              if (submitted) {
                if (isCorrect) { border = "rgba(16,185,129,0.4)"; bg = "rgba(16,185,129,0.08)"; color = "#10B981"; }
                else if (isSelected) { border = "rgba(239,68,68,0.4)"; bg = "rgba(239,68,68,0.08)"; color = "#ef4444"; }
              } else if (isSelected) { border = "rgba(108,99,255,0.5)"; bg = "rgba(108,99,255,0.12)"; color = "#f0f4ff"; }

              return (
                <button
                  key={i}
                  onClick={() => !submitted && setAnswers((a) => ({ ...a, [q.id]: i }))}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl mb-2 text-left transition-all duration-150"
                  style={{ background: bg, border: `1px solid ${border}`, cursor: submitted ? "default" : "pointer" }}
                >
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color, fontSize: "0.7rem", minWidth: 16 }}>{["A","B","C","D"][i]}</span>
                  <span style={{ color, fontFamily: "Inter, sans-serif", fontSize: "0.8125rem" }}>{opt}</span>
                </button>
              );
            })}
          </div>
        ))}

        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            className="py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#8B5CF6,#6C63FF)", color: "white", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.9375rem", border: "none", cursor: "pointer", boxShadow: "0 0 24px rgba(139,92,246,0.35)" }}
          >
            Nộp bài
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl text-center"
            style={{ background: score === p.questions.length ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${score === p.questions.length ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}` }}
          >
            <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "2rem", color: score === p.questions.length ? "#10B981" : "#F59E0B" }}>
              {score}/{p.questions.length}
            </p>
            <p style={{ color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", marginTop: 4 }}>
              {score === p.questions.length ? "Xuất sắc! 🎉" : "Hãy đọc lại passage để tìm đáp án 📖"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Mock Test Info ──────────────────────────────────────────────────────────*/
function MockTestTab() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MOCK_TEST_INFO.duration * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTest = () => {
    setStarted(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-8 rounded-2xl mb-6 text-center" style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.2)" }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "linear-gradient(135deg,#EC4899,#8B5CF6)", boxShadow: "0 0 40px rgba(236,72,153,0.3)" }}>
            <Trophy size={36} color="white" />
          </div>
          <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "#f0f4ff", letterSpacing: "-0.03em", marginBottom: 8 }}>TOEIC Mock Test</h2>
          <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.9375rem", lineHeight: 1.7, marginBottom: 24 }}>
            Chuẩn ETS 2025 · 200 câu hỏi · 120 phút
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: "Thời gian", value: "120 phút", icon: Clock, color: "#3B82F6" },
              { label: "Tổng câu", value: "200 câu", icon: FileText, color: "#8B5CF6" },
              { label: "Điểm tối đa", value: "990 điểm", icon: Trophy, color: "#F59E0B" },
              { label: "Độ khó", value: "ETS 2025", icon: Brain, color: "#EC4899" },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-xl" style={{ background: `${s.color}0d`, border: `1px solid ${s.color}25` }}>
                <s.icon size={20} color={s.color} style={{ marginBottom: 8 }} />
                <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#f0f4ff" }}>{s.value}</p>
                <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mb-6 text-left">
            {MOCK_TEST_INFO.parts.map((p) => (
              <div key={p.part} className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#c4cfea", fontFamily: "Inter, sans-serif", fontSize: "0.875rem" }}>Part {p.part}: {p.name}</span>
                <span style={{ color: p.type === "listening" ? "#3B82F6" : "#8B5CF6", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", fontWeight: 600 }}>{p.questions} câu</span>
              </div>
            ))}
          </div>
          <button
            onClick={startTest}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200"
            style={{ background: "linear-gradient(135deg,#EC4899,#8B5CF6)", color: "white", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1rem", border: "none", cursor: "pointer", boxShadow: "0 0 32px rgba(236,72,153,0.35)" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 48px rgba(236,72,153,0.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 32px rgba(236,72,153,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <Play size={20} fill="white" /> Bắt đầu thi thử
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 p-4 rounded-2xl sticky top-0 z-10" style={{ background: "rgba(5,8,22,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(108,99,255,0.2)" }}>
        <span style={{ color: "#f0f4ff", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>TOEIC Mock Test</span>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: timeLeft < 300 ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.1)", border: `1px solid ${timeLeft < 300 ? "rgba(239,68,68,0.4)" : "rgba(59,130,246,0.3)"}` }}>
          <Clock size={16} color={timeLeft < 300 ? "#ef4444" : "#3B82F6"} />
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: "1.0625rem", color: timeLeft < 300 ? "#ef4444" : "#3B82F6" }}>{mins}:{secs}</span>
        </div>
      </div>
      <div className="p-6 rounded-2xl text-center" style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.15)" }}>
        <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.9375rem", lineHeight: 1.7 }}>
          📝 Đây là phiên bản demo. Trong phiên bản đầy đủ, 200 câu hỏi thực sự sẽ được tải tại đây với audio cho phần Listening.
        </p>
      </div>
    </div>
  );
}

/* ─── TOEIC Page ──────────────────────────────────────────────────────────────*/
export function TOEICPage() {
  const [activeTab, setActiveTab] = useState("listening");
  const [cardIdx, setCardIdx] = useState(0);

  return (
    <div className="px-8 py-8" style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)" }}>
          <span style={{ color: "#3B82F6", fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em" }}>TOEIC LEARNING</span>
        </div>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem,3vw,2rem)", color: "#f0f4ff", letterSpacing: "-0.03em" }}>
          Luyện thi TOEIC{" "}
          <span style={{ background: "linear-gradient(135deg,#3B82F6,#6C63FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            990 điểm
          </span>
        </h1>
        <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.9375rem", marginTop: 6 }}>
          Chuẩn ETS · AI phân tích điểm yếu · Lộ trình cá nhân hóa
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-200"
              style={{
                background: isActive ? `${tab.color}18` : "rgba(11,16,35,0.6)",
                border: isActive ? `1px solid ${tab.color}44` : "1px solid rgba(108,99,255,0.15)",
                color: isActive ? "#f0f4ff" : "#6b7fa3",
                fontFamily: "Inter, sans-serif", fontWeight: isActive ? 600 : 400, fontSize: "0.875rem",
                cursor: "pointer", boxShadow: isActive ? `0 0 20px ${tab.color}20` : "none",
              }}
            >
              <Icon size={16} color={isActive ? tab.color : "#6b7fa3"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {activeTab === "listening" && <ListeningTab />}
          {activeTab === "reading" && <ReadingTab />}
          {activeTab === "vocabulary" && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <span style={{ color: "#6b7fa3", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem" }}>
                  Từ {cardIdx + 1}/{TOEIC_VOCABULARY.length}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setCardIdx((i) => Math.max(0, i - 1))} className="px-3 py-1.5 rounded-xl" style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.2)", color: "#6b7fa3", cursor: "pointer" }}>← Trước</button>
                  <button onClick={() => setCardIdx((i) => Math.min(TOEIC_VOCABULARY.length - 1, i + 1))} className="px-3 py-1.5 rounded-xl" style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.2)", color: "#6b7fa3", cursor: "pointer" }}>Tiếp →</button>
                </div>
              </div>
              <FlashCard {...TOEIC_VOCABULARY[cardIdx]} />
            </div>
          )}
          {activeTab === "mocktest" && <MockTestTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
