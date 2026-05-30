import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  BookOpen,
  TrendingUp,
  Activity,
  Search,
  Plus,
  Trash2,
  Edit2,
  ShieldAlert,
  ShieldCheck,
  Server,
  Database,
  Cpu,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { adminService } from "../../../lib/services/adminService";

// Default/fallback mock stats
const SYSTEM_STATS = [
  { label: "Tổng số học viên", value: "54,204", change: "+12.5%", icon: Users, color: "#6C63FF" },
  { label: "Khóa học đang mở", value: "32", change: "+2", icon: BookOpen, color: "#3B82F6" },
  { label: "Lượt truy cập ngày", value: "4,821", change: "+18.3%", icon: Activity, color: "#8B5CF6" },
  { label: "Doanh thu tháng", value: "98.5 Tr", change: "+24.1%", icon: TrendingUp, color: "#EC4899" },
];

const GROWTH_DATA = [
  { month: "Tháng 1", users: 18000, revenue: 32 },
  { month: "Tháng 2", users: 24000, revenue: 45 },
  { month: "Tháng 3", users: 31000, revenue: 58 },
  { month: "Tháng 4", users: 42000, revenue: 78 },
  { month: "Tháng 5", users: 54000, revenue: 98 },
];

const SERVER_METRICS = [
  { name: "CPU Load", val: "24%", icon: Cpu, color: "#34d399" },
  { name: "RAM Used", val: "3.4 GB / 8 GB", icon: Server, color: "#3B82F6" },
  { name: "DB Connections", val: "48 Active", icon: Database, color: "#8B5CF6" },
];

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Teacher" | "Admin";
  status: "Active" | "Banned";
  enrolledAt: string;
  dbId?: number; // Primary key in backend
}

const INITIAL_USERS: AdminUser[] = [
  { id: "1", name: "Nguyễn An", email: "nguyen.an@email.com", role: "Student", status: "Active", enrolledAt: "2026-01-15" },
  { id: "2", name: "Trần Thế Anh", email: "theanh.tran@gmail.com", role: "Student", status: "Active", enrolledAt: "2026-02-10" },
  { id: "3", name: "Lê Hoàng Long", email: "longlh.fpt@fpt.com.vn", role: "Teacher", status: "Active", enrolledAt: "2026-03-01" },
  { id: "4", name: "Vũ Minh Thu", email: "minhthu.jp@gmail.com", role: "Student", status: "Active", enrolledAt: "2026-04-12" },
  { id: "5", name: "Hoàng Văn Đạt", email: "dathv@ad.lingua.com", role: "Admin", status: "Active", enrolledAt: "2025-12-01" },
  { id: "6", name: "Phạm Tấn Tài", email: "taipt.banned@yahoo.com", role: "Student", status: "Banned", enrolledAt: "2026-05-18" },
];

export function AdminDashboardPage() {
  const { user, isOffline } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState(SYSTEM_STATS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const loadAdminData = async () => {
      // Check if user is admin
      if (user && user.role === "admin" && !user.isOfflineFallback) {
        try {
          const resStats = await adminService.getStats();
          setStats([
            { label: "Tổng số học viên", value: resStats.totalUsers.toLocaleString(), change: "+12.5%", icon: Users, color: "#6C63FF" },
            { label: "Khóa học đang mở", value: String(resStats.coursesTotal), change: "+2", icon: BookOpen, color: "#3B82F6" },
            { label: "Lượt truy cập ngày", value: resStats.activeToday.toLocaleString(), change: "+18.3%", icon: Activity, color: "#8B5CF6" },
            { label: "Doanh thu tháng", value: `${(resStats.revenueMonth / 1000000).toFixed(1)} Tr`, change: "+24.1%", icon: TrendingUp, color: "#EC4899" },
          ]);

          const resUsers = await adminService.getUsers();
          const mapped: AdminUser[] = resUsers.map((u: any) => ({
            id: String(u.id),
            name: u.username || "User",
            email: u.email,
            role: u.role === "admin" ? "Admin" : u.role === "teacher" ? "Teacher" : "Student",
            status: u.is_active ? "Active" : "Banned",
            enrolledAt: u.date_joined ? u.date_joined.slice(0, 10) : "2026-01-01",
            dbId: u.id,
          }));
          setUsers(mapped);
        } catch (err) {
          console.warn("Could not load admin stats/users from server", err);
          loadMockData();
        }
      } else {
        loadMockData();
      }
    };

    const loadMockData = () => {
      setStats(SYSTEM_STATS);
      setUsers(INITIAL_USERS);
    };

    loadAdminData();
  }, [user]);

  const toggleUserStatus = async (id: string) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;

    const newStatus = targetUser.status === "Active" ? "Banned" : "Active";
    const newIsActive = newStatus === "Active";

    if (user && user.role === "admin" && !user.isOfflineFallback && targetUser.dbId) {
      try {
        await adminService.updateUser(targetUser.dbId, {
          is_active: newIsActive,
        });
      } catch (err) {
        console.warn("Could not update user status on backend", err);
      }
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  const deleteUser = async (id: string) => {
    setUserToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const targetUser = users.find((u) => u.id === userToDelete);

    if (user && user.role === "admin" && !user.isOfflineFallback && targetUser?.dbId) {
      try {
        await adminService.deleteUser(targetUser.dbId);
      } catch (err) {
        console.warn("Could not delete user on backend", err);
      }
    }

    setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
    setUserToDelete(null);
  };

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === "all" || u.role.toLowerCase() === selectedRoleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div
      className="flex flex-col min-h-screen p-4 md:p-8 relative overflow-hidden"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Glow shapes */}
      <div
        className="absolute left-1/4 top-10 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(108, 99, 255, 0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-6xl w-full mx-auto relative z-10 flex flex-col gap-8">
        {/* Offline Alert Banner */}
        {isOffline && (
          <div 
            className="p-4 rounded-2xl flex items-center justify-between text-xs font-semibold"
            style={{ 
              background: "rgba(245, 158, 11, 0.1)", 
              border: "1px solid rgba(245, 158, 11, 0.25)",
              color: "#F59E0B"
            }}
          >
            <span>⚠️ Bạn đang ở chế độ ngoại tuyến. Dữ liệu học viên hiển thị bên dưới là dữ liệu mẫu.</span>
          </div>
        )}

        {/* Header */}
        <div>
          <h1
            style={{
              fontFamily: "Sora, sans-serif",
              fontWeight: 800,
              fontSize: "2rem",
              letterSpacing: "-0.03em",
              background: isDark
                ? "linear-gradient(135deg, #f0f4ff 60%, #8B5CF6 100%)"
                : "linear-gradient(135deg, #0f172a 60%, #8B5CF6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bảng Quản Trị Hệ Thống
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "4px" }}>
            Giám sát số lượng học viên học tập, cấu hình các khóa học, quản lý người dùng và theo dõi sức khỏe máy chủ.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl cursor-default"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem" }}>{stat.label}</span>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${stat.color}15`,
                      border: `1px solid ${stat.color}30`,
                    }}
                  >
                    <Icon size={16} color={stat.color} />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: "var(--foreground)",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">{stat.change}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts & Server Health Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Growth Area Chart */}
          <div
            className="lg:col-span-2 p-6 rounded-3xl"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>
                  Tăng trưởng học viên & Doanh thu
                </h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", marginTop: "2px" }}>Biểu đồ thống kê 5 tháng đầu năm 2026</p>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GROWTH_DATA}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke={isDark ? "#4a5a7a" : "#64748b"} fontSize={11} tickLine={false} />
                  <YAxis stroke={isDark ? "#4a5a7a" : "#64748b"} fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      color: "var(--foreground)",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#6C63FF" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" name="Học viên" />
                  <Area type="monotone" dataKey="revenue" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Doanh thu (Tr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Server Health Metric Widgets */}
          <div
            className="p-6 rounded-3xl flex flex-col justify-between"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div>
              <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }} className="mb-1">
                Hiệu năng Hệ thống
              </h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", marginBottom: "20px" }}>Trạng thái sức khỏe hạ tầng thời gian thực</p>
            </div>

            <div className="space-y-6 flex-1 flex flex-col justify-center">
              {SERVER_METRICS.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.name} className="flex items-center justify-between p-3.5 rounded-2xl border" style={{ background: "var(--input)", borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border)" }}
                      >
                        <Icon size={16} color={metric.color} />
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground font-semibold">{metric.name}</span>
                        <span className="block text-xs font-bold text-foreground mt-0.5" style={{ fontFamily: "Sora" }}>
                          {metric.val}
                        </span>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div
          className="p-6 rounded-3xl"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Top filtering controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>
              Danh sách quản lý người dùng
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search bar */}
              <div
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
                style={{
                  background: "var(--input)",
                  border: "1px solid var(--border)",
                }}
              >
                <Search size={14} color="#6C63FF" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm tên hoặc email..."
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--foreground)",
                    fontSize: "0.8125rem",
                    width: "150px",
                  }}
                />
              </div>

              {/* Role filter dropdown */}
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                style={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "0.8125rem",
                }}
                className="px-3.5 py-2.5 rounded-xl outline-none"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="Student">Học viên (Student)</option>
                <option value="Teacher">Giảng viên (Teacher)</option>
                <option value="Admin">Quản trị viên (Admin)</option>
              </select>
            </div>
          </div>

          {/* Table display */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)] font-bold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Thành viên</th>
                  <th className="pb-3.5">Vai trò</th>
                  <th className="pb-3.5">Ngày đăng ký</th>
                  <th className="pb-3.5">Trạng thái</th>
                  <th className="pb-3.5 text-right pr-2">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-[var(--muted-foreground)]">
                      Không tìm thấy người dùng nào khớp với điều kiện lọc.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item, idx) => {
                    const isBanned = item.status === "Banned";
                    const roleColor =
                      item.role === "Admin"
                        ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                        : item.role === "Teacher"
                        ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                        : "text-slate-400 bg-slate-500/10 border-slate-500/20";

                    return (
                      <tr key={item.id || idx} className="hover:bg-slate-900/25 transition">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8.5 h-8.5 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0"
                              style={{
                                background: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)",
                              }}
                            >
                              {item.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <span
                                style={{
                                  fontFamily: "Sora, sans-serif",
                                  fontSize: "0.8125rem",
                                  fontWeight: 600,
                                  color: "var(--foreground)",
                                }}
                                className="block"
                              >
                                {item.name}
                              </span>
                              <span style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }} className="block mt-0.5">
                                {item.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 border rounded-md text-[10px] font-semibold ${roleColor}`}>
                            {item.role}
                          </span>
                        </td>
                        <td className="py-4 text-[var(--muted-foreground)]">{item.enrolledAt}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isBanned ? "bg-rose-500" : "bg-emerald-500"}`} />
                            <span style={{ color: isBanned ? "#f87171" : "#34d399", fontSize: "0.75rem", fontWeight: 600 }}>
                              {isBanned ? "Banned" : "Active"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right pr-2">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* Ban/Unban toggle */}
                            <button
                              onClick={() => toggleUserStatus(item.id)}
                              className="p-1.5 rounded-lg transition text-muted-foreground hover:text-foreground cursor-pointer"
                              style={{ border: "1px solid transparent" }}
                              title={isBanned ? "Kích hoạt lại tài khoản" : "Khóa tài khoản"}
                            >
                              {isBanned ? <ShieldCheck size={14} color="#34d399" /> : <ShieldAlert size={14} color="#fbbf24" />}
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => deleteUser(item.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition cursor-pointer"
                              title="Xóa tài khoản vĩnh viễn"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUserToDelete(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-sm p-6 rounded-3xl overflow-hidden shadow-2xl z-10"
              style={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-rose-500/10 border border-rose-500/35"
                >
                  <ShieldAlert size={22} color="#EF4444" />
                </div>
                <h3
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: "var(--foreground)",
                    marginBottom: "8px",
                  }}
                >
                  Xác nhận xóa tài khoản
                </h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem", lineHeight: 1.5, marginBottom: "20px" }}>
                  Bạn có chắc chắn muốn xóa tài khoản người dùng này không? Hành động này không thể hoàn tác.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 py-3 rounded-xl border text-muted-foreground hover:text-foreground transition cursor-pointer text-xs font-semibold"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--input)",
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3 rounded-xl text-white font-semibold cursor-pointer text-xs transition-colors bg-rose-600 hover:bg-rose-500"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
