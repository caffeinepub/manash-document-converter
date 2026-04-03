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

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: "oklch(0.17 0.03 250)",
        borderColor: "oklch(0.28 0.06 250)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-amber-400">{icon}</span>
        <h2
          className="text-base font-bold"
          style={{ color: "oklch(0.85 0.15 75)" }}
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
      let guide = { ...formGuidelines[id] };
      try {
        const custom = JSON.parse(
          localStorage.getItem("customFormGuidelines") || "{}",
        );
        if (custom[id]) guide = { ...guide, ...custom[id] };
      } catch {}
      setGuide(guide);
    }
  }, []);

  if (notFound) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.12 0.03 250)" }}
      >
        <div className="text-center">
          <FileText className="mx-auto mb-4 text-gray-500" size={48} />
          <h1 className="text-xl font-bold text-white mb-2">Form Not Found</h1>
          <p className="text-blue-200/70 text-sm mb-4">
            No guidelines found for this form.
          </p>
          <button
            type="button"
            onClick={() => window.close()}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: "oklch(0.45 0.15 250)" }}
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
      style={{ background: "oklch(0.12 0.03 250)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          background: "oklch(0.14 0.04 250)",
          borderColor: "oklch(0.25 0.06 250)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={20} className="text-amber-400 shrink-0" />
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "oklch(0.85 0.15 75)" }}
            >
              Form Guide
            </span>
          </div>
          <button
            type="button"
            onClick={() => window.close()}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-colors hover:opacity-80"
            style={{
              background: "oklch(0.22 0.04 250)",
              color: "oklch(0.75 0.08 240)",
            }}
          >
            <X size={13} />
            Close Tab
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Title section */}
        <div
          className="rounded-xl border p-6"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.15 0.05 250) 0%, oklch(0.18 0.07 265) 100%)",
            borderColor: "oklch(0.3 0.08 260)",
          }}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full border"
              style={{
                background: "oklch(0.55 0.12 80 / 0.2)",
                borderColor: "oklch(0.55 0.12 80 / 0.4)",
                color: "oklch(0.82 0.12 75)",
              }}
            >
              {guide.category}
            </span>
          </div>
          <h1
            className="text-xl md:text-2xl font-bold leading-snug mb-2"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.85 0.15 80), oklch(0.75 0.18 65))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {guide.title}
          </h1>
          <p className="text-blue-200/80 text-sm leading-relaxed">
            Use this guide to understand how to fill and submit this form
            correctly.
          </p>
        </div>

        {/* What is this form */}
        <SectionCard icon={<HelpCircle size={18} />} title="What is this Form?">
          <p className="text-blue-100/80 text-sm leading-relaxed">
            {guide.whatIsThisForm}
          </p>
        </SectionCard>

        {/* Who can apply */}
        <SectionCard icon={<User size={18} />} title="Who Can Apply?">
          <p className="text-blue-100/80 text-sm leading-relaxed">
            {guide.whoCanApply}
          </p>
        </SectionCard>

        {/* Documents required */}
        <SectionCard icon={<FileText size={18} />} title="Documents Required">
          <ul className="space-y-2">
            {guide.documentsRequired.map((doc) => (
              <li key={doc} className="flex items-start gap-2 text-sm">
                <CheckCircle
                  size={15}
                  className="shrink-0 mt-0.5"
                  style={{ color: "oklch(0.65 0.18 145)" }}
                />
                <span className="text-blue-100/80">{doc}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Step by step */}
        <SectionCard
          icon={<ChevronRight size={18} />}
          title="Step-by-Step Guide"
        >
          <ol className="space-y-3">
            {guide.stepByStep.map((step, i) => (
              <li key={step.slice(0, 30)} className="flex items-start gap-3">
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.15 65), oklch(0.62 0.18 55))",
                    color: "oklch(0.12 0.03 250)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-blue-100/80 text-sm leading-relaxed pt-0.5">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </SectionCard>

        {/* Where to submit */}
        <SectionCard icon={<MapPin size={18} />} title="Where to Submit">
          <p className="text-blue-100/80 text-sm leading-relaxed">
            {guide.whereToSubmit}
          </p>
        </SectionCard>

        {/* Fee */}
        <SectionCard icon={<DollarSign size={18} />} title="Fee Details">
          <div
            className="flex items-center gap-3 rounded-lg px-4 py-3"
            style={{ background: "oklch(0.22 0.05 250)" }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: "oklch(0.72 0.18 145)" }}
            >
              {guide.fee.startsWith("Free") ? "Free" : guide.fee.split(" ")[0]}
            </span>
            {!guide.fee.startsWith("Free") && (
              <span className="text-blue-200/70 text-sm">{guide.fee}</span>
            )}
            {guide.fee.startsWith("Free") && (
              <span className="text-blue-200/70 text-sm">{guide.fee}</span>
            )}
          </div>
        </SectionCard>

        {/* Official link */}
        <div
          className="rounded-xl border p-5"
          style={{
            background: "oklch(0.17 0.03 250)",
            borderColor: "oklch(0.28 0.06 250)",
          }}
        >
          <h2
            className="text-base font-bold mb-3"
            style={{ color: "oklch(0.85 0.15 75)" }}
          >
            Official Portal
          </h2>
          <a
            href={guide.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-80"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.50 0.20 255), oklch(0.40 0.22 265))",
            }}
          >
            <ExternalLink size={14} />
            Visit Official Website
          </a>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-blue-200/50 pb-4">
          Information provided is for guidance only. Always verify with the
          official government portal for the latest requirements.
        </p>
      </main>
    </div>
  );
}
