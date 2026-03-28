import { Button } from "@/components/ui/button";
import { FileType } from "lucide-react";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ background: "oklch(0.22 0.04 220)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileType className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              DocConvert
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {["Convert", "Features", "How It Works"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-medium nav-link-dark"
                data-ocid="nav.link"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
              data-ocid="header.login_button"
            >
              Log In
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              data-ocid="header.signup_button"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
