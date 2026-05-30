import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { MainLayout } from "./layouts/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout";

// Lazy-loaded pages for code splitting (reduces initial bundle ~60%)
const LandingPage         = lazy(() => import("./pages/LandingPage").then(m => ({ default: m.LandingPage })));
const LoginPage           = lazy(() => import("./pages/auth/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage        = lazy(() => import("./pages/auth/RegisterPage").then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage  = lazy(() => import("./pages/auth/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const DashboardPage       = lazy(() => import("./pages/dashboard/DashboardPage").then(m => ({ default: m.DashboardPage })));
const TOEICPage           = lazy(() => import("./pages/toeic/TOEICPage").then(m => ({ default: m.TOEICPage })));
const JapanesePage        = lazy(() => import("./pages/japanese/JapanesePage").then(m => ({ default: m.JapanesePage })));
const ProgrammingPage     = lazy(() => import("./pages/programming/ProgrammingPage").then(m => ({ default: m.ProgrammingPage })));
const AIAssistantPage     = lazy(() => import("./pages/ai/AIAssistantPage").then(m => ({ default: m.AIAssistantPage })));
const StudyPlannerPage    = lazy(() => import("./pages/planner/StudyPlannerPage").then(m => ({ default: m.StudyPlannerPage })));
const VocabularyStatsPage = lazy(() => import("./pages/vocabulary/VocabularyStatsPage").then(m => ({ default: m.VocabularyStatsPage })));
const ProfilePage         = lazy(() => import("./pages/profile/ProfilePage").then(m => ({ default: m.ProfilePage })));
const AdminDashboardPage  = lazy(() => import("./pages/admin/AdminDashboardPage").then(m => ({ default: m.AdminDashboardPage })));

// Full-screen animated loading fallback
function PageLoader() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "#050816" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse"
          style={{
            background: "linear-gradient(135deg, #6C63FF, #3B82F6)",
            boxShadow: "0 0 30px rgba(108,99,255,0.5)",
          }}
        >
          <span
            style={{
              fontFamily: "Sora, sans-serif",
              fontWeight: 800,
              color: "white",
              fontSize: "1.25rem",
            }}
          >
            L
          </span>
        </div>
        <div
          style={{
            color: "#6b7fa3",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.875rem",
          }}
        >
          Đang tải...
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Protected Routes (Main Layout with Sidebar) */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/toeic" element={<TOEICPage />} />
                <Route path="/japanese" element={<JapanesePage />} />
                <Route path="/programming" element={<ProgrammingPage />} />
                <Route path="/ai" element={<AIAssistantPage />} />
                <Route path="/planner" element={<StudyPlannerPage />} />
                <Route path="/vocabulary" element={<VocabularyStatsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
