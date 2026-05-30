import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "student" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    background: "rgba(108,99,255,0.07)",
    border: "1px solid rgba(108,99,255,0.2)",
    borderRadius: 14,
    color: "#f0f4ff",
    fontFamily: "Inter, sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
    padding: "12px 16px",
    transition: "border-color 0.2s",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    await login(form.email, form.password);
    navigate("/dashboard");
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6C63FF,#3B82F6)" }}>
          <Zap size={16} color="white" fill="white" />
        </div>
        <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "#f0f4ff", fontSize: "1rem" }}>LinguaFlow</span>
      </div>

      <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1.875rem", color: "#f0f4ff", letterSpacing: "-0.03em", marginBottom: 8 }}>
        Tạo tài khoản miễn phí 🚀
      </h1>
      <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.9375rem", marginBottom: 28 }}>
        Bắt đầu hành trình học TOEIC & Tiếng Nhật ngay hôm nay
      </p>

      {/* Role selector */}
      <div className="flex gap-3 mb-6">
        {[
          { value: "student", label: "🎓 Học sinh / Sinh viên" },
          { value: "teacher", label: "👨‍🏫 Giáo viên" },
        ].map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setForm((p) => ({ ...p, role: r.value }))}
            className="flex-1 py-3 rounded-2xl transition-all duration-200 text-sm"
            style={{
              background: form.role === r.value ? "rgba(108,99,255,0.2)" : "rgba(108,99,255,0.06)",
              border: form.role === r.value ? "1px solid rgba(108,99,255,0.5)" : "1px solid rgba(108,99,255,0.15)",
              color: form.role === r.value ? "#f0f4ff" : "#6b7fa3",
              fontFamily: "Inter, sans-serif",
              fontWeight: form.role === r.value ? 600 : 400,
              cursor: "pointer",
              boxShadow: form.role === r.value ? "0 0 16px rgba(108,99,255,0.2)" : "none",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label style={{ color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", fontWeight: 500, display: "block", marginBottom: 8 }}>Họ và tên</label>
          <div className="relative">
            <User size={16} color="#6b7fa3" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input type="text" value={form.name} onChange={set("name")} placeholder="Nguyễn Văn A"
              style={{ ...inputStyle, paddingLeft: 42 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.2)"; }}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={{ color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", fontWeight: 500, display: "block", marginBottom: 8 }}>Email</label>
          <div className="relative">
            <Mail size={16} color="#6b7fa3" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input type="email" value={form.email} onChange={set("email")} placeholder="email@example.com"
              style={{ ...inputStyle, paddingLeft: 42 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.2)"; }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label style={{ color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", fontWeight: 500, display: "block", marginBottom: 8 }}>Mật khẩu</label>
          <div className="relative">
            <Lock size={16} color="#6b7fa3" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Tối thiểu 8 ký tự"
              style={{ ...inputStyle, paddingLeft: 42, paddingRight: 42 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.2)"; }}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
              {showPw ? <EyeOff size={16} color="#6b7fa3" /> : <Eye size={16} color="#6b7fa3" />}
            </button>
          </div>
        </div>

        {/* Confirm */}
        <div>
          <label style={{ color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", fontWeight: 500, display: "block", marginBottom: 8 }}>Xác nhận mật khẩu</label>
          <div className="relative">
            <Lock size={16} color="#6b7fa3" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input type={showPw ? "text" : "password"} value={form.confirm} onChange={set("confirm")} placeholder="Nhập lại mật khẩu"
              style={{ ...inputStyle, paddingLeft: 42, borderColor: form.confirm && form.confirm !== form.password ? "rgba(239,68,68,0.5)" : undefined }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = form.confirm !== form.password ? "rgba(239,68,68,0.5)" : "rgba(108,99,255,0.2)"; }}
            />
          </div>
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" required style={{ accentColor: "#6C63FF", marginTop: 3 }} />
          <span style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", lineHeight: 1.5 }}>
            Tôi đồng ý với{" "}
            <span style={{ color: "#6C63FF" }}>Điều khoản sử dụng</span> và{" "}
            <span style={{ color: "#6C63FF" }}>Chính sách bảo mật</span>
          </span>
        </label>

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
          {loading ? "Đang tạo tài khoản..." : <> Đăng ký ngay <ArrowRight size={18} /> </>}
        </button>
      </form>

      <p className="text-center mt-6" style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.875rem" }}>
        Đã có tài khoản?{" "}
        <Link to="/login" style={{ color: "#6C63FF", fontWeight: 600, textDecoration: "none" }}>Đăng nhập</Link>
      </p>
    </motion.div>
  );
}
