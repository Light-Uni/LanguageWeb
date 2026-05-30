import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User as UserIcon,
  Mail,
  Flame,
  Award,
  Sparkles,
  Edit2,
  Calendar,
  Lock,
  ChevronRight,
  BookOpen,
  Code,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { profileService } from "../../../lib/services/profileService";
import { dashboardService, HeatmapItem } from "../../../lib/services/dashboardService";

interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: typeof Award;
  color: string;
  glow: string;
  unlocked: boolean;
}

const INITIAL_BADGES: Badge[] = [
  { id: "1", name: "Chiến binh Streak", desc: "Học tập liên tục 7 ngày liên tiếp", icon: Flame, color: "#EF4444", glow: "rgba(239, 68, 68, 0.4)", unlocked: true },
  { id: "2", name: "Bậc thầy Kanji", desc: "Thuộc lòng 100 chữ Kanji N3 trở lên", icon: Award, color: "#3B82F6", glow: "rgba(59, 130, 246, 0.4)", unlocked: true },
  { id: "3", name: "Luyện sĩ TOEIC", desc: "Hoàn thành 5 đề thi thử TOEIC", icon: Trophy, color: "#F59E0B", glow: "rgba(245, 158, 11, 0.4)", unlocked: true },
  { id: "4", name: "Siêu nhân Thuật toán", desc: "Tự viết thành công 30 bài code tối ưu", icon: Code, color: "#8B5CF6", glow: "rgba(139, 92, 246, 0.4)", unlocked: false },
];

export function ProfilePage() {
  const { user, isOffline, refreshUserData } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(user?.name || "Nguyễn An");
  const [bio, setBio] = useState("Học viên LinguaFlow");
  const [avatar, setAvatar] = useState(user?.initials || "US");
  const [email, setEmail] = useState(user?.email || "user@email.com");
  const [heatmapData, setHeatmapData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Temporary Edit Form State
  const [tempName, setTempName] = useState(name);
  const [tempBio, setTempBio] = useState(bio);
  const [tempEmail, setTempEmail] = useState(email);

  // Sync state with auth user when user loads
  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.initials);
      setEmail(user.email);
    }
  }, [user]);

  // Load bio and heatmap
  useEffect(() => {
    const loadProfileData = async () => {
      if (user && !user.isOfflineFallback) {
        try {
          const profile = await profileService.getProfile();
          setBio(profile.bio || "Chưa có tiểu sử.");
          setTempBio(profile.bio || "");
          
          const heatmap = await dashboardService.getHeatmap();
          // Map counts (0-4+) to level values
          const mapped = heatmap.map((h: HeatmapItem) => {
            if (h.count === 0) return 0;
            if (h.count === 1) return 1;
            if (h.count === 2) return 2;
            return 4;
          });
          setHeatmapData(mapped);
        } catch (err) {
          console.warn("Could not load backend profile data", err);
          generateMockHeatmap();
        }
      } else {
        generateMockHeatmap();
      }
    };

    const generateMockHeatmap = () => {
      setBio("Kỹ sư phần mềm tương lai | Đam mê tiếng Nhật và văn hóa xứ sở hoa anh đào. Đang nỗ lực bứt phá TOEIC 900+!");
      setTempBio("Kỹ sư phần mềm tương lai | Đam mê tiếng Nhật và văn hóa xứ sở hoa anh đào. Đang nỗ lực bứt phá TOEIC 900+!");
      const mock = Array.from({ length: 15 * 7 }).map(() => {
        const randVal = Math.random();
        if (randVal > 0.8) return 4;
        if (randVal > 0.5) return 2;
        if (randVal > 0.3) return 1;
        return 0;
      });
      setHeatmapData(mock);
    };

    loadProfileData();
  }, [user]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      if (user && !user.isOfflineFallback) {
        await profileService.updateProfile({
          username: tempName,
          email: tempEmail,
          bio: tempBio,
        });
        await refreshUserData();
      }
      
      setName(tempName);
      setBio(tempBio);
      setEmail(tempEmail);
      if (tempName.trim()) {
        setAvatar(
          tempName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        );
      }
      setShowEditModal(false);
    } catch (err) {
      console.error("Save profile failed", err);
      // fallback
      setName(tempName);
      setBio(tempBio);
      setEmail(tempEmail);
      setShowEditModal(false);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="flex flex-col min-h-screen p-4 md:p-8 relative overflow-hidden"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Background decorations */}
      <div
        className="absolute top-10 left-10 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(108, 99, 255, 0.05) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col gap-8">
        {/* Profile Card Header */}
        <div
          className="p-8 rounded-3xl relative overflow-hidden"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Cover decorative bar */}
          <div
            className="absolute top-0 left-0 right-0 h-2.5"
            style={{
              background: "linear-gradient(90deg, #6C63FF 0%, #3B82F6 50%, #8B5CF6 100%)",
            }}
          />

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 mt-2">
            {/* Avatar Circle */}
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl relative group shrink-0"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)",
                boxShadow: "0 8px 32px rgba(108, 99, 255, 0.35)",
              }}
            >
              {avatar}
              <div
                className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
                onClick={() => setShowEditModal(true)}
              >
                <Edit2 size={18} color="white" />
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      color: "var(--foreground)",
                    }}
                  >
                    {name}
                  </h2>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem", marginTop: "2px" }} className="flex items-center justify-center sm:justify-start gap-1">
                    <Mail size={13} color="var(--muted-foreground)" /> {email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setTempName(name);
                    setTempBio(bio);
                    setTempEmail(email);
                    setShowEditModal(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border transition text-xs font-semibold cursor-pointer text-muted-foreground hover:text-foreground"
                  style={{ background: "var(--input)", borderColor: "var(--border)" }}
                >
                  <Edit2 size={12} />
                  <span>Sửa thông tin</span>
                </button>
              </div>

              <p style={{ color: "var(--foreground)", opacity: 0.8, fontSize: "0.875rem", lineHeight: 1.6, marginTop: "16px" }}>
                {bio}
              </p>

              {/* Mini counters */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 mt-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2">
                  <Flame size={18} color="#EF4444" />
                  <div>
                    <span className="block text-xs text-muted-foreground">Streak hiện tại</span>
                    <span className="font-bold text-sm text-foreground" style={{ fontFamily: "Sora" }}>12 ngày</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={18} color="#6C63FF" />
                  <div>
                    <span className="block text-xs text-muted-foreground">XP Tích lũy</span>
                    <span className="font-bold text-sm text-foreground" style={{ fontFamily: "Sora" }}>4,850 XP</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={18} color="#3B82F6" />
                  <div>
                    <span className="block text-xs text-muted-foreground">Hạng giải đấu</span>
                    <span className="font-bold text-sm text-foreground" style={{ fontFamily: "Sora" }}>Kim Cương IV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Activity */}
        <div
          className="p-6 rounded-3xl"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} color="#6C63FF" />
            <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>
              Tần suất học tập trong năm
            </h3>
          </div>

          {/* Grid Heatmap */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1.5 min-w-[560px]">
              {Array.from({ length: Math.ceil(heatmapData.length / 7) }).map((_, wIdx) => (
                <div key={`w-${wIdx}`} className="flex flex-col gap-1.5">
                  {Array.from({ length: 7 }).map((_, dIdx) => {
                    const idx = wIdx * 7 + dIdx;
                    const level = heatmapData[idx] || 0;
                    let bgColor = "rgba(255,255,255,0.03)";
                    let glowBox = "none";
                    if (level === 1) bgColor = "rgba(108, 99, 255, 0.2)";
                    if (level === 2) bgColor = "rgba(108, 99, 255, 0.4)";
                    if (level === 4) {
                      bgColor = "rgba(108, 99, 255, 0.85)";
                      glowBox = "0 0 8px rgba(108, 99, 255, 0.45)";
                    }

                    return (
                      <div
                        key={`d-${dIdx}`}
                        className="w-3.5 h-3.5 rounded-sm transition duration-300"
                        style={{
                          background: bgColor,
                          boxShadow: glowBox,
                        }}
                        title={`Ngày học thứ ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              ))}

            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-3 font-semibold">
            <span>Ít học</span>
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--border)", opacity: 0.3 }} />
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(108, 99, 255, 0.2)" }} />
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(108, 99, 255, 0.4)" }} />
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(108, 99, 255, 0.85)" }} />
            </div>
            <span>Chăm chỉ</span>
          </div>
        </div>

        {/* Badges Achievements */}
        <div
          className="p-6 rounded-3xl"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Award size={18} color="#8B5CF6" />
            <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>
              Danh hiệu đạt được ({INITIAL_BADGES.filter((b) => b.unlocked).length}/{INITIAL_BADGES.length})
            </h3>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INITIAL_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className="flex items-center gap-4 p-4 rounded-2xl cursor-default"
                  style={{
                    background: "var(--input)",
                    border: badge.unlocked ? `1px solid ${badge.color}35` : "1px solid var(--border)",
                    opacity: badge.unlocked ? 1 : 0.4,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: badge.unlocked ? `${badge.color}15` : "rgba(255,255,255,0.03)",
                      border: badge.unlocked ? `1px solid ${badge.color}45` : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: badge.unlocked ? `0 0 16px ${badge.glow}15` : "none",
                    }}
                  >
                    <Icon size={20} color={badge.unlocked ? badge.color : "#4a5a7a"} />
                  </div>

                  <div>
                    <h4
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        color: badge.unlocked ? "var(--foreground)" : "var(--muted-foreground)",
                      }}
                    >
                      {badge.name}
                    </h4>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", marginTop: "2px" }}>
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md p-6 rounded-3xl overflow-hidden shadow-2xl z-10"
              style={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: "var(--foreground)",
                  marginBottom: "16px",
                }}
              >
                Cập nhật thông tin cá nhân
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>
                    Họ và tên
                  </label>
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    style={{
                      background: "var(--input)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                    }}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>
                    Địa chỉ Email
                  </label>
                  <input
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    style={{
                      background: "var(--input)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                    }}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>
                    Tiểu sử cá nhân
                  </label>
                  <textarea
                    rows={3}
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    style={{
                      background: "var(--input)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                    }}
                    className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3.5 rounded-xl border text-muted-foreground hover:text-foreground transition cursor-pointer text-sm"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--input)",
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-3.5 rounded-xl text-white font-medium cursor-pointer text-sm"
                  style={{
                    background: "linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)",
                  }}
                >
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
