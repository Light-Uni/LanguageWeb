/**
 * ApiStatusBadge
 * Pings the Django backend every 30 seconds to show real-time
 * connection status in the main layout top bar.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

type Status = "online" | "offline" | "checking";

async function checkBackend(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/login/", {
      method: "HEAD",
      signal: AbortSignal.timeout(4000),
    });
    // Django returns 405 Method Not Allowed for HEAD on POST-only endpoints → still reachable
    return res.status < 500;
  } catch {
    return false;
  }
}

export function ApiStatusBadge() {
  const [status, setStatus] = useState<Status>("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const doCheck = useCallback(async () => {
    setStatus("checking");
    const ok = await checkBackend();
    setStatus(ok ? "online" : "offline");
    setLastCheck(new Date());
  }, []);

  // Initial check + repeat every 30s
  useEffect(() => {
    doCheck();
    const interval = setInterval(doCheck, 30_000);
    return () => clearInterval(interval);
  }, [doCheck]);

  const color =
    status === "online"
      ? "#34d399"
      : status === "offline"
      ? "#f87171"
      : "#F59E0B";

  const label =
    status === "online"
      ? "Backend Online"
      : status === "offline"
      ? "Backend Offline"
      : "Kiểm tra...";

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Badge button */}
      <button
        onClick={doCheck}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer"
        style={{
          background: `${color}10`,
          border: `1px solid ${color}30`,
        }}
        title="Nhấn để kiểm tra lại"
      >
        {/* Animated pulse dot */}
        {status === "checking" ? (
          <RefreshCw size={12} color={color} className="animate-spin" />
        ) : status === "online" ? (
          <Wifi size={12} color={color} />
        ) : (
          <WifiOff size={12} color={color} />
        )}

        <span
          style={{
            color,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.6875rem",
            fontWeight: 700,
            letterSpacing: "0.03em",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>

        {/* Pulse indicator only when online */}
        {status === "online" && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 6px ${color}`,
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
        )}
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && lastCheck && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 px-3 py-2 rounded-xl z-50 whitespace-nowrap"
            style={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            <p
              style={{
                color: "var(--muted-foreground)",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.75rem",
              }}
            >
              Cập nhật lần cuối:{" "}
              {lastCheck.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
            <p
              style={{
                color: "var(--foreground)",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.75rem",
                marginTop: 2,
              }}
            >
              {status === "online"
                ? "✅ Kết nối Django backend thành công"
                : status === "offline"
                ? "❌ Không thể kết nối. Kiểm tra server."
                : "⏳ Đang kiểm tra..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
