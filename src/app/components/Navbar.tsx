import { useState } from "react";
import { Search, Bell, ChevronDown, Zap, BookOpen, Users, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

const NAV_LINKS = [
  { label: "Khóa học", icon: BookOpen },
  { label: "Luyện thi TOEIC", icon: Trophy },
  { label: "Tiếng Nhật", icon: null },
  { label: "Cộng đồng", icon: Users },
];

const PROFILE_ITEMS = ["Hồ sơ của tôi", "Tiến độ học tập", "Cài đặt", "Đăng xuất"];

export function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Khóa học");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleNavLinkClick = (label: string) => {
    setActiveLink(label);
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    switch (label) {
      case "Khóa học":
        navigate("/dashboard");
        break;
      case "Luyện thi TOEIC":
        navigate("/toeic");
        break;
      case "Tiếng Nhật":
        navigate("/japanese");
        break;
      case "Cộng đồng":
        navigate("/dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const handleProfileItemClick = async (item: string) => {
    setProfileOpen(false);
    if (item === "Đăng xuất") {
      await logout();
      navigate("/");
    } else if (item === "Hồ sơ của tôi" || item === "Cài đặt") {
      navigate("/profile");
    } else if (item === "Tiến độ học tập") {
      navigate("/dashboard");
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(5, 8, 22, 0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(108, 99, 255, 0.12)",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between px-8 py-4"
        style={{ maxWidth: "1440px" }}
      >
        {/* Logo */}
        <div 
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)",
              boxShadow: "0 0 24px rgba(108, 99, 255, 0.55)",
            }}
          >
            <Zap size={18} color="white" fill="white" />
          </div>
          <span
            style={{
              fontFamily: "Sora, sans-serif",
              fontWeight: 700,
              fontSize: "1.125rem",
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #f0f4ff 60%, #8B5CF6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            LinguaFlow
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavLinkClick(link.label)}
              className="relative px-4 py-2 rounded-xl transition-all duration-200"
              style={{
                color: activeLink === link.label ? "#f0f4ff" : "#6b7fa3",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                background:
                  activeLink === link.label ? "rgba(108, 99, 255, 0.15)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (activeLink !== link.label)
                  e.currentTarget.style.color = "#c4cfea";
              }}
              onMouseLeave={(e) => {
                if (activeLink !== link.label)
                  e.currentTarget.style.color = "#6b7fa3";
              }}
            >
              {link.label}
              {activeLink === link.label && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: "#6C63FF", boxShadow: "0 0 8px #6C63FF" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Right: Search + Icons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Search */}
              <div
                className="hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: "rgba(108, 99, 255, 0.08)",
                  border: "1px solid rgba(108, 99, 255, 0.18)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(108, 99, 255, 0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(108, 99, 255, 0.18)";
                }}
              >
                <Search size={15} color="#6C63FF" />
                <input
                  placeholder="Tìm kiếm khóa học..."
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#8899bb",
                    fontSize: "0.8125rem",
                    width: "150px",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>

              {/* Notification */}
              <button
                className="relative p-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: "rgba(108, 99, 255, 0.08)",
                  border: "1px solid rgba(108, 99, 255, 0.18)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(108, 99, 255, 0.4)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(108, 99, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(108, 99, 255, 0.18)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(108, 99, 255, 0.08)";
                }}
              >
                <Bell size={17} color="#8899bb" />
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{
                    background: "#6C63FF",
                    boxShadow: "0 0 8px rgba(108, 99, 255, 0.9)",
                  }}
                />
              </button>

              {/* Avatar + Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 transition-all"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                    style={{
                      background: "linear-gradient(135deg, #6C63FF, #8B5CF6)",
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      boxShadow: "0 0 16px rgba(108, 99, 255, 0.4)",
                    }}
                  >
                    {user?.initials || "US"}
                  </div>
                  <ChevronDown
                    size={14}
                    color="#6b7fa3"
                    style={{
                      transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-52 rounded-2xl p-2 z-50"
                      style={{
                        background: "rgba(8, 12, 28, 0.96)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(108, 99, 255, 0.2)",
                        boxShadow:
                          "0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(108, 99, 255, 0.05)",
                      }}
                    >
                      {/* User info */}
                      <div className="px-4 py-3 mb-1">
                        <p
                          style={{
                            color: "#f0f4ff",
                            fontFamily: "Sora, sans-serif",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                          }}
                        >
                          {user?.name || "Người dùng"}
                        </p>
                        <p
                          style={{
                            color: "#6b7fa3",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.75rem",
                            marginTop: "2px",
                          }}
                        >
                          {user?.email || ""}
                        </p>
                      </div>
                      <div
                        style={{ height: "1px", background: "rgba(108, 99, 255, 0.1)", margin: "0 8px 8px" }}
                      />
                      {PROFILE_ITEMS.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleProfileItemClick(item)}
                          className="w-full text-left px-4 py-2.5 rounded-xl transition-all duration-150"
                          style={{
                            color: "#8899bb",
                            fontSize: "0.8125rem",
                            fontFamily: "Inter, sans-serif",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(108, 99, 255, 0.12)";
                            e.currentTarget.style.color = "#f0f4ff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#8899bb";
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: "rgba(108, 99, 255, 0.08)",
                  border: "1px solid rgba(108, 99, 255, 0.25)",
                  color: "#c4cfea",
                  fontSize: "0.875rem",
                  fontFamily: "Sora, sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(108, 99, 255, 0.15)";
                  e.currentTarget.style.color = "#f0f4ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(108, 99, 255, 0.08)";
                  e.currentTarget.style.color = "#c4cfea";
                }}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer text-white"
                style={{
                  background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)",
                  boxShadow: "0 0 16px rgba(108, 99, 255, 0.3)",
                  fontSize: "0.875rem",
                  fontFamily: "Sora, sans-serif",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(108, 99, 255, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 16px rgba(108, 99, 255, 0.3)";
                }}
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
