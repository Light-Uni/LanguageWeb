import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, BookOpen, Layers, Pencil, CheckCircle2, XCircle, RefreshCw, Sparkles } from "lucide-react";
import { HIRAGANA, KATAKANA, KANJI_LIST, AI_WRITING_EXAMPLES } from "../../../lib/mockData";

const TABS = [
  { id: "hiragana", label: "Hiragana", icon: Globe, color: "#EC4899" },
  { id: "katakana", label: "Katakana", icon: Layers, color: "#8B5CF6" },
  { id: "kanji", label: "Kanji", icon: BookOpen, color: "#F59E0B" },
  { id: "ai-writing", label: "AI Writing", icon: Pencil, color: "#10B981" },
];

/* ─── Kana Grid ───────────────────────────────────────────────────────────────*/
function KanaGrid({ data, color }: { data: { char: string; romaji: string }[]; color: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [learned, setLearned] = useState<Set<number>>(new Set());

  return (
    <div>
      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))" }}>
        {data.map((item, i) => {
          const isLearned = learned.has(i);
          const isSel = selected === i;
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setSelected(isSel ? null : i); }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200"
              style={{
                background: isSel ? `${color}20` : isLearned ? "rgba(16,185,129,0.08)" : "rgba(11,16,35,0.6)",
                border: isSel ? `2px solid ${color}` : isLearned ? "1px solid rgba(16,185,129,0.35)" : "1px solid rgba(108,99,255,0.15)",
                cursor: "pointer", minHeight: 72,
                boxShadow: isSel ? `0 0 20px ${color}30` : "none",
              }}
            >
              <span style={{ fontFamily: "sans-serif", fontSize: "1.5rem", color: isSel ? "#f0f4ff" : isLearned ? "#10B981" : "#c4cfea", lineHeight: 1.2 }}>
                {item.char}
              </span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.625rem", color: isSel ? color : "#6b7fa3", marginTop: 4, fontWeight: 600 }}>
                {item.romaji}
              </span>
              {isLearned && <span style={{ fontSize: "0.5rem", marginTop: 2 }}>✅</span>}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl"
            style={{
              background: "rgba(8,12,28,0.98)", backdropFilter: "blur(24px)",
              border: `1px solid ${color}40`, boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${color}20`,
              minWidth: 300,
            }}
          >
            <span style={{ fontFamily: "sans-serif", fontSize: "3rem", color: "#f0f4ff" }}>{data[selected].char}</span>
            <div className="flex-1">
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1rem", color, fontWeight: 700 }}>{data[selected].romaji}</p>
              <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", marginTop: 2 }}>Nhấn để đánh dấu đã học</p>
            </div>
            <button
              onClick={() => { setLearned((s) => { const n = new Set(s); n.has(selected) ? n.delete(selected) : n.add(selected); return n; }); setSelected(null); }}
              className="px-4 py-2 rounded-xl flex items-center gap-2"
              style={{ background: learned.has(selected) ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", border: `1px solid ${learned.has(selected) ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)"}`, color: learned.has(selected) ? "#ef4444" : "#10B981", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer" }}
            >
              {learned.has(selected) ? <><XCircle size={14} /> Bỏ</> : <><CheckCircle2 size={14} /> Đã học</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-4">
        <div className="px-4 py-2 rounded-xl" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <span style={{ color: "#10B981", fontFamily: "JetBrains Mono, monospace", fontSize: "0.8125rem", fontWeight: 600 }}>
            ✅ {learned.size}/{data.length} đã học
          </span>
        </div>
        <div style={{ flex: 1, height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
          <div style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, #10B981, ${color})`, width: `${(learned.size / data.length) * 100}%`, boxShadow: "0 0 10px rgba(16,185,129,0.4)", transition: "width 0.3s" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Kanji Grid ──────────────────────────────────────────────────────────────*/
function KanjiGrid() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState("N5");

  const filtered = KANJI_LIST.filter((k) => filter === "All" || k.level === filter);

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "N5", "N4", "N3"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className="px-4 py-2 rounded-xl transition-all duration-200"
            style={{
              background: filter === lvl ? "rgba(245,158,11,0.18)" : "rgba(11,16,35,0.6)",
              border: filter === lvl ? "1px solid rgba(245,158,11,0.45)" : "1px solid rgba(108,99,255,0.15)",
              color: filter === lvl ? "#F59E0B" : "#6b7fa3", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer",
            }}
          >
            {lvl}
          </button>
        ))}
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        {filtered.map((k, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.04, y: -2 }}
            onClick={() => setSelected(selected === i ? null : i)}
            className="p-4 rounded-2xl text-left transition-all duration-200"
            style={{
              background: selected === i ? "rgba(245,158,11,0.12)" : "rgba(11,16,35,0.6)",
              border: selected === i ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(108,99,255,0.15)",
              cursor: "pointer",
              boxShadow: selected === i ? "0 0 20px rgba(245,158,11,0.2)" : "none",
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <span style={{ fontFamily: "sans-serif", fontSize: "2rem", color: "#f0f4ff", lineHeight: 1 }}>{k.char}</span>
              <span style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", fontWeight: 700, padding: "2px 6px", borderRadius: 99 }}>{k.level}</span>
            </div>
            <p style={{ color: "#8B5CF6", fontFamily: "JetBrains Mono, monospace", fontSize: "0.6875rem", marginBottom: 4 }}>{k.reading}</p>
            <p style={{ color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem" }}>{k.meaning}</p>
            <p style={{ color: "#4a5a7a", fontFamily: "JetBrains Mono, monospace", fontSize: "0.625rem", marginTop: 4 }}>{k.strokes} nét</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─── AI Writing Assistant ────────────────────────────────────────────────────*/
function AIWritingTab() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<typeof AI_WRITING_EXAMPLES[0] | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = async () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1500));
    // Match or use first example
    const match = AI_WRITING_EXAMPLES.find((e) => input.includes(e.input.slice(0, 5)));
    setResult(match || AI_WRITING_EXAMPLES[0]);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header card */}
      <div className="p-5 rounded-2xl mb-6" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.35)" }}>
            <Sparkles size={17} color="#10B981" />
          </div>
          <div>
            <p style={{ color: "#10B981", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>AI Writing Assistant</p>
            <p style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }}>Nhập câu tiếng Nhật — AI sẽ phân tích ngữ pháp tức thì</p>
          </div>
        </div>
      </div>

      {/* Example */}
      <div className="mb-6 flex flex-wrap gap-2">
        {AI_WRITING_EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => { setInput(ex.input); setResult(null); }}
            className="px-4 py-2 rounded-xl transition-all duration-200"
            style={{ background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)", color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(108,99,255,0.15)"; e.currentTarget.style.color = "#f0f4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(108,99,255,0.08)"; e.currentTarget.style.color = "#8899bb"; }}
          >
            {ex.input.slice(0, 12)}…
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="relative mb-4">
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(null); }}
          placeholder="例：私は昨日学校に行きます"
          rows={3}
          style={{
            width: "100%", background: "rgba(11,16,35,0.8)", border: "1px solid rgba(108,99,255,0.25)",
            borderRadius: 16, color: "#f0f4ff", fontFamily: "sans-serif", fontSize: "1.125rem",
            padding: "16px 20px", outline: "none", resize: "none", lineHeight: 1.8, letterSpacing: "0.05em",
            boxSizing: "border-box",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.25)"; }}
        />
        <span style={{ position: "absolute", right: 16, bottom: 12, color: "#4a5a7a", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem" }}>
          {input.length} / 200
        </span>
      </div>

      <button
        onClick={analyze}
        disabled={!input.trim() || analyzing}
        className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 mb-6 transition-all duration-200"
        style={{
          background: input.trim() ? "linear-gradient(135deg,#10B981,#3B82F6)" : "rgba(108,99,255,0.2)",
          color: "white", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1rem",
          border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
          boxShadow: input.trim() ? "0 0 32px rgba(16,185,129,0.35)" : "none",
        }}
      >
        {analyzing ? (
          <>
            <RefreshCw size={18} className="animate-spin" />
            AI đang phân tích...
          </>
        ) : (
          <><Sparkles size={18} /> Phân tích ngữ pháp</>
        )}
      </button>

      {/* Result */}
      <AnimatePresence>
        {result && !analyzing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            {/* Accuracy */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(11,16,35,0.7)", border: "1px solid rgba(108,99,255,0.2)" }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ color: "#f0f4ff", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>📊 Kết quả phân tích</span>
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{
                    background: result.accuracy >= 80 ? "rgba(16,185,129,0.12)" : result.accuracy >= 60 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
                    border: `1px solid ${result.accuracy >= 80 ? "rgba(16,185,129,0.35)" : result.accuracy >= 60 ? "rgba(245,158,11,0.35)" : "rgba(239,68,68,0.35)"}`,
                  }}
                >
                  <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1.25rem", color: result.accuracy >= 80 ? "#10B981" : result.accuracy >= 60 ? "#F59E0B" : "#ef4444" }}>
                    {result.accuracy}%
                  </span>
                  <span style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem" }}>chính xác</span>
                </div>
              </div>

              {/* Accuracy bar */}
              <div style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,0.06)", marginBottom: 16 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.accuracy}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 99, background: result.accuracy >= 80 ? "linear-gradient(90deg,#10B981,#3B82F6)" : result.accuracy >= 60 ? "linear-gradient(90deg,#F59E0B,#EC4899)" : "linear-gradient(90deg,#ef4444,#F59E0B)", boxShadow: "0 0 10px rgba(108,99,255,0.3)" }}
                />
              </div>

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className="mb-4">
                  <p style={{ color: "#ef4444", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.875rem", marginBottom: 8 }}>❌ Lỗi phát hiện:</p>
                  {result.errors.map((err, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <XCircle size={14} color="#ef4444" />
                      <span style={{ color: "#f0f4ff", fontFamily: "Inter, sans-serif", fontSize: "0.875rem" }}>{err.type}</span>
                      <span style={{ color: "#6b7fa3", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", marginLeft: "auto" }}>{err.correction}</span>
                    </div>
                  ))}
                </div>
              )}

              {result.errors.length === 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
                  <CheckCircle2 size={14} color="#10B981" />
                  <span style={{ color: "#10B981", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.875rem" }}>Không có lỗi ngữ pháp!</span>
                </div>
              )}

              {/* Correct version */}
              <div className="p-4 rounded-xl mb-3" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <p style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", marginBottom: 6 }}>✅ Câu đúng:</p>
                <p style={{ fontFamily: "sans-serif", fontSize: "1.125rem", color: "#10B981", letterSpacing: "0.05em" }}>{result.corrected}</p>
              </div>

              {/* Natural version */}
              <div className="p-4 rounded-xl mb-3" style={{ background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.2)" }}>
                <p style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", marginBottom: 6 }}>💬 Cách nói tự nhiên hơn:</p>
                <p style={{ fontFamily: "sans-serif", fontSize: "1.125rem", color: "#a78bfa", letterSpacing: "0.05em" }}>{result.natural}</p>
              </div>

              {/* Explanation */}
              <div className="p-4 rounded-xl" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <p style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", marginBottom: 6 }}>📚 Giải thích:</p>
                <p style={{ color: "#c4cfea", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", lineHeight: 1.7 }}>{result.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Japanese Page ───────────────────────────────────────────────────────────*/
export function JapanesePage() {
  const [activeTab, setActiveTab] = useState("hiragana");

  return (
    <div className="px-8 py-8" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3" style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)" }}>
          <span style={{ color: "#EC4899", fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em" }}>🇯🇵 JAPANESE LEARNING</span>
        </div>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem,3vw,2rem)", color: "#f0f4ff", letterSpacing: "-0.03em" }}>
          Học Tiếng Nhật{" "}
          <span style={{ background: "linear-gradient(135deg,#EC4899,#8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            JLPT N1
          </span>
        </h1>
        <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.9375rem", marginTop: 6 }}>
          Hiragana · Katakana · Kanji · AI Grammar Checker
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

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {activeTab === "hiragana" && <KanaGrid data={HIRAGANA} color="#EC4899" />}
          {activeTab === "katakana" && <KanaGrid data={KATAKANA} color="#8B5CF6" />}
          {activeTab === "kanji" && <KanjiGrid />}
          {activeTab === "ai-writing" && <AIWritingTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
