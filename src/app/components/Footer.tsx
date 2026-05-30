import { Zap, Github, Twitter, Youtube, Send } from "lucide-react";

const FOOTER_LINKS = {
  "Sản phẩm": ["Khóa học TOEIC", "Luyện thi N3", "AI Tutor", "Mock Tests", "Vocabulary App"],
  "Học tập": ["TOEIC 600+", "TOEIC 750+", "TOEIC 900+", "JLPT N5–N1", "Business English"],
  "Công ty": ["Về chúng tôi", "Blog", "Tuyển dụng", "Đối tác", "Báo chí"],
  "Hỗ trợ": ["Trung tâm trợ giúp", "Cộng đồng", "Liên hệ", "Chính sách", "Điều khoản"],
};

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#030610", borderTop: "1px solid rgba(108,99,255,0.1)" }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: "800px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.5), transparent)",
        }}
      />

      <div className="mx-auto px-8 pt-16 pb-8" style={{ maxWidth: "1440px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)",
                  boxShadow: "0 0 20px rgba(108,99,255,0.5)",
                }}
              >
                <Zap size={18} color="white" fill="white" />
              </div>
              <span
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  background: "linear-gradient(135deg, #f0f4ff, #8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                LinguaFlow
              </span>
            </div>

            <p
              style={{
                color: "#4a5a7a",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.875rem",
                lineHeight: 1.8,
                marginBottom: "1.5rem",
                maxWidth: "280px",
              }}
            >
              Nền tảng học tiếng Anh TOEIC và tiếng Nhật hàng đầu Việt Nam, ứng dụng công nghệ AI tiên tiến.
            </p>

            {/* Newsletter */}
            <div
              className="flex items-center gap-2 p-1.5 rounded-xl"
              style={{
                background: "rgba(108,99,255,0.08)",
                border: "1px solid rgba(108,99,255,0.2)",
              }}
            >
              <input
                placeholder="Email của bạn..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#8899bb",
                  fontSize: "0.8125rem",
                  fontFamily: "Inter, sans-serif",
                  paddingLeft: "12px",
                }}
              />
              <button
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #6C63FF, #3B82F6)",
                  boxShadow: "0 0 16px rgba(108,99,255,0.4)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 24px rgba(108,99,255,0.7)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 16px rgba(108,99,255,0.4)")
                }
              >
                <Send size={15} color="white" />
              </button>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {[Github, Twitter, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "rgba(108,99,255,0.08)",
                    border: "1px solid rgba(108,99,255,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(108,99,255,0.2)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(108,99,255,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(108,99,255,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(108,99,255,0.15)";
                  }}
                >
                  <Icon size={16} color="#6b7fa3" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4
                style={{
                  color: "#f0f4ff",
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  marginBottom: "1.25rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        color: "#4a5a7a",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.8125rem",
                        lineHeight: 1.5,
                        transition: "color 0.15s",
                        textDecoration: "none",
                        display: "block",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#8899bb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#4a5a7a")
                      }
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(108,99,255,0.08)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p
            style={{
              color: "#2a3a5a",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.8125rem",
            }}
          >
            © 2026 LinguaFlow. All rights reserved.
          </p>
          <p
            style={{
              color: "#2a3a5a",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.8125rem",
            }}
          >
            Được xây dựng với ❤️ tại Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
}
