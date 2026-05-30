import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Users, Star, ChevronRight, BarChart3 } from "lucide-react";

const TABS = ["Tất cả", "TOEIC", "Tiếng Nhật", "Mới nhất"];

const COURSES = [
  {
    category: "TOEIC",
    badge: "HOT",
    badgeColor: "#EC4899",
    title: "TOEIC 750+ Sprint",
    desc: "Lộ trình 60 ngày tập trung vào Part 5, 6, 7 với 800+ câu hỏi dạng mới nhất của ETS 2025.",
    level: "Intermediate",
    levelColor: "#3B82F6",
    duration: "60 ngày",
    students: "12,480",
    rating: 4.9,
    progress: 0,
    accent: "#3B82F6",
    tags: ["Part 5-7", "Grammar", "Reading"],
  },
  {
    category: "Tiếng Nhật",
    badge: "NEW",
    badgeColor: "#8B5CF6",
    title: "JLPT N3 Master",
    desc: "Hoàn thành ngữ pháp N3 với 500+ điểm ngữ pháp, 3,750 từ vựng và luyện thi thực chiến.",
    level: "Intermediate",
    levelColor: "#8B5CF6",
    duration: "90 ngày",
    students: "8,320",
    rating: 4.8,
    progress: 0,
    accent: "#8B5CF6",
    tags: ["Ngữ pháp", "Từ vựng", "Kanji"],
  },
  {
    category: "TOEIC",
    badge: "BEST",
    badgeColor: "#10B981",
    title: "TOEIC 900+ Elite",
    desc: "Chương trình chuyên sâu cho người nhắm đến điểm 900+. Phân tích chiến lược từng câu hỏi.",
    level: "Advanced",
    levelColor: "#EC4899",
    duration: "45 ngày",
    students: "5,190",
    rating: 5.0,
    progress: 0,
    accent: "#10B981",
    tags: ["Full Test", "Strategy", "900+"],
  },
  {
    category: "Tiếng Nhật",
    badge: "PHỔ BIẾN",
    badgeColor: "#F59E0B",
    title: "Tiếng Nhật Cơ bản N5→N4",
    desc: "Xây dựng nền tảng vững chắc từ bảng chữ cái Hiragana, Katakana đến ngữ pháp N4 căn bản.",
    level: "Beginner",
    levelColor: "#10B981",
    duration: "120 ngày",
    students: "19,750",
    rating: 4.9,
    progress: 0,
    accent: "#F59E0B",
    tags: ["N5", "N4", "Hiragana"],
  },
  {
    category: "TOEIC",
    badge: "AI",
    badgeColor: "#6C63FF",
    title: "TOEIC Listening Mastery",
    desc: "Chuyên sâu Part 1–4 với AI phân tích accent Mỹ–Anh–Úc–Canada. Tăng 100 điểm trong 30 ngày.",
    level: "All levels",
    levelColor: "#6b7fa3",
    duration: "30 ngày",
    students: "7,640",
    rating: 4.7,
    progress: 0,
    accent: "#6C63FF",
    tags: ["Listening", "Accent", "Part 1-4"],
  },
  {
    category: "Tiếng Nhật",
    badge: "HOT",
    badgeColor: "#EC4899",
    title: "JLPT N1 Intensive",
    desc: "Chương trình cao cấp nhất cho kỳ thi N1 với 10,000 từ vựng, ngữ pháp nâng cao và đọc hiểu chuyên sâu.",
    level: "Advanced",
    levelColor: "#EC4899",
    duration: "180 ngày",
    students: "2,910",
    rating: 4.9,
    progress: 0,
    accent: "#EC4899",
    tags: ["N1", "Business", "10K từ"],
  },
];

export function CoursesSection() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered =
    activeTab === "Tất cả"
      ? COURSES
      : activeTab === "Mới nhất"
      ? COURSES.filter((_, i) => i < 3)
      : COURSES.filter((c) => c.category === activeTab);

  return (
    <section className="relative py-32 px-8" style={{ background: "#050816" }}>
      {/* Top divider */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: "600px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.4), transparent)",
        }}
      />

      <div className="mx-auto" style={{ maxWidth: "1440px" }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{
                background: "rgba(108,99,255,0.1)",
                border: "1px solid rgba(108,99,255,0.25)",
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
                KHÓA HỌC NỔI BẬT
              </span>
            </div>
            <h2
              style={{
                fontFamily: "Sora, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                color: "#f0f4ff",
              }}
            >
              Chọn lộ trình phù hợp
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #6C63FF, #3B82F6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                với mục tiêu của bạn
              </span>
            </h2>
          </div>

          {/* Tabs */}
          <div
            className="flex items-center gap-1 p-1.5 rounded-2xl self-start md:self-auto"
            style={{
              background: "rgba(11,16,35,0.6)",
              border: "1px solid rgba(108,99,255,0.15)",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2 rounded-xl transition-all duration-200"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  background: activeTab === tab ? "rgba(108,99,255,0.22)" : "transparent",
                  color: activeTab === tab ? "#f0f4ff" : "#6b7fa3",
                  border: activeTab === tab ? "1px solid rgba(108,99,255,0.35)" : "1px solid transparent",
                  boxShadow: activeTab === tab ? "0 0 16px rgba(108,99,255,0.2)" : "none",
                  cursor: "pointer",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Course cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filtered.map((course, i) => {
              const isHov = hovered === i;
              return (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative p-6 rounded-2xl cursor-pointer group"
                  style={{
                    background: isHov ? "rgba(15,22,48,0.9)" : "rgba(11,16,35,0.55)",
                    border: isHov
                      ? `1px solid ${course.accent}44`
                      : "1px solid rgba(108,99,255,0.12)",
                    backdropFilter: "blur(16px)",
                    boxShadow: isHov
                      ? `0 0 50px ${course.accent}15, 0 20px 60px rgba(0,0,0,0.35)`
                      : "0 4px 24px rgba(0,0,0,0.15)",
                    transform: isHov ? "translateY(-4px)" : "translateY(0)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="px-2.5 py-1 rounded-lg"
                        style={{
                          background: `${course.badgeColor}18`,
                          color: course.badgeColor,
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.625rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          border: `1px solid ${course.badgeColor}30`,
                        }}
                      >
                        {course.badge}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-lg"
                        style={{
                          background: `${course.levelColor}12`,
                          color: course.levelColor,
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.6875rem",
                          fontWeight: 500,
                        }}
                      >
                        {course.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <span
                        style={{
                          color: "#F59E0B",
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {course.rating}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      color: "#f0f4ff",
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 700,
                      fontSize: "1.0625rem",
                      letterSpacing: "-0.015em",
                      marginBottom: "10px",
                      lineHeight: 1.35,
                    }}
                  >
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      color: "#6b7fa3",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {course.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap mb-5">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          color: "#6b7fa3",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.6875rem",
                          fontWeight: 500,
                          padding: "3px 10px",
                          borderRadius: "99px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(108,99,255,0.08)",
                      marginBottom: "1rem",
                    }}
                  />

                  {/* Footer row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} color="#4a5a7a" />
                        <span
                          style={{
                            color: "#6b7fa3",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          {course.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={13} color="#4a5a7a" />
                        <span
                          style={{
                            color: "#6b7fa3",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          {course.students}
                        </span>
                      </div>
                    </div>

                    <button
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200"
                      style={{
                        background: isHov
                          ? `linear-gradient(135deg, ${course.accent}cc, ${course.accent}88)`
                          : "rgba(108,99,255,0.1)",
                        border: isHov ? "none" : "1px solid rgba(108,99,255,0.2)",
                        color: isHov ? "white" : "#8899bb",
                        fontFamily: "Sora, sans-serif",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        cursor: "pointer",
                        boxShadow: isHov ? `0 0 20px ${course.accent}44` : "none",
                      }}
                    >
                      Đăng ký
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* View all link */}
        <div className="text-center mt-12">
          <button
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl transition-all duration-200"
            style={{
              background: "rgba(108,99,255,0.08)",
              border: "1px solid rgba(108,99,255,0.25)",
              color: "#a78bfa",
              fontFamily: "Sora, sans-serif",
              fontWeight: 600,
              fontSize: "0.9375rem",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(108,99,255,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(108,99,255,0.45)";
              (e.currentTarget as HTMLButtonElement).style.color = "#f0f4ff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(108,99,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(108,99,255,0.25)";
              (e.currentTarget as HTMLButtonElement).style.color = "#a78bfa";
            }}
          >
            <BarChart3 size={16} />
            Xem tất cả khóa học
          </button>
        </div>
      </div>
    </section>
  );
}
