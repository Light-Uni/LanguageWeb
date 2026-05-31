import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export function CTASection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative py-28 px-8 overflow-hidden" style={{ background: "#060a1a" }}>
      {/* Background effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(108,99,255,0.15) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      <div className="mx-auto relative z-10" style={{ maxWidth: "860px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative p-12 md:p-16 rounded-3xl text-center overflow-hidden"
          style={{
            background: "rgba(11,16,35,0.7)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(108,99,255,0.22)",
            boxShadow:
              "0 0 80px rgba(108,99,255,0.12), 0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Corner gradient accents */}
          <div
            className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 0% 0%, rgba(108,99,255,0.15), transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 100% 100%, rgba(59,130,246,0.12), transparent 70%)",
            }}
          />

          {/* Top border glow */}
          <div
            className="absolute top-0 left-1/4 right-1/4 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.8), transparent)",
            }}
          />

          <div className="relative z-10">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: "rgba(108,99,255,0.12)",
                border: "1px solid rgba(108,99,255,0.3)",
              }}
            >
              <Sparkles size={13} color="#8B5CF6" />
              <span
                style={{
                  color: "#a78bfa",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}
              >
                BẮT ĐẦU NGAY HÔM NAY · MIỄN PHÍ
              </span>
            </div>

            <h2
              style={{
                fontFamily: "Sora, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.04em",
                marginBottom: "1.25rem",
              }}
            >
              <span style={{ color: "#f0f4ff" }}>Sẵn sàng đạt</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 50%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                TOEIC 900+?
              </span>
            </h2>

            <p
              style={{
                color: "#6b7fa3",
                fontFamily: "Inter, sans-serif",
                fontSize: "1.0625rem",
                lineHeight: 1.75,
                maxWidth: "540px",
                margin: "0 auto 2.5rem",
              }}
            >
              Tham gia ngay hôm nay và nhận{" "}
              <span style={{ color: "#a78bfa" }}>7 ngày dùng thử Premium miễn phí</span>. Không cần thẻ tín dụng.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #6C63FF, #3B82F6)",
                  boxShadow: "0 0 40px rgba(108,99,255,0.55), 0 8px 30px rgba(0,0,0,0.3)",
                  color: "white",
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 60px rgba(108,99,255,0.75), 0 12px 40px rgba(0,0,0,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 40px rgba(108,99,255,0.55), 0 8px 30px rgba(0,0,0,0.3)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
                }}
              >
                Bắt đầu miễn phí ngay
                <ArrowRight size={18} />
              </button>

              <button
                className="px-8 py-4 rounded-2xl transition-all duration-200"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(108,99,255,0.3)",
                  color: "#a78bfa",
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(108,99,255,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(108,99,255,0.5)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#f0f4ff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(108,99,255,0.3)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#a78bfa";
                }}
              >
                Tìm hiểu thêm
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
              {[
                { label: "Không cần thẻ tín dụng" },
                { label: "Hủy bất kỳ lúc nào" },
                { label: "Hỗ trợ 24/7" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2"
                >
                  <span
                    style={{
                      color: "#10B981",
                      fontSize: "0.75rem",
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      color: "#4a5a7a",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.8125rem",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
