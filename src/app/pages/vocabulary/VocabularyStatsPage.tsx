import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Search,
  BookOpen,
  Award,
  Calendar,
  Flame,
  CheckCircle,
  HelpCircle,
  Clock,
  Filter,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { vocabularyService, UserVocabularyWord, VocabStats } from "../../../lib/services/vocabularyService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Default/mock fallback stats
const DEFAULT_STATS = [
  { label: "Tổng từ đã học", value: "852 từ", icon: BookOpen, color: "#6C63FF" },
  { label: "Tỉ lệ ghi nhớ", value: "92%", icon: Award, color: "#3B82F6" },
  { label: "Cần ôn tập hôm nay", value: "24 từ", icon: Clock, color: "#F59E0B" },
  { label: "Tốc độ học trung bình", value: "18 từ/ngày", icon: Flame, color: "#EC4899" },
];

const DEFAULT_WEEKLY = [
  { day: "Thứ 2", words: 12 },
  { day: "Thứ 3", words: 25 },
  { day: "Thứ 4", words: 18 },
  { day: "Thứ 5", words: 30 },
  { day: "Thứ 6", words: 15 },
  { day: "Thứ 7", words: 22 },
  { day: "Chủ Nhật", words: 28 },
];

const DEFAULT_DISTRIBUTION = [
  { name: "TOEIC Business", value: 340, color: "#6C63FF" },
  { name: "Kanji N3", value: 210, color: "#3B82F6" },
  { name: "JLPT N5 Bảng chữ cái", value: 180, color: "#8B5CF6" },
  { name: "Lập trình", value: 122, color: "#EC4899" },
];

const MOCK_WORDS = [
  { id: "1", word: "Implement", type: "Verb", meaning: "Thi hành, thực hiện", category: "TOEIC Business", difficulty: "Trung bình", status: "learned" },
  { id: "2", word: "勉強する (Benkyou)", type: "Verb", meaning: "Học tập", category: "JLPT N5 Bảng chữ cái", difficulty: "Dễ", status: "learned" },
  { id: "3", word: "Strategic", type: "Adj", meaning: "Mang tính chiến lược", category: "TOEIC Business", difficulty: "Khó", status: "review" },
  { id: "4", word: "約束 (Yakusoku)", type: "Noun", meaning: "Lời hứa, cuộc hẹn", category: "JLPT N5 Bảng chữ cái", difficulty: "Trung bình", status: "learned" },
  { id: "5", word: "Optimize", type: "Verb", meaning: "Tối ưu hóa", category: "TOEIC Business", difficulty: "Khó", status: "review" },
  { id: "6", word: "猫 (Neko)", type: "Noun", meaning: "Con mèo", category: "Lập trình", difficulty: "Dễ", status: "learned" },
  { id: "7", word: "Collaboration", type: "Noun", meaning: "Sự cộng tác", category: "TOEIC Business", difficulty: "Trung bình", status: "learned" },
  { id: "8", word: "試練 (Shiren)", type: "Noun", meaning: "Thử thách, rèn luyện", category: "Kanji N3", difficulty: "Khó", status: "review" },
];

const mapCategory = (cat: string) => {
  if (cat === "TOEIC") return "TOEIC Business";
  if (cat === "JLPT_N5") return "JLPT N5 Bảng chữ cái";
  if (cat === "JLPT_N3") return "Kanji N3";
  if (cat === "Programming") return "Lập trình";
  return cat.replace("_", " ");
};

export function VocabularyStatsPage() {
  const { user, isOffline } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "learned" | "review">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [weeklyData, setWeeklyData] = useState(DEFAULT_WEEKLY);
  const [categories, setCategories] = useState(DEFAULT_DISTRIBUTION);
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    const fetchVocabStatsAndList = async () => {
      if (user && !user.isOfflineFallback) {
        try {
          const resStats = await vocabularyService.getStats();
          
          // Map to stats structure
          setStats([
            { label: "Tổng từ đã học", value: `${resStats.totalLearned} từ`, icon: BookOpen, color: "#6C63FF" },
            { label: "Tỉ lệ ghi nhớ", value: `${resStats.rememberRate}%`, icon: Award, color: "#3B82F6" },
            { label: "Cần ôn tập hôm nay", value: `${resStats.needReview} từ`, icon: Clock, color: "#F59E0B" },
            { label: "Tốc độ học trung bình", value: `${resStats.studySpeed} từ/giờ`, icon: Flame, color: "#EC4899" },
          ]);

          // Map weeklyData
          if (resStats.weeklyData && resStats.weeklyData.length > 0) {
            setWeeklyData(resStats.weeklyData.map((d: any) => ({
              day: d.day,
              words: d.learned
            })));
          }

          // Map categories distribution
          if (resStats.categories && resStats.categories.length > 0) {
            setCategories(resStats.categories.map((c: any) => ({
              name: mapCategory(c.name),
              value: c.value,
              color: c.color
            })));
          }

          // Fetch user's word list
          const listRes = await vocabularyService.getMyVocabulary();
          if (listRes.results) {
            const today = new Date();
            const mapped = listRes.results.map((item: UserVocabularyWord) => {
              const nextReviewDate = new Date(item.next_review);
              const needReview = nextReviewDate <= today;
              const difficultyText = item.difficulty === 1 ? "Dễ" : item.difficulty === 2 ? "Trung bình" : "Khó";
              
              // Guess word type from category/reading/word itself
              let wordType = "Noun";
              if (item.category === "Programming") wordType = "Term";
              else if (item.word.endsWith("ate") || item.word.endsWith("ify") || item.word.endsWith("ish")) wordType = "Verb";
              else if (item.word.endsWith("ive") || item.word.endsWith("al")) wordType = "Adj";

              return {
                id: String(item.id),
                word: item.word,
                type: wordType,
                meaning: item.meaning_vi,
                category: mapCategory(item.category),
                difficulty: difficultyText,
                status: needReview ? "review" : "learned",
              };
            });
            setWords(mapped);
          }
        } catch (err) {
          console.warn("Could not load vocabulary stats from server", err);
          loadMockData();
        }
      } else {
        loadMockData();
      }
    };

    const loadMockData = () => {
      setStats(DEFAULT_STATS);
      setWeeklyData(DEFAULT_WEEKLY);
      setCategories(DEFAULT_DISTRIBUTION);
      setWords(MOCK_WORDS);
    };

    fetchVocabStatsAndList();
  }, [user]);

  // Filtering Logic
  const filteredWords = words.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedFilter === "all" || item.status === selectedFilter;
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalWordsCount = categories.reduce((sum, c) => sum + c.value, 0);

  return (
    <div
      className="flex flex-col min-h-screen p-4 md:p-8 relative overflow-hidden"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Background decoration */}
      <div
        className="absolute left-1/3 top-10 w-96 h-96 rounded-full pointer-events-none"
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
            <span>⚠️ Bạn đang ở chế độ ngoại tuyến. Dữ liệu từ vựng hiển thị bên dưới là dữ liệu mẫu.</span>
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
            Thống kê Từ vựng
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "4px" }}>
            Theo dõi sự tiến bộ, quản lý kho từ vựng đã học và lập lịch ôn tập thông minh Spaced Repetition.
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

                <div
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "var(--foreground)",
                  }}
                >
                  {stat.value}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 & 2: Area Chart */}
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
                  Tiến độ học tuần này
                </h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", marginTop: "2px" }}>Số lượng từ vựng học mới mỗi ngày</p>
              </div>
              <TrendingUp size={16} color="#6C63FF" />
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke={isDark ? "#4a5a7a" : "#64748b"} fontSize={11} tickLine={false} />
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
                  <Area type="monotone" dataKey="words" stroke="#6C63FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWords)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Column 3: Pie Chart */}
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
                Phân bố theo chủ đề
              </h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>Tỉ lệ từ vựng giữa các môn học</p>
            </div>

            {/* Pie render */}
            <div className="h-[160px] w-full flex items-center justify-center my-4 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || "#6C63FF"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)", fontFamily: "Sora" }}>{totalWordsCount}</span>
                <span style={{ fontSize: "9px", color: "var(--muted-foreground)", fontWeight: 600 }}>TỪ VỰNG</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5">
              {categories.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                    <span style={{ color: "var(--muted-foreground)" }} className="truncate max-w-[130px]">{item.name}</span>
                  </div>
                  <span style={{ color: "var(--foreground)", opacity: 0.8, fontWeight: 600 }}>{item.value} từ</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Word Database List */}
        <div
          className="p-6 rounded-3xl"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Controls bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>
              Từ điển cá nhân của bạn
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-200"
                style={{
                  background: "var(--input)",
                  border: "1px solid var(--border)",
                }}
              >
                <Search size={14} color="#6C63FF" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tra cứu từ vựng..."
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

              {/* Status buttons */}
              <div className="flex p-1 rounded-xl border" style={{ background: "var(--input)", borderColor: "var(--border)" }}>
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${selectedFilter === "all" ? "bg-[#6C63FF] text-white" : "text-muted-foreground"}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setSelectedFilter("learned")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${selectedFilter === "learned" ? "bg-[#6C63FF] text-white" : "text-muted-foreground"}`}
                >
                  Đã thuộc
                </button>
                <button
                  onClick={() => setSelectedFilter("review")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${selectedFilter === "review" ? "bg-[#6C63FF] text-white" : "text-muted-foreground"}`}
                >
                  Cần ôn
                </button>
              </div>

              {/* Category selector filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "0.8125rem",
                }}
                className="px-3.5 py-2.5 rounded-xl outline-none"
              >
                <option value="all">Mọi bộ từ</option>
                <option value="TOEIC Business">TOEIC Business</option>
                <option value="JLPT N5 Bảng chữ cái">JLPT N5</option>
                <option value="Kanji N3">Kanji N3</option>
                <option value="Lập trình">Lập trình</option>
              </select>
            </div>
          </div>

          {/* Word Table Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)] font-bold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Từ vựng</th>
                  <th className="pb-3.5">Từ loại</th>
                  <th className="pb-3.5">Ý nghĩa</th>
                  <th className="pb-3.5">Môn học / Nhóm</th>
                  <th className="pb-3.5">Độ khó</th>
                  <th className="pb-3.5 text-right pr-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredWords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-[var(--muted-foreground)]">
                      Không tìm thấy từ vựng nào khớp với điều kiện lọc.
                    </td>
                  </tr>
                ) : (
                  filteredWords.map((item, idx) => {
                    const diffColor =
                      item.difficulty === "Dễ"
                        ? "text-emerald-400"
                        : item.difficulty === "Trung bình"
                        ? "text-blue-400"
                        : "text-rose-400";

                    return (
                      <tr key={item.id || idx} className="hover:bg-slate-900/25 dark:hover:bg-slate-900/10 transition">
                        <td
                          className="py-4 pl-2 font-bold"
                          style={{
                            fontFamily: "Sora, sans-serif",
                            fontSize: "0.875rem",
                            color: "var(--foreground)",
                          }}
                        >
                          {item.word}
                        </td>
                        <td className="py-4 text-[var(--muted-foreground)] italic">{item.type}</td>
                        <td className="py-4 text-[var(--foreground)] opacity-95 max-w-[200px] truncate">{item.meaning}</td>
                        <td className="py-4 text-[var(--muted-foreground)]">{item.category}</td>
                        <td className={`py-4 font-semibold ${diffColor}`}>{item.difficulty}</td>
                        <td className="py-4 text-right pr-2">
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                            style={{
                              background: item.status === "learned" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                              color: item.status === "learned" ? "#34d399" : "#fbbf24",
                            }}
                          >
                            {item.status === "learned" ? "Đã thuộc" : "Cần ôn tập"}
                          </span>
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
    </div>
  );
}
