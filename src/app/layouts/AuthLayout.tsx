import { Outlet, Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Zap } from "lucide-react";

export function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#050816", fontFamily: "Inter, sans-serif" }}
    >
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ width: "45%", background: "rgba(11,16,35,0.8)" }}
      >
        {/* Grid bg */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 70% at 30% 50%, rgba(108,99,255,0.12) 0%, transparent 65%)" }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6C63FF, #3B82F6)", boxShadow: "0 0 24px rgba(108,99,255,0.5)" }}
          >
            <Zap size={20} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#f0f4ff", letterSpacing: "-0.02em" }}>
            LinguaFlow
          </span>
        </div>

        {/* Quote */}
        <div className="relative">
          <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "#f0f4ff", lineHeight: 1.3, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
            Nền tảng học tập<br />
            <span style={{ background: "linear-gradient(135deg, #6C63FF, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              thông minh nhất
            </span><br />
            Việt Nam
          </p>
          <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.9375rem", lineHeight: 1.7 }}>
            Học TOEIC, Tiếng Nhật và Lập trình<br />với trợ lý AI cá nhân hóa 24/7.
          </p>
        </div>

        {/* Stats */}
        <div className="relative flex gap-8">
          {[
            { value: "50K+", label: "Học viên" },
            { value: "4.9★", label: "Đánh giá" },
            { value: "900+", label: "Điểm TOEIC max" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1.375rem", color: "#6C63FF", letterSpacing: "-0.02em" }}>{s.value}</p>
              <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full" style={{ maxWidth: 440 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
