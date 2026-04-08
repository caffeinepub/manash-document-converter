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
      style={{
        background:
          "linear-gradient(160deg, #FFF0F6 0%, #F0F8FF 50%, #FFF0F6 100%)",
      }}
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
              "linear-gradient(135deg, rgba(255,182,217,0.25) 0%, rgba(180,231,255,0.2) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute top-6 left-8 w-48 h-48 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: "#FFB6D9" }}
          />
          <div
            className="absolute bottom-4 right-8 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "#B4E7FF" }}
          />

          <div className="relative max-w-4xl mx-auto">
            {/* Emblem ring */}
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto animate-float"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "2px solid rgba(255,182,217,0.6)",
                boxShadow: "0 8px 32px rgba(255,182,217,0.3)",
                backdropFilter: "blur(10px)",
              }}
              aria-hidden
            >
              <span
                className="text-3xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #be185d, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ☸
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <Badge
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(180,231,255,0.3)",
                  color: "#0369a1",
                  border: "1px solid rgba(180,231,255,0.6)",
                  backdropFilter: "blur(10px)",
                }}
              >
                🇮🇳 Digital India Initiative
              </Badge>
              <Badge
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(255,182,217,0.25)",
                  color: "#be185d",
                  border: "1px solid rgba(255,182,217,0.5)",
                  backdropFilter: "blur(10px)",
                }}
              >
                Income Tax Department
              </Badge>
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{
                background:
                  "linear-gradient(135deg, #be185d, #7c3aed, #0369a1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {panHeroText.title}
            </h1>
            <p className="text-lg mb-2 text-slate-600">
              {panHeroText.subtitle}
            </p>
            <p className="text-sm text-slate-500">
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
                  className="flex items-center gap-2 text-sm px-4 py-2 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,182,217,0.3)",
                    color: "#64748b",
                    backdropFilter: "blur(10px)",
                  }}
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
            style={{
              background: "linear-gradient(135deg, #be185d, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Select a Service
          </h2>
          <p className="text-slate-500">
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
                className={`text-left rounded-3xl p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                  activeService === svc.id ? "scale-[1.02]" : ""
                }`}
                style={{
                  background:
                    activeService === svc.id
                      ? "rgba(255,255,255,0.98)"
                      : "rgba(255,255,255,0.88)",
                  border:
                    activeService === svc.id
                      ? "2px solid rgba(255,182,217,0.7)"
                      : "1.5px solid rgba(255,182,217,0.25)",
                  boxShadow:
                    activeService === svc.id
                      ? "0 8px 32px rgba(255,182,217,0.3)"
                      : "0 2px 12px rgba(255,182,217,0.08)",
                  backdropFilter: "blur(10px)",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background:
                      activeService === svc.id
                        ? "linear-gradient(135deg, #FFB6D9, #B4E7FF)"
                        : "rgba(255,182,217,0.12)",
                    color: activeService === svc.id ? "#7c3aed" : "#be185d",
                  }}
                >
                  {getServiceIcon(svc.id)}
                </div>

                {svc.badge && (
                  <span
                    className="inline-block text-xs px-2.5 py-0.5 rounded-full mb-2"
                    style={{
                      background: "rgba(180,231,255,0.2)",
                      color: "#0369a1",
                      border: "1px solid rgba(180,231,255,0.5)",
                    }}
                  >
                    {svc.badge}
                  </span>
                )}

                <h3 className="font-semibold text-sm mb-1 leading-tight text-slate-800">
                  {svc.title}
                </h3>
                <p className="text-xs mb-3 leading-relaxed text-slate-500">
                  {svc.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, #be185d, #7c3aed)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {svc.fee}
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{
                      color: activeService === svc.id ? "#be185d" : "#94a3b8",
                    }}
                  >
                    {activeService === svc.id ? "Hide form" : "Proceed"}
                    <ArrowRight
                      size={12}
                      className={`transition-transform duration-200 ${activeService === svc.id ? "rotate-90" : ""}`}
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
              className="rounded-3xl p-6 md:p-8"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "1.5px solid rgba(255,182,217,0.4)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 40px rgba(255,182,217,0.2)",
              }}
            >
              {/* Pink-Sky top accent */}
              <div
                className="h-1 w-full rounded-full mb-6"
                style={{
                  background: "linear-gradient(90deg, #FFB6D9, #B4E7FF)",
                }}
              />

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
            style={{
              background: "linear-gradient(135deg, #be185d, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Fee Structure
          </h2>
          <p className="text-slate-500">
            As prescribed by NSDL e-Gov / UTIITSL
          </p>
        </div>

        <div
          className="rounded-3xl overflow-hidden"
          style={{
            border: "1.5px solid rgba(255,182,217,0.3)",
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 4px 20px rgba(255,182,217,0.1)",
          }}
        >
          <Table>
            <TableHeader>
              <TableRow
                style={{
                  background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
                  borderBottom: "none",
                }}
              >
                <TableHead className="text-white font-bold">Service</TableHead>
                <TableHead className="text-white font-bold">
                  Indian Address
                </TableHead>
                <TableHead className="text-white font-bold">
                  Foreign Address
                </TableHead>
                <TableHead className="text-white font-bold">Notes</TableHead>
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
                          ? "rgba(255,255,255,0.8)"
                          : "rgba(255,182,217,0.05)",
                      borderBottom: "1px solid rgba(255,182,217,0.15)",
                    }}
                    data-ocid={`pan.fees.row.${i + 1}`}
                  >
                    <TableCell className="font-medium text-slate-700">
                      {row.service}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-pink-600">
                        {row.indian}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-sky-600">
                        {row.foreign}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
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
            style={{
              background: "linear-gradient(135deg, #0369a1, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Official Government Links
          </h2>
          <p className="text-slate-500">
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
            ) => (
              <a
                key={link.id || link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid={`pan.link.${i + 1}`}
                className="group flex items-start gap-3 rounded-3xl p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  border: "1.5px solid rgba(255,182,217,0.25)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
                  }}
                >
                  <ExternalLink size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm mb-0.5 text-slate-700 group-hover:text-pink-600 transition-colors">
                    {link.title}
                  </div>
                  <div className="text-xs truncate text-slate-400">
                    {link.sub}
                  </div>
                </div>
              </a>
            ),
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
            style={{
              background: "linear-gradient(135deg, #be185d, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <HelpCircle size={22} className="text-pink-400" />
            Frequently Asked Questions
          </h2>
        </div>
        <FaqAccordion faqs={FAQS} />
      </section>

      {/* ── Disclaimer ── */}
      <footer
        className="max-w-7xl mx-auto px-4 py-8 text-center"
        style={{ borderTop: "1px solid rgba(255,182,217,0.2)" }}
      >
        <div className="flex items-start gap-2 justify-center max-w-3xl mx-auto">
          <AlertCircle
            size={16}
            className="flex-shrink-0 mt-0.5 text-pink-400"
          />
          <p className="text-xs text-left text-slate-400">
            <strong className="text-slate-600">Disclaimer:</strong> This portal
            provides guidance and assistance for PAN card services. All actual
            applications are processed exclusively by NSDL e-Gov, UTIITSL, and
            the Income Tax Department, Government of India. Manash PC World 2.0
            is not affiliated with, endorsed by, or representing the Government
            of India or any of its departments. All fees and details are subject
            to change; verify on the official portal before applying.
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
          style={{
            background: "linear-gradient(135deg, #be185d, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </h2>
        <span
          className="text-sm px-3 py-1 rounded-full font-semibold"
          style={{
            background: "rgba(255,182,217,0.15)",
            color: "#be185d",
            border: "1px solid rgba(255,182,217,0.4)",
          }}
        >
          Fee: {fee}
        </span>
      </div>
      {external && (
        <p className="text-xs mt-2 text-slate-500">
          <CheckCircle size={12} className="inline mr-1 text-emerald-500" />
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
      <Label htmlFor={id} className="text-sm mb-1.5 block text-slate-600">
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
      className="w-full rounded-xl h-11"
      style={{
        background: "rgba(255,255,255,0.9)",
        border: "1.5px solid rgba(255,182,217,0.4)",
        color: "#1e293b",
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
      className="w-full rounded-xl"
      style={{
        background: "rgba(255,255,255,0.9)",
        border: "1.5px solid rgba(255,182,217,0.4)",
        color: "#1e293b",
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
        className="rounded-xl h-11"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1.5px solid rgba(255,182,217,0.4)",
          color: value ? "#1e293b" : "#94a3b8",
        }}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        style={{
          background: "rgba(255,255,255,0.98)",
          border: "1px solid rgba(255,182,217,0.3)",
        }}
      >
        {options.map((o) => (
          <SelectItem key={o} value={o} className="text-slate-700">
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
      style={{ borderTop: "1px solid rgba(255,182,217,0.2)" }}
    >
      {note && (
        <p className="text-xs mb-3 flex items-center gap-1.5 text-slate-500">
          <AlertCircle size={12} className="text-pink-400" />
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
            className="w-full md:w-auto font-semibold rounded-2xl transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
              color: "#7c3aed",
              border: "none",
              boxShadow: "0 4px 16px rgba(255,182,217,0.4)",
            }}
          >
            {label} <ExternalLink size={14} className="ml-2" />
          </Button>
        </a>
      ) : (
        <Button
          type="submit"
          className="w-full md:w-auto font-semibold rounded-2xl transition-all hover:scale-105"
          data-ocid="pan.form.submit_button"
          style={{
            background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
            color: "#7c3aed",
            border: "none",
            boxShadow: "0 4px 16px rgba(255,182,217,0.4)",
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
                className="flex items-center gap-1.5 cursor-pointer text-sm text-slate-600"
              >
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={gender === g}
                  onChange={() => setGender(g)}
                  className="accent-pink-400"
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
        <Label className="text-sm mb-2 block text-slate-600">
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
              className="flex items-center gap-2 cursor-pointer text-sm text-slate-600"
            >
              <input
                type="checkbox"
                checked={corrections.includes(item)}
                onChange={() => toggleCorrection(item)}
                className="accent-pink-400 w-4 h-4"
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
          className="font-semibold rounded-2xl transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
            color: "#7c3aed",
            border: "none",
            boxShadow: "0 4px 16px rgba(255,182,217,0.4)",
          }}
        >
          <Search size={14} className="mr-2" /> Search PAN
        </Button>
      </div>
      {searched && (
        <div
          className="mt-4 rounded-2xl p-4 flex items-center gap-3 animate-scale-in"
          style={{
            background: "rgba(180,231,255,0.15)",
            border: "1px solid rgba(180,231,255,0.4)",
          }}
          data-ocid="pan.know_pan.success_state"
        >
          <AlertCircle size={18} className="text-sky-500" />
          <div>
            <p className="text-sm font-medium text-slate-700">
              Results will appear here
            </p>
            <p className="text-xs mt-0.5 text-slate-500">
              This feature connects to the official Income Tax portal. For live
              results, visit{" "}
              <a
                href="https://www.incometax.gov.in/iec/foportal/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-sky-600"
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
          className="font-semibold rounded-2xl transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
            color: "#7c3aed",
            border: "none",
            boxShadow: "0 4px 16px rgba(255,182,217,0.4)",
          }}
        >
          <FileSearch size={14} className="mr-2" /> Track Status
        </Button>
      </div>
      {tracked && (
        <div
          className="mt-4 rounded-2xl p-4 animate-scale-in"
          style={{
            background: "rgba(180,231,255,0.12)",
            border: "1px solid rgba(180,231,255,0.4)",
          }}
          data-ocid="pan.track.success_state"
        >
          <p className="text-sm font-medium text-slate-700">
            Tracking results will appear here
          </p>
          <p className="text-xs mt-1 text-slate-500">
            For live status, track directly on{" "}
            <a
              href="https://www.onlineservices.nsdl.com/paam/requestAndDownloadEPAN.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-sky-600"
            >
              NSDL portal
            </a>{" "}
            or{" "}
            <a
              href="https://www.utiitsl.com/UTIITSL_SITE/pan/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-sky-600"
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
        className="mb-4 flex items-start gap-2 p-3 rounded-2xl"
        style={{
          background: "rgba(255,182,217,0.1)",
          border: "1.5px solid rgba(255,182,217,0.4)",
        }}
      >
        <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-pink-500" />
        <p className="text-xs text-slate-600">
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
          className="rounded-3xl overflow-hidden transition-all duration-300"
          style={{
            border:
              open === i
                ? "1.5px solid rgba(255,182,217,0.6)"
                : "1.5px solid rgba(255,182,217,0.25)",
            background:
              open === i ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.88)",
            backdropFilter: "blur(10px)",
            boxShadow:
              open === i
                ? "0 4px 20px rgba(255,182,217,0.2)"
                : "0 1px 6px rgba(255,182,217,0.06)",
          }}
          data-ocid={`pan.faq.item.${i + 1}`}
        >
          <button
            type="button"
            className="w-full flex items-center justify-between gap-3 p-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
            data-ocid={`pan.faq.toggle.${i + 1}`}
          >
            <span className="font-medium text-sm text-slate-700">{faq.q}</span>
            <span className="text-pink-400 flex-shrink-0">
              {open === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm leading-relaxed text-slate-600 animate-slide-down">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
