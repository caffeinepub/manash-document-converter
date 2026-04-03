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
import { useState } from "react";
import type { Page } from "../App";
import { type ThemePreference, useTheme } from "../hooks/useTheme";
import { getCustomerSession } from "../types";

interface Props {
  page: Page;
  navigate: (p: Page) => void;
  cartCount: number;
}

const themeIcons: Record<ThemePreference, React.ReactNode> = {
  light: <Sun size={18} />,
  dark: <Moon size={18} />,
  auto: <Monitor size={18} />,
};

const themeOrder: ThemePreference[] = ["auto", "light", "dark"];

const themeLabels: Record<ThemePreference, string> = {
  auto: "Auto (system)",
  light: "Light mode",
  dark: "Dark mode",
};

export function Header({ page, navigate, cartCount }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const customer = getCustomerSession();
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const idx = themeOrder.indexOf(theme);
    const next = themeOrder[(idx + 1) % themeOrder.length];
    setTheme(next);
  };

  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Shop", page: "shop" },
    { label: "Document Converter", page: "converter" },
    { label: "Image Tools", page: "image-tools" },
    { label: "Job Updates", page: "job-updates" },
    { label: "Gov Documents", page: "gov-documents" },
    { label: "PAN Portal", page: "pan-card" },
    { label: "Contact Us", page: "contact-us" },
    { label: "Manash 2.0", page: "ai-chat" },
    { label: "\uD83C\uDFAE Entertainment", page: "entertainment" },
    { label: "\uD83C\uDFD4\uFE0F Assam Tourism", page: "assam-tourism" },
    { label: "⚙️ Admin Panel", page: "admin" },
  ];

  return (
    <header
      className="sticky top-0 z-50"
      style={{ boxShadow: "0 4px 24px oklch(0 0 0 / 0.4)" }}
    >
      {/* Top utility bar */}
      <div
        className="text-xs py-1.5 px-4 text-right animate-slide-in-top"
        style={{
          background: "oklch(0.10 0.03 250)",
          color: "oklch(0.6 0.04 240)",
          borderBottom: "1px solid oklch(0.22 0.05 250)",
        }}
      >
        Formerly Manash PC World &nbsp;|&nbsp; NextGen IT Hub
      </div>

      {/* Main header */}
      <div
        className="px-4 py-3"
        style={{
          background: "oklch(0.13 0.04 250 / 0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid oklch(0.25 0.06 250 / 0.6)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("home")}
            className="flex items-center gap-3 min-w-0 hover-scale"
            data-ocid="nav.link"
          >
            <img
              src="/assets/uploads/picsart_26-03-20_17-21-03-596-019d37d3-67cb-70ae-b887-e779e514ed62-1.png"
              alt="NextGen IT Hub"
              className="h-12 w-12 object-contain rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="text-left">
              <div
                className="font-bold text-lg leading-tight tracking-wide font-display"
                style={{ color: "oklch(0.95 0.02 240)" }}
              >
                NextGen IT Hub
              </div>
              <div className="text-xs" style={{ color: "oklch(0.78 0.18 65)" }}>
                Formerly Manash PC World
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm">
            {navLinks.map((l) => (
              <button
                type="button"
                key={l.page}
                onClick={() => navigate(l.page)}
                data-ocid={`nav.${l.page}.link`}
                className={`nav-underline transition-all duration-200 flex items-center gap-1 ${
                  page === l.page ? "active-link font-semibold" : ""
                }`}
                style={{
                  color:
                    page === l.page
                      ? "oklch(0.78 0.18 65)"
                      : "oklch(0.75 0.04 240)",
                }}
              >
                {l.page === "converter" && <FileText size={14} />}
                {l.page === "image-tools" && <FileImage size={14} />}
                {l.page === "job-updates" && <Briefcase size={14} />}
                {l.page === "gov-documents" && <ScrollText size={14} />}
                {l.page === "pan-card" && <CreditCard size={14} />}
                {l.page === "contact-us" && <Mail size={14} />}
                {l.page === "ai-chat" && <Bot size={14} />}
                {l.page === "assam-tourism" && <Mountain size={14} />}
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={cycleTheme}
              title={themeLabels[theme]}
              className="flex items-center transition-colors duration-200 rounded-lg p-1.5 hover:opacity-80"
              style={{ color: "oklch(0.75 0.04 240)" }}
              data-ocid="nav.theme.toggle"
              aria-label={themeLabels[theme]}
            >
              {themeIcons[theme]}
            </button>

            <button
              type="button"
              onClick={() => navigate(customer ? "account" : "auth")}
              className="flex items-center gap-1 transition-colors text-sm duration-200"
              style={{ color: "oklch(0.75 0.04 240)" }}
              data-ocid="nav.auth.link"
            >
              <User size={20} />
              <span className="hidden md:inline">
                {customer ? customer.name.split(" ")[0] : "Login"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate("cart")}
              className="relative flex items-center transition-colors"
              style={{ color: "oklch(0.75 0.04 240)" }}
              data-ocid="nav.cart.link"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce"
                  style={{
                    background: "oklch(0.78 0.18 65)",
                    color: "oklch(0.12 0.03 250)",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="md:hidden transition-transform duration-200 hover:scale-110"
              style={{ color: "oklch(0.75 0.04 240)" }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — slide down animation */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-4 animate-slide-down"
          style={{
            background: "oklch(0.13 0.04 250 / 0.98)",
            borderBottom: "1px solid oklch(0.25 0.06 250)",
            backdropFilter: "blur(16px)",
          }}
        >
          {navLinks.map((l, i) => (
            <button
              type="button"
              key={l.page}
              onClick={() => {
                navigate(l.page);
                setMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 text-sm transition-colors"
              style={{
                color: "oklch(0.75 0.04 240)",
                animationDelay: `${i * 40}ms`,
                borderBottom: "1px solid oklch(0.20 0.04 250)",
              }}
            >
              {l.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              navigate(customer ? "account" : "auth");
              setMenuOpen(false);
            }}
            className="block w-full text-left py-2.5 text-sm transition-colors"
            style={{ color: "oklch(0.75 0.04 240)" }}
          >
            {customer ? `My Account (${customer.name})` : "Login / Register"}
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("admin");
              setMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-xs transition-colors"
            style={{ color: "oklch(0.5 0.03 240)" }}
          >
            Admin Panel
          </button>
          {/* Mobile theme toggle */}
          <div
            className="flex items-center gap-3 pt-3 mt-1"
            style={{ borderTop: "1px solid oklch(0.20 0.04 250)" }}
          >
            <span className="text-xs" style={{ color: "oklch(0.5 0.03 240)" }}>
              Theme:
            </span>
            {themeOrder.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                title={themeLabels[t]}
                className="p-1.5 rounded-lg transition-all duration-200"
                style={{
                  color:
                    theme === t ? "oklch(0.78 0.18 65)" : "oklch(0.5 0.03 240)",
                  background:
                    theme === t ? "oklch(0.78 0.18 65 / 0.12)" : "transparent",
                  border:
                    theme === t
                      ? "1px solid oklch(0.78 0.18 65 / 0.4)"
                      : "1px solid transparent",
                }}
              >
                {themeIcons[t]}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
