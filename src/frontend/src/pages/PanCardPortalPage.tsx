import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Download,
  ExternalLink,
  FileSearch,
  FileText,
  Globe,
  HelpCircle,
  Link2,
  Printer,
  RefreshCw,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
type ServiceId =
  | "apply-49a"
  | "apply-49aa"
  | "correction"
  | "reprint"
  | "know-pan"
  | "track"
  | "link-aadhaar"
  | "epan"
  | null;

// ── InView hook ──────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Service cards data (localStorage-backed) ────────────────────────────────
const DEFAULT_PAN_SERVICES_RAW = [
  {
    id: "apply-49a",
    title: "Apply New PAN (Form 49A)",
    desc: "Apply for a new Permanent Account Number for Indian citizens and entities.",
    fee: "₹107",
    badge: "Indian Citizens",
  },
  {
    id: "apply-49aa",
    title: "Apply New PAN (Form 49AA)",
    desc: "PAN application for foreign citizens, foreign entities, and NRIs.",
    fee: "₹1,017",
    badge: "Foreign Nationals",
  },
  {
    id: "correction",
    title: "PAN Correction / Update",
    desc: "Correct or update your name, date of birth, address, or father's name on existing PAN.",
    fee: "₹110",
    badge: "",
  },
  {
    id: "reprint",
    title: "Reprint PAN Card",
    desc: "Request a physical PAN card reprint for lost, damaged, or worn-out cards.",
    fee: "₹50",
    badge: "",
  },
  {
    id: "know-pan",
    title: "Know Your PAN",
    desc: "Find your PAN number using your name and date of birth as registered with Income Tax Department.",
    fee: "Free",
    badge: "",
  },
  {
    id: "track",
    title: "Track Application Status",
    desc: "Check real-time status of your PAN application using the 15-digit acknowledgment number.",
    fee: "Free",
    badge: "",
  },
  {
    id: "link-aadhaar",
    title: "Link PAN with Aadhaar",
    desc: "Link your PAN card with Aadhaar number as mandated by the Income Tax Department.",
    fee: "₹1,000",
    badge: "Mandatory",
  },
  {
    id: "epan",
    title: "Download e-PAN",
    desc: "Download your digitally signed e-PAN card in PDF format from NSDL or UTIITSL portal.",
    fee: "Free (30 days)",
    badge: "",
  },
];

function getServiceIcon(id: string) {
  if (id === "apply-49a" || id === "apply-49aa") return <FileText size={28} />;
  if (id === "apply-49aa") return <Globe size={28} />;
  if (id === "correction") return <RefreshCw size={28} />;
  if (id === "reprint") return <Printer size={28} />;
  if (id === "know-pan") return <Search size={28} />;
  if (id === "track") return <FileSearch size={28} />;
  if (id === "link-aadhaar") return <Link2 size={28} />;
  if (id === "epan") return <Download size={28} />;
  return <FileText size={28} />;
}

function loadPanServices() {
  try {
    const stored = JSON.parse(localStorage.getItem("panServices") || "null");
    return stored || DEFAULT_PAN_SERVICES_RAW;
  } catch {
    return DEFAULT_PAN_SERVICES_RAW;
  }
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
];

const DEFAULT_PAN_FAQS_RAW = [
  {
    q: "What is a PAN Card?",
    a: "PAN (Permanent Account Number) is a 10-digit alphanumeric identifier issued by the Income Tax Department of India. It serves as a universal identification key for all financial transactions and tax-related matters.",
  },
  {
    q: "Who needs a PAN Card?",
    a: "Anyone who files income tax returns, makes financial transactions above ₹50,000, opens a bank account, invests in securities, or conducts any high-value transaction in India requires a PAN card.",
  },
  {
    q: "What is the validity of a PAN Card?",
    a: "A PAN card has lifetime validity. Once issued, the PAN number remains the same for life and does not expire. The physical card can be replaced if lost or damaged.",
  },
  {
    q: "How long does it take to get a PAN Card?",
    a: "Physical PAN card delivery typically takes 15–20 working days after successful application. e-PAN is issued within 48 hours via email for eligible applicants.",
  },
  {
    q: "What documents are required for a new PAN Card?",
    a: "You need: (1) Proof of Identity — Aadhaar, Passport, Voter ID, or Driving Licence. (2) Proof of Address — Aadhaar, Passport, Bank Statement, or Utility Bill. (3) Proof of Date of Birth — Birth Certificate, School Leaving Certificate, or Aadhaar.",
  },
  {
    q: "Can I have two PAN Cards?",
    a: "No. Holding more than one PAN card is illegal under Section 272B of the Income Tax Act, 1961, and can attract a penalty of ₹10,000. If you have accidentally received two PANs, you must surrender the duplicate immediately.",
  },
  {
    q: "Is linking PAN with Aadhaar mandatory?",
    a: "Yes. The Government of India has made it mandatory to link PAN with Aadhaar. Failure to link by the deadline renders the PAN inoperative, subject to a late fee of ₹1,000.",
  },
];

function loadPanFaqs() {
  try {
    const stored = JSON.parse(localStorage.getItem("panFaqs") || "null");
    if (stored)
      return stored.map((f: { id?: string; q: string; a: string }) => ({
        q: f.q,
        a: f.a,
      }));
    return DEFAULT_PAN_FAQS_RAW;
  } catch {
    return DEFAULT_PAN_FAQS_RAW;
  }
}

// ── Main Component ────────────────────────────────────────────────────────────
// Helper to add alpha transparency to oklch color strings
function makeAlpha(color: string, alpha: number): string {
  const base = color.endsWith(")") ? color.slice(0, -1) : color;
  return `${base} / ${String(alpha)})`;
}

export function PanCardPortalPage() {
  // Read from localStorage with defaults
  const panHeroText = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("panHeroText") || "null") || {
          title: "PAN Card Services",
          subtitle: "Government of India — Income Tax Department",
        }
      );
    } catch {
      return {
        title: "PAN Card Services",
        subtitle: "Government of India — Income Tax Department",
      };
    }
  })();

  const SERVICES = loadPanServices();
  const FAQS = loadPanFaqs();

  const feeTable = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem("panFeeTable") || "null");
      if (stored) return stored;
      return [
        {
          service: "New PAN (Form 49A)",
          indian: "₹107",
          foreign: "₹1,017",
          notes: "Includes GST + dispatch charges",
        },
        {
          service: "New PAN (Form 49AA)",
          indian: "₹107",
          foreign: "₹1,017",
          notes: "For foreign nationals/NRIs",
        },
        {
          service: "PAN Correction/Update",
          indian: "₹110",
          foreign: "₹1,020",
          notes: "Change in name, DOB, address",
        },
        {
          service: "Reprint PAN Card",
          indian: "₹50",
          foreign: "₹959",
          notes: "Lost/damaged card replacement",
        },
        {
          service: "e-PAN Download",
          indian: "Free",
          foreign: "Free",
          notes: "Within 30 days of allotment",
        },
        {
          service: "PAN-Aadhaar Link",
          indian: "₹1,000",
          foreign: "₹1,000",
          notes: "Late fee applicable; deadline passed",
        },
      ];
    } catch {
      return [];
    }
  })();

  const officialLinks = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem("panLinks") || "null");
      if (stored) return stored;
      return [
        {
          title: "NSDL PAN Portal",
          sub: "onlineservices.nsdl.com",
          url: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
          color: "oklch(0.78 0.18 65)",
        },
        {
          title: "UTIITSL PAN Portal",
          sub: "utiitsl.com",
          url: "https://www.utiitsl.com/UTIITSL_SITE/pan/",
          color: "oklch(0.72 0.18 200)",
        },
        {
          title: "Income Tax e-Filing",
          sub: "incometax.gov.in",
          url: "https://www.incometax.gov.in/iec/foportal/",
          color: "oklch(0.65 0.16 145)",
        },
        {
          title: "PAN-Aadhaar Link Status",
          sub: "eportal.incometax.gov.in",
          url: "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar-with-pan",
          color: "oklch(0.68 0.18 30)",
        },
      ];
    } catch {
      return [];
    }
  })();

  const [activeService, setActiveService] = useState<ServiceId>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const heroSection = useInView();
  const cardsSection = useInView();
  const feeSection = useInView();
  const linksSection = useInView();
  const faqSection = useInView();

  const handleServiceClick = (id: ServiceId) => {
    setActiveService((prev) => (prev === id ? null : id));
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <main
      className="min-h-screen"
      style={{ background: "oklch(0.12 0.03 250)" }}
    >
      {/* ── Hero ── */}
      <section
        ref={heroSection.ref}
        className={`relative overflow-hidden transition-all duration-700 ${
          heroSection.inView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        {/* Tri-color strip */}
        <div className="flex h-2 w-full">
          <div className="flex-1" style={{ background: "#FF9933" }} />
          <div className="flex-1" style={{ background: "#FFFFFF" }} />
          <div className="flex-1" style={{ background: "#138808" }} />
        </div>

        {/* Hero body */}
        <div
          className="relative px-4 py-14 text-center"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.14 0.05 250) 0%, oklch(0.10 0.04 260) 60%, oklch(0.13 0.04 255) 100%)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute top-6 left-8 w-32 h-32 rounded-full opacity-10 blur-2xl"
            style={{ background: "#FF9933" }}
          />
          <div
            className="absolute bottom-4 right-8 w-40 h-40 rounded-full opacity-10 blur-2xl"
            style={{ background: "#138808" }}
          />

          <div className="relative max-w-4xl mx-auto">
            {/* Emblem ring */}
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto animate-float"
              style={{
                background: "oklch(0.20 0.06 250)",
                border: "2px solid oklch(0.78 0.18 65 / 0.5)",
                boxShadow: "0 0 24px oklch(0.78 0.18 65 / 0.2)",
              }}
              aria-hidden
            >
              <span
                className="text-3xl font-bold"
                style={{ color: "oklch(0.78 0.18 65)" }}
              >
                ☸
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <Badge
                className="text-xs px-3 py-1"
                style={{
                  background: "oklch(0.20 0.12 145 / 0.8)",
                  color: "oklch(0.88 0.16 145)",
                  border: "1px solid oklch(0.40 0.14 145 / 0.5)",
                }}
              >
                🇮🇳 Digital India Initiative
              </Badge>
              <Badge
                className="text-xs px-3 py-1"
                style={{
                  background: "oklch(0.20 0.08 65 / 0.8)",
                  color: "oklch(0.88 0.18 65)",
                  border: "1px solid oklch(0.78 0.18 65 / 0.4)",
                }}
              >
                Income Tax Department
              </Badge>
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold mb-3 gradient-text-gold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {panHeroText.title}
            </h1>
            <p
              className="text-lg mb-2"
              style={{ color: "oklch(0.82 0.04 240)" }}
            >
              {panHeroText.subtitle}
            </p>
            <p className="text-sm" style={{ color: "oklch(0.6 0.04 240)" }}>
              Apply, Update, Track, and Manage your PAN Card through official
              portals
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {[
                { icon: "🏛️", label: "NSDL e-Gov" },
                { icon: "🔐", label: "Secure Portal" },
                { icon: "⚡", label: "Instant e-PAN" },
                { icon: "📲", label: "Online Apply" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "oklch(0.75 0.04 240)" }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom tri-color strip */}
        <div className="flex h-1 w-full">
          <div className="flex-1" style={{ background: "#FF9933" }} />
          <div className="flex-1" style={{ background: "#FFFFFF" }} />
          <div className="flex-1" style={{ background: "#138808" }} />
        </div>
      </section>

      {/* ── Service Cards ── */}
      <section
        ref={cardsSection.ref}
        className={`max-w-7xl mx-auto px-4 py-14 transition-all duration-700 delay-100 ${
          cardsSection.inView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
        data-ocid="pan.section"
      >
        <div className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: "oklch(0.78 0.18 65)" }}
          >
            Select a Service
          </h2>
          <p style={{ color: "oklch(0.65 0.04 240)" }}>
            Click any service to view details and proceed
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map(
            (
              svc: {
                id: string;
                title: string;
                desc: string;
                fee: string;
                badge?: string;
              },
              i: number,
            ) => (
              <button
                key={svc.id}
                type="button"
                data-ocid={`pan.service.${i + 1}.button`}
                onClick={() => handleServiceClick(svc.id as ServiceId)}
                className={`text-left rounded-xl p-5 transition-all duration-300 hover-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                  activeService === svc.id ? "ring-2" : ""
                }`}
                style={{
                  background:
                    activeService === svc.id
                      ? "oklch(0.20 0.08 65 / 0.25)"
                      : "oklch(0.16 0.04 250)",
                  border:
                    activeService === svc.id
                      ? "1px solid oklch(0.78 0.18 65 / 0.6)"
                      : "1px solid oklch(0.25 0.06 250)",
                  boxShadow:
                    activeService === svc.id
                      ? "0 0 20px oklch(0.78 0.18 65 / 0.15)"
                      : "none",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background:
                      activeService === svc.id
                        ? "oklch(0.78 0.18 65 / 0.2)"
                        : "oklch(0.20 0.06 250)",
                    color:
                      activeService === svc.id
                        ? "oklch(0.88 0.18 65)"
                        : "oklch(0.72 0.18 200)",
                  }}
                >
                  {getServiceIcon(svc.id)}
                </div>

                {svc.badge && (
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full mb-2"
                    style={{
                      background: "oklch(0.20 0.10 145 / 0.6)",
                      color: "oklch(0.80 0.15 145)",
                      border: "1px solid oklch(0.40 0.12 145 / 0.4)",
                    }}
                  >
                    {svc.badge}
                  </span>
                )}

                <h3
                  className="font-semibold text-sm mb-1 leading-tight"
                  style={{ color: "oklch(0.94 0.02 240)" }}
                >
                  {svc.title}
                </h3>
                <p
                  className="text-xs mb-3 leading-relaxed"
                  style={{ color: "oklch(0.6 0.04 240)" }}
                >
                  {svc.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-bold"
                    style={{ color: "oklch(0.78 0.18 65)" }}
                  >
                    {svc.fee}
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{
                      color:
                        activeService === svc.id
                          ? "oklch(0.78 0.18 65)"
                          : "oklch(0.55 0.04 240)",
                    }}
                  >
                    {activeService === svc.id ? "Hide form" : "Proceed"}
                    <ArrowRight
                      size={12}
                      className={`transition-transform duration-200 ${
                        activeService === svc.id ? "rotate-90" : ""
                      }`}
                    />
                  </span>
                </div>
              </button>
            ),
          )}
        </div>
      </section>

      {/* ── Inline Form Section ── */}
      <div ref={formRef}>
        {activeService && (
          <section
            className="max-w-4xl mx-auto px-4 pb-10 animate-scale-in"
            data-ocid="pan.form.section"
          >
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "oklch(0.15 0.045 250)",
                border: "1px solid oklch(0.28 0.08 65 / 0.4)",
                boxShadow: "0 8px 32px oklch(0 0 0 / 0.4)",
              }}
            >
              {/* Form header with tri-color accent */}
              <div className="flex h-1 w-full rounded-full mb-6 overflow-hidden">
                <div className="flex-1" style={{ background: "#FF9933" }} />
                <div className="flex-1" style={{ background: "#FFFFFF" }} />
                <div className="flex-1" style={{ background: "#138808" }} />
              </div>

              {activeService === "apply-49a" && <Form49A />}
              {activeService === "apply-49aa" && <Form49AA />}
              {activeService === "correction" && <FormCorrection />}
              {activeService === "reprint" && <FormReprint />}
              {activeService === "know-pan" && <FormKnowPan />}
              {activeService === "track" && <FormTrack />}
              {activeService === "link-aadhaar" && <FormLinkAadhaar />}
              {activeService === "epan" && <FormEPan />}
            </div>
          </section>
        )}
      </div>

      {/* ── Fee Table ── */}
      <section
        ref={feeSection.ref}
        className={`max-w-7xl mx-auto px-4 py-12 transition-all duration-700 ${
          feeSection.inView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
        data-ocid="pan.fees.section"
      >
        <div className="text-center mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: "oklch(0.78 0.18 65)" }}
          >
            Fee Structure
          </h2>
          <p style={{ color: "oklch(0.65 0.04 240)" }}>
            As prescribed by NSDL e-Gov / UTIITSL
          </p>
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid oklch(0.25 0.06 250)" }}
        >
          <Table>
            <TableHeader>
              <TableRow
                style={{
                  background: "oklch(0.18 0.05 250)",
                  borderBottom: "1px solid oklch(0.28 0.07 250)",
                }}
              >
                <TableHead style={{ color: "oklch(0.78 0.18 65)" }}>
                  Service
                </TableHead>
                <TableHead style={{ color: "oklch(0.78 0.18 65)" }}>
                  Indian Address
                </TableHead>
                <TableHead style={{ color: "oklch(0.78 0.18 65)" }}>
                  Foreign Address
                </TableHead>
                <TableHead style={{ color: "oklch(0.78 0.18 65)" }}>
                  Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeTable.map(
                (
                  row: {
                    id?: string;
                    service: string;
                    indian: string;
                    foreign: string;
                    notes: string;
                  },
                  i: number,
                ) => (
                  <TableRow
                    key={row.id || row.service}
                    style={{
                      background:
                        i % 2 === 0
                          ? "oklch(0.14 0.04 250)"
                          : "oklch(0.16 0.04 250)",
                      borderBottom: "1px solid oklch(0.22 0.05 250)",
                    }}
                    data-ocid={`pan.fees.row.${i + 1}`}
                  >
                    <TableCell
                      style={{ color: "oklch(0.88 0.02 240)", fontWeight: 500 }}
                    >
                      {row.service}
                    </TableCell>
                    <TableCell>
                      <span
                        className="font-semibold"
                        style={{ color: "oklch(0.78 0.18 65)" }}
                      >
                        {row.indian}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="font-semibold"
                        style={{ color: "oklch(0.72 0.18 200)" }}
                      >
                        {row.foreign}
                      </span>
                    </TableCell>
                    <TableCell
                      style={{
                        color: "oklch(0.6 0.04 240)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {row.notes}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* ── Important Links ── */}
      <section
        ref={linksSection.ref}
        className={`max-w-7xl mx-auto px-4 py-10 transition-all duration-700 ${
          linksSection.inView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
        data-ocid="pan.links.section"
      >
        <div className="text-center mb-8">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "oklch(0.78 0.18 65)" }}
          >
            Official Government Links
          </h2>
          <p style={{ color: "oklch(0.65 0.04 240)" }}>
            All actual applications are processed on official portals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {officialLinks.map(
            (
              link: {
                id?: string;
                title: string;
                sub: string;
                url: string;
                color?: string;
              },
              i: number,
            ) => {
              const linkColor = link.color || "oklch(0.78 0.18 65)";
              return (
                <a
                  key={link.id || link.title}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid={`pan.link.${i + 1}`}
                  className="group flex items-start gap-3 rounded-xl p-4 transition-all duration-300 hover-lift"
                  style={{
                    background: "oklch(0.16 0.04 250)",
                    border: "1px solid oklch(0.25 0.06 250)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: makeAlpha(linkColor, 0.15),
                      color: linkColor,
                    }}
                  >
                    <ExternalLink size={20} />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="font-semibold text-sm mb-0.5 group-hover:underline"
                      style={{ color: "oklch(0.88 0.02 240)" }}
                    >
                      {link.title}
                    </div>
                    <div
                      className="text-xs truncate"
                      style={{ color: "oklch(0.55 0.04 240)" }}
                    >
                      {link.sub}
                    </div>
                  </div>
                  <ExternalLink
                    size={14}
                    className="flex-shrink-0 mt-1"
                    style={{ color: "oklch(0.5 0.04 240)" }}
                  />
                </a>
              );
            },
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        ref={faqSection.ref}
        className={`max-w-4xl mx-auto px-4 py-12 transition-all duration-700 ${
          faqSection.inView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
        data-ocid="pan.faq.section"
      >
        <div className="text-center mb-8">
          <h2
            className="text-2xl font-bold mb-2 flex items-center justify-center gap-2"
            style={{ color: "oklch(0.78 0.18 65)" }}
          >
            <HelpCircle size={22} />
            Frequently Asked Questions
          </h2>
        </div>
        <FaqAccordion faqs={FAQS} />
      </section>

      {/* ── Disclaimer ── */}
      <footer
        className="max-w-7xl mx-auto px-4 py-8 text-center"
        style={{ borderTop: "1px solid oklch(0.22 0.05 250)" }}
      >
        <div className="flex items-start gap-2 justify-center max-w-3xl mx-auto">
          <AlertCircle
            size={16}
            className="flex-shrink-0 mt-0.5"
            style={{ color: "oklch(0.65 0.15 65)" }}
          />
          <p
            className="text-xs text-left"
            style={{ color: "oklch(0.5 0.04 240)" }}
          >
            <strong style={{ color: "oklch(0.65 0.08 65)" }}>
              Disclaimer:
            </strong>{" "}
            This portal provides guidance and assistance for PAN card services.
            All actual applications are processed exclusively by NSDL e-Gov,
            UTIITSL, and the Income Tax Department, Government of India. Manash
            PC World 2.0 is not affiliated with, endorsed by, or representing
            the Government of India or any of its departments. All fees and
            details are subject to change; verify on the official portal before
            applying.
          </p>
        </div>
      </footer>
    </main>
  );
}

// ── Form Components ───────────────────────────────────────────────────────────

function FormHeading({
  title,
  fee,
  external,
}: { title: string; fee: string; external?: string }) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2
          className="text-xl font-bold"
          style={{ color: "oklch(0.78 0.18 65)" }}
        >
          {title}
        </h2>
        <span
          className="text-sm px-3 py-1 rounded-full font-semibold"
          style={{
            background: "oklch(0.22 0.08 65 / 0.4)",
            color: "oklch(0.85 0.18 65)",
            border: "1px solid oklch(0.78 0.18 65 / 0.3)",
          }}
        >
          Fee: {fee}
        </span>
      </div>
      {external && (
        <p className="text-xs mt-2" style={{ color: "oklch(0.6 0.04 240)" }}>
          <CheckCircle
            size={12}
            className="inline mr-1"
            style={{ color: "oklch(0.65 0.16 145)" }}
          />
          Your application will be processed on the official government portal.
        </p>
      )}
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">{children}</div>
  );
}

function FormField({
  label,
  id,
  children,
}: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="text-sm mb-1.5 block"
        style={{ color: "oklch(0.78 0.04 240)" }}
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Input
      {...props}
      className="w-full"
      style={{
        background: "oklch(0.12 0.03 250)",
        border: "1px solid oklch(0.28 0.07 250)",
        color: "oklch(0.92 0.02 240)",
      }}
    />
  );
}

function StyledTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <Textarea
      {...props}
      className="w-full"
      style={{
        background: "oklch(0.12 0.03 250)",
        border: "1px solid oklch(0.28 0.07 250)",
        color: "oklch(0.92 0.02 240)",
        minHeight: "80px",
      }}
    />
  );
}

function StyledSelect({
  id,
  placeholder,
  options,
  value,
  onChange,
}: {
  id: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        style={{
          background: "oklch(0.12 0.03 250)",
          border: "1px solid oklch(0.28 0.07 250)",
          color: value ? "oklch(0.92 0.02 240)" : "oklch(0.55 0.04 240)",
        }}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        style={{
          background: "oklch(0.16 0.04 250)",
          border: "1px solid oklch(0.28 0.07 250)",
        }}
      >
        {options.map((o) => (
          <SelectItem
            key={o}
            value={o}
            style={{ color: "oklch(0.88 0.02 240)" }}
          >
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SubmitButton({
  label,
  externalUrl,
  note,
}: { label: string; externalUrl?: string; note?: string }) {
  return (
    <div
      className="mt-6 pt-4"
      style={{ borderTop: "1px solid oklch(0.22 0.05 250)" }}
    >
      {note && (
        <p
          className="text-xs mb-3 flex items-center gap-1.5"
          style={{ color: "oklch(0.65 0.04 240)" }}
        >
          <AlertCircle size={12} style={{ color: "oklch(0.78 0.18 65)" }} />
          {note}
        </p>
      )}
      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="pan.form.submit_button"
        >
          <Button
            className="w-full md:w-auto font-semibold"
            style={{
              background: "oklch(0.78 0.18 65)",
              color: "oklch(0.12 0.03 250)",
            }}
          >
            {label} <ExternalLink size={14} className="ml-2" />
          </Button>
        </a>
      ) : (
        <Button
          type="submit"
          className="w-full md:w-auto font-semibold"
          data-ocid="pan.form.submit_button"
          style={{
            background: "oklch(0.78 0.18 65)",
            color: "oklch(0.12 0.03 250)",
          }}
        >
          {label}
        </Button>
      )}
    </div>
  );
}

// ── Individual Forms ──────────────────────────────────────────────────────────

function Form49A() {
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.open(
          "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
          "_blank",
        );
      }}
    >
      <FormHeading
        title="Apply New PAN — Form 49A"
        fee="₹107 (Indian) / ₹1,017 (Foreign)"
        external="nsdl"
      />
      <FieldRow>
        <FormField label="Full Name (as per Aadhaar) *" id="f49a-name">
          <StyledInput
            id="f49a-name"
            placeholder="e.g. Rajesh Kumar Sharma"
            required
          />
        </FormField>
        <FormField label="Father's Name *" id="f49a-father">
          <StyledInput
            id="f49a-father"
            placeholder="Father's full name"
            required
          />
        </FormField>
      </FieldRow>
      <FieldRow>
        <FormField label="Date of Birth *" id="f49a-dob">
          <StyledInput id="f49a-dob" type="date" required />
        </FormField>
        <FormField label="Gender *" id="f49a-gender">
          <div className="flex gap-4 mt-2">
            {["Male", "Female", "Transgender"].map((g) => (
              <label
                key={g}
                className="flex items-center gap-1.5 cursor-pointer text-sm"
                style={{ color: "oklch(0.80 0.04 240)" }}
              >
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={gender === g}
                  onChange={() => setGender(g)}
                  className="accent-yellow-400"
                />
                {g}
              </label>
            ))}
          </div>
        </FormField>
      </FieldRow>
      <FieldRow>
        <FormField label="Mobile Number *" id="f49a-mobile">
          <StyledInput
            id="f49a-mobile"
            type="tel"
            placeholder="10-digit mobile number"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </FormField>
        <FormField label="Email Address *" id="f49a-email">
          <StyledInput
            id="f49a-email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </FormField>
      </FieldRow>
      <FieldRow>
        <FormField label="Aadhaar Number *" id="f49a-aadhaar">
          <StyledInput
            id="f49a-aadhaar"
            placeholder="12-digit Aadhaar number"
            pattern="[0-9]{12}"
            maxLength={12}
            required
          />
        </FormField>
        <FormField label="Category *" id="f49a-category">
          <StyledSelect
            id="f49a-category"
            placeholder="Select category"
            options={[
              "Individual",
              "Hindu Undivided Family (HUF)",
              "Company",
              "Firm/LLP",
              "Association of Persons (AOP)",
              "Body of Individuals (BOI)",
              "Trust",
              "Artificial Juridical Person",
            ]}
            value={category}
            onChange={setCategory}
          />
        </FormField>
      </FieldRow>
      <div className="mb-4">
        <FormField label="Residential Address *" id="f49a-address">
          <StyledTextarea
            id="f49a-address"
            placeholder="Flat/House No., Street, Locality"
            required
          />
        </FormField>
      </div>
      <FieldRow>
        <FormField label="City *" id="f49a-city">
          <StyledInput id="f49a-city" placeholder="City" required />
        </FormField>
        <FormField label="State *" id="f49a-state">
          <StyledSelect
            id="f49a-state"
            placeholder="Select state"
            options={INDIAN_STATES}
            value={state}
            onChange={setState}
          />
        </FormField>
      </FieldRow>
      <FieldRow>
        <FormField label="PIN Code *" id="f49a-pin">
          <StyledInput
            id="f49a-pin"
            placeholder="6-digit PIN code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
          />
        </FormField>
      </FieldRow>
      <SubmitButton
        label="Proceed to NSDL Portal"
        externalUrl="https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html"
        note="You will be redirected to the official NSDL e-Gov portal to complete your application and payment."
      />
    </form>
  );
}

function Form49AA() {
  const [country, setCountry] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.open(
          "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
          "_blank",
        );
      }}
    >
      <FormHeading
        title="Apply New PAN — Form 49AA (Foreign Citizens)"
        fee="₹1,017"
        external="nsdl"
      />
      <FieldRow>
        <FormField label="Full Name *" id="f49aa-name">
          <StyledInput
            id="f49aa-name"
            placeholder="Full name as per passport"
            required
          />
        </FormField>
        <FormField label="Father's Name" id="f49aa-father">
          <StyledInput id="f49aa-father" placeholder="Father's full name" />
        </FormField>
      </FieldRow>
      <FieldRow>
        <FormField label="Date of Birth *" id="f49aa-dob">
          <StyledInput id="f49aa-dob" type="date" required />
        </FormField>
        <FormField label="Nationality *" id="f49aa-nationality">
          <StyledInput
            id="f49aa-nationality"
            placeholder="e.g. American, British"
            required
          />
        </FormField>
      </FieldRow>
      <FieldRow>
        <FormField label="Country of Residence *" id="f49aa-country">
          <StyledSelect
            id="f49aa-country"
            placeholder="Select country"
            options={[
              "United States",
              "United Kingdom",
              "Canada",
              "Australia",
              "Germany",
              "France",
              "Singapore",
              "UAE",
              "Japan",
              "Other",
            ]}
            value={country}
            onChange={setCountry}
          />
        </FormField>
        <FormField label="Passport Number *" id="f49aa-passport">
          <StyledInput
            id="f49aa-passport"
            placeholder="Passport number"
            required
          />
        </FormField>
      </FieldRow>
      <FieldRow>
        <FormField label="Mobile Number *" id="f49aa-mobile">
          <StyledInput
            id="f49aa-mobile"
            type="tel"
            placeholder="With country code"
            required
          />
        </FormField>
        <FormField label="Email Address *" id="f49aa-email">
          <StyledInput
            id="f49aa-email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </FormField>
      </FieldRow>
      <div className="mb-4">
        <FormField label="Address (Foreign) *" id="f49aa-address">
          <StyledTextarea
            id="f49aa-address"
            placeholder="Complete foreign address"
            required
          />
        </FormField>
      </div>
      <SubmitButton
        label="Proceed to NSDL Portal"
        externalUrl="https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html"
        note="Foreign address applications attract a fee of ₹1,017. You will be redirected to NSDL portal."
      />
    </form>
  );
}

function FormCorrection() {
  const [corrections, setCorrections] = useState<string[]>([]);

  const toggleCorrection = (val: string) => {
    setCorrections((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val],
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.open("https://www.onlineservices.nsdl.com", "_blank");
      }}
    >
      <FormHeading
        title="PAN Correction / Update"
        fee="₹110 (Indian) / ₹1,020 (Foreign)"
        external="nsdl"
      />
      <FieldRow>
        <FormField label="Existing PAN Number *" id="corr-pan">
          <StyledInput
            id="corr-pan"
            placeholder="e.g. ABCDE1234F"
            maxLength={10}
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            required
          />
        </FormField>
        <FormField label="Name as per Existing PAN *" id="corr-name">
          <StyledInput
            id="corr-name"
            placeholder="Name on your PAN card"
            required
          />
        </FormField>
      </FieldRow>

      <div className="mb-4">
        <Label
          className="text-sm mb-2 block"
          style={{ color: "oklch(0.78 0.04 240)" }}
        >
          Correction Required In (select all that apply) *
        </Label>
        <div className="flex flex-wrap gap-4 mt-1">
          {[
            "Name",
            "Date of Birth",
            "Address",
            "Father's Name",
            "Mother's Name",
            "Mobile",
            "Email",
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 cursor-pointer text-sm"
              style={{ color: "oklch(0.80 0.04 240)" }}
            >
              <input
                type="checkbox"
                checked={corrections.includes(item)}
                onChange={() => toggleCorrection(item)}
                className="accent-yellow-400 w-4 h-4"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <FormField label="New / Corrected Details *" id="corr-details">
          <StyledTextarea
            id="corr-details"
            placeholder="Describe the corrections needed clearly"
            required
          />
        </FormField>
      </div>
      <FieldRow>
        <FormField label="Mobile Number *" id="corr-mobile">
          <StyledInput
            id="corr-mobile"
            type="tel"
            placeholder="10-digit mobile"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </FormField>
        <FormField label="Email Address *" id="corr-email">
          <StyledInput
            id="corr-email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </FormField>
      </FieldRow>
      <SubmitButton
        label="Proceed to NSDL Correction Portal"
        externalUrl="https://www.onlineservices.nsdl.com"
        note="Correction requests are processed on the official NSDL e-Gov portal. Upload supporting documents there."
      />
    </form>
  );
}

function FormReprint() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.open("https://www.onlineservices.nsdl.com", "_blank");
      }}
    >
      <FormHeading
        title="Reprint PAN Card"
        fee="₹50 (Indian) / ₹959 (Foreign)"
        external="nsdl"
      />
      <FieldRow>
        <FormField label="PAN Number *" id="rep-pan">
          <StyledInput
            id="rep-pan"
            placeholder="e.g. ABCDE1234F"
            maxLength={10}
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            required
          />
        </FormField>
        <FormField label="Name as per PAN *" id="rep-name">
          <StyledInput
            id="rep-name"
            placeholder="Name on your PAN card"
            required
          />
        </FormField>
      </FieldRow>
      <FieldRow>
        <FormField label="Date of Birth *" id="rep-dob">
          <StyledInput id="rep-dob" type="date" required />
        </FormField>
        <FormField label="Mobile Number *" id="rep-mobile">
          <StyledInput
            id="rep-mobile"
            type="tel"
            placeholder="10-digit mobile"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </FormField>
      </FieldRow>
      <SubmitButton
        label="Proceed to NSDL Reprint Portal"
        externalUrl="https://www.onlineservices.nsdl.com"
        note="Physical card dispatch: 15–20 working days. Reprint fee: ₹50 (Indian address) / ₹959 (foreign address)."
      />
    </form>
  );
}

function FormKnowPan() {
  const [searched, setSearched] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSearched(true);
      }}
    >
      <FormHeading title="Know Your PAN" fee="Free" />
      <FieldRow>
        <FormField label="Full Name *" id="kyp-name">
          <StyledInput
            id="kyp-name"
            placeholder="Name as per Income Tax records"
            required
          />
        </FormField>
        <FormField label="Date of Birth *" id="kyp-dob">
          <StyledInput id="kyp-dob" type="date" required />
        </FormField>
      </FieldRow>
      <FieldRow>
        <FormField label="Mobile Number *" id="kyp-mobile">
          <StyledInput
            id="kyp-mobile"
            type="tel"
            placeholder="Registered mobile number"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </FormField>
      </FieldRow>
      <div className="mt-4">
        <Button
          type="submit"
          data-ocid="pan.know_pan.submit_button"
          className="font-semibold"
          style={{
            background: "oklch(0.78 0.18 65)",
            color: "oklch(0.12 0.03 250)",
          }}
        >
          <Search size={14} className="mr-2" /> Search PAN
        </Button>
      </div>
      {searched && (
        <div
          className="mt-4 rounded-lg p-4 flex items-center gap-3 animate-scale-in"
          style={{
            background: "oklch(0.18 0.06 250)",
            border: "1px solid oklch(0.28 0.08 250)",
          }}
          data-ocid="pan.know_pan.success_state"
        >
          <AlertCircle size={18} style={{ color: "oklch(0.78 0.18 65)" }} />
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "oklch(0.88 0.02 240)" }}
            >
              Results will appear here
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "oklch(0.6 0.04 240)" }}
            >
              This feature connects to the official Income Tax portal. For live
              results, visit{" "}
              <a
                href="https://www.incometax.gov.in/iec/foportal/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "oklch(0.72 0.18 200)" }}
              >
                incometax.gov.in
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </form>
  );
}

function FormTrack() {
  const [appType, setAppType] = useState("");
  const [tracked, setTracked] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTracked(true);
      }}
    >
      <FormHeading title="Track Application Status" fee="Free" />
      <FieldRow>
        <FormField label="Acknowledgment Number *" id="track-ack">
          <StyledInput
            id="track-ack"
            placeholder="15-digit acknowledgment number"
            pattern="[0-9]{15}"
            maxLength={15}
            required
          />
        </FormField>
        <FormField label="Application Type *" id="track-type">
          <StyledSelect
            id="track-type"
            placeholder="Select type"
            options={[
              "New PAN — Indian Citizen (Form 49A)",
              "New PAN — Foreign Citizen (Form 49AA)",
              "PAN Correction / Update",
              "Reprint PAN Card",
            ]}
            value={appType}
            onChange={setAppType}
          />
        </FormField>
      </FieldRow>
      <div className="mt-4">
        <Button
          type="submit"
          data-ocid="pan.track.submit_button"
          className="font-semibold"
          style={{
            background: "oklch(0.78 0.18 65)",
            color: "oklch(0.12 0.03 250)",
          }}
        >
          <FileSearch size={14} className="mr-2" /> Track Status
        </Button>
      </div>
      {tracked && (
        <div
          className="mt-4 rounded-lg p-4 animate-scale-in"
          style={{
            background: "oklch(0.18 0.06 250)",
            border: "1px solid oklch(0.28 0.08 250)",
          }}
          data-ocid="pan.track.success_state"
        >
          <p
            className="text-sm font-medium"
            style={{ color: "oklch(0.88 0.02 240)" }}
          >
            Tracking results will appear here
          </p>
          <p className="text-xs mt-1" style={{ color: "oklch(0.6 0.04 240)" }}>
            For live status, track directly on{" "}
            <a
              href="https://www.onlineservices.nsdl.com/paam/requestAndDownloadEPAN.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "oklch(0.72 0.18 200)" }}
            >
              NSDL portal
            </a>{" "}
            or{" "}
            <a
              href="https://www.utiitsl.com/UTIITSL_SITE/pan/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "oklch(0.72 0.18 200)" }}
            >
              UTIITSL portal
            </a>
            .
          </p>
        </div>
      )}
    </form>
  );
}

function FormLinkAadhaar() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.open("https://www.incometax.gov.in/iec/foportal/", "_blank");
      }}
    >
      <FormHeading
        title="Link PAN with Aadhaar"
        fee="₹1,000 (Late fee applicable)"
        external="incometax"
      />
      <div
        className="mb-4 flex items-start gap-2 p-3 rounded-lg"
        style={{
          background: "oklch(0.20 0.08 65 / 0.2)",
          border: "1px solid oklch(0.78 0.18 65 / 0.3)",
        }}
      >
        <AlertCircle
          size={16}
          className="flex-shrink-0 mt-0.5"
          style={{ color: "oklch(0.78 0.18 65)" }}
        />
        <p className="text-xs" style={{ color: "oklch(0.80 0.04 240)" }}>
          <strong>Important:</strong> The deadline for free PAN-Aadhaar linking
          has passed. A late fee of ₹1,000 is applicable. Unlinked PANs have
          been rendered inoperative.
        </p>
      </div>
      <FieldRow>
        <FormField label="PAN Number *" id="link-pan">
          <StyledInput
            id="link-pan"
            placeholder="e.g. ABCDE1234F"
            maxLength={10}
            required
          />
        </FormField>
        <FormField label="Aadhaar Number *" id="link-aadhaar">
          <StyledInput
            id="link-aadhaar"
            placeholder="12-digit Aadhaar number"
            pattern="[0-9]{12}"
            maxLength={12}
            required
          />
        </FormField>
      </FieldRow>
      <FieldRow>
        <FormField label="Name as per Aadhaar *" id="link-name">
          <StyledInput
            id="link-name"
            placeholder="Exact name on Aadhaar card"
            required
          />
        </FormField>
        <FormField label="Mobile Number *" id="link-mobile">
          <StyledInput
            id="link-mobile"
            type="tel"
            placeholder="Aadhaar-linked mobile"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </FormField>
      </FieldRow>
      <SubmitButton
        label="Proceed to Income Tax Portal"
        externalUrl="https://www.incometax.gov.in/iec/foportal/"
        note="You will be redirected to incometax.gov.in — the official portal for PAN-Aadhaar linking."
      />
    </form>
  );
}

function FormEPan() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.open(
          "https://www.onlineservices.nsdl.com/paam/requestAndDownloadEPAN.html",
          "_blank",
        );
      }}
    >
      <FormHeading
        title="Download e-PAN"
        fee="Free (within 30 days of allotment)"
        external="nsdl"
      />
      <FieldRow>
        <FormField label="PAN Number *" id="epan-pan">
          <StyledInput
            id="epan-pan"
            placeholder="e.g. ABCDE1234F"
            maxLength={10}
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            required
          />
        </FormField>
        <FormField label="Aadhaar Number *" id="epan-aadhaar">
          <StyledInput
            id="epan-aadhaar"
            placeholder="12-digit Aadhaar number"
            pattern="[0-9]{12}"
            maxLength={12}
            required
          />
        </FormField>
      </FieldRow>
      <FieldRow>
        <FormField label="Date of Birth *" id="epan-dob">
          <StyledInput id="epan-dob" type="date" required />
        </FormField>
      </FieldRow>
      <SubmitButton
        label="Proceed to NSDL e-PAN Download"
        externalUrl="https://www.onlineservices.nsdl.com/paam/requestAndDownloadEPAN.html"
        note="e-PAN is free to download within 30 days of PAN allotment. Post that, a nominal fee applies."
      />
    </form>
  );
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={faq.q}
          className="rounded-xl overflow-hidden transition-all duration-300"
          style={{
            border:
              open === i
                ? "1px solid oklch(0.78 0.18 65 / 0.4)"
                : "1px solid oklch(0.25 0.06 250)",
            background:
              open === i ? "oklch(0.17 0.05 250)" : "oklch(0.15 0.04 250)",
          }}
          data-ocid={`pan.faq.item.${i + 1}`}
        >
          <button
            type="button"
            className="w-full flex items-center justify-between gap-3 p-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
            data-ocid={`pan.faq.toggle.${i + 1}`}
          >
            <span
              className="font-medium text-sm"
              style={{ color: "oklch(0.90 0.02 240)" }}
            >
              {faq.q}
            </span>
            <span style={{ color: "oklch(0.78 0.18 65)", flexShrink: 0 }}>
              {open === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>
          {open === i && (
            <div
              className="px-4 pb-4 text-sm leading-relaxed animate-slide-down"
              style={{ color: "oklch(0.70 0.04 240)" }}
            >
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
