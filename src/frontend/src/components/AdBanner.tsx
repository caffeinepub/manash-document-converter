import { useEffect } from "react";

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
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (_e) {
      // ignore
    }
  }, []);

  return (
    <div className={`text-center my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9877323479681817"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
}
