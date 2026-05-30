import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, BookOpen, Globe, Code2, Bot, Calendar,
  BarChart3, User, Settings, LogOut, Zap, ChevronLeft,
  ChevronRight, Shield, Flame,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useTheme } from "../../../contexts/ThemeContext";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "#6C63FF" },
  { to: "/toeic", icon: BookOpen, label: "TOEIC", color: "#3B82F6" },
  { to: "/japanese", icon: Globe, label: "Tiếng Nhật", color: "#EC4899" },
  { to: "/programming", icon: Code2, label: "Lập trình", color: "#10B981" },
  { to: "/ai", icon: Bot, label: "AI Assistant", color: "#8B5CF6" },
  { to: "/planner", icon: Calendar, label: "Study Planner", color: "#F59E0B" },
  { to: "/vocabulary", icon: BarChart3, label: "Từ vựng", color: "#06B6D4" },
];

const BOTTOM_ITEMS = [
  { to: "/profile", icon: User, label: "Hồ sơ" },
  { to: "/settings", icon: Settings, label: "Cài đặt" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col overflow-hidden"
      style={{
        background: "var(--sidebar)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5" style={{ minHeight: 72 }}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)",
              boxShadow: "0 0 20px rgba(108,99,255,0.5)",
            }}
          >
            <Zap size={18} color="white" fill="white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.0625rem",
                  letterSpacing: "-0.02em",
                  background: isDark
                    ? "linear-gradient(135deg, #f0f4ff 60%, #8B5CF6 100%)"
                    : "linear-gradient(135deg, #0f172a 60%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  whiteSpace: "nowrap",
                }}
              >
                LinguaFlow
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: "var(--input)",
            border: "1px solid var(--border)",
            color: "var(--muted-foreground)",
          }}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* User Card */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mx-3 mb-4 p-3 rounded-xl"
          style={{ background: "var(--input)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #6C63FF, #8B5CF6)",
                fontFamily: "Sora, sans-serif",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            >
              {user?.initials || "NA"}
            </div>
            <div className="overflow-hidden">
              <p style={{ color: "var(--foreground)", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.8125rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name || "Nguyễn An"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Flame size={11} color="#F59E0B" />
                <span style={{ color: "#F59E0B", fontFamily: "JetBrains Mono, monospace", fontSize: "0.6875rem", fontWeight: 600 }}>
                  {user?.streak || 42} ngày
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-2 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "none" }}>
        <div style={{ color: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.08em", padding: collapsed ? "0 0 8px" : "0 8px 8px" }}>
          {!collapsed && "MENU"}
        </div>
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? "nav-active" : ""}`
                }
                style={({ isActive }) => ({
                  background: isActive ? `${item.color}18` : "transparent",
                  border: isActive ? `1px solid ${item.color}30` : "1px solid transparent",
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      color={isActive ? item.color : (isDark ? "#6b7fa3" : "#64748b")}
                      className="flex-shrink-0 transition-colors duration-200"
                      style={{ filter: isActive ? `drop-shadow(0 0 6px ${item.color})` : "none" }}
                    />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.875rem",
                            fontWeight: isActive ? 600 : 400,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Admin section */}
        {user?.role === "admin" && (
          <>
            <div style={{ height: 1, background: "var(--sidebar-border)", margin: "12px 8px" }} />
            <div style={{ color: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.08em", padding: collapsed ? "0 0 8px" : "0 8px 8px" }}>
              {!collapsed && "ADMIN"}
            </div>
            <NavLink
              to="/admin"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? "nav-active" : ""}`}
              style={({ isActive }) => ({
                background: isActive ? "rgba(16,185,129,0.15)" : "transparent",
                border: isActive ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent",
              })}
            >
              {({ isActive }) => (
                <>
                  <Shield size={18} color={isActive ? "#10B981" : (isDark ? "#6b7fa3" : "#64748b")} className="flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}
                        style={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap" }}
                      >
                        Admin Panel
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          </>
        )}
      </nav>

      {/* Bottom: Profile + Logout */}
      <div className="px-2 pb-4 pt-2" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mb-1"
              style={({ isActive }) => ({
                background: isActive ? "var(--input)" : "transparent",
                color: "var(--muted-foreground)",
              })}
            >
              <Icon size={17} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}
                    style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
          style={{ color: "var(--destructive)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={17} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}
                style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", whiteSpace: "nowrap" }}
              >
                Đăng xuất
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
