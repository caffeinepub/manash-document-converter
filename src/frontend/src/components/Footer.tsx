import { FileType, Github, Linkedin, Twitter } from "lucide-react";

const SOCIAL_ICONS = [
  { Icon: Github, label: "GitHub" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Linkedin, label: "LinkedIn" },
];

const TOOL_LINKS = [
  "JPG to PDF",
  "PDF to JPG",
  "JPG to PNG",
  "PNG to JPG",
  "PNG to PDF",
  "PDF to PNG",
];

const RESOURCE_LINKS = ["Documentation", "API Guide", "Blog", "Support"];
const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer style={{ background: "oklch(0.18 0.04 220)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileType className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-white font-bold text-xl">DocConvert</span>
            </div>
            <p className="text-sm leading-relaxed footer-muted">
              Fast, free, and private file format conversion. No servers. No
              uploads. Just results.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Tools</h4>
            <ul className="space-y-3">
              {TOOL_LINKS.map((t) => (
                <li key={t}>
                  <a
                    href="#convert"
                    className="text-sm footer-link"
                    data-ocid="footer.link"
                  >
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((t) => (
                <li key={t}>
                  <a
                    href="#features"
                    className="text-sm footer-link"
                    data-ocid="footer.link"
                  >
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((t) => (
                <li key={t}>
                  <a
                    href="#how-it-works"
                    className="text-sm footer-link"
                    data-ocid="footer.link"
                  >
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid oklch(0.35 0.04 220)" }}
        >
          <div className="flex items-center gap-4">
            {SOCIAL_ICONS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#convert"
                aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center social-icon-btn"
                data-ocid="footer.link"
              >
                <Icon className="w-4 h-4 text-white" />
              </a>
            ))}
          </div>
          <p className="text-xs footer-muted">
            &copy; {year} DocConvert. Built with &#10084;&#65039; using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
