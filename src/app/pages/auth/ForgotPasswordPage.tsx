import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link
        to="/login"
        className="inline-flex items-center gap-2 mb-8"
        style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#f0f4ff"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#6b7fa3"; }}
      >
        <ArrowLeft size={16} /> Quay lại đăng nhập
      </Link>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1.875rem", color: "#f0f4ff", letterSpacing: "-0.03em", marginBottom: 8 }}>
              Quên mật khẩu? 🔑
            </h1>
            <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.9375rem", marginBottom: 32 }}>
              Nhập email của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label style={{ color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", fontWeight: 500, display: "block", marginBottom: 8 }}>Email</label>
                <div className="relative">
                  <Mail size={16} color="#6b7fa3" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    style={{
                      background: "rgba(108,99,255,0.07)",
                      border: "1px solid rgba(108,99,255,0.2)",
                      borderRadius: 14,
                      color: "#f0f4ff",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.9rem",
                      outline: "none",
                      width: "100%",
                      padding: "12px 16px 12px 42px",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.2)"; }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2.5 py-3.5 rounded-2xl transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)",
                  color: "white", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.9375rem",
                  boxShadow: "0 0 32px rgba(108,99,255,0.45)", cursor: "pointer", border: "none",
                }}
              >
                {loading ? "Đang gửi..." : <> Gửi link đặt lại <ArrowRight size={18} /> </>}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.3)" }}
              >
                <CheckCircle2 size={40} color="#10B981" />
              </div>
            </div>
            <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#f0f4ff", marginBottom: 12 }}>
              Email đã được gửi! ✅
            </h2>
            <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.9375rem", lineHeight: 1.7, marginBottom: 32 }}>
              Chúng tôi đã gửi link đặt lại mật khẩu đến<br />
              <span style={{ color: "#6C63FF", fontWeight: 600 }}>{email}</span>.<br />
              Vui lòng kiểm tra hộp thư (kể cả spam).
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)",
                color: "white", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.9375rem",
                boxShadow: "0 0 32px rgba(108,99,255,0.45)", textDecoration: "none",
              }}
            >
              Quay lại đăng nhập
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
