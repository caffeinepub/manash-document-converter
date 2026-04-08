import { Home, Music2, Settings, ShoppingBag, Wrench } from "lucide-react";
import type { Page } from "../App";
import { useTheme } from "../hooks/useTheme";

interface Props {
  page: Page;
  navigate: (p: Page) => void;
}

const tabs: { label: string; icon: React.ReactNode; page: Page }[] = [
  { label: "Home", icon: <Home size={22} />, page: "home" },
  { label: "Shop", icon: <ShoppingBag size={22} />, page: "shop" },
  { label: "Music", icon: <Music2 size={22} />, page: "entertainment" },
  { label: "Services", icon: <Wrench size={22} />, page: "gov-documents" },
  { label: "Admin", icon: <Settings size={22} />, page: "admin" },
];

export function BottomNav({ page, navigate }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      style={{
        background: isDark ? "rgba(26,10,20,0.94)" : "rgba(255,252,254,0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: isDark
          ? "1px solid rgba(255,182,217,0.18)"
          : "1px solid rgba(180,231,255,0.5)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: isDark
          ? "0 -4px 20px rgba(0,0,0,0.3)"
          : "0 -4px 20px rgba(255,182,217,0.20)",
      }}
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map(({ label, icon, page: tabPage }) => {
          const isActive = page === tabPage;
          return (
            <button
              key={tabPage}
              type="button"
              onClick={() => navigate(tabPage)}
              data-ocid={`bottom-nav.${tabPage}`}
              aria-label={label}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 min-w-[48px]"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(232,93,138,0.16) 0%, rgba(79,168,224,0.16) 100%)"
                  : "transparent",
                color: isActive
                  ? isDark
                    ? "#FFB6D9"
                    : "#C84880"
                  : isDark
                    ? "rgba(255,240,248,0.45)"
                    : "rgba(100,60,80,0.45)",
              }}
            >
              {/* Active pill indicator */}
              {isActive && (
                <span
                  className="absolute rounded-full"
                  style={{
                    width: 32,
                    height: 3,
                    background:
                      "linear-gradient(90deg, #E85D8A 0%, #4FA8E0 100%)",
                    top: 0,
                    borderRadius: "0 0 4px 4px",
                  }}
                />
              )}

              <span
                className="transition-transform duration-200"
                style={{
                  transform: isActive ? "scale(1.12)" : "scale(1)",
                }}
              >
                {icon}
              </span>
              <span className="text-[10px] font-medium leading-none">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
