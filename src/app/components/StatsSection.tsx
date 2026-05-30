import { motion } from "motion/react";
import { Users, FileCheck, TrendingUp, Star } from "lucide-react";

const STATS = [
  {
    icon: Users,
    value: "50,000+",
    label: "Học viên tin tưởng",
    sublabel: "từ 63 tỉnh thành Việt Nam",
    color: "#6C63FF",
    glow: "rgba(108, 99, 255, 0.5)",
  },
  {
    icon: FileCheck,
    value: "2,000+",
    label: "Bài thi thử TOEIC",
    sublabel: "chuẩn format ETS mới nhất",
    color: "#3B82F6",
    glow: "rgba(59, 130, 246, 0.5)",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Tỉ lệ cải thiện điểm",
    sublabel: "trong vòng 3 tháng luyện thi",
    color: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.5)",
  },
  {
    icon: Star,
    value: "4.9★",
    label: "Đánh giá trung bình",
    sublabel: "trên App Store & Google Play",
    color: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.5)",
  },
];

export function StatsSection() {
  return (
    <section
      className="relative py-28 px-8 overflow-hidden"
      style={{ background: "#060a1a" }}
    >
      {/* Background gradient blobs */}
      <div
        className="absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="mx-auto relative z-10" style={{ maxWidth: "1440px" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
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
              SỐ LIỆU THỰC TẾ
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
              marginBottom: "0.75rem",
            }}
          >
            Được hàng chục nghìn học viên tin tưởng
          </h2>
          <p
            style={{
              color: "#6b7fa3",
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              lineHeight: 1.7,
            }}
          >
            Kết quả được chứng minh qua thực tế, không phải lời hứa suông.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative p-8 rounded-2xl text-center group cursor-default"
                style={{
                  background: "rgba(11, 16, 35, 0.6)",
                  border: "1px solid rgba(108, 99, 255, 0.12)",
                  backdropFilter: "blur(16px)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = `1px solid ${stat.color}44`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 40px ${stat.glow}20, 0 20px 50px rgba(0,0,0,0.3)`;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(108, 99, 255, 0.12)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: `${stat.color}18`,
                    border: `1px solid ${stat.color}30`,
                  }}
                >
                  <Icon size={26} color={stat.color} />
                </div>

                {/* Value */}
                <div
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 4vw, 2.75rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    background: `linear-gradient(135deg, ${stat.color}, #f0f4ff)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: "0.75rem",
                    textShadow: "none",
                  }}
                >
                  {stat.value}
                </div>

                <p
                  style={{
                    color: "#c4cfea",
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    marginBottom: "6px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {stat.label}
                </p>
                <p
                  style={{
                    color: "#4a5a7a",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.8125rem",
                    lineHeight: 1.5,
                  }}
                >
                  {stat.sublabel}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
