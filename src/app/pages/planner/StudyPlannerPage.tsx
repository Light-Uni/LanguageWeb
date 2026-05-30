import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Circle,
  Plus,
  Trash2,
  Tv,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { plannerService, StudyTask } from "../../../lib/services/plannerService";

interface Task {
  id: string;
  title: string;
  category: "TOEIC" | "Japanese" | "Programming" | "General";
  duration: number; // in minutes
  completed: boolean;
  timeSlot?: string;
  dbId?: number; // Stores the primary key in database
}

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Luyện nghe TOEIC Part 1 (ETS 2024)", category: "TOEIC", duration: 30, completed: true, timeSlot: "08:00 - 08:30" },
  { id: "2", title: "Học 15 Kanji cấp độ N3 (Bộ Thủ & Âm On)", category: "Japanese", duration: 45, completed: false, timeSlot: "09:30 - 10:15" },
  { id: "3", title: "Giải bài tập thuật toán Array trên LeetCode", category: "Programming", duration: 60, completed: false, timeSlot: "14:00 - 15:00" },
  { id: "4", title: "Viết đoạn văn mô tả biểu đồ TOEIC Part 7", category: "TOEIC", duration: 25, completed: false, timeSlot: "16:30 - 16:55" },
];

export function StudyPlannerPage() {
  const { user, isOffline } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<"TOEIC" | "Japanese" | "Programming" | "General">("General");
  const [newTaskDuration, setNewTaskDuration] = useState(30);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // Pomodoro Timer State
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(25 * 60);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to format date as YYYY-MM-DD
  const getSelectedDateString = () => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDay).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Load tasks for the selected date
  useEffect(() => {
    const fetchTasks = async () => {
      const dateStr = getSelectedDateString();
      if (user && !user.isOfflineFallback) {
        try {
          const list = await plannerService.getTasks(dateStr);
          const mapped: Task[] = list.map((t: any) => ({
            id: String(t.id),
            title: t.title,
            category: t.subject === "Other" ? "General" : (t.subject as any),
            duration: t.duration_min,
            completed: t.is_completed,
            timeSlot: t.time_slot ? t.time_slot.slice(0, 5) : undefined,
            dbId: t.id,
          }));
          setTasks(mapped);
        } catch (err) {
          console.warn("Could not fetch tasks from server, falling back to mock", err);
          loadMockTasks();
        }
      } else {
        loadMockTasks();
      }
    };

    const loadMockTasks = () => {
      // Return initial tasks only for today's date, empty for others
      const today = new Date().getDate();
      const todayMonth = new Date().getMonth();
      if (selectedDay === today && currentDate.getMonth() === todayMonth) {
        setTasks(INITIAL_TASKS);
      } else {
        setTasks([]);
      }
    };

    fetchTasks();
  }, [selectedDay, currentDate, user]);

  // Update total seconds if minutes change (when resetting or switching modes)
  const setTimerMode = (m: number) => {
    setTimerActive(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimerMinutes(m);
    setTimerSeconds(0);
    setTimerTotalSeconds(m * 60);
  };

  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            setTimerMinutes((prevMinutes) => {
              if (prevMinutes > 0) {
                setTimerSeconds(59);
                return prevMinutes - 1;
              } else {
                // Timer finished!
                setTimerActive(false);
                if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                alert("Chúc mừng! Bạn đã hoàn thành phiên tập trung!");
                return 0;
              }
            });
            return 0;
          }
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive]);

  // Pomodoro Progress Ring Calculations
  const currentRemainingSeconds = timerMinutes * 60 + timerSeconds;
  const progressRatio = timerTotalSeconds > 0 ? currentRemainingSeconds / timerTotalSeconds : 0;
  const strokeDashoffset = 2 * Math.PI * 70 * (1 - progressRatio);

  // Calendar calculations
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Add Task
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    const startHour = Math.floor(Math.random() * 6) + 8; // Random mock time slots
    const startMin = Math.random() > 0.5 ? "00" : "30";
    const timeSlotStr = `${String(startHour).padStart(2, "0")}:${startMin}:00`;

    const dateStr = getSelectedDateString();
    
    // Call API if connected
    if (user && !user.isOfflineFallback) {
      try {
        const created = await plannerService.createTask({
          title: newTaskTitle,
          subject: newTaskCategory === "General" ? "Other" : (newTaskCategory as any),
          scheduled_date: dateStr,
          time_slot: timeSlotStr,
          duration_min: newTaskDuration,
          color: newTaskCategory === "TOEIC" ? "#3B82F6" : newTaskCategory === "Japanese" ? "#8B5CF6" : newTaskCategory === "Programming" ? "#10B981" : "#F59E0B",
          is_completed: false,
          notes: "",
        });

        const newTask: Task = {
          id: String(created.id),
          title: created.title,
          category: created.subject === "Other" ? "General" : (created.subject as any),
          duration: created.duration_min,
          completed: created.is_completed,
          timeSlot: created.time_slot ? created.time_slot.slice(0, 5) : undefined,
          dbId: created.id,
        };

        setTasks((prev) => [...prev, newTask]);
        setNewTaskTitle("");
        setShowModal(false);
        return;
      } catch (err) {
        console.warn("Could not save task to backend, using local state", err);
      }
    }

    // Local/Offline Fallback
    const mockTime = `${startHour}:${startMin}`;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      category: newTaskCategory,
      duration: newTaskDuration,
      completed: false,
      timeSlot: mockTime,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setShowModal(false);
  };

  const handleToggleComplete = async (id: string) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    const newCompleted = !taskToToggle.completed;

    if (user && !user.isOfflineFallback && taskToToggle.dbId) {
      try {
        await plannerService.updateTask(taskToToggle.dbId, {
          is_completed: newCompleted,
        });
      } catch (err) {
        console.warn("Could not update task on backend", err);
      }
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );
  };

  const handleDeleteTask = async (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    if (user && !user.isOfflineFallback && taskToDelete.dbId) {
      try {
        await plannerService.deleteTask(taskToDelete.dbId);
      } catch (err) {
        console.warn("Could not delete task on backend", err);
      }
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      className="flex flex-col min-h-screen p-4 md:p-8 relative overflow-hidden"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Glow blobs */}
      <div
        className="absolute left-1/4 top-10 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(108, 99, 255, 0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute right-10 bottom-20 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)",
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
            <span>⚠️ Bạn đang ở chế độ ngoại tuyến. Các tác vụ sẽ được lưu tạm ở trình duyệt và mất khi tải lại trang.</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              Lập kế hoạch Học tập
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "4px" }}>
              Sắp xếp thời gian, duy trì kỷ luật với đồng hồ Pomodoro và nhạc Lofi thư giãn.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer shadow-lg"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)",
              boxShadow: "0 4px 16px rgba(108, 99, 255, 0.35)",
              color: "white",
              fontSize: "0.875rem",
            }}
          >
            <Plus size={16} />
            <span>Thêm mục tiêu</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Schedule & Tasks */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Calendar Widget */}
            <div
              className="p-6 rounded-3xl"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <CalendarIcon size={18} color="#6C63FF" />
                  <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>
                    {currentDate.toLocaleString("vi-VN", { month: "long", year: "numeric" })}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-slate-800/30 transition text-muted-foreground" style={{ border: "1px solid transparent" }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-slate-800/30 transition text-muted-foreground" style={{ border: "1px solid transparent" }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground mb-3">
                <span>CN</span>
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                  <span key={`empty-${idx}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                  const isSelected = day === selectedDay;

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => setSelectedDay(day)}
                      className="aspect-square flex items-center justify-center rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)"
                          : isToday
                          ? "rgba(108, 99, 255, 0.15)"
                          : "var(--input)",
                        border: isSelected
                          ? "none"
                          : isToday
                          ? "1px solid rgba(108, 99, 255, 0.3)"
                          : "1px solid transparent",
                        color: isSelected ? "white" : isToday ? "var(--primary)" : "var(--foreground)",
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Todo List */}
            <div
              className="p-6 rounded-3xl flex-1 flex flex-col"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>
                  Mục tiêu ngày {selectedDay} tháng {currentDate.getMonth() + 1}
                </h3>
                <span className="text-[11px] font-semibold text-[#8B5CF6] px-2.5 py-1 rounded-full" style={{ background: "rgba(139,92,246,0.12)" }}>
                  {tasks.filter((t) => t.completed).length}/{tasks.length} Hoàn thành
                </span>
              </div>

              {/* Task Items */}
              <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[350px] pr-2">
                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Chưa có mục tiêu nào được đặt ra cho ngày này.
                  </div>
                ) : (
                  tasks.map((task) => {
                    const badgeColor =
                      task.category === "TOEIC"
                        ? "#6C63FF"
                        : task.category === "Japanese"
                        ? "#3B82F6"
                        : task.category === "Programming"
                        ? "#8B5CF6"
                        : "#6b7fa3";

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        className="flex items-center justify-between p-4 rounded-2xl transition-all"
                        style={{
                          background: task.completed ? "var(--input)" : "var(--card)",
                          border: `1px solid var(--border)`,
                          opacity: task.completed ? 0.65 : 1,
                        }}
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <button
                            onClick={() => handleToggleComplete(task.id)}
                            className="text-[#6C63FF] hover:scale-110 transition cursor-pointer flex-shrink-0"
                          >
                            {task.completed ? <CheckCircle size={20} /> : <Circle size={20} color="var(--border)" />}
                          </button>

                          <div className="min-w-0">
                            <p
                              style={{
                                color: task.completed ? "var(--muted-foreground)" : "var(--foreground)",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                textDecoration: task.completed ? "line-through" : "none",
                              }}
                              className="truncate"
                            >
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                style={{
                                  background: `${badgeColor}15`,
                                  color: badgeColor,
                                  fontSize: "0.6875rem",
                                  fontWeight: 600,
                                }}
                                className="px-2 py-0.5 rounded-md"
                              >
                                {task.category}
                              </span>
                              <span style={{ color: "var(--muted-foreground)", fontSize: "0.6875rem" }} className="flex items-center gap-1">
                                <Clock size={11} /> {task.duration} phút
                              </span>
                              {task.timeSlot && (
                                <span style={{ color: "var(--muted-foreground)", fontSize: "0.6875rem" }}>
                                  • {task.timeSlot}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-muted-foreground hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Pomodoro & Music */}
          <div className="flex flex-col gap-8">
            {/* Pomodoro Timer */}
            <div
              className="p-6 rounded-3xl flex flex-col items-center text-center"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Clock size={18} color="#8B5CF6" />
                <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>
                  Đồng hồ Pomodoro
                </h3>
              </div>

              {/* Custom mode switch buttons */}
              <div className="flex gap-2.5 mb-8 p-1.5 rounded-2xl border" style={{ background: "var(--input)", borderColor: "var(--border)" }}>
                <button
                  onClick={() => setTimerMode(25)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  style={{
                    background: timerTotalSeconds === 25 * 60 ? "rgba(108,99,255,0.2)" : "transparent",
                    color: timerTotalSeconds === 25 * 60 ? "var(--primary)" : "var(--muted-foreground)",
                    border: timerTotalSeconds === 25 * 60 ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent",
                  }}
                >
                  25 phút
                </button>
                <button
                  onClick={() => setTimerMode(50)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  style={{
                    background: timerTotalSeconds === 50 * 60 ? "rgba(108,99,255,0.2)" : "transparent",
                    color: timerTotalSeconds === 50 * 60 ? "var(--primary)" : "var(--muted-foreground)",
                    border: timerTotalSeconds === 50 * 60 ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent",
                  }}
                >
                  50 phút
                </button>
                <button
                  onClick={() => setTimerMode(5)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  style={{
                    background: timerTotalSeconds === 5 * 60 ? "rgba(108,99,255,0.2)" : "transparent",
                    color: timerTotalSeconds === 5 * 60 ? "var(--primary)" : "var(--muted-foreground)",
                    border: timerTotalSeconds === 5 * 60 ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent",
                  }}
                >
                  Nghỉ ngắn
                </button>
              </div>

              {/* Circle Timer Graphic */}
              <div className="relative w-44 h-44 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle cx="88" cy="88" r="70" stroke="var(--border)" strokeWidth="6" fill="transparent" />
                  {/* Active Ring */}
                  <circle
                    cx="88"
                    cy="88"
                    r="70"
                    stroke="#8B5CF6"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 70}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>

                {/* Counter */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 800,
                      fontSize: "2.25rem",
                      color: "var(--foreground)",
                      lineHeight: 1,
                    }}
                  >
                    {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
                  </span>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "0.6875rem", marginTop: "4px" }}>
                    {timerActive ? "Đang tập trung" : "Đã tạm dừng"}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white cursor-pointer shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)",
                  }}
                >
                  {timerActive ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
                </button>

                <button
                  onClick={() => setTimerMode(timerTotalSeconds / 60)}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground border transition cursor-pointer"
                  style={{ borderColor: "var(--border)", background: "var(--input)" }}
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>

            {/* Lofi Playlist embed */}
            <div
              className="p-6 rounded-3xl"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Tv size={18} color="#3B82F6" />
                <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.9375rem" }}>
                  Lofi Chill Radio
                </h3>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden border shadow-inner" style={{ borderColor: "var(--border)" }}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/jfKfPfyJRdk"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.6875rem", marginTop: "8px", textAlign: "center" }}>
                Nhạc nền hoàn hảo giúp nâng cao hiệu suất học tập.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
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
                Thêm mục tiêu mới
              </h3>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>
                    Nội dung học tập
                  </label>
                  <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="VD: Học từ vựng chủ đề Kinh tế"
                    style={{
                      background: "var(--input)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                    }}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:border-[#6C63FF]"
                  />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>
                      Lĩnh vực
                    </label>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value as any)}
                      style={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                        fontSize: "0.875rem",
                      }}
                      className="w-full px-4 py-3 rounded-xl outline-none"
                    >
                      <option value="General">Chung</option>
                      <option value="TOEIC">TOEIC</option>
                      <option value="Japanese">Tiếng Nhật</option>
                      <option value="Programming">Lập trình</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>
                      Thời lượng (phút)
                    </label>
                    <input
                      type="number"
                      value={newTaskDuration}
                      onChange={(e) => setNewTaskDuration(parseInt(e.target.value) || 25)}
                      style={{
                        background: "var(--input)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                        fontSize: "0.875rem",
                      }}
                      className="w-full px-4 py-3 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 rounded-xl border text-muted-foreground hover:text-foreground transition cursor-pointer text-sm"
                  style={{ borderColor: "var(--border)", background: "var(--input)" }}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleAddTask}
                  className="flex-1 py-3.5 rounded-xl text-white font-medium cursor-pointer text-sm"
                  style={{
                    background: "linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)",
                  }}
                >
                  Tạo mục tiêu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
