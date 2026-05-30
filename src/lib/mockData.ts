// ─── Mock Data for LinguaFlow ───────────────────────────────────────────────

export const MOCK_USER = {
  id: "1",
  name: "Nguyễn An",
  email: "nguyen.an@email.com",
  avatar: null,
  initials: "NA",
  role: "student" as "student" | "admin",
  xp: 4250,
  level: 12,
  streak: 42,
  joinedAt: "2024-09-01",
};

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export const DASHBOARD_STATS = {
  totalHours: 128,
  streak: 42,
  wordsLearned: 1240,
  xpTotal: 4250,
  toeicProgress: 79,
  japaneseProgress: 64,
  programmingProgress: 51,
  weakSkills: ["TOEIC Part 5", "Kanji N3", "Python OOP"],
};

export const WEEKLY_PROGRESS = [
  { day: "T2", toeic: 45, japanese: 30, programming: 20 },
  { day: "T3", toeic: 60, japanese: 45, programming: 35 },
  { day: "T4", toeic: 30, japanese: 60, programming: 50 },
  { day: "T5", toeic: 80, japanese: 40, programming: 25 },
  { day: "T6", toeic: 55, japanese: 70, programming: 60 },
  { day: "T7", toeic: 90, japanese: 55, programming: 40 },
  { day: "CN", toeic: 40, japanese: 80, programming: 70 },
];

// Heatmap — 52 weeks x 7 days
export const HEATMAP_DATA = Array.from({ length: 364 }, (_, i) => ({
  date: new Date(Date.now() - (363 - i) * 86400000).toISOString().split("T")[0],
  count: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 5),
}));

export const TODAY_SCHEDULE = [
  { id: "1", time: "08:00", subject: "TOEIC Listening", duration: 30, color: "#3B82F6", done: true },
  { id: "2", time: "10:00", subject: "Kanji N3 — 10 chữ", duration: 20, color: "#8B5CF6", done: true },
  { id: "3", time: "14:00", subject: "Python: OOP Basics", duration: 45, color: "#10B981", done: false },
  { id: "4", time: "20:00", subject: "TOEIC Reading Part 7", duration: 60, color: "#3B82F6", done: false },
];

// ─── TOEIC ────────────────────────────────────────────────────────────────────

export const TOEIC_LISTENING_QUESTIONS = [
  {
    id: "L1",
    part: 1,
    audioUrl: null,
    imageDesc: "A man is sitting at a desk, working on a computer.",
    question: "What is the man doing?",
    options: [
      "He is talking on the phone.",
      "He is working on a computer.",
      "He is reading a book.",
      "He is writing a letter.",
    ],
    correct: 1,
    explanation: "The picture shows a man sitting at a desk working on a computer.",
  },
  {
    id: "L2",
    part: 2,
    audioUrl: null,
    question: "When will the meeting start?",
    options: ["At 9 AM", "At 10 AM", "At 11 AM"],
    correct: 0,
    explanation: "The response indicates the meeting starts at 9 AM.",
  },
  {
    id: "L3",
    part: 3,
    audioUrl: null,
    question: "What are the speakers discussing?",
    options: [
      "A project deadline",
      "A business trip",
      "A job interview",
      "A product launch",
    ],
    correct: 0,
    explanation: "They mention they need to finish the report before the deadline.",
  },
];

export const TOEIC_READING_PASSAGES = [
  {
    id: "R1",
    part: 7,
    title: "Company Memo",
    passage: `To: All Staff
From: HR Department
Date: May 15, 2025
Subject: Annual Performance Reviews

Please be advised that annual performance reviews will be conducted from June 1–30. All managers are required to schedule one-on-one meetings with their direct reports within this period.

Employees should prepare a self-assessment form available on the company intranet by May 25. For questions, contact HR at hr@company.com.`,
    questions: [
      {
        id: "R1Q1",
        question: "When will performance reviews take place?",
        options: ["May 1–31", "June 1–30", "July 1–31", "August 1–31"],
        correct: 1,
      },
      {
        id: "R1Q2",
        question: "What must employees submit by May 25?",
        options: ["A resume", "A self-assessment form", "A project report", "A time sheet"],
        correct: 1,
      },
    ],
  },
];

export const TOEIC_VOCABULARY = [
  { id: "V1", word: "Accomplish", meaning: "Hoàn thành, đạt được", example: "She accomplished all her goals this year.", level: "TOEIC 700+" },
  { id: "V2", word: "Adjacent", meaning: "Liền kề, gần bên", example: "The office is adjacent to the conference room.", level: "TOEIC 800+" },
  { id: "V3", word: "Allocate", meaning: "Phân bổ, phân phối", example: "We need to allocate more resources to marketing.", level: "TOEIC 750+" },
  { id: "V4", word: "Amendment", meaning: "Sửa đổi, bổ sung", example: "The contract amendment was signed yesterday.", level: "TOEIC 800+" },
  { id: "V5", word: "Collaborate", meaning: "Hợp tác, cộng tác", example: "The two companies decided to collaborate on the project.", level: "TOEIC 700+" },
  { id: "V6", word: "Deadline", meaning: "Hạn chót, thời hạn", example: "We must meet the project deadline.", level: "TOEIC 600+" },
];

// ─── Japanese ─────────────────────────────────────────────────────────────────

export const HIRAGANA = [
  { char: "あ", romaji: "a" }, { char: "い", romaji: "i" }, { char: "う", romaji: "u" },
  { char: "え", romaji: "e" }, { char: "お", romaji: "o" },
  { char: "か", romaji: "ka" }, { char: "き", romaji: "ki" }, { char: "く", romaji: "ku" },
  { char: "け", romaji: "ke" }, { char: "こ", romaji: "ko" },
  { char: "さ", romaji: "sa" }, { char: "し", romaji: "shi" }, { char: "す", romaji: "su" },
  { char: "せ", romaji: "se" }, { char: "そ", romaji: "so" },
  { char: "た", romaji: "ta" }, { char: "ち", romaji: "chi" }, { char: "つ", romaji: "tsu" },
  { char: "て", romaji: "te" }, { char: "と", romaji: "to" },
  { char: "な", romaji: "na" }, { char: "に", romaji: "ni" }, { char: "ぬ", romaji: "nu" },
  { char: "ね", romaji: "ne" }, { char: "の", romaji: "no" },
  { char: "は", romaji: "ha" }, { char: "ひ", romaji: "hi" }, { char: "ふ", romaji: "fu" },
  { char: "へ", romaji: "he" }, { char: "ほ", romaji: "ho" },
  { char: "ま", romaji: "ma" }, { char: "み", romaji: "mi" }, { char: "む", romaji: "mu" },
  { char: "め", romaji: "me" }, { char: "も", romaji: "mo" },
  { char: "や", romaji: "ya" }, { char: "ゆ", romaji: "yu" }, { char: "よ", romaji: "yo" },
  { char: "ら", romaji: "ra" }, { char: "り", romaji: "ri" }, { char: "る", romaji: "ru" },
  { char: "れ", romaji: "re" }, { char: "ろ", romaji: "ro" },
  { char: "わ", romaji: "wa" }, { char: "を", romaji: "wo" }, { char: "ん", romaji: "n" },
];

export const KATAKANA = [
  { char: "ア", romaji: "a" }, { char: "イ", romaji: "i" }, { char: "ウ", romaji: "u" },
  { char: "エ", romaji: "e" }, { char: "オ", romaji: "o" },
  { char: "カ", romaji: "ka" }, { char: "キ", romaji: "ki" }, { char: "ク", romaji: "ku" },
  { char: "ケ", romaji: "ke" }, { char: "コ", romaji: "ko" },
  { char: "サ", romaji: "sa" }, { char: "シ", romaji: "shi" }, { char: "ス", romaji: "su" },
  { char: "セ", romaji: "se" }, { char: "ソ", romaji: "so" },
  { char: "タ", romaji: "ta" }, { char: "チ", romaji: "chi" }, { char: "ツ", romaji: "tsu" },
  { char: "テ", romaji: "te" }, { char: "ト", romaji: "to" },
  { char: "ナ", romaji: "na" }, { char: "ニ", romaji: "ni" }, { char: "ヌ", romaji: "nu" },
  { char: "ネ", romaji: "ne" }, { char: "ノ", romaji: "no" },
  { char: "ハ", romaji: "ha" }, { char: "ヒ", romaji: "hi" }, { char: "フ", romaji: "fu" },
  { char: "ヘ", romaji: "he" }, { char: "ホ", romaji: "ho" },
  { char: "マ", romaji: "ma" }, { char: "ミ", romaji: "mi" }, { char: "ム", romaji: "mu" },
  { char: "メ", romaji: "me" }, { char: "モ", romaji: "mo" },
  { char: "ヤ", romaji: "ya" }, { char: "ユ", romaji: "yu" }, { char: "ヨ", romaji: "yo" },
  { char: "ラ", romaji: "ra" }, { char: "リ", romaji: "ri" }, { char: "ル", romaji: "ru" },
  { char: "レ", romaji: "re" }, { char: "ロ", romaji: "ro" },
  { char: "ワ", romaji: "wa" }, { char: "ヲ", romaji: "wo" }, { char: "ン", romaji: "n" },
];

export const KANJI_LIST = [
  { char: "日", reading: "にち・ひ", meaning: "Ngày / Mặt trời", level: "N5", strokes: 4 },
  { char: "月", reading: "つき・げつ", meaning: "Tháng / Mặt trăng", level: "N5", strokes: 4 },
  { char: "火", reading: "ひ・か", meaning: "Lửa", level: "N5", strokes: 4 },
  { char: "水", reading: "みず・すい", meaning: "Nước", level: "N5", strokes: 4 },
  { char: "木", reading: "き・もく", meaning: "Cây / Gỗ", level: "N5", strokes: 4 },
  { char: "金", reading: "かね・きん", meaning: "Vàng / Tiền", level: "N5", strokes: 8 },
  { char: "土", reading: "つち・ど", meaning: "Đất", level: "N5", strokes: 3 },
  { char: "山", reading: "やま・さん", meaning: "Núi", level: "N5", strokes: 3 },
  { char: "川", reading: "かわ・せん", meaning: "Sông", level: "N5", strokes: 3 },
  { char: "田", reading: "た・でん", meaning: "Ruộng lúa", level: "N5", strokes: 5 },
  { char: "人", reading: "ひと・じん", meaning: "Người", level: "N5", strokes: 2 },
  { char: "大", reading: "おお・だい", meaning: "To lớn", level: "N5", strokes: 3 },
  { char: "小", reading: "ちい・しょう", meaning: "Nhỏ bé", level: "N5", strokes: 3 },
  { char: "上", reading: "うえ・じょう", meaning: "Trên", level: "N5", strokes: 3 },
  { char: "下", reading: "した・か", meaning: "Dưới", level: "N5", strokes: 3 },
  { char: "中", reading: "なか・ちゅう", meaning: "Giữa / Trong", level: "N5", strokes: 4 },
];

export const AI_WRITING_EXAMPLES = [
  {
    input: "私は昨日学校に行きます",
    errors: [{ type: "Sai thì động từ", position: [8, 11], correction: "行きました" }],
    accuracy: 65,
    corrected: "私は昨日学校に行きました",
    explanation: "「昨日」(hôm qua) là thì quá khứ, nên động từ phải chia thành dạng ta-form: 行きます → 行きました",
    natural: "昨日、学校に行きました。",
  },
  {
    input: "私は毎日日本語を勉強している",
    errors: [],
    accuracy: 95,
    corrected: "私は毎日日本語を勉強している",
    explanation: "Câu đúng ngữ pháp! Dùng dạng て+いる để diễn tả hành động đang diễn ra thường xuyên.",
    natural: "毎日日本語を勉強しています。(lịch sự hơn)",
  },
];

// ─── Programming ──────────────────────────────────────────────────────────────

export const PROGRAMMING_LESSONS = {
  python: [
    {
      id: "py1", title: "Python Basics — Variables & Types", level: "Beginner",
      content: `# Python Variables và Data Types

## Khai báo biến
\`\`\`python
name = "LinguaFlow"  # string
age = 25             # int
score = 9.5          # float
is_active = True     # bool
\`\`\`

## Type checking
\`\`\`python
print(type(name))    # <class 'str'>
print(type(age))     # <class 'int'>
\`\`\``,
      starterCode: `# Thực hành: Khai báo 3 biến mô tả bản thân
# 1. Tên (string)
# 2. Tuổi (int)  
# 3. Điểm TOEIC mục tiêu (int)

name = "Your Name"
age = 20
toeic_target = 750

print(f"Xin chào, tôi là {name}, {age} tuổi")
print(f"Mục tiêu TOEIC: {toeic_target} điểm")`,
      expectedOutput: "Xin chào, tôi là Your Name, 20 tuổi\nMục tiêu TOEIC: 750 điểm",
    },
    {
      id: "py2", title: "Control Flow — if/else, loops", level: "Beginner",
      content: `# Control Flow trong Python

## If / Elif / Else
\`\`\`python
score = 750
if score >= 900:
    print("Xuất sắc!")
elif score >= 700:
    print("Tốt!")
else:
    print("Cần cố gắng thêm!")
\`\`\`

## For loop
\`\`\`python
words = ["accomplish", "adjacent", "allocate"]
for word in words:
    print(f"Từ: {word}")
\`\`\``,
      starterCode: `# Kiểm tra chuỗi học liên tiếp
streak = 42

if streak >= 30:
    print("🔥 Tuyệt vời! Chuỗi trên 30 ngày!")
elif streak >= 7:
    print("⭐ Tốt! Chuỗi trên 1 tuần!")
else:
    print("💪 Hãy duy trì chuỗi mỗi ngày!")`,
      expectedOutput: "🔥 Tuyệt vời! Chuỗi trên 30 ngày!",
    },
  ],
  javascript: [
    {
      id: "js1", title: "JavaScript — Variables & Functions", level: "Beginner",
      content: `# JavaScript Fundamentals

## Variables
\`\`\`js
const name = "LinguaFlow"; // không đổi
let score = 750;           // có thể thay đổi
\`\`\`

## Arrow Functions
\`\`\`js
const greet = (name) => {
  return \`Hello, \${name}!\`;
};
console.log(greet("Student")); // Hello, Student!
\`\`\``,
      starterCode: `// Tính điểm TOEIC trung bình
const listeningScore = 390;
const readingScore = 395;

const totalScore = listeningScore + readingScore;
const grade = totalScore >= 900 ? "A" : totalScore >= 750 ? "B" : "C";

console.log(\`Tổng điểm: \${totalScore}/990\`);
console.log(\`Xếp loại: \${grade}\`);`,
      expectedOutput: "Tổng điểm: 785/990\nXếp loại: B",
    },
  ],
  java: [
    {
      id: "java1", title: "Java OOP — Classes & Objects", level: "Intermediate",
      content: `# Java — Object Oriented Programming

## Khai báo Class
\`\`\`java
public class Student {
    private String name;
    private int toeicScore;
    
    public Student(String name, int score) {
        this.name = name;
        this.toeicScore = score;
    }
    
    public String getGrade() {
        if (toeicScore >= 900) return "Xuất sắc";
        if (toeicScore >= 750) return "Tốt";
        return "Cần cố gắng";
    }
}
\`\`\``,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Tạo object Student
        String name = "Nguyen An";
        int score = 785;
        
        String grade = score >= 900 ? "Xuất sắc" : 
                       score >= 750 ? "Tốt" : "Cần cố gắng";
        
        System.out.println("Học sinh: " + name);
        System.out.println("Điểm TOEIC: " + score);
        System.out.println("Xếp loại: " + grade);
    }
}`,
      expectedOutput: "Học sinh: Nguyen An\nĐiểm TOEIC: 785\nXếp loại: Tốt",
    },
  ],
  cpp: [
    {
      id: "cpp1", title: "C++ — Basics & Arrays", level: "Beginner",
      content: `# C++ Basics

## Variables và Input/Output
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    string name = "LinguaFlow";
    int score = 785;
    
    cout << "App: " << name << endl;
    cout << "Score: " << score << endl;
    
    return 0;
}
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
    int scores[] = {390, 395};
    int total = scores[0] + scores[1];
    
    cout << "Listening: " << scores[0] << "/495" << endl;
    cout << "Reading: " << scores[1] << "/495" << endl;
    cout << "Total: " << total << "/990" << endl;
    
    return 0;
}`,
      expectedOutput: "Listening: 390/495\nReading: 395/495\nTotal: 785/990",
    },
  ],
};

// ─── AI Chat Messages ─────────────────────────────────────────────────────────

export const AI_INITIAL_MESSAGES = [
  {
    id: "ai0",
    role: "assistant" as const,
    content: "Xin chào! Tôi là **LinguaAI** 🤖 — trợ lý học tập thông minh của bạn!\n\nTôi có thể giúp bạn:\n• 📝 Giải thích ngữ pháp TOEIC & JLPT\n• 🇯🇵 Chấm câu tiếng Nhật\n• 💻 Review code và giải thích lỗi\n• 📅 Tư vấn lịch học phù hợp\n\nBạn muốn hỏi gì hôm nay?",
    timestamp: new Date().toISOString(),
  },
];

export const AI_QUICK_PROMPTS = [
  "Giải thích thì hiện tại hoàn thành trong TOEIC",
  "Sự khác biệt は vs が trong tiếng Nhật?",
  "Review code Python của tôi",
  "Tạo lịch học cho tuần này",
  "Từ vựng TOEIC Part 5 hay gặp nhất",
];

// ─── Study Planner ────────────────────────────────────────────────────────────

export const PLANNER_TASKS = [
  { id: "t1", title: "TOEIC Listening Part 1-2", subject: "TOEIC", duration: 30, date: "2026-05-29", time: "08:00", color: "#3B82F6", done: true },
  { id: "t2", title: "Kanji N3: 火・水・木", subject: "Japanese", duration: 20, date: "2026-05-29", time: "10:00", color: "#8B5CF6", done: false },
  { id: "t3", title: "Python OOP Basics", subject: "Programming", duration: 45, date: "2026-05-29", time: "14:00", color: "#10B981", done: false },
  { id: "t4", title: "TOEIC Mock Test Part 7", subject: "TOEIC", duration: 60, date: "2026-05-30", time: "09:00", color: "#3B82F6", done: false },
  { id: "t5", title: "Japanese AI Writing Practice", subject: "Japanese", duration: 30, date: "2026-05-30", time: "15:00", color: "#8B5CF6", done: false },
];

export const LOFI_PLAYLISTS = [
  { id: "lf1", name: "Lofi Study Beats", embedId: "jfKfPfyJRdk", icon: "🎵" },
  { id: "lf2", name: "Japanese Study Music", embedId: "na3yQrcCy5s", icon: "🎌" },
  { id: "lf3", name: "Deep Focus Coding", embedId: "n61ULEU7CO0", icon: "💻" },
  { id: "lf4", name: "Chill Morning Study", embedId: "DWcJFNfaw9c", icon: "☀️" },
];

// ─── Vocabulary Stats ─────────────────────────────────────────────────────────

export const VOCAB_STATS = {
  totalLearned: 1240,
  rememberRate: 78,
  newToday: 24,
  studySpeed: 18, // words per hour
  needReview: 86,
};

export const VOCAB_WEEKLY = [
  { day: "T2", learned: 18, reviewed: 45 },
  { day: "T3", learned: 24, reviewed: 60 },
  { day: "T4", learned: 12, reviewed: 38 },
  { day: "T5", learned: 30, reviewed: 72 },
  { day: "T6", learned: 22, reviewed: 55 },
  { day: "T7", learned: 28, reviewed: 80 },
  { day: "CN", learned: 15, reviewed: 40 },
];

export const VOCAB_CATEGORIES = [
  { name: "TOEIC Business", value: 420, color: "#3B82F6" },
  { name: "JLPT N5-N4", value: 380, color: "#8B5CF6" },
  { name: "JLPT N3", value: 280, color: "#EC4899" },
  { name: "Lập trình", value: 160, color: "#10B981" },
];

export const DIFFICULT_WORDS = [
  { word: "Remuneration", meaning: "Thù lao, tiền công", wrongCount: 5, category: "TOEIC" },
  { word: "Stipulate", meaning: "Quy định, đặt điều kiện", wrongCount: 4, category: "TOEIC" },
  { word: "煩雑", meaning: "Phức tạp, rắc rối", wrongCount: 6, category: "JLPT N2" },
  { word: "概念", meaning: "Khái niệm", wrongCount: 3, category: "JLPT N2" },
  { word: "Polymorphism", meaning: "Đa hình (OOP)", wrongCount: 3, category: "Programming" },
];

// ─── Achievements ─────────────────────────────────────────────────────────────

export const ACHIEVEMENTS = [
  { id: "a1", icon: "🔥", name: "Streak Master", desc: "42 ngày liên tiếp", unlocked: true, color: "#F59E0B" },
  { id: "a2", icon: "📚", name: "Word Wizard", desc: "Học 1000+ từ vựng", unlocked: true, color: "#8B5CF6" },
  { id: "a3", icon: "🎯", name: "TOEIC Hunter", desc: "Điểm 750+", unlocked: true, color: "#3B82F6" },
  { id: "a4", icon: "🇯🇵", name: "Nihongo Starter", desc: "Hoàn thành N5", unlocked: true, color: "#EC4899" },
  { id: "a5", icon: "💻", name: "Code Warrior", desc: "100 bài code", unlocked: false, color: "#10B981" },
  { id: "a6", icon: "🏆", name: "TOEIC Elite", desc: "Điểm 900+", unlocked: false, color: "#6C63FF" },
  { id: "a7", icon: "⛩️", name: "JLPT N3", desc: "Vượt qua N3", unlocked: false, color: "#F59E0B" },
  { id: "a8", icon: "🌟", name: "Top Learner", desc: "Top 10 bảng xếp hạng", unlocked: false, color: "#06B6D4" },
];

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export const ADMIN_STATS = {
  totalUsers: 52840,
  activeToday: 1248,
  coursesTotal: 48,
  revenueMonth: 128500000,
};

export const ADMIN_USERS = [
  { id: "u1", name: "Nguyễn An", email: "nguyen.an@email.com", role: "student", streak: 42, xp: 4250, joined: "2024-09-01" },
  { id: "u2", name: "Trần Hương", email: "tran.huong@email.com", role: "student", streak: 15, xp: 2100, joined: "2024-10-15" },
  { id: "u3", name: "Lê Minh Khôi", email: "le.khoi@email.com", role: "student", streak: 7, xp: 890, joined: "2025-01-20" },
  { id: "u4", name: "Phạm Thu Hà", email: "pham.ha@email.com", role: "student", streak: 28, xp: 3400, joined: "2024-11-05" },
  { id: "u5", name: "Hoàng Văn Nam", email: "hoang.nam@email.com", role: "admin", streak: 60, xp: 8900, joined: "2024-08-01" },
];

// ─── Mock Test ────────────────────────────────────────────────────────────────

export const MOCK_TEST_INFO = {
  duration: 120, // minutes
  totalQuestions: 200,
  parts: [
    { part: 1, name: "Photographs", questions: 6, type: "listening" },
    { part: 2, name: "Question-Response", questions: 25, type: "listening" },
    { part: 3, name: "Conversations", questions: 39, type: "listening" },
    { part: 4, name: "Short Talks", questions: 30, type: "listening" },
    { part: 5, name: "Incomplete Sentences", questions: 30, type: "reading" },
    { part: 6, name: "Text Completion", questions: 16, type: "reading" },
    { part: 7, name: "Reading Comprehension", questions: 54, type: "reading" },
  ],
};
