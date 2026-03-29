import {
  Bot,
  Briefcase,
  FileImage,
  FileText,
  Mail,
  Menu,
  ScrollText,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Page } from "../App";
import { getCustomerSession } from "../types";

interface Props {
  page: Page;
  navigate: (p: Page) => void;
  cartCount: number;
}

export function Header({ page, navigate, cartCount }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const customer = getCustomerSession();

  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Shop", page: "shop" },
    { label: "Document Converter", page: "converter" },
    { label: "Image Tools", page: "image-tools" },
    { label: "Job Updates", page: "job-updates" },
    { label: "Gov Documents", page: "gov-documents" },
    { label: "Contact Us", page: "contact-us" },
    { label: "Manash 2.0", page: "ai-chat" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top utility bar */}
      <div className="bg-gray-100 text-xs py-1 px-4 text-right text-gray-600">
        Formerly Manash PC World &nbsp;|&nbsp; NextGen IT Hub
      </div>

      {/* Main header */}
      <div className="bg-[#0B2A4A] text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("home")}
            className="flex items-center gap-3 min-w-0"
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
              <div className="font-bold text-lg leading-tight tracking-wide">
                NextGen IT Hub
              </div>
              <div className="text-xs text-blue-300">
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
                className={`hover:text-blue-300 transition-colors flex items-center gap-1 ${
                  page === l.page ? "text-blue-300 font-semibold" : ""
                }`}
              >
                {l.page === "converter" && <FileText size={14} />}
                {l.page === "image-tools" && <FileImage size={14} />}
                {l.page === "job-updates" && <Briefcase size={14} />}
                {l.page === "gov-documents" && <ScrollText size={14} />}
                {l.page === "contact-us" && <Mail size={14} />}
                {l.page === "ai-chat" && <Bot size={14} />}
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(customer ? "account" : "auth")}
              className="flex items-center gap-1 hover:text-blue-300 transition-colors text-sm"
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
              className="relative flex items-center hover:text-blue-300 transition-colors"
              data-ocid="nav.cart.link"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1E88FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0B2A4A] border-t border-blue-900 px-4 pb-4">
          {navLinks.map((l) => (
            <button
              type="button"
              key={l.page}
              onClick={() => {
                navigate(l.page);
                setMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-white hover:text-blue-300 text-sm"
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
            className="block w-full text-left py-2 text-white hover:text-blue-300 text-sm"
          >
            {customer ? `My Account (${customer.name})` : "Login / Register"}
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("admin");
              setMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-gray-400 hover:text-gray-200 text-xs"
          >
            Admin Panel
          </button>
        </div>
      )}
    </header>
  );
}
