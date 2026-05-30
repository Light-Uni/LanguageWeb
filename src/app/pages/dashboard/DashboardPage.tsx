import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Clock, Flame, BookOpen, Star, TrendingUp, Target,
  CheckCircle2, Circle, Bot, ChevronRight, Zap,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  DASHBOARD_STATS, WEEKLY_PROGRESS, HEATMAP_DATA,
  TODAY_SCHEDULE, ACHIEVEMENTS,
} from "../../../lib/mockData";
import { useAuth } from "../../../contexts/AuthContext";
import { dashboardService, DashboardStats, HeatmapItem, TodayScheduleItem, WeeklyProgressItem } from "../../../lib/services/dashboardService";

/* ─── Stat Card ──────────────────────────────────────────────────────────────*/
function StatCard({
  icon: Icon, label, value, sub, color, glow,
}: {
  icon: React.ElementType; label: string; value: string | number; sub: string;
  color: string; glow: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="p-5 rounded-2xl transition-all duration-300"
      style={{
        background: hov ? "rgba(15,22,48,0.9)" : "rgba(11,16,35,0.6)",
        border: hov ? `1px solid ${color}44` : "1px solid rgba(108,99,255,0.15)",
        boxShadow: hov ? `0 0 40px ${glow}20, 0 10px 40px rgba(0,0,0,0.3)` : "0 4px 24px rgba(0,0,0,0.15)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30`, boxShadow: hov ? `0 0 16px ${glow}` : "none" }}
        >
          <Icon size={20} color={color} />
        </div>
        {hov && <ChevronRight size={16} color={color} />}
      </div>
      <p style={{ color: "#f0f4ff", fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1.625rem", letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", marginTop: 4 }}>{label}</p>
      <p style={{ color: color, fontFamily: "JetBrains Mono, monospace", fontSize: "0.6875rem", fontWeight: 600, marginTop: 6 }}>{sub}</p>
    </motion.div>
  );
}

/* ─── Progress Ring ───────────────────────────────────────────────────────────*/
function ProgressRing({ pct, color, size = 88, label }: { pct: number; color: string; size?: number; label: string }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1rem", color, transform: "rotate(0deg)" }}>
          {pct}%
        </span>
      </div>
      <span style={{ color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", textAlign: "center" }}>{label}</span>
    </div>
  );
}

/* ─── Heatmap ─────────────────────────────────────────────────────────────────*/
function HeatMap({ data }: { data: HeatmapItem[] }) {
  const weeks: HeatmapItem[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }
  const colors = ["rgba(108,99,255,0.06)", "rgba(108,99,255,0.25)", "rgba(108,99,255,0.5)", "rgba(108,99,255,0.7)", "rgba(108,99,255,0.9)"];
  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <div className="flex gap-1" style={{ width: "max-content" }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={`${day.date}: ${day.count} phiên`}
                style={{
                  width: 12, height: 12, borderRadius: 3,
                  background: colors[Math.min(day.count, 4)],
                  border: day.count > 0 ? `1px solid rgba(108,99,255,0.2)` : "1px solid rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  transition: "transform 0.1s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Custom Tooltip ─────────────────────────────────────────────────────────*/
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-3 rounded-xl" style={{ background: "rgba(8,12,28,0.96)", border: "1px solid rgba(108,99,255,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      <p style={{ color: "#8899bb", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
            <span style={{ color: "#c4cfea", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem" }}>{p.name}: {p.value} phút</span>
          </div>
      ))}
    </div>
  );
}

/* ─── Dashboard Page ─────────────────────────────────────────────────────────*/
export function DashboardPage() {
  const { user, isOffline } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  const [statsData, setStatsData] = useState<DashboardStats>({
    totalHours: DASHBOARD_STATS.totalHours,
    streak: user?.streak || DASHBOARD_STATS.streak,
    wordsLearned: DASHBOARD_STATS.wordsLearned,
    xpTotal: user?.xp || DASHBOARD_STATS.xpTotal,
    toeicProgress: DASHBOARD_STATS.toeicProgress,
    japaneseProgress: DASHBOARD_STATS.japaneseProgress,
    programmingProgress: DASHBOARD_STATS.programmingProgress,
    weakSkills: DASHBOARD_STATS.weakSkills,
    level: user?.level || 1,
    role: user?.role || "student",
  });
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgressItem[]>(WEEKLY_PROGRESS);
  const [schedule, setSchedule] = useState<TodayScheduleItem[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapItem[]>(HEATMAP_DATA);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user && !user.isOfflineFallback) {
        try {
          const stats = await dashboardService.getStats();
          setStatsData(stats);
          
          const progress = await dashboardService.getWeeklyProgress();
          setWeeklyProgress(progress);
          
          const sched = await dashboardService.getSchedule();
          setSchedule(sched);
          
          const heat = await dashboardService.getHeatmap();
          setHeatmap(heat);
        } catch (err) {
          console.warn("Error fetching dashboard data, using local fallback", err);
          loadMockData();
        }
      } else {
        loadMockData();
      }
    };

    const loadMockData = () => {
      // Map TODAY_SCHEDULE to schedule
      setSchedule(TODAY_SCHEDULE.map(s => ({
        id: s.id,
        time: s.time,
        subject: s.subject,
        duration: s.duration,
        color: s.color,
        done: s.done
      })));
    };

    fetchDashboardData();
  }, [user]);

  const stats = [
    { icon: Clock, label: "Tổng giờ học", value: `${statsData.totalHours}h`, sub: "+3.5h tuần này", color: "#3B82F6", glow: "rgba(59,130,246,0.4)" },
    { icon: Flame, label: "Chuỗi học", value: `${statsData.streak}🔥`, sub: "Kỷ lục cá nhân!", color: "#F59E0B", glow: "rgba(245,158,11,0.4)" },
    { icon: BookOpen, label: "Từ vựng đã học", value: statsData.wordsLearned.toLocaleString(), sub: "+24 từ hôm nay", color: "#8B5CF6", glow: "rgba(139,92,246,0.4)" },
    { icon: Star, label: "Tổng XP", value: statsData.xpTotal.toLocaleString(), sub: `Level ${statsData.level} → ${statsData.level + 1}`, color: "#EC4899", glow: "rgba(236,72,153,0.4)" },
  ];

  const pendingLessons = schedule.filter(s => !(s.done || s.is_completed)).length;

  return (
    <div className="px-8 py-8" style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Offline Alert Banner */}
      {isOffline && (
        <div 
          className="mb-6 p-4 rounded-2xl flex items-center justify-between text-xs font-semibold"
          style={{ 
            background: "rgba(245, 158, 11, 0.1)", 
            border: "1px solid rgba(245, 158, 11, 0.25)",
            color: "#F59E0B"
          }}
        >
          <span>⚠️ Bạn đang ở chế độ ngoại tuyến. Dữ liệu hiển thị là dữ liệu mẫu và tiến độ sẽ không được đồng bộ lên máy chủ.</span>
        </div>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: "#6b7fa3", letterSpacing: "0.06em" }}>
            {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#f0f4ff", letterSpacing: "-0.03em" }}>
          {greeting}, <span style={{ background: "linear-gradient(135deg,#6C63FF,#3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{user?.name?.split(" ").pop() || "An"}</span>! 👋
        </h1>
        <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.9375rem", marginTop: 4 }}>
          Hôm nay bạn còn <span style={{ color: "#6C63FF", fontWeight: 600 }}>{pendingLessons} buổi học</span> chưa hoàn thành.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6 rounded-2xl"
          style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.15)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f4ff" }}>Thống kê học tập tuần này</h2>
              <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", marginTop: 2 }}>Phút học mỗi ngày</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <TrendingUp size={13} color="#10B981" />
              <span style={{ color: "#10B981", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", fontWeight: 600 }}>+18% vs tuần trước</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.06)" />
              <XAxis dataKey="day" tick={{ fill: "#6b7fa3", fontSize: 12, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7fa3", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }} />
              <Line type="monotone" dataKey="toeic" name="TOEIC" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: "#3B82F6", r: 4 }} activeDot={{ r: 6, fill: "#3B82F6", filter: "drop-shadow(0 0 6px #3B82F6)" }} />
              <Line type="monotone" dataKey="japanese" name="Tiếng Nhật" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: "#8B5CF6", r: 4 }} activeDot={{ r: 6, fill: "#8B5CF6", filter: "drop-shadow(0 0 6px #8B5CF6)" }} />
              <Line type="monotone" dataKey="programming" name="Lập trình" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 4 }} activeDot={{ r: 6, fill: "#10B981", filter: "drop-shadow(0 0 6px #10B981)" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Progress Rings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="p-6 rounded-2xl"
          style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.15)" }}
        >
          <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f4ff", marginBottom: 4 }}>Tiến độ tổng thể</h2>
          <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", marginBottom: 24 }}>Mức độ hoàn thành mục tiêu</p>
          <div className="flex justify-around">
            <ProgressRing pct={statsData.toeicProgress} color="#3B82F6" label="TOEIC" />
            <ProgressRing pct={statsData.japaneseProgress} color="#8B5CF6" label="Tiếng Nhật" />
            <ProgressRing pct={statsData.programmingProgress} color="#10B981" label="Lập trình" />
          </div>

          {/* Weak skills */}
          <div className="mt-6">
            <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", marginBottom: 10 }}>⚠️ Kỹ năng cần cải thiện</p>
            {statsData.weakSkills.map((skill) => (
              <div key={skill} className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
                <Target size={12} color="#ef4444" />
                <span style={{ color: "#ef4444", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem" }}>{skill}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl"
          style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.15)" }}
        >
          <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f4ff", marginBottom: 16 }}>📅 Lịch học hôm nay</h2>
          <div className="flex flex-col gap-3">
            {schedule.length === 0 ? (
              <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", textAlign: "center", py: 4 }}>Không có lịch học nào hôm nay.</p>
            ) : (
              schedule.map((item, idx) => {
                const isDone = item.done || item.is_completed || false;
                const timeStr = item.time || item.time_slot || "08:00";
                const durationVal = item.duration || item.duration_min || 30;
                const titleStr = item.title || item.subject || "Học tập";
                return (
                  <div
                    key={item.id || idx}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer"
                    style={{
                      background: isDone ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isDone ? "rgba(16,185,129,0.2)" : "rgba(108,99,255,0.1)"}`,
                      opacity: isDone ? 0.65 : 1,
                    }}
                  >
                    {isDone
                      ? <CheckCircle2 size={16} color="#10B981" />
                      : <Circle size={16} color={item.color} />
                    }
                    <div className="flex-1">
                      <p style={{ color: "#f0f4ff", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", fontWeight: 500, textDecoration: isDone ? "line-through" : "none" }}>
                        {titleStr}
                      </p>
                      <p style={{ color: "#6b7fa3", fontFamily: "JetBrains Mono, monospace", fontSize: "0.6875rem", marginTop: 2 }}>
                        {timeStr.slice(0, 5)} · {durationVal} phút · {item.subject}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* AI recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="p-6 rounded-2xl"
          style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.15)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(108,99,255,0.2)", border: "1px solid rgba(108,99,255,0.3)" }}>
              <Bot size={16} color="#6C63FF" />
            </div>
            <div>
              <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "#f0f4ff" }}>AI Gợi ý hôm nay</h2>
              <p style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.6875rem" }}>Dựa trên tiến độ của bạn</p>
            </div>
          </div>

          {[
            { title: "Ôn TOEIC Part 5 & 6", desc: "Ngữ pháp là điểm yếu tuần này. Làm 20 câu.", time: "30 phút", color: "#3B82F6", priority: "Cao" },
            { title: "Kanji N3: 10 chữ mới", desc: "Đã 2 ngày chưa học Kanji", time: "20 phút", color: "#8B5CF6", priority: "Trung bình" },
            { title: "Python: Vòng lặp for", desc: "Tiếp tục bài học dang dở", time: "25 phút", color: "#10B981", priority: "Thấp" },
          ].map((rec, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-xl mb-3 cursor-pointer transition-all duration-200"
              style={{ background: `${rec.color}08`, border: `1px solid ${rec.color}20` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${rec.color}14`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `${rec.color}08`; }}
            >
              <div className="w-1 rounded-full flex-shrink-0" style={{ background: rec.color, minHeight: 40 }} />
              <div className="flex-1">
                <p style={{ color: "#f0f4ff", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "0.8125rem" }}>{rec.title}</p>
                <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", marginTop: 2, lineHeight: 1.4 }}>{rec.desc}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span style={{ background: `${rec.color}20`, color: rec.color, fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>{rec.time}</span>
                  <span style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.6875rem" }}>· Ưu tiên: {rec.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl"
          style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.15)" }}
        >
          <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f4ff", marginBottom: 16 }}>🏆 Thành tựu</h2>
          <div className="grid grid-cols-4 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.id}
                title={`${a.name}: ${a.desc}`}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  background: a.unlocked ? `${a.color}12` : "rgba(255,255,255,0.03)",
                  border: a.unlocked ? `1px solid ${a.color}30` : "1px solid rgba(255,255,255,0.06)",
                  opacity: a.unlocked ? 1 : 0.4,
                  filter: a.unlocked ? "none" : "grayscale(0.8)",
                }}
                onMouseEnter={(e) => { if (a.unlocked) e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <span style={{ fontSize: "1.25rem" }}>{a.icon}</span>
                <span style={{ color: a.unlocked ? a.color : "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.5rem", textAlign: "center", lineHeight: 1.2 }}>
                  {a.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="p-6 rounded-2xl"
        style={{ background: "rgba(11,16,35,0.6)", border: "1px solid rgba(108,99,255,0.15)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f4ff" }}>📊 Lịch sử học tập</h2>
            <p style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.8125rem", marginTop: 2 }}>
              {heatmap.filter((d) => d.count > 0).length} ngày học / 1 năm
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }}>Ít</span>
            {["rgba(108,99,255,0.06)", "rgba(108,99,255,0.25)", "rgba(108,99,255,0.5)", "rgba(108,99,255,0.7)", "rgba(108,99,255,0.9)"].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c, border: "1px solid rgba(108,99,255,0.2)" }} />
            ))}
            <span style={{ color: "#4a5a7a", fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }}>Nhiều</span>
          </div>
        </div>
        <HeatMap data={heatmap} />
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-1.5">
            <Zap size={13} color="#6C63FF" />
            <span style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }}>Chuỗi hiện tại: <span style={{ color: "#F59E0B", fontWeight: 600 }}>{statsData.streak} ngày 🔥</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={13} color="#8B5CF6" />
            <span style={{ color: "#6b7fa3", fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }}>Tổng phiên học: <span style={{ color: "#8B5CF6", fontWeight: 600 }}>{heatmap.filter((d) => d.count > 0).length} phiên</span></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
