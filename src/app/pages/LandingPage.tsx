import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Shield, Award, Check, HelpCircle, ChevronDown, MessageSquare } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { StatsSection } from "../components/StatsSection";
import { CoursesSection } from "../components/CoursesSection";
import { CTASection } from "../components/CTASection";
import { Footer } from "../components/Footer";

// Testimonials data
const TESTIMONIALS = [
  {
    name: "Trần Thế Anh",
    role: "Học viên TOEIC 850+",
    avatar: "TA",
    comment: "Nhờ LinguaFlow, mình đã bứt phá từ 500 lên 855 điểm TOEIC chỉ trong 3 tháng. Các bài tập nghe của web rất trực quan, giao diện mượt mà và AI chỉ lỗi phát âm cực chuẩn luôn!",
    rating: 5,
    glow: "rgba(108, 99, 255, 0.4)",
  },
  {
    name: "Minh Thu",
    role: "Đỗ JLPT N3",
    avatar: "MT",
    comment: "Tính năng học Kanji bằng Flashcard 3D và trợ lý AI sửa ngữ pháp tiếng Nhật thực sự đỉnh. Mình đã tự tin nói chuyện với người bản xứ và đỗ chứng chỉ N3 dễ dàng.",
    rating: 5,
    glow: "rgba(59, 130, 246, 0.4)",
  },
  {
    name: "Lê Hoàng Long",
    role: "Kỹ sư Phần mềm tại FPT",
    avatar: "HL",
    comment: "Trình duyệt code và trình biên dịch chạy thử code online của LinguaFlow siêu tiện lợi. AI Code Review chỉ ra các lỗi tối ưu và giải thích rất cặn kẽ cấu trúc dữ liệu.",
    rating: 5,
    glow: "rgba(139, 92, 246, 0.4)",
  },
];

// Pricing plans
const PLANS = [
  {
    name: "Free",
    price: "0đ",
    period: "trọn đời",
    desc: "Trải nghiệm cơ bản cho người mới bắt đầu học ngoại ngữ và lập trình.",
    features: [
      "Học thử TOEIC Part 1 & Part 5",
      "Bảng chữ cái Hiragana/Katakana",
      "Bài học lập trình cơ bản",
      "Xem quảng cáo",
    ],
    popular: false,
    color: "#6b7fa3",
    glow: "rgba(107, 127, 163, 0.1)",
  },
  {
    name: "Premium Pro",
    price: "199.000đ",
    period: "tháng",
    desc: "Mở khóa toàn bộ tính năng và học không giới hạn với trợ lý AI.",
    features: [
      "Trọn bộ bài thi thử TOEIC chuẩn ETS",
      "Kho từ vựng thông minh & Kanji full các cấp độ N5-N1",
      "Trình biên dịch code & Trợ lý AI giải thích lỗi lập trình",
      "Trò chuyện AI trợ giảng không giới hạn 24/7",
      "Không quảng cáo & Ưu tiên hỗ trợ",
    ],
    popular: true,
    color: "#6C63FF",
    glow: "rgba(108, 99, 255, 0.4)",
  },
  {
    name: "Lifetime Plus",
    price: "1.499.000đ",
    period: "trọn đời",
    desc: "Đầu tư một lần duy nhất cho hành trình học tập suốt đời của bạn.",
    features: [
      "Toàn bộ quyền lợi gói Premium Pro",
      "Sử dụng trọn đời, không bao giờ phải gia hạn",
      "Nhận ngay các tính năng và khóa học mới nhất trong tương lai",
      "Chứng nhận hoàn thành khóa học từ LinguaFlow",
      "Tham gia nhóm VIP Discord giao lưu với chuyên gia",
    ],
    popular: false,
    color: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.4)",
  },
];

// FAQ items
const FAQS = [
  {
    q: "Hệ thống AI sửa bài viết tiếng Nhật hoạt động thế nào?",
    a: "Chúng tôi sử dụng mô hình ngôn ngữ lớn (LLM) cao cấp, được tinh chỉnh chuyên sâu để nhận dạng lỗi chính tả, sai cấu trúc ngữ pháp tiếng Nhật và gợi ý cách diễn đạt tự nhiên hơn như người bản xứ. AI sẽ cung cấp phân tích chi tiết từng lỗi sai và giải thích tường tận cách khắc phục.",
  },
  {
    q: "Có thể học thử TOEIC và Lập trình miễn phí không?",
    a: "Hoàn toàn được! LinguaFlow cung cấp gói Free trọn đời, cho phép bạn học thử một lượng nội dung nhất định gồm bài nghe TOEIC, bảng chữ cái tiếng Nhật và các bài code cơ bản để trải nghiệm chất lượng dịch vụ trước khi quyết định nâng cấp.",
  },
  {
    q: "Tôi có được cấp chứng nhận sau khi hoàn thành khóa học không?",
    a: "Có, học viên sử dụng gói Lifetime Plus hoặc hoàn thành trọn vẹn lộ trình học tập của bất kỳ khóa học nào trên hệ thống sẽ được cấp chứng chỉ điện tử LinguaFlow. Bạn có thể dễ dàng tải xuống hoặc tích hợp vào hồ sơ LinkedIn của mình.",
  },
  {
    q: "Hỗ trợ khách hàng hoạt động như thế nào khi tôi gặp sự cố thanh toán?",
    a: "Đội ngũ chăm sóc khách hàng của chúng tôi hoạt động 24/7. Bạn có thể gửi email hỗ trợ hoặc chat trực tiếp qua hệ thống Live Chat. Mọi giao dịch nâng cấp tài khoản đều được cam kết bảo mật và hoàn tiền 100% trong vòng 7 ngày nếu bạn không hài lòng.",
  },
];

export function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div
      style={{
        background: "#050816",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        overflowX: "hidden",
        scrollbarWidth: "none",
      }}
    >
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; }
      `}</style>

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CoursesSection />

      {/* Testimonials Section */}
      <section className="relative py-28 px-8 overflow-hidden" style={{ background: "#050816" }}>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(108,99,255,0.05) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="mx-auto relative z-10" style={{ maxWidth: "1440px" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: "rgba(108, 99, 255, 0.1)",
                border: "1px solid rgba(108, 99, 255, 0.25)",
              }}
            >
              <MessageSquare size={14} color="#8B5CF6" />
              <span
                style={{
                  color: "#8B5CF6",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                CẢM NHẬN THỰC TẾ
              </span>
            </div>

            <h2
              style={{
                fontFamily: "Sora, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                color: "#f0f4ff",
                marginBottom: "0.75rem",
              }}
            >
              Hơn 50,000 học viên đã thành công
            </h2>
            <p style={{ color: "#6b7fa3", fontSize: "1rem" }}>
              Hãy lắng nghe chia sẻ thực tế từ các học viên đã nâng cao trình độ qua nền tảng.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-8 rounded-2xl cursor-default group"
                style={{
                  background: "rgba(11, 16, 35, 0.55)",
                  border: "1px solid rgba(108, 99, 255, 0.1)",
                  backdropFilter: "blur(16px)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `1px solid ${t.glow}`;
                  e.currentTarget.style.boxShadow = `0 12px 40px ${t.glow}15`;
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(108, 99, 255, 0.1)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Rating stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </div>

                <p
                  style={{
                    color: "#c4cfea",
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                    marginBottom: "1.5rem",
                  }}
                >
                  "{t.comment}"
                </p>

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${t.glow.replace("0.4", "1")}, #f0f4ff)`,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        color: "#f0f4ff",
                      }}
                    >
                      {t.name}
                    </h4>
                    <p style={{ color: "#4a5a7a", fontSize: "0.75rem", marginTop: "1px" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-28 px-8 overflow-hidden" style={{ background: "#060a1a" }}>
        <div
          className="absolute right-10 bottom-10 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="mx-auto relative z-10" style={{ maxWidth: "1440px" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: "rgba(108, 99, 255, 0.1)",
                border: "1px solid rgba(108, 99, 255, 0.25)",
              }}
            >
              <Award size={14} color="#8B5CF6" />
              <span
                style={{
                  color: "#8B5CF6",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                BẢNG GIÁ ƯU ĐÃI
              </span>
            </div>

            <h2
              style={{
                fontFamily: "Sora, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                color: "#f0f4ff",
                marginBottom: "0.75rem",
              }}
            >
              Chọn gói học tập phù hợp với mục tiêu
            </h2>
            <p style={{ color: "#6b7fa3", fontSize: "1rem" }}>
              Nâng cấp lên gói Premium để học nhanh hơn, nhớ sâu hơn với Trợ lý AI đắc lực.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PLANS.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative rounded-3xl p-8 flex flex-col cursor-default"
                style={{
                  background: plan.popular ? "rgba(16, 21, 51, 0.75)" : "rgba(11, 16, 35, 0.5)",
                  border: plan.popular
                    ? "2px solid rgba(108, 99, 255, 0.65)"
                    : "1px solid rgba(108, 99, 255, 0.12)",
                  boxShadow: plan.popular
                    ? "0 20px 50px rgba(108, 99, 255, 0.15), 0 0 40px rgba(108, 99, 255, 0.05)"
                    : "none",
                  backdropFilter: "blur(24px)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.border = `1px solid ${plan.color}66`;
                    e.currentTarget.style.boxShadow = `0 12px 30px ${plan.glow}15`;
                  }
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.border = "1px solid rgba(108, 99, 255, 0.12)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                    style={{
                      background: "linear-gradient(90deg, #6C63FF, #8B5CF6)",
                      boxShadow: "0 0 16px rgba(108, 99, 255, 0.8)",
                    }}
                  >
                    Đăng ký nhiều nhất
                  </div>
                )}

                {/* Name */}
                <h3
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: plan.popular ? "#a5b4fc" : "#f0f4ff",
                    marginBottom: "12px",
                  }}
                >
                  {plan.name}
                </h3>

                <p style={{ color: "#6b7fa3", fontSize: "0.875rem", lineHeight: 1.6, minHeight: "60px" }}>
                  {plan.desc}
                </p>

                {/* Price */}
                <div className="my-6 flex items-baseline gap-2">
                  <span
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 800,
                      fontSize: "2.5rem",
                      color: "#f0f4ff",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ color: "#4a5a7a", fontSize: "0.875rem" }}>/ {plan.period}</span>
                </div>

                <div style={{ height: "1px", background: "rgba(108, 99, 255, 0.1)", marginBottom: "24px" }} />

                {/* Features */}
                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: plan.popular ? "rgba(108, 99, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
                          border: `1px solid ${plan.popular ? "#6c63ff" : "rgba(255,255,255,0.15)"}`,
                        }}
                      >
                        <Check size={11} color={plan.popular ? "#a5b4fc" : "#c4cfea"} />
                      </div>
                      <span style={{ color: "#c4cfea", fontSize: "0.875rem", lineHeight: 1.4 }}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className="w-full py-4.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer"
                  style={{
                    background: plan.popular
                      ? "linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)"
                      : "rgba(255,255,255,0.04)",
                    border: plan.popular ? "none" : "1px solid rgba(108, 99, 255, 0.25)",
                    color: "white",
                    fontSize: "0.9375rem",
                    fontFamily: "Sora, sans-serif",
                    boxShadow: plan.popular ? "0 0 32px rgba(108, 99, 255, 0.45)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (plan.popular) {
                      e.currentTarget.style.boxShadow = "0 0 45px rgba(108, 99, 255, 0.75)";
                    } else {
                      e.currentTarget.style.background = "rgba(108, 99, 255, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.popular) {
                      e.currentTarget.style.boxShadow = "0 0 32px rgba(108, 99, 255, 0.45)";
                    } else {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }
                  }}
                >
                  {plan.price === "0đ" ? "Bắt đầu học ngay" : "Nâng cấp tài khoản"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-28 px-8 overflow-hidden" style={{ background: "#050816" }}>
        <div className="mx-auto relative z-10" style={{ maxWidth: "1000px" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: "rgba(108, 99, 255, 0.1)",
                border: "1px solid rgba(108, 99, 255, 0.25)",
              }}
            >
              <HelpCircle size={14} color="#8B5CF6" />
              <span
                style={{
                  color: "#8B5CF6",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                GIẢI ĐÁP THẮC MẮC
              </span>
            </div>

            <h2
              style={{
                fontFamily: "Sora, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                color: "#f0f4ff",
                marginBottom: "0.75rem",
              }}
            >
              Câu hỏi thường gặp
            </h2>
            <p style={{ color: "#6b7fa3", fontSize: "1rem" }}>
              Giải đáp nhanh các băn khoăn phổ biến của các bạn học viên mới.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: "rgba(11, 16, 35, 0.5)",
                    border: isOpen
                      ? "1px solid rgba(108, 99, 255, 0.35)"
                      : "1px solid rgba(108, 99, 255, 0.08)",
                  }}
                >
                  <button
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                  >
                    <span
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        color: isOpen ? "#a5b4fc" : "#f0f4ff",
                        transition: "color 0.2s",
                      }}
                    >
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      color="#6b7fa3"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                      }}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div
                          className="px-6 pb-6 pt-2"
                          style={{
                            color: "#c4cfea",
                            fontSize: "0.9375rem",
                            lineHeight: 1.7,
                            borderTop: "1px solid rgba(108, 99, 255, 0.05)",
                          }}
                        >
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}
