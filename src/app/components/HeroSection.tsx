import { motion } from "motion/react";
import { ArrowRight, Play, Flame, Trophy, Star, BookOpen, ChevronRight } from "lucide-react";

function FloatCard({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.5 + delay * 0.5, repeat: Infinity, ease: "easeInOut", delay }}
      style={{
        background: "rgba(11, 16, 35, 0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(108, 99, 255, 0.22)",
        borderRadius: "20px",
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 40px rgba(108,99,255,0.08)",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* Radial progress ring */
function ProgressRing({
  pct,
  color,
  size = 80,
}: {
  pct: number;
  color: string;
  size?: number;
}) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "100vh", background: "#050816" }}
    >
      {/* Animated grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.12) 0%, transparent 65%)",
        }}
      />

      {/* Glowing orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "-10%",
          top: "20%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-5%",
          bottom: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 mx-auto px-8 flex items-center"
        style={{ maxWidth: "1440px", minHeight: "100vh", paddingTop: "88px" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full items-center py-16">
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
              style={{
                background: "rgba(108,99,255,0.12)",
                border: "1px solid rgba(108,99,255,0.3)",
                boxShadow: "0 0 20px rgba(108,99,255,0.12)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#6C63FF", boxShadow: "0 0 8px #6C63FF" }}
              />
              <span
                style={{
                  color: "#a78bfa",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}
              >
                🚀 Nền tảng học ngôn ngữ #1 Việt Nam
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: "Sora, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ color: "#f0f4ff" }}>Master </span>
              <span
                style={{
                  background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 50%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                TOEIC &amp; 日本語
              </span>
              <br />
              <span style={{ color: "#f0f4ff" }}>với </span>
              <span
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI Power
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                color: "#6b7fa3",
                fontFamily: "Inter, sans-serif",
                fontSize: "1.0625rem",
                lineHeight: 1.75,
                marginBottom: "2.5rem",
                maxWidth: "520px",
              }}
            >
              Luyện thi TOEIC 900+ và JLPT N1 với trợ lý AI cá nhân hóa. Hơn{" "}
              <span style={{ color: "#a78bfa" }}>50,000 học viên</span> đã cải thiện điểm số chỉ trong{" "}
              <span style={{ color: "#3B82F6" }}>3 tháng</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              {/* Primary CTA */}
              <button
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl transition-all duration-200 group"
                style={{
                  background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)",
                  boxShadow: "0 0 32px rgba(108,99,255,0.5), 0 4px 24px rgba(0,0,0,0.3)",
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "white",
                  letterSpacing: "-0.01em",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 48px rgba(108,99,255,0.7), 0 8px 32px rgba(0,0,0,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 32px rgba(108,99,255,0.5), 0 4px 24px rgba(0,0,0,0.3)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                Bắt đầu miễn phí
                <ArrowRight size={18} style={{ transition: "transform 0.2s" }} />
              </button>

              {/* Secondary CTA */}
              <button
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl transition-all duration-200"
                style={{
                  background: "rgba(108,99,255,0.08)",
                  border: "1px solid rgba(108,99,255,0.28)",
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "#c4cfea",
                  letterSpacing: "-0.01em",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(108,99,255,0.15)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(108,99,255,0.5)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#f0f4ff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(108,99,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(108,99,255,0.28)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#c4cfea";
                }}
              >
                <Play size={16} fill="currentColor" />
                Xem demo
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center gap-6 flex-wrap"
            >
              {/* Avatars */}
              <div className="flex items-center">
                {["#6C63FF", "#3B82F6", "#8B5CF6", "#06B6D4", "#EC4899"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full flex items-center justify-center border-2"
                      style={{
                        background: `${color}33`,
                        borderColor: "#050816",
                        marginLeft: i === 0 ? 0 : "-10px",
                        fontFamily: "Sora, sans-serif",
                        fontWeight: 700,
                        fontSize: "0.6875rem",
                        color: color,
                        zIndex: 5 - i,
                        position: "relative",
                      }}
                    >
                      {["AN", "TH", "MK", "RY", "+"][i]}
                    </div>
                  )
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      color="#F59E0B"
                      fill="#F59E0B"
                    />
                  ))}
                  <span
                    style={{
                      color: "#F59E0B",
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      marginLeft: "4px",
                    }}
                  >
                    4.9
                  </span>
                </div>
                <p
                  style={{
                    color: "#4a5a7a",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.75rem",
                    marginTop: "2px",
                  }}
                >
                  50,000+ học viên hài lòng
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — Floating cards ── */}
          <div className="relative hidden lg:block" style={{ height: "580px" }}>
            {/* Main card: TOEIC Score Tracker */}
            <FloatCard delay={0} style={{ position: "absolute", top: "40px", left: "20px", width: "320px", padding: "24px" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 500, marginBottom: "2px" }}>
                    TOEIC SCORE TRACKER
                  </p>
                  <p style={{ color: "#f0f4ff", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>
                    785 <span style={{ color: "#4a5a7a", fontSize: "0.8125rem", fontWeight: 400 }}>/990</span>
                  </p>
                </div>
                <div className="relative">
                  <ProgressRing pct={79} color="#6C63FF" size={72} />
                  <span
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "#6C63FF",
                    }}
                  >
                    79%
                  </span>
                </div>
              </div>

              {/* Progress bars */}
              {[
                { label: "Listening", val: 390, max: 495, color: "#6C63FF", pct: 79 },
                { label: "Reading", val: 395, max: 495, color: "#3B82F6", pct: 80 },
              ].map((item) => (
                <div key={item.label} className="mb-3">
                  <div className="flex justify-between mb-1.5">
                    <span style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }}>
                      {item.label}
                    </span>
                    <span style={{ color: "#c4cfea", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem" }}>
                      {item.val}/{item.max}
                    </span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.06)" }}>
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "99px",
                        width: `${item.pct}%`,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)`,
                        boxShadow: `0 0 10px ${item.color}66`,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div
                className="flex items-center gap-2 mt-4 px-3 py-2 rounded-xl"
                style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                <span style={{ color: "#10B981", fontSize: "0.75rem" }}>▲</span>
                <span style={{ color: "#10B981", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 500 }}>
                  +45 điểm trong tháng này
                </span>
              </div>
            </FloatCard>

            {/* Card: Japanese word of the day */}
            <FloatCard
              delay={0.8}
              style={{ position: "absolute", top: "0px", right: "0px", width: "230px", padding: "20px" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EC4899", boxShadow: "0 0 8px #EC4899" }}
                />
                <span style={{ color: "#4a5a7a", fontFamily: "JetBrains Mono, monospace", fontSize: "0.6875rem", letterSpacing: "0.06em" }}>
                  今日の単語
                </span>
              </div>
              <div
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 700,
                  fontSize: "2.25rem",
                  color: "#f0f4ff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                桜
              </div>
              <div style={{ color: "#8B5CF6", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", marginBottom: "6px" }}>
                さくら (sakura)
              </div>
              <div style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem" }}>
                Cherry Blossom • N4
              </div>
              <div
                className="mt-4 flex items-center gap-1.5"
                style={{ color: "#8B5CF6", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", cursor: "pointer" }}
              >
                <BookOpen size={12} />
                Học thêm từ vựng →
              </div>
            </FloatCard>

            {/* Card: Study Streak */}
            <FloatCard
              delay={1.2}
              style={{ position: "absolute", bottom: "80px", left: "0px", width: "195px", padding: "18px" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)" }}
                >
                  <Flame size={20} color="#F59E0B" />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 800,
                      fontSize: "1.625rem",
                      color: "#F59E0B",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      textShadow: "0 0 20px rgba(245,158,11,0.5)",
                    }}
                  >
                    42
                  </div>
                  <div style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }}>
                    ngày liên tiếp
                  </div>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: "6px",
                      borderRadius: "3px",
                      background:
                        i < 6
                          ? `rgba(245,158,11,${0.3 + (i / 6) * 0.7})`
                          : "rgba(255,255,255,0.06)",
                      boxShadow: i < 6 ? "0 0 6px rgba(245,158,11,0.4)" : "none",
                    }}
                  />
                ))}
              </div>
            </FloatCard>

            {/* Card: AI Recommendation */}
            <FloatCard
              delay={1.6}
              style={{ position: "absolute", bottom: "50px", right: "10px", width: "245px", padding: "18px" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(108,99,255,0.2)", border: "1px solid rgba(108,99,255,0.3)" }}
                >
                  <Trophy size={17} color="#6C63FF" />
                </div>
                <div>
                  <div style={{ color: "#f0f4ff", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.875rem" }}>
                    AI Gợi ý hôm nay
                  </div>
                  <div style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.6875rem" }}>
                    Dựa trên tiến độ của bạn
                  </div>
                </div>
              </div>
              <div
                className="rounded-xl px-3 py-2.5"
                style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.18)" }}
              >
                <p style={{ color: "#a78bfa", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", lineHeight: 1.6 }}>
                  Ôn tập Part 5 &amp; 6 — Ngữ pháp là điểm yếu của bạn tuần này.
                </p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }}>
                  30 phút · Level B2
                </span>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, #6C63FF, #3B82F6)",
                    color: "white",
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 0 14px rgba(108,99,255,0.4)",
                  }}
                >
                  Học ngay
                  <ChevronRight size={12} />
                </button>
              </div>
            </FloatCard>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(transparent, #050816)",
        }}
      />
    </section>
  );
}
