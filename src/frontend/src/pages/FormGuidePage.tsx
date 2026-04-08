import {
  CheckCircle,
  ChevronRight,
  DollarSign,
  ExternalLink,
  FileText,
  HelpCircle,
  MapPin,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { type FormGuideline, formGuidelines } from "../data/formGuidelines";

// iOS Pink+Sky design tokens
const pinkGrad = "linear-gradient(135deg, #FFB6D9 0%, #ff8fc6 100%)";
const skyGrad = "linear-gradient(135deg, #B4E7FF 0%, #7dd3fc 100%)";
const glassBg = "rgba(255,255,255,0.90)";
const glassBorder = "1px solid rgba(255,182,217,0.28)";

function SectionCard({
  icon,
  title,
  children,
  accent = "pink",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: "pink" | "sky";
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: glassBg,
        border: glassBorder,
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 12px rgba(255,182,217,0.08)",
      }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: accent === "sky" ? skyGrad : pinkGrad,
          }}
        >
          <span className="text-white scale-75">{icon}</span>
        </span>
        <h2
          className="text-sm font-bold"
          style={{
            background:
              accent === "sky"
                ? "linear-gradient(135deg, #0369a1, #0891b2)"
                : "linear-gradient(135deg, #be185d, #db2777)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

export function FormGuidePage() {
  const [guide, setGuide] = useState<FormGuideline | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id || !formGuidelines[id]) {
      setNotFound(true);
    } else {
      let guideData = { ...formGuidelines[id] };
      try {
        const custom = JSON.parse(
          localStorage.getItem("customFormGuidelines") || "{}",
        );
        if (custom[id]) guideData = { ...guideData, ...custom[id] };
      } catch {
        /* ignore */
      }
      setGuide(guideData);
    }
  }, []);

  if (notFound) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: "linear-gradient(160deg, #fff5fb 0%, #f0f9ff 100%)",
        }}
      >
        <div
          className="text-center rounded-2xl p-8 max-w-sm w-full"
          style={{
            background: glassBg,
            border: glassBorder,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(255,182,217,0.15)" }}
          >
            <FileText size={28} style={{ color: "#FFB6D9" }} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Form Not Found
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            No guidelines found for this form.
          </p>
          <button
            type="button"
            onClick={() => window.close()}
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all active:scale-95"
            style={{ background: pinkGrad }}
          >
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  if (!guide) return null;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #fff5fb 0%, #f0f9ff 100%)",
      }}
    >
      {/* iOS-style sticky header */}
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          background: "rgba(255,255,255,0.92)",
          borderColor: "rgba(255,182,217,0.2)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: pinkGrad }}
            >
              <FileText size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 truncate">
              Form Guide
            </span>
          </div>
          <button
            type="button"
            onClick={() => window.close()}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 transition-all active:scale-95"
            style={{
              background: "rgba(255,182,217,0.12)",
              border: "1px solid rgba(255,182,217,0.3)",
              color: "#be185d",
            }}
          >
            <X size={13} />
            Close Tab
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {/* Hero title card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, #FFB6D9 0%, #B4E7FF 100%)",
            boxShadow: "0 8px 32px rgba(255,182,217,0.3)",
          }}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.35)",
                color: "white",
                backdropFilter: "blur(4px)",
              }}
            >
              {guide.category}
            </span>
          </div>
          <h1
            className="text-xl md:text-2xl font-bold leading-snug mb-2 text-white"
            style={{ textShadow: "0 1px 8px rgba(190,24,93,0.2)" }}
          >
            {guide.title}
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">
            Use this guide to understand how to fill and submit this form
            correctly.
          </p>
        </div>

        {/* What is this form */}
        <SectionCard
          icon={<HelpCircle size={16} />}
          title="What is this Form?"
          accent="pink"
        >
          <p className="text-gray-600 text-sm leading-relaxed">
            {guide.whatIsThisForm}
          </p>
        </SectionCard>

        {/* Who can apply */}
        <SectionCard
          icon={<User size={16} />}
          title="Who Can Apply?"
          accent="sky"
        >
          <p className="text-gray-600 text-sm leading-relaxed">
            {guide.whoCanApply}
          </p>
        </SectionCard>

        {/* Documents required */}
        <SectionCard
          icon={<FileText size={16} />}
          title="Documents Required"
          accent="pink"
        >
          <ul className="space-y-2">
            {guide.documentsRequired.map((doc) => (
              <li key={doc} className="flex items-start gap-2.5 text-sm">
                <CheckCircle
                  size={15}
                  className="shrink-0 mt-0.5"
                  style={{ color: "#22c55e" }}
                />
                <span className="text-gray-600">{doc}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Step by step */}
        <SectionCard
          icon={<ChevronRight size={16} />}
          title="Step-by-Step Guide"
          accent="sky"
        >
          <ol className="space-y-3">
            {guide.stepByStep.map((step, i) => (
              <li key={step.slice(0, 30)} className="flex items-start gap-3">
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: pinkGrad }}
                >
                  {i + 1}
                </span>
                <span className="text-gray-600 text-sm leading-relaxed pt-0.5">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </SectionCard>

        {/* Where to submit */}
        <SectionCard
          icon={<MapPin size={16} />}
          title="Where to Submit"
          accent="pink"
        >
          <p className="text-gray-600 text-sm leading-relaxed">
            {guide.whereToSubmit}
          </p>
        </SectionCard>

        {/* Fee */}
        <SectionCard
          icon={<DollarSign size={16} />}
          title="Fee Details"
          accent="sky"
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{
              background: "rgba(180,231,255,0.15)",
              border: "1px solid rgba(180,231,255,0.3)",
            }}
          >
            <span className="text-2xl font-bold" style={{ color: "#0369a1" }}>
              {guide.fee.startsWith("Free") ? "Free" : guide.fee.split(" ")[0]}
            </span>
            <span className="text-gray-500 text-sm">{guide.fee}</span>
          </div>
        </SectionCard>

        {/* Official portal */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: glassBg,
            border: glassBorder,
            backdropFilter: "blur(10px)",
          }}
        >
          <h2
            className="text-sm font-bold mb-3"
            style={{
              background: pinkGrad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Official Portal
          </h2>
          <a
            href={guide.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all active:scale-95 shadow-md"
            style={{
              background: "linear-gradient(135deg, #B4E7FF, #7dd3fc)",
              color: "#0c4a6e",
            }}
          >
            <ExternalLink size={14} />
            Visit Official Website
          </a>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Information provided is for guidance only. Always verify with the
          official government portal.
        </p>
      </main>
    </div>
  );
}
