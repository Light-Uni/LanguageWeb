import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar } from "../components/shared/Sidebar";
import { ApiStatusBadge } from "../components/shared/ApiStatusBadge";
import { Bell, Search, X, Sun, Moon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const NOTIFICATIONS = [
  { id: "n1", msg: "Bạn có buổi học TOEIC lúc 20:00 hôm nay", time: "30 phút nữa", color: "#3B82F6", read: false },
  { id: "n2", msg: "Streak 42 ngày! 🔥 Tiếp tục phát huy!", time: "08:00", color: "#F59E0B", read: false },
  { id: "n3", msg: "Kanji hôm nay: 火・水・木 đã sẵn sàng", time: "Hôm qua", color: "#8B5CF6", read: true },
];

export function MainLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#050816" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6C63FF, #3B82F6)", boxShadow: "0 0 30px rgba(108,99,255,0.5)" }}
          >
            <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, color: "white", fontSize: "1.25rem" }}>L</span>
          </div>
          <div style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.875rem" }}>Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Sidebar />

      {/* Main content — offset by sidebar width (240px, collapses to 72px) */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: 240, transition: "margin-left 0.3s ease" }}>
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 py-3"
          style={{
            background: isDark ? "rgba(5,8,22,0.85)" : "rgba(246,248,252,0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
            minHeight: 64,
          }}
        >
          {/* Search */}
          <div
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
            style={{ background: "var(--input)", border: "1px solid var(--border)", width: 280 }}
          >
            <Search size={14} color="#6C63FF" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bài học, từ vựng..."
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "var(--foreground)", fontSize: "0.8125rem", width: "100%",
                fontFamily: "Inter, sans-serif",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")}><X size={13} color="var(--muted-foreground)" /></button>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all duration-200"
              style={{ background: "var(--input)", border: "1px solid var(--border)" }}
              title={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {isDark ? <Sun size={17} color="#F59E0B" /> : <Moon size={17} color="#6C63FF" />}
            </button>

            {/* Backend API Status */}
            <ApiStatusBadge />

            {/* Notification */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 rounded-xl transition-all duration-200"
                style={{ background: "var(--input)", border: "1px solid var(--border)" }}
              >
                <Bell size={17} color={isDark ? "#8899bb" : "#64748b"} />
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: "#6C63FF", boxShadow: "0 0 8px rgba(108,99,255,0.9)" }}
                />
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden z-50"
                    style={{
                      background: "var(--popover)",
                      backdropFilter: "blur(24px)",
                      border: "1px solid var(--border)",
                      boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.6)" : "0 24px 64px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                      <p style={{ color: "var(--foreground)", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>Thông báo</p>
                    </div>
                    {NOTIFICATIONS.map((n) => (
                      <div
                        key={n.id}
                        className="flex gap-3 px-4 py-3 transition-all duration-150 cursor-pointer"
                        style={{ background: n.read ? "transparent" : "var(--input)", borderBottom: "1px solid var(--border)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--input)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = n.read ? "transparent" : "var(--input)"; }}
                      >
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.color, boxShadow: `0 0 6px ${n.color}` }} />
                        <div>
                          <p style={{ color: "var(--foreground)", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", lineHeight: 1.5 }}>{n.msg}</p>
                          <p style={{ color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", marginTop: 2 }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
