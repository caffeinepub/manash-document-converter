import {
  Bot,
  Briefcase,
  CreditCard,
  FileImage,
  FileText,
  Mail,
  Menu,
  Monitor,
  Moon,
  Mountain,
  ScrollText,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Page } from "../App";
import { type ThemePreference, useTheme } from "../hooks/useTheme";
import { getCustomerSession } from "../types";

interface Props {
  page: Page;
  navigate: (p: Page) => void;
  cartCount: number;
}

const themeIcons: Record<ThemePreference, React.ReactNode> = {
  light: <Sun size={15} />,
  dark: <Moon size={15} />,
  auto: <Monitor size={15} />,
};

const themeLabels: Record<ThemePreference, string> = {
  auto: "Auto",
  light: "Light",
  dark: "Dark",
};

const themeOrder: ThemePreference[] = ["auto", "light", "dark"];

export function Header({ page, navigate, cartCount }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const customer = getCustomerSession();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const panelRef = useRef<HTMLDialogElement>(null);

  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const navLinks: { label: string; page: Page; icon?: React.ReactNode }[] = [
    { label: "Home", page: "home" },
    { label: "Shop", page: "shop" },
    { label: "Converter", page: "converter", icon: <FileText size={13} /> },
    {
      label: "Image Tools",
      page: "image-tools",
      icon: <FileImage size={13} />,
    },
    {
      label: "Job Updates",
      page: "job-updates",
      icon: <Briefcase size={13} />,
    },
    {
      label: "Gov Docs",
      page: "gov-documents",
      icon: <ScrollText size={13} />,
    },
    { label: "PAN Portal", page: "pan-card", icon: <CreditCard size={13} /> },
    { label: "Contact", page: "contact-us", icon: <Mail size={13} /> },
    { label: "Manash 2.0", page: "ai-chat", icon: <Bot size={13} /> },
    { label: "🎮 Entertainment", page: "entertainment" },
    {
      label: "🏔️ Assam Tourism",
      page: "assam-tourism",
      icon: <Mountain size={13} />,
    },
    { label: "⚙️ Admin Panel", page: "admin" },
  ];

  const headerBg = isDark ? "rgba(26,10,20,0.92)" : "rgba(255,255,255,0.88)";
  const headerBorder = isDark
    ? "1px solid rgba(255,182,217,0.18)"
    : "1px solid rgba(180,231,255,0.5)";
  const boxShadow = scrolled
    ? isDark
      ? "0 4px 24px rgba(0,0,0,0.35)"
      : "0 4px 20px rgba(255,182,217,0.25)"
    : "none";

  return (
    <>
      {/* Safe area spacer for iOS notch */}
      <div
        style={{
          height: "env(safe-area-inset-top)",
          background: headerBg,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 51,
        }}
      />

      <header
        className="sticky z-50 transition-all duration-300"
        style={{
          top: "env(safe-area-inset-top)",
          background: headerBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: headerBorder,
          boxShadow,
        }}
      >
        {/* Subtle pink-sky gradient bar at very top */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background:
              "linear-gradient(90deg, #FFB6D9 0%, #B4E7FF 50%, #FFB6D9 100%)",
            opacity: 0.7,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("home")}
            className="flex items-center gap-2.5 flex-shrink-0 hover-scale"
            data-ocid="nav.link"
          >
            <img
              src="/assets/uploads/picsart_26-03-20_17-21-03-596-019d37d3-67cb-70ae-b887-e779e514ed62-1.png"
              alt="NextGen IT Hub"
              className="h-10 w-10 object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="text-left leading-tight">
              <div
                className="font-bold text-base tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #E85D8A 0%, #4FA8E0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                NextGen IT Hub
              </div>
              <div
                className="text-[10px] font-medium"
                style={{
                  color: isDark
                    ? "rgba(255,182,217,0.6)"
                    : "rgba(160,100,130,0.8)",
                }}
              >
                Chamata, Nalbari
              </div>
            </div>
          </button>

          {/* Desktop nav — scrollable pill chips */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none ml-2">
            {navLinks.map((l) => {
              const isActive = page === l.page;
              return (
                <button
                  type="button"
                  key={l.page}
                  onClick={() => navigate(l.page)}
                  data-ocid={`nav.${l.page}.link`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(232,93,138,0.18) 0%, rgba(79,168,224,0.18) 100%)"
                      : "transparent",
                    color: isActive
                      ? isDark
                        ? "#FFB6D9"
                        : "#C84880"
                      : isDark
                        ? "rgba(255,240,248,0.75)"
                        : "rgba(80,50,70,0.75)",
                    border: isActive
                      ? "1px solid rgba(232,93,138,0.35)"
                      : "1px solid transparent",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {l.icon}
                  {l.label}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            {/* iOS Segmented Theme Toggle */}
            <div
              className="hidden md:flex items-center rounded-full p-0.5 gap-0.5"
              style={{
                background: isDark
                  ? "rgba(255,182,217,0.10)"
                  : "rgba(0,0,0,0.06)",
              }}
            >
              {themeOrder.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  title={themeLabels[t]}
                  aria-label={themeLabels[t]}
                  data-ocid="nav.theme.toggle"
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200"
                  style={{
                    background:
                      theme === t
                        ? isDark
                          ? "rgba(255,182,217,0.22)"
                          : "rgba(255,255,255,0.95)"
                        : "transparent",
                    color:
                      theme === t
                        ? isDark
                          ? "#FFB6D9"
                          : "#C84880"
                        : isDark
                          ? "rgba(255,240,248,0.5)"
                          : "rgba(80,50,70,0.5)",
                    boxShadow:
                      theme === t ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                  }}
                >
                  {themeIcons[t]}
                </button>
              ))}
            </div>

            {/* User */}
            <button
              type="button"
              onClick={() => navigate(customer ? "account" : "auth")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                color: isDark ? "rgba(255,240,248,0.8)" : "rgba(80,50,70,0.8)",
              }}
              data-ocid="nav.auth.link"
            >
              <User size={18} />
              <span className="hidden md:inline">
                {customer ? customer.name.split(" ")[0] : "Login"}
              </span>
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => navigate("cart")}
              className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
              style={{
                background:
                  cartCount > 0
                    ? "linear-gradient(135deg, rgba(232,93,138,0.15) 0%, rgba(79,168,224,0.15) 100%)"
                    : "transparent",
              }}
              data-ocid="nav.cart.link"
            >
              <ShoppingCart
                size={20}
                style={{
                  color: isDark
                    ? "rgba(255,240,248,0.85)"
                    : "rgba(80,50,70,0.85)",
                }}
              />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-white text-[10px] rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center font-bold"
                  style={{
                    background: "linear-gradient(135deg, #E85D8A, #B04070)",
                    fontSize: "10px",
                    lineHeight: 1,
                    padding: "2px 4px",
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
              style={{
                color: isDark
                  ? "rgba(255,240,248,0.85)"
                  : "rgba(80,50,70,0.85)",
                background: menuOpen
                  ? isDark
                    ? "rgba(255,182,217,0.15)"
                    : "rgba(232,93,138,0.10)"
                  : "transparent",
              }}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in panel from right */}
      {menuOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-[60]"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
        >
          <dialog
            ref={panelRef}
            open
            aria-label="Navigation menu"
            className="absolute top-0 right-0 bottom-0 w-72 flex flex-col overflow-y-auto m-0 p-0"
            style={{
              background: isDark
                ? "rgba(26,10,20,0.97)"
                : "rgba(255,252,254,0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderLeft: isDark
                ? "1px solid rgba(255,182,217,0.2)"
                : "1px solid rgba(180,231,255,0.5)",
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
              animation:
                "slideInFromRight 0.28s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                borderBottom: isDark
                  ? "1px solid rgba(255,182,217,0.12)"
                  : "1px solid rgba(180,231,255,0.4)",
              }}
            >
              <div
                className="font-bold text-base"
                style={{
                  background:
                    "linear-gradient(135deg, #E85D8A 0%, #4FA8E0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                NextGen IT Hub
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: isDark
                    ? "rgba(255,182,217,0.12)"
                    : "rgba(232,93,138,0.08)",
                  color: isDark ? "#FFB6D9" : "#C84880",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex flex-col px-3 py-3 gap-1">
              {navLinks.map((l) => {
                const isActive = page === l.page;
                return (
                  <button
                    type="button"
                    key={l.page}
                    onClick={() => {
                      navigate(l.page);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-left transition-all duration-200"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(232,93,138,0.15) 0%, rgba(79,168,224,0.15) 100%)"
                        : "transparent",
                      color: isActive
                        ? isDark
                          ? "#FFB6D9"
                          : "#C84880"
                        : isDark
                          ? "rgba(255,240,248,0.8)"
                          : "rgba(60,30,50,0.85)",
                      fontWeight: isActive ? 600 : 400,
                      borderLeft: isActive
                        ? "3px solid #E85D8A"
                        : "3px solid transparent",
                    }}
                  >
                    {l.icon && <span style={{ opacity: 0.7 }}>{l.icon}</span>}
                    {l.label}
                  </button>
                );
              })}
            </div>

            {/* Bottom section: user + theme */}
            <div
              className="mt-auto px-4 py-4 flex flex-col gap-3"
              style={{
                borderTop: isDark
                  ? "1px solid rgba(255,182,217,0.12)"
                  : "1px solid rgba(180,231,255,0.4)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  navigate(customer ? "account" : "auth");
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium"
                style={{
                  background: isDark
                    ? "rgba(255,182,217,0.08)"
                    : "rgba(232,93,138,0.06)",
                  color: isDark
                    ? "rgba(255,240,248,0.85)"
                    : "rgba(60,30,50,0.85)",
                }}
              >
                <User size={16} />
                {customer
                  ? `${customer.name.split(" ")[0]}'s Account`
                  : "Login / Register"}
              </button>

              {/* Theme segmented */}
              <div
                className="flex items-center rounded-2xl p-1 gap-1"
                style={{
                  background: isDark
                    ? "rgba(255,182,217,0.08)"
                    : "rgba(0,0,0,0.05)",
                }}
              >
                {themeOrder.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                    style={{
                      background:
                        theme === t
                          ? isDark
                            ? "rgba(255,182,217,0.20)"
                            : "rgba(255,255,255,0.95)"
                          : "transparent",
                      color:
                        theme === t
                          ? isDark
                            ? "#FFB6D9"
                            : "#C84880"
                          : isDark
                            ? "rgba(255,240,248,0.5)"
                            : "rgba(80,50,70,0.5)",
                      boxShadow:
                        theme === t ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                    }}
                  >
                    {themeIcons[t]}
                    {themeLabels[t]}
                  </button>
                ))}
              </div>
            </div>
          </dialog>
        </div>
      )}

      {/* Slide-in keyframe */}
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1;   }
        }
      `}</style>
    </>
  );
}
