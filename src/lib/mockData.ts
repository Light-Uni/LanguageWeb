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
  // ── A ──────────────────────────────────────────────────────────────────────
  { id: "V1",  word: "Accomplish",    pos: "verb",  meaning: "Hoàn thành, đạt được",              example: "She accomplished all of her targets ahead of schedule.",                         level: "TOEIC 700+",  cambridge: "to succeed in doing something good" },
  { id: "V2",  word: "Adjacent",      pos: "adj",   meaning: "Liền kề, tiếp giáp",               example: "The conference room is adjacent to the main lobby.",                             level: "TOEIC 800+",  cambridge: "very near, next to, or touching" },
  { id: "V3",  word: "Allocate",      pos: "verb",  meaning: "Phân bổ, phân phối",               example: "Funds were allocated equally among the three departments.",                      level: "TOEIC 750+",  cambridge: "to give something to someone as their share" },
  { id: "V4",  word: "Amendment",     pos: "noun",  meaning: "Sửa đổi, điều chỉnh hợp đồng",     example: "An amendment to the contract was signed by both parties.",                       level: "TOEIC 800+",  cambridge: "a change made to a law or agreement" },
  { id: "V5",  word: "Assemble",      pos: "verb",  meaning: "Tập hợp, lắp ráp",                 example: "Workers assembled the new equipment in under two hours.",                         level: "TOEIC 700+",  cambridge: "to come together, or to bring things together, in one place" },
  // ── B ──────────────────────────────────────────────────────────────────────
  { id: "V6",  word: "Budget",         pos: "noun",  meaning: "Ngân sách, kinh phí",               example: "The project came in under budget by 15 per cent.",                               level: "TOEIC 600+",  cambridge: "a plan that shows how much money you have and how it will be spent" },
  // ── C ──────────────────────────────────────────────────────────────────────
  { id: "V7",  word: "Collaborate",   pos: "verb",  meaning: "Hợp tác, cộng tác",                example: "The two firms collaborated on developing the new software.",                      level: "TOEIC 700+",  cambridge: "to work together with someone in order to produce or achieve something" },
  { id: "V8",  word: "Compensate",    pos: "verb",  meaning: "Bù đắp, đền bù thiệt hại",         example: "The airline compensated passengers for the delayed flight.",                      level: "TOEIC 750+",  cambridge: "to pay someone money because you have harmed them" },
  { id: "V9",  word: "Comply",        pos: "verb",  meaning: "Tuân thủ, chấp hành",               example: "All staff must comply with the new data protection regulations.",                  level: "TOEIC 750+",  cambridge: "to act according to an order, rule, or request" },
  { id: "V10", word: "Consecutive",   pos: "adj",   meaning: "Liên tiếp, liên tục",               example: "Sales increased for the fifth consecutive quarter.",                             level: "TOEIC 800+",  cambridge: "following one after another without an interruption" },
  { id: "V11", word: "Coordinate",    pos: "verb",  meaning: "Phối hợp, điều phối",               example: "She coordinates travel arrangements for senior executives.",                      level: "TOEIC 700+",  cambridge: "to make many different things work effectively as a whole" },
  // ── D ──────────────────────────────────────────────────────────────────────
  { id: "V12", word: "Deadline",       pos: "noun",  meaning: "Hạn chót, thời hạn nộp",            example: "We must submit the report before Friday's deadline.",                            level: "TOEIC 600+",  cambridge: "a time or day by which something must be done" },
  { id: "V13", word: "Delegate",       pos: "verb",  meaning: "Ủy quyền, giao phó nhiệm vụ",      example: "A good manager knows how to delegate tasks efficiently.",                        level: "TOEIC 750+",  cambridge: "to give part of your work or duties to someone below you" },
  { id: "V14", word: "Determine",      pos: "verb",  meaning: "Xác định, quyết định",              example: "We need to determine the cause of the production delay.",                        level: "TOEIC 650+",  cambridge: "to discover the facts or truth about something" },
  { id: "V15", word: "Discrepancy",    pos: "noun",  meaning: "Sự chênh lệch, mâu thuẫn số liệu", example: "The auditor found a discrepancy in the financial records.",                     level: "TOEIC 850+",  cambridge: "a difference between two things that should be the same" },
  // ── E ──────────────────────────────────────────────────────────────────────
  { id: "V16", word: "Elaborate",      pos: "verb",  meaning: "Giải thích chi tiết, triển khai",   example: "Could you elaborate on your proposal for the new system?",                      level: "TOEIC 800+",  cambridge: "to add more detail or information" },
  { id: "V17", word: "Eligible",       pos: "adj",   meaning: "Đủ điều kiện, đủ tiêu chuẩn",      example: "Only full-time employees are eligible for the pension scheme.",                   level: "TOEIC 700+",  cambridge: "having the right to do or obtain something" },
  { id: "V18", word: "Endorse",        pos: "verb",  meaning: "Chứng thực, ký hậu, ủng hộ",       example: "The CEO endorsed the merger after reviewing the financial data.",                 level: "TOEIC 800+",  cambridge: "to make a public statement of your approval or support" },
  { id: "V19", word: "Expedite",       pos: "verb",  meaning: "Thúc đẩy, xử lý nhanh",            example: "The manager asked to expedite the shipment to meet the deadline.",               level: "TOEIC 800+",  cambridge: "to make something happen more quickly" },
  // ── F ──────────────────────────────────────────────────────────────────────
  { id: "V20", word: "Facilitate",     pos: "verb",  meaning: "Tạo điều kiện, thúc đẩy",          example: "New software has facilitated communication between remote teams.",               level: "TOEIC 750+",  cambridge: "to make something possible or easier" },
  { id: "V21", word: "Forecast",       pos: "noun",  meaning: "Dự báo, dự đoán kết quả",          example: "The sales forecast for next quarter looks very positive.",                       level: "TOEIC 700+",  cambridge: "a statement about what is likely to happen in the future" },
  // ── I ──────────────────────────────────────────────────────────────────────
  { id: "V22", word: "Implement",      pos: "verb",  meaning: "Thực hiện, triển khai",             example: "The new HR policy will be implemented from next month.",                        level: "TOEIC 700+",  cambridge: "to start using a plan or system" },
  { id: "V23", word: "Incentive",      pos: "noun",  meaning: "Ưu đãi, khuyến khích",             example: "The company offers performance incentives to boost productivity.",              level: "TOEIC 750+",  cambridge: "something that encourages a person to do something" },
  { id: "V24", word: "Inventory",      pos: "noun",  meaning: "Hàng tồn kho, danh mục hàng hóa",  example: "An inventory check revealed that three items were out of stock.",               level: "TOEIC 700+",  cambridge: "a complete list of all the things in a place" },
  // ── M ──────────────────────────────────────────────────────────────────────
  { id: "V25", word: "Mandatory",      pos: "adj",   meaning: "Bắt buộc, cưỡng bức",              example: "Attendance at the safety training is mandatory for all employees.",              level: "TOEIC 750+",  cambridge: "something that must be done, or that is demanded by law" },
  { id: "V26", word: "Merchandise",    pos: "noun",  meaning: "Hàng hóa, sản phẩm thương mại",    example: "The new merchandise will be displayed at the trade fair.",                      level: "TOEIC 700+",  cambridge: "goods that are bought and sold" },
  // ── N ──────────────────────────────────────────────────────────────────────
  { id: "V27", word: "Negotiate",      pos: "verb",  meaning: "Đàm phán, thương lượng",            example: "Both sides agreed to negotiate the terms of the contract.",                     level: "TOEIC 700+",  cambridge: "to have formal discussions in order to reach an agreement" },
  // ── O ──────────────────────────────────────────────────────────────────────
  { id: "V28", word: "Objective",      pos: "noun",  meaning: "Mục tiêu, mục đích cụ thể",         example: "The team's main objective is to increase market share by 10%.",                 level: "TOEIC 650+",  cambridge: "something that you plan to achieve" },
  { id: "V29", word: "Optimize",       pos: "verb",  meaning: "Tối ưu hóa, cải tiến hiệu quả",    example: "We redesigned the workflow to optimize production efficiency.",                   level: "TOEIC 800+",  cambridge: "to make something as good or as effective as possible" },
  { id: "V30", word: "Outstanding",    pos: "adj",   meaning: "Chưa thanh toán / Xuất sắc",       example: "There are still three outstanding invoices from last month.",                    level: "TOEIC 700+",  cambridge: "not yet paid, done, or solved / exceptionally good" },
  // ── P ──────────────────────────────────────────────────────────────────────
  { id: "V31", word: "Preliminary",    pos: "adj",   meaning: "Sơ bộ, ban đầu",                   example: "A preliminary report will be sent to shareholders next week.",                  level: "TOEIC 800+",  cambridge: "coming before a more important action or event" },
  { id: "V32", word: "Proceed",        pos: "verb",  meaning: "Tiến hành, tiến tới",               example: "Once the contract is signed, we may proceed with the project.",                  level: "TOEIC 650+",  cambridge: "to continue doing something that has already been planned" },
  { id: "V33", word: "Proficient",     pos: "adj",   meaning: "Thành thạo, giỏi về",              example: "Candidates must be proficient in both English and Japanese.",                    level: "TOEIC 800+",  cambridge: "skilled and experienced in a particular subject" },
  // ── R ──────────────────────────────────────────────────────────────────────
  { id: "V34", word: "Reimburse",      pos: "verb",  meaning: "Hoàn tiền, bồi hoàn chi phí",      example: "The company will reimburse travel expenses within 30 days.",                     level: "TOEIC 750+",  cambridge: "to pay back money to someone who has spent it for you" },
  { id: "V35", word: "Remuneration",   pos: "noun",  meaning: "Thù lao, khoản thưởng công",       example: "Remuneration packages include base salary and performance bonus.",               level: "TOEIC 900+",  cambridge: "money paid to someone for the work they have done" },
  { id: "V36", word: "Revenue",        pos: "noun",  meaning: "Doanh thu, thu nhập doanh nghiệp",  example: "The company's annual revenue grew by 12% year on year.",                        level: "TOEIC 700+",  cambridge: "the income that a business receives from its normal activities" },
  // ── S ──────────────────────────────────────────────────────────────────────
  { id: "V37", word: "Scrutinize",     pos: "verb",  meaning: "Xem xét kỹ lưỡng, kiểm tra chặt",  example: "The board will scrutinize the budget proposal before approval.",                  level: "TOEIC 850+",  cambridge: "to examine something very carefully" },
  { id: "V38", word: "Stipulate",      pos: "verb",  meaning: "Quy định, đặt điều khoản",         example: "The lease stipulates that pets are not permitted on the premises.",               level: "TOEIC 900+",  cambridge: "to say exactly what must be done, or how something must be done" },
  { id: "V39", word: "Subsequent",     pos: "adj",   meaning: "Tiếp sau, kế tiếp",                example: "The initial results were good; subsequent tests confirmed the findings.",       level: "TOEIC 800+",  cambridge: "happening or coming after something else" },
  { id: "V40", word: "Surplus",        pos: "noun",  meaning: "Thặng dư, dư thừa",                example: "A budget surplus allowed the firm to invest in new equipment.",                  level: "TOEIC 800+",  cambridge: "an amount that is more than is needed" },
  // ── T ──────────────────────────────────────────────────────────────────────
  { id: "V41", word: "Tentative",      pos: "adj",   meaning: "Tạm thời, chưa xác định chắc",     example: "We have set a tentative date for the product launch in July.",                   level: "TOEIC 750+",  cambridge: "not certain or agreed, or showing a lack of confidence" },
  { id: "V42", word: "Transaction",    pos: "noun",  meaning: "Giao dịch, nghiệp vụ kinh doanh",  example: "All financial transactions must be recorded in the ledger.",                     level: "TOEIC 700+",  cambridge: "a piece of business done between two people or groups" },
  // ── V ──────────────────────────────────────────────────────────────────────
  { id: "V43", word: "Verify",         pos: "verb",  meaning: "Xác minh, kiểm tra tính xác thực",  example: "Please verify your identity before accessing the system.",                      level: "TOEIC 700+",  cambridge: "to prove that something exists or is true" },
  { id: "V44", word: "Voucher",         pos: "noun",  meaning: "Phiếu mua hàng, chứng từ thanh toán",example: "Employees receive a meal voucher worth 50,000 VND per day.",                    level: "TOEIC 650+",  cambridge: "a piece of paper that can be used instead of money" },
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
  // ── JLPT N5 (80 Kanji cơ bản nhất) ─────────────────────────────────────────
  { char: "日", reading: "にち・ひ",     meaning: "Ngày / Mặt trời",   level: "N5", strokes: 4,  example: "日曜日（にちようび）日本語（にほんご）" },
  { char: "月", reading: "つき・げつ",   meaning: "Tháng / Mặt trăng", level: "N5", strokes: 4,  example: "月曜日（げつようび）来月（らいげつ）" },
  { char: "火", reading: "ひ・か",       meaning: "Lửa",               level: "N5", strokes: 4,  example: "火曜日（かようび）花火（はなび）" },
  { char: "水", reading: "みず・すい",   meaning: "Nước",              level: "N5", strokes: 4,  example: "水曜日（すいようび）水道（すいどう）" },
  { char: "木", reading: "き・もく",     meaning: "Cây / Gỗ",         level: "N5", strokes: 4,  example: "木曜日（もくようび）木村（きむら）" },
  { char: "金", reading: "かね・きん",   meaning: "Vàng / Tiền",      level: "N5", strokes: 8,  example: "金曜日（きんようび）お金（おかね）" },
  { char: "土", reading: "つち・ど",     meaning: "Đất",               level: "N5", strokes: 3,  example: "土曜日（どようび）土地（とち）" },
  { char: "山", reading: "やま・さん",   meaning: "Núi",               level: "N5", strokes: 3,  example: "富士山（ふじさん）登山（とざん）" },
  { char: "川", reading: "かわ・せん",   meaning: "Sông",              level: "N5", strokes: 3,  example: "川（かわ）神奈川（かながわ）" },
  { char: "田", reading: "た・でん",     meaning: "Ruộng lúa",        level: "N5", strokes: 5,  example: "田中（たなか）水田（すいでん）" },
  { char: "人", reading: "ひと・じん",   meaning: "Người",             level: "N5", strokes: 2,  example: "人（ひと）日本人（にほんじん）" },
  { char: "大", reading: "おお・だい",   meaning: "To lớn",            level: "N5", strokes: 3,  example: "大学（だいがく）大きい（おおきい）" },
  { char: "小", reading: "ちい・しょう", meaning: "Nhỏ bé",            level: "N5", strokes: 3,  example: "小学校（しょうがっこう）小さい（ちいさい）" },
  { char: "上", reading: "うえ・じょう", meaning: "Trên",              level: "N5", strokes: 3,  example: "上（うえ）上手（じょうず）" },
  { char: "下", reading: "した・か",     meaning: "Dưới",              level: "N5", strokes: 3,  example: "下（した）地下（ちか）" },
  { char: "中", reading: "なか・ちゅう", meaning: "Giữa / Trong",     level: "N5", strokes: 4,  example: "中（なか）中学校（ちゅうがっこう）" },
  { char: "本", reading: "ほん・もと",   meaning: "Sách / Gốc rễ",    level: "N5", strokes: 5,  example: "本（ほん）日本（にほん）" },
  { char: "語", reading: "ご・かた",     meaning: "Ngôn ngữ / Nói",   level: "N5", strokes: 14, example: "日本語（にほんご）英語（えいご）" },
  { char: "学", reading: "がく・まな",   meaning: "Học tập",           level: "N5", strokes: 8,  example: "大学（だいがく）学生（がくせい）" },
  { char: "校", reading: "こう",         meaning: "Trường học",        level: "N5", strokes: 10, example: "学校（がっこう）高校（こうこう）" },
  { char: "先", reading: "さき・せん",   meaning: "Trước / Thầy",     level: "N5", strokes: 6,  example: "先生（せんせい）先週（せんしゅう）" },
  { char: "生", reading: "せい・い",     meaning: "Sinh / Sống",      level: "N5", strokes: 5,  example: "学生（がくせい）生活（せいかつ）" },
  { char: "年", reading: "ねん・とし",   meaning: "Năm",               level: "N5", strokes: 6,  example: "今年（ことし）来年（らいねん）" },
  { char: "時", reading: "じ・とき",     meaning: "Thời gian / Giờ",  level: "N5", strokes: 10, example: "何時（なんじ）時間（じかん）" },
  { char: "間", reading: "あいだ・かん", meaning: "Khoảng / Giữa",    level: "N5", strokes: 12, example: "時間（じかん）人間（にんげん）" },
  { char: "国", reading: "くに・こく",   meaning: "Quốc gia / Đất nước",level:"N5", strokes: 8,  example: "国（くに）外国（がいこく）" },
  { char: "見", reading: "み・けん",     meaning: "Nhìn / Xem",       level: "N5", strokes: 7,  example: "見る（みる）見学（けんがく）" },
  { char: "聞", reading: "き・ぶん",     meaning: "Nghe / Hỏi",       level: "N5", strokes: 14, example: "聞く（きく）新聞（しんぶん）" },
  { char: "言", reading: "い・げん",     meaning: "Nói / Lời nói",    level: "N5", strokes: 7,  example: "言う（いう）言語（げんご）" },
  { char: "読", reading: "よ・どく",     meaning: "Đọc",               level: "N5", strokes: 14, example: "読む（よむ）読書（どくしょ）" },
  { char: "書", reading: "か・しょ",     meaning: "Viết",              level: "N5", strokes: 10, example: "書く（かく）図書館（としょかん）" },
  { char: "食", reading: "た・しょく",   meaning: "Ăn / Thức ăn",     level: "N5", strokes: 9,  example: "食べる（たべる）食事（しょくじ）" },
  { char: "飲", reading: "の・いん",     meaning: "Uống",              level: "N5", strokes: 12, example: "飲む（のむ）飲料（いんりょう）" },
  // ── JLPT N4 ─────────────────────────────────────────────────────────────────
  { char: "会", reading: "あ・かい",     meaning: "Gặp / Hội họp",     level: "N4", strokes: 6,  example: "会う（あう）会社（かいしゃ）" },
  { char: "社", reading: "しゃ",         meaning: "Công ty / Xã hội",  level: "N4", strokes: 7,  example: "会社（かいしゃ）社会（しゃかい）" },
  { char: "仕", reading: "し",           meaning: "Phục vụ / Làm việc",level: "N4", strokes: 5,  example: "仕事（しごと）仕方（しかた）" },
  { char: "事", reading: "こと・じ",     meaning: "Việc / Sự việc",   level: "N4", strokes: 8,  example: "仕事（しごと）事実（じじつ）" },
  { char: "電", reading: "でん",         meaning: "Điện",              level: "N4", strokes: 13, example: "電気（でんき）電車（でんしゃ）" },
  { char: "車", reading: "くるま・しゃ", meaning: "Xe / Ô tô",         level: "N4", strokes: 7,  example: "電車（でんしゃ）自動車（じどうしゃ）" },
  { char: "駅", reading: "えき",         meaning: "Ga tàu / Bến xe",   level: "N4", strokes: 14, example: "駅（えき）駅前（えきまえ）" },
  { char: "道", reading: "みち・どう",   meaning: "Đường / Con đường",  level: "N4", strokes: 12, example: "道（みち）北海道（ほっかいどう）" },
  { char: "町", reading: "まち・ちょう", meaning: "Thị trấn / Phường",  level: "N4", strokes: 7,  example: "町（まち）町長（ちょうちょう）" },
  { char: "店", reading: "みせ・てん",   meaning: "Cửa hàng / Tiệm",   level: "N4", strokes: 8,  example: "お店（おみせ）書店（しょてん）" },
  { char: "友", reading: "とも・ゆう",   meaning: "Bạn bè",             level: "N4", strokes: 4,  example: "友達（ともだち）友人（ゆうじん）" },
  { char: "家", reading: "いえ・か",     meaning: "Nhà / Gia đình",    level: "N4", strokes: 10, example: "家（いえ）家族（かぞく）" },
  { char: "族", reading: "ぞく",         meaning: "Gia tộc / Nhóm",   level: "N4", strokes: 11, example: "家族（かぞく）民族（みんぞく）" },
  { char: "体", reading: "からだ・たい", meaning: "Cơ thể / Thể chất",  level: "N4", strokes: 7,  example: "体（からだ）体育（たいいく）" },
  { char: "頭", reading: "あたま・とう", meaning: "Đầu",               level: "N4", strokes: 16, example: "頭（あたま）頭痛（ずつう）" },
  { char: "目", reading: "め・もく",     meaning: "Mắt",               level: "N4", strokes: 5,  example: "目（め）目標（もくひょう）" },
  { char: "手", reading: "て・しゅ",     meaning: "Tay",               level: "N4", strokes: 4,  example: "手（て）上手（じょうず）" },
  { char: "足", reading: "あし・そく",   meaning: "Chân / Đủ",         level: "N4", strokes: 7,  example: "足（あし）満足（まんぞく）" },
  // ── JLPT N3 ─────────────────────────────────────────────────────────────────
  { char: "決", reading: "き・けつ",     meaning: "Quyết định",        level: "N3", strokes: 7,  example: "決める（きめる）決定（けってい）" },
  { char: "定", reading: "さだ・てい",   meaning: "Xác định / Quy định",level: "N3", strokes: 8,  example: "決定（けってい）予定（よてい）" },
  { char: "意", reading: "い",           meaning: "Ý nghĩa / Chú ý",  level: "N3", strokes: 13, example: "意味（いみ）注意（ちゅうい）" },
  { char: "味", reading: "あじ・み",     meaning: "Vị / Ý nghĩa",     level: "N3", strokes: 8,  example: "意味（いみ）趣味（しゅみ）" },
  { char: "考", reading: "かんが・こう", meaning: "Suy nghĩ / Xem xét",level: "N3", strokes: 6,  example: "考える（かんがえる）考え方（かんがえかた）" },
  { char: "思", reading: "おも・し",     meaning: "Nghĩ / Cảm thấy",   level: "N3", strokes: 9,  example: "思う（おもう）思想（しそう）" },
  { char: "知", reading: "し・ち",       meaning: "Biết / Nhận thức",  level: "N3", strokes: 8,  example: "知る（しる）知識（ちしき）" },
  { char: "感", reading: "かん",         meaning: "Cảm xúc / Cảm nhận",level: "N3", strokes: 13, example: "感じる（かんじる）感謝（かんしゃ）" },
  { char: "験", reading: "けん",         meaning: "Kinh nghiệm / Kiểm tra",level:"N3",strokes: 18, example: "経験（けいけん）試験（しけん）" },
  { char: "続", reading: "つづ・ぞく",   meaning: "Tiếp tục / Liên tục",level: "N3", strokes: 13, example: "続く（つづく）続ける（つづける）" },
  { char: "変", reading: "か・へん",     meaning: "Thay đổi / Kỳ lạ",  level: "N3", strokes: 9,  example: "変わる（かわる）大変（たいへん）" },
  { char: "働", reading: "はたら・どう", meaning: "Làm việc",           level: "N3", strokes: 13, example: "働く（はたらく）労働（ろうどう）" },
  { char: "集", reading: "あつ・しゅう", meaning: "Tập hợp / Thu thập", level: "N3", strokes: 12, example: "集まる（あつまる）集中（しゅうちゅう）" },
  { char: "発", reading: "はつ・ほっ",   meaning: "Xuất phát / Phát sinh",level:"N3", strokes: 9,  example: "発展（はってん）出発（しゅっぱつ）" },
  { char: "表", reading: "おもて・ひょう",meaning: "Biểu hiện / Bảng",  level: "N3", strokes: 8,  example: "表す（あらわす）発表（はっぴょう）" },
  { char: "情", reading: "なさ・じょう", meaning: "Tình cảm / Thông tin",level:"N3", strokes: 11, example: "感情（かんじょう）情報（じょうほう）" },
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

// ─── TOEIC Part 5 — Incomplete Sentences (Grammar / Vocabulary) ────────────
export const TOEIC_PART5_QUESTIONS = [
  {
    id: "P5Q1",
    sentence: "The new employee ________ the quarterly report before the deadline.",
    options: ["submit", "submitted", "submitting", "to submit"],
    correct: 1,
    explanation: "Past simple tense needed because the event (submitting) happened before another past event (deadline).",
    category: "Grammar",
  },
  {
    id: "P5Q2",
    sentence: "The marketing team ________ a comprehensive strategy to boost sales.",
    options: ["developed", "development", "developing", "develop"],
    correct: 0,
    explanation: "Simple past 'developed' fits as the main verb of the sentence.",
    category: "Grammar",
  },
  {
    id: "P5Q3",
    sentence: "All employees must ________ with the company's new data-protection policy.",
    options: ["comply", "compliance", "complying", "complied"],
    correct: 0,
    explanation: "After modal verb 'must', use the base form of the verb: comply.",
    category: "Vocabulary",
  },
  {
    id: "P5Q4",
    sentence: "The project was completed ________ of schedule, impressing the client.",
    options: ["ahead", "before", "prior", "forward"],
    correct: 0,
    explanation: "'Ahead of schedule' is the fixed expression meaning before the planned time.",
    category: "Vocabulary",
  },
  {
    id: "P5Q5",
    sentence: "________ the heavy workload, the team finished the presentation on time.",
    options: ["Despite", "Although", "However", "Because"],
    correct: 0,
    explanation: "'Despite' is followed by a noun phrase (heavy workload), not a clause.",
    category: "Grammar",
  },
  {
    id: "P5Q6",
    sentence: "The board of directors has ________ a new CEO to lead the company.",
    options: ["appointed", "appointment", "appoints", "appointing"],
    correct: 0,
    explanation: "Present perfect 'has appointed' — main verb after auxiliary 'has' should be past participle.",
    category: "Grammar",
  },
  {
    id: "P5Q7",
    sentence: "Candidates ________ for the position must have five years of experience.",
    options: ["applying", "applied", "to apply", "applies"],
    correct: 0,
    explanation: "Participial phrase 'applying for the position' modifies 'Candidates'.",
    category: "Grammar",
  },
  {
    id: "P5Q8",
    sentence: "The contract ________ that all disputes shall be resolved by arbitration.",
    options: ["stipulates", "stipulate", "stipulated", "stipulating"],
    correct: 0,
    explanation: "Third-person singular present: 'The contract stipulates'.",
    category: "Vocabulary",
  },
  {
    id: "P5Q9",
    sentence: "We will ________ the costs of the business trip in your next paycheck.",
    options: ["reimburse", "reimbursement", "reimburses", "reimbursed"],
    correct: 0,
    explanation: "After 'will', use base form: reimburse.",
    category: "Vocabulary",
  },
  {
    id: "P5Q10",
    sentence: "Ms. Chen is ________ in three programming languages, including Python.",
    options: ["proficient", "proficiency", "proficiently", "proficient in"],
    correct: 0,
    explanation: "'Proficient' is an adjective used with 'be' verb: is proficient.",
    category: "Vocabulary",
  },
  {
    id: "P5Q11",
    sentence: "The annual ________ showed a 12% increase in revenue compared to last year.",
    options: ["forecast", "forecasting", "forecasts", "forecasted"],
    correct: 0,
    explanation: "Noun 'forecast' is the subject of the sentence.",
    category: "Vocabulary",
  },
  {
    id: "P5Q12",
    sentence: "Please ________ the figures in this report before submitting it to the client.",
    options: ["verify", "verification", "verified", "verifying"],
    correct: 0,
    explanation: "Imperative sentence uses base verb form: verify.",
    category: "Vocabulary",
  },
  {
    id: "P5Q13",
    sentence: "The manager ________ responsibility for the quarterly results to her assistant.",
    options: ["delegated", "delegation", "delegate", "delegating"],
    correct: 0,
    explanation: "Past simple 'delegated' is the main verb.",
    category: "Vocabulary",
  },
  {
    id: "P5Q14",
    sentence: "The two companies decided to ________ on the development of the new product.",
    options: ["collaborate", "collaboration", "collaboratively", "collaborating"],
    correct: 0,
    explanation: "After 'to' (infinitive marker), use base form: collaborate.",
    category: "Vocabulary",
  },
  {
    id: "P5Q15",
    sentence: "The seminar is ________ to employees with more than two years of experience.",
    options: ["restricted", "restricting", "restriction", "restrict"],
    correct: 0,
    explanation: "Past participle 'restricted' used as adjective with 'is': is restricted to.",
    category: "Grammar",
  },
];

// ─── TOEIC Part 6 — Text Completion ──────────────────────────────────────────
export const TOEIC_PART6_PASSAGES = [
  {
    id: "P6A",
    title: "Email: Project Status Update",
    passage: [
      { text: "Dear Team,\n\nI am writing to provide you with an update on the Henderson Project. As you know, we ", type: "text" },
      { blank: "B1", options: ["have been working", "worked", "work", "are worked"], correct: 0, explanation: "Present perfect continuous shows ongoing action." },
      { text: " diligently to meet the client's requirements.\n\nUnfortunately, there ", type: "text" },
      { blank: "B2", options: ["has been", "have been", "was", "were"], correct: 0, explanation: "'There has been' — singular subject 'has been'." },
      { text: " a slight delay in the delivery of raw materials. To compensate for the lost time, we will ________ the production schedule.", type: "text" },
      { blank: "B3", options: ["expedite", "expend", "expect", "expand"], correct: 0, explanation: "'Expedite' means to make happen more quickly — fits the context." },
      { text: "\n\nPlease submit your weekly progress reports by Friday.\n\nBest regards,\nProject Manager", type: "text" },
    ],
    questions: [
      { id: "P6AQ1", blankId: "B1", options: ["have been working", "worked", "work", "are worked"], correct: 0, explanation: "Present perfect continuous shows ongoing action." },
      { id: "P6AQ2", blankId: "B2", options: ["has been", "have been", "was", "were"], correct: 0, explanation: "'There has been' — singular 'delay' takes 'has'." },
      { id: "P6AQ3", blankId: "B3", options: ["expedite", "expend", "expect", "expand"], correct: 0, explanation: "'Expedite' = make something happen faster." },
    ],
  },
];

// ─── TOEIC Part 7 — Multi-passage Reading Comprehension ─────────────────────
export const TOEIC_PART7_PASSAGES = [
  {
    id: "P7A",
    type: "single",
    title: "Notice: Office Relocation",
    passage: `OFFICE RELOCATION NOTICE

To: All Staff
From: Administration Department
Date: August 3, 2025
Subject: Upcoming Office Relocation

We are pleased to announce that our headquarters will be relocating to a new, modern facility at 88 Innovation Drive, Suite 400, effective September 1, 2025.

The new office features state-of-the-art meeting rooms, an on-site cafeteria, and improved parking facilities. All IT equipment will be moved during the weekend of August 29–31 by our contracted moving company, SecureMove Ltd.

Employees are requested to:
• Pack personal belongings in boxes provided by Administration (available from August 20).
• Label all boxes clearly with your name and department.
• Submit a request for a temporary laptop by August 25 if required.

The office will be closed on August 29–31. Remote work is encouraged for those who need access to files during this period. For questions, please contact admin@company.com.`,
    questions: [
      {
        id: "P7AQ1",
        question: "When will the office relocation take effect?",
        options: ["August 20", "August 25", "August 29", "September 1"],
        correct: 3,
        explanation: "The notice states 'effective September 1, 2025'.",
      },
      {
        id: "P7AQ2",
        question: "What should employees do by August 25?",
        options: [
          "Pack their personal belongings",
          "Submit a temporary laptop request",
          "Contact the moving company",
          "Submit weekly progress reports",
        ],
        correct: 1,
        explanation: "The notice says 'Submit a request for a temporary laptop by August 25 if required'.",
      },
      {
        id: "P7AQ3",
        question: "What is indicated about August 29–31?",
        options: [
          "Employees must come to the office",
          "IT equipment will be installed",
          "The office will be closed",
          "Boxes will be distributed",
        ],
        correct: 2,
        explanation: "The notice states 'The office will be closed on August 29–31'.",
      },
    ],
  },
  {
    id: "P7B",
    type: "single",
    title: "Advertisement: Business Workshop",
    passage: `ELEVATE YOUR CAREER
Professional Development Workshop Series

Transform your professional skills with our intensive weekend workshops designed for mid-level executives and aspiring managers.

UPCOMING SESSIONS:

• Effective Negotiation Strategies (October 12–13)
  Learn proven techniques for contract negotiations, salary discussions, and client dealings.
  Fee: 3,500,000 VND

• Financial Planning for Non-Finance Managers (October 19–20)
  Understand budgets, forecasts, and P&L statements without a finance background.
  Fee: 3,200,000 VND

• Advanced Leadership Communication (November 2–3)
  Master presentation skills, executive presence, and stakeholder management.
  Fee: 4,000,000 VND

All workshops are held at the Grand Business Center, 15 Commerce Street. Lunch and learning materials are included. Early registration (before September 30) receives a 15% discount.

For registration: workshops@elevate.vn | Tel: 028-3456-7890`,
    questions: [
      {
        id: "P7BQ1",
        question: "What is the most expensive workshop?",
        options: [
          "Effective Negotiation Strategies",
          "Financial Planning for Non-Finance Managers",
          "Advanced Leadership Communication",
          "All workshops cost the same",
        ],
        correct: 2,
        explanation: "Advanced Leadership Communication costs 4,000,000 VND, the highest.",
      },
      {
        id: "P7BQ2",
        question: "What benefit do early registrants receive?",
        options: [
          "Free lunch",
          "Free learning materials",
          "A 15% discount",
          "A 20% discount",
        ],
        correct: 2,
        explanation: "The ad says 'Early registration (before September 30) receives a 15% discount'.",
      },
      {
        id: "P7BQ3",
        question: "What is included in the workshop fee?",
        options: [
          "Accommodation",
          "Transport",
          "Lunch and learning materials",
          "Certificate of completion",
        ],
        correct: 2,
        explanation: "'Lunch and learning materials are included' is stated in the advertisement.",
      },
    ],
  },
];

// ─── TOEIC Grammar Quiz (standalone) ─────────────────────────────────────────
export const TOEIC_GRAMMAR_QUESTIONS = [
  {
    id: "G1",
    question: "By the time the manager arrived, the team ________ the presentation.",
    options: ["finished", "had finished", "has finished", "finish"],
    correct: 1,
    explanation: "Past perfect (had finished) is used for an action completed before another past action.",
    topic: "Past Perfect",
  },
  {
    id: "G2",
    question: "The new software ________ by the IT department next week.",
    options: ["will install", "will be installed", "is installing", "installs"],
    correct: 1,
    explanation: "Future passive voice: will be + past participle.",
    topic: "Passive Voice",
  },
  {
    id: "G3",
    question: "________ the meeting room is available, we should book it immediately.",
    options: ["Since", "If", "Unless", "Although"],
    correct: 1,
    explanation: "'If' introduces a conditional clause. 'Unless' means 'if not'.",
    topic: "Conditionals",
  },
  {
    id: "G4",
    question: "The report, ________ was submitted last week, contains several errors.",
    options: ["which", "that", "who", "whom"],
    correct: 0,
    explanation: "Non-defining relative clause uses 'which' (not 'that') with a comma.",
    topic: "Relative Clauses",
  },
  {
    id: "G5",
    question: "She suggested ________ an extra shift to complete the project on time.",
    options: ["to work", "working", "work", "worked"],
    correct: 1,
    explanation: "'Suggest' is followed by a gerund (verb + -ing): suggest working.",
    topic: "Gerunds & Infinitives",
  },
  {
    id: "G6",
    question: "The company ________ in this building for over twenty years.",
    options: ["has been located", "is locating", "located", "was locating"],
    correct: 0,
    explanation: "Present perfect passive for ongoing state: has been located.",
    topic: "Perfect Passive",
  },
  {
    id: "G7",
    question: "Please send the documents to ________ is in charge of procurement.",
    options: ["whoever", "whomever", "whatever", "whichever"],
    correct: 0,
    explanation: "'Whoever' is used as the subject of the embedded clause 'is in charge'.",
    topic: "Pronoun Choice",
  },
  {
    id: "G8",
    question: "Not only ________ he increase sales, but he also reduced costs significantly.",
    options: ["did", "had", "has", "does"],
    correct: 0,
    explanation: "Inverted structure with 'Not only' in past tense: Not only did he...",
    topic: "Inversion",
  },
  {
    id: "G9",
    question: "I wish the management ________ our proposal more seriously.",
    options: ["considered", "would consider", "considers", "had considered"],
    correct: 1,
    explanation: "'Wish + would + base verb' expresses a desire for a change in present/future.",
    topic: "Wish Clauses",
  },
  {
    id: "G10",
    question: "The merger, ________ was announced last quarter, has boosted investor confidence.",
    options: ["that", "which", "who", "what"],
    correct: 1,
    explanation: "Non-defining relative clause with comma uses 'which'.",
    topic: "Relative Clauses",
  },
];
