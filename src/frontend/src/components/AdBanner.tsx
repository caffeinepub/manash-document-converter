import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "fluid";
  layoutKey?: string;
  className?: string;
}

export default function AdBanner({
  slot,
  format = "auto",
  layoutKey,
  className = "",
}: AdBannerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (_e) {
      // ignore
    }
  }, []);

  return (
    <div
      className={`my-4 ${className}`}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: isDark
          ? "0 2px 12px rgba(0,0,0,0.25)"
          : "0 2px 12px rgba(255,182,217,0.20)",
        background: isDark ? "rgba(26,10,20,0.7)" : "rgba(255,252,254,0.7)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: isDark
          ? "1px solid rgba(255,182,217,0.12)"
          : "1px solid rgba(180,231,255,0.35)",
        padding: "2px",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", borderRadius: 14 }}
        data-ad-client="ca-pub-9877323479681817"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
}
