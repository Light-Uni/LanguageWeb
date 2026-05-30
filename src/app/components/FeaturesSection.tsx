import { useState } from "react";
import { motion } from "motion/react";
import { Bot, FileText, BookMarked, Mic, BrainCircuit, Map } from "lucide-react";

const FEATURES = [
  {
    icon: Bot,
    color: "#6C63FF",
    glow: "rgba(108, 99, 255, 0.4)",
    title: "AI Tutor 24/7",
    desc: "Trợ lý AI cá nhân hóa giải thích ngữ pháp, sửa lỗi và trả lời mọi câu hỏi bằng tiếng Việt tức thì.",
    tag: "GPT-4 Powered",
  },
  {
    icon: FileText,
    color: "#3B82F6",
    glow: "rgba(59, 130, 246, 0.4)",
    title: "TOEIC Mock Tests",
    desc: "2,000+ đề thi thử chuẩn ETS với phân tích chi tiết từng câu, theo dõi tiến độ theo thời gian thực.",
    tag: "ETS Standard",
  },
  {
    icon: BookMarked,
    color: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.4)",
    title: "Smart Vocabulary",
    desc: "Flashcard thông minh với thuật toán Spaced Repetition, học 30 từ vựng TOEIC & N3 mỗi ngày hiệu quả tối đa.",
    tag: "SRS Algorithm",
  },
  {
    icon: Mic,
    color: "#06B6D4",
    glow: "rgba(6, 182, 212, 0.4)",
    title: "Speaking AI",
    desc: "Luyện phát âm tiếng Anh chuẩn và tiếng Nhật với AI nhận diện giọng nói, phân tích pitch và intonation.",
    tag: "Real-time Analysis",
  },
  {
    icon: BrainCircuit,
    color: "#EC4899",
    glow: "rgba(236, 72, 153, 0.4)",
    title: "Grammar Engine",
    desc: "Hệ thống giải thích ngữ pháp JLPT N1–N5 và TOEIC Part 5–6 với 500+ mẫu câu minh họa ngữ cảnh thực tế.",
    tag: "N1 → N5 + TOEIC",
  },
  {
    icon: Map,
    color: "#10B981",
    glow: "rgba(16, 185, 129, 0.4)",
    title: "Learning Roadmap",
    desc: "Lộ trình học tập được cá nhân hóa theo mục tiêu điểm TOEIC và cấp độ JLPT của từng học viên.",
    tag: "Personalized AI",
  },
];

export function FeaturesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative py-32 px-8" style={{ background: "#050816" }}>
      {/* Subtle top divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: "600px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.4), transparent)",
        }}
      />

      <div className="mx-auto" style={{ maxWidth: "1440px" }}>
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(108, 99, 255, 0.1)",
              border: "1px solid rgba(108, 99, 255, 0.25)",
            }}
          >
            <span
              style={{
                color: "#8B5CF6",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              TÍNH NĂNG NỔI BẬT
            </span>
          </div>

          <h2
            style={{
              fontFamily: "Sora, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
            }}
          >
            <span style={{ color: "#f0f4ff" }}>Công nghệ AI tiên tiến cho</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 50%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              hành trình ngôn ngữ của bạn
            </span>
          </h2>

          <p
            style={{
              color: "#6b7fa3",
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            Kết hợp công nghệ AI thế hệ mới với phương pháp học tập đã được khoa học chứng minh để bạn đạt điểm TOEIC mục tiêu nhanh nhất.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            const isHovered = hovered === i;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="relative p-7 rounded-2xl cursor-pointer transition-all duration-300 group"
                style={{
                  background: isHovered
                    ? "rgba(15, 22, 48, 0.9)"
                    : "rgba(11, 16, 35, 0.5)",
                  border: isHovered
                    ? `1px solid ${feature.color}55`
                    : "1px solid rgba(108, 99, 255, 0.12)",
                  boxShadow: isHovered
                    ? `0 0 40px ${feature.glow}25, 0 20px 60px rgba(0,0,0,0.3)`
                    : "0 4px 24px rgba(0,0,0,0.2)",
                  backdropFilter: "blur(16px)",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {/* Gradient top border */}
                <div
                  className="absolute top-0 left-6 right-6 h-px rounded-full transition-all duration-300"
                  style={{
                    background: isHovered
                      ? `linear-gradient(90deg, transparent, ${feature.color}, transparent)`
                      : "linear-gradient(90deg, transparent, rgba(108,99,255,0.2), transparent)",
                  }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                  style={{
                    background: isHovered
                      ? `${feature.color}22`
                      : "rgba(108, 99, 255, 0.1)",
                    border: isHovered
                      ? `1px solid ${feature.color}44`
                      : "1px solid rgba(108,99,255,0.15)",
                    boxShadow: isHovered ? `0 0 20px ${feature.glow}` : "none",
                  }}
                >
                  <Icon size={22} color={isHovered ? feature.color : "#6b7fa3"} />
                </div>

                {/* Tag */}
                <span
                  className="inline-block px-2.5 py-1 rounded-lg mb-3"
                  style={{
                    background: `${feature.color}15`,
                    color: feature.color,
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  {feature.tag}
                </span>

                <h3
                  style={{
                    color: "#f0f4ff",
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.0625rem",
                    marginBottom: "10px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    color: "#6b7fa3",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                  }}
                >
                  {feature.desc}
                </p>

                {/* Arrow on hover */}
                <div
                  className="flex items-center gap-1.5 mt-5 transition-all duration-300"
                  style={{
                    color: isHovered ? feature.color : "transparent",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                >
                  Khám phá ngay →
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
