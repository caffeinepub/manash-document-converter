import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Award, Download, ImageIcon, Printer, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Print Styles ─────────────────────────────────────────────────────────────
const PRINT_STYLE = `
@media print {
  body > * { display: none !important; }
  #printable-area { display: block !important; position: fixed; top: 0; left: 0; width: 100%; }
  .no-print { display: none !important; }
}
`;

// ─── Border Styles ────────────────────────────────────────────────────────────
type BorderStyle = "gold" | "blue" | "green" | "red";

const BORDERS: Record<
  BorderStyle,
  { label: string; outer: string; inner: string; accent: string; text: string }
> = {
  gold: {
    label: "Classic Gold",
    outer: "#b8860b",
    inner: "#daa520",
    accent: "#ffd700",
    text: "#4a3000",
  },
  blue: {
    label: "Blue Formal",
    outer: "#003580",
    inner: "#1565c0",
    accent: "#42a5f5",
    text: "#001a40",
  },
  green: {
    label: "Green Nature",
    outer: "#1b5e20",
    inner: "#2e7d32",
    accent: "#81c784",
    text: "#0a2e0e",
  },
  red: {
    label: "Red Royal",
    outer: "#7f0000",
    inner: "#c62828",
    accent: "#ef9a9a",
    text: "#3e0000",
  },
};

// ─── Certificate Preview ──────────────────────────────────────────────────────
function CertificatePreview({
  name,
  achievement,
  issuedBy,
  date,
  subtitle,
  border,
}: {
  name: string;
  achievement: string;
  issuedBy: string;
  date: string;
  subtitle: string;
  border: BorderStyle;
}) {
  const b = BORDERS[border];
  return (
    <div
      id="certificate-preview"
      style={{
        width: "794px",
        minHeight: "562px",
        background: "#fffdf5",
        border: `12px solid ${b.outer}`,
        boxShadow: `0 0 0 4px ${b.accent}, 0 0 0 8px ${b.inner}, inset 0 0 0 4px ${b.accent}`,
        padding: "48px 56px",
        fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
        textAlign: "center",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Corner ornaments */}
      {[
        "top-3 left-3",
        "top-3 right-3",
        "bottom-3 left-3",
        "bottom-3 right-3",
      ].map((pos) => (
        <div
          key={pos}
          className={`absolute ${pos} w-8 h-8`}
          style={{ color: b.outer, fontSize: "24px", lineHeight: 1 }}
        >
          ✦
        </div>
      ))}

      {/* Header flourish */}
      <div
        style={{
          color: b.inner,
          fontSize: "28px",
          letterSpacing: "12px",
          marginBottom: "4px",
        }}
      >
        ✦ ✦ ✦
      </div>

      {/* Logo / seal placeholder */}
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          border: `3px solid ${b.outer}`,
          background: `linear-gradient(135deg, ${b.inner}22, ${b.accent}44)`,
          margin: "0 auto 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
        }}
      >
        🏆
      </div>

      {/* Organization */}
      <p
        style={{
          fontSize: "13px",
          letterSpacing: "4px",
          color: b.inner,
          textTransform: "uppercase",
          marginBottom: "8px",
          fontWeight: 600,
        }}
      >
        {issuedBy || "Organization Name"}
      </p>

      {/* Title */}
      <h1
        style={{
          fontSize: "36px",
          fontWeight: 800,
          color: b.text,
          letterSpacing: "3px",
          margin: "0 0 4px",
          lineHeight: 1.2,
        }}
      >
        Certificate
      </h1>
      <div
        style={{
          fontSize: "13px",
          letterSpacing: "6px",
          color: b.inner,
          textTransform: "uppercase",
          marginBottom: "24px",
        }}
      >
        of {subtitle || "Achievement"}
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "12px",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
        }}
      >
        This certificate is proudly presented to
      </div>

      {/* Name */}
      <div
        style={{
          fontSize: "44px",
          fontWeight: 700,
          color: b.text,
          borderBottom: `2px solid ${b.accent}`,
          borderTop: `2px solid ${b.accent}`,
          padding: "8px 32px",
          margin: "0 auto 20px",
          display: "inline-block",
          letterSpacing: "2px",
        }}
      >
        {name || "Recipient Name"}
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#555",
          marginBottom: "12px",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          maxWidth: "520px",
          margin: "0 auto 24px",
        }}
      >
        for successfully completing and demonstrating excellence in
      </div>

      {/* Achievement */}
      <div
        style={{
          fontSize: "22px",
          fontWeight: 600,
          color: b.inner,
          marginBottom: "32px",
          letterSpacing: "1px",
        }}
      >
        {achievement || "Achievement / Course Title"}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "auto",
          borderTop: `1px solid ${b.accent}`,
          paddingTop: "20px",
        }}
      >
        <div style={{ textAlign: "center", flex: 1 }}>
          <div
            style={{
              borderTop: `2px solid ${b.text}`,
              width: "140px",
              margin: "0 auto 6px",
            }}
          />
          <div
            style={{ fontSize: "12px", color: b.text, letterSpacing: "1px" }}
          >
            Authorized Signature
          </div>
        </div>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              border: `3px double ${b.outer}`,
              margin: "0 auto 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: b.inner,
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            SEAL
          </div>
        </div>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div
            style={{
              borderTop: `2px solid ${b.text}`,
              width: "140px",
              margin: "0 auto 6px",
            }}
          />
          <div
            style={{ fontSize: "12px", color: b.text, letterSpacing: "1px" }}
          >
            {date || "Date"}
          </div>
        </div>
      </div>

      {/* Footer flourish */}
      <div
        style={{
          color: b.inner,
          fontSize: "20px",
          letterSpacing: "8px",
          marginTop: "12px",
        }}
      >
        ✦ ✦ ✦
      </div>
    </div>
  );
}

// ─── Certificate Tab ───────────────────────────────────────────────────────────
function CertificateTab() {
  const [name, setName] = useState("");
  const [achievement, setAchievement] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );
  const [subtitle, setSubtitle] = useState("Achievement");
  const [border, setBorder] = useState<BorderStyle>("gold");
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const el = document.getElementById("certificate-preview");
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Certificate</title>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
      <style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f0f0f0;}@media print{body{background:white;}}</style>
      </head><body>${el.outerHTML}<script>window.onload=()=>{window.print();window.close();}<\/script></body></html>
    `);
    win.document.close();
  };

  const handleDownload = () => {
    const el = document.getElementById("certificate-preview");
    if (!el) return;
    const canvas = document.createElement("canvas");
    const scale = 2;
    canvas.width = 794 * scale;
    canvas.height = 562 * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const b = BORDERS[border];
    ctx.scale(scale, scale);
    // Background
    ctx.fillStyle = "#fffdf5";
    ctx.fillRect(0, 0, 794, 562);
    // Outer border
    ctx.strokeStyle = b.outer;
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, 782, 550);
    ctx.strokeStyle = b.inner;
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 754, 522);
    ctx.strokeStyle = b.accent;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 26, 742, 510);
    // Organization
    ctx.fillStyle = b.inner;
    ctx.font = "bold 13px 'Arial'";
    ctx.textAlign = "center";
    ctx.fillText((issuedBy || "Organization Name").toUpperCase(), 397, 90);
    // Title
    ctx.fillStyle = b.text;
    ctx.font = "bold 38px 'Georgia'";
    ctx.fillText("Certificate", 397, 145);
    ctx.fillStyle = b.inner;
    ctx.font = "13px 'Arial'";
    ctx.fillText(`of ${subtitle || "Achievement"}`.toUpperCase(), 397, 170);
    // Presented to
    ctx.fillStyle = "#666";
    ctx.font = "italic 14px 'Georgia'";
    ctx.fillText("This certificate is proudly presented to", 397, 205);
    // Name
    ctx.fillStyle = b.text;
    ctx.font = "bold 40px 'Georgia'";
    ctx.fillText(name || "Recipient Name", 397, 265);
    // Line under name
    ctx.strokeStyle = b.accent;
    ctx.lineWidth = 2;
    const nameWidth = Math.min(
      ctx.measureText(name || "Recipient Name").width + 60,
      500,
    );
    ctx.beginPath();
    ctx.moveTo(397 - nameWidth / 2, 278);
    ctx.lineTo(397 + nameWidth / 2, 278);
    ctx.stroke();
    // For achievement
    ctx.fillStyle = "#555";
    ctx.font = "italic 13px 'Georgia'";
    ctx.fillText(
      "for successfully completing and demonstrating excellence in",
      397,
      308,
    );
    // Achievement
    ctx.fillStyle = b.inner;
    ctx.font = "bold 20px 'Georgia'";
    ctx.fillText(achievement || "Achievement / Course Title", 397, 345);
    // Signature lines
    ctx.strokeStyle = b.text;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(160, 480);
    ctx.lineTo(300, 480);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(494, 480);
    ctx.lineTo(634, 480);
    ctx.stroke();
    ctx.fillStyle = b.text;
    ctx.font = "11px 'Arial'";
    ctx.fillText("Authorized Signature", 230, 496);
    ctx.fillText(date || "Date", 564, 496);
    // Seal
    ctx.strokeStyle = b.outer;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(397, 470, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = b.inner;
    ctx.font = "bold 9px 'Arial'";
    ctx.fillText("SEAL", 397, 474);
    // Download
    const link = document.createElement("a");
    link.download = `certificate-${name || "recipient"}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Form */}
      <div className="space-y-4 no-print">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <Award size={20} className="text-yellow-600" /> Certificate Details
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cert-name">Recipient Name</Label>
              <Input
                id="cert-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="mt-1"
                data-ocid="certificate.input"
              />
            </div>
            <div>
              <Label htmlFor="cert-achievement">
                Achievement / Course Title
              </Label>
              <Input
                id="cert-achievement"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder="e.g. Computer Fundamentals"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cert-issued">Issued By (Organization)</Label>
              <Input
                id="cert-issued"
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
                placeholder="e.g. NextGen IT Hub"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cert-subtitle">Subtitle</Label>
                <Input
                  id="cert-subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Achievement"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cert-date">Date</Label>
                <Input
                  id="cert-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Border selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3">Border Style</h3>
          <div className="grid grid-cols-2 gap-3">
            {(
              Object.entries(BORDERS) as [
                BorderStyle,
                (typeof BORDERS)[BorderStyle],
              ][]
            ).map(([key, val]) => (
              <button
                key={key}
                type="button"
                data-ocid={`certificate.${key}.toggle`}
                onClick={() => setBorder(key)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  border === key
                    ? "ring-2 ring-offset-1"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  borderColor: val.outer,
                  background: border === key ? `${val.accent}33` : undefined,
                  color: val.text,
                }}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handlePrint}
            className="flex-1 bg-blue-700 hover:bg-blue-800"
            data-ocid="certificate.print.button"
          >
            <Printer size={16} className="mr-2" /> Print Certificate
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1"
            data-ocid="certificate.download.button"
          >
            <Download size={16} className="mr-2" /> Download PNG
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="no-print">
        <h3 className="font-semibold text-gray-700 mb-3">Live Preview</h3>
        <div
          ref={previewRef}
          className="overflow-auto border rounded-xl shadow-md bg-gray-100 p-4"
          style={{ maxWidth: "100%" }}
        >
          <div
            style={{
              transform: "scale(0.55)",
              transformOrigin: "top left",
              width: "794px",
              pointerEvents: "none",
            }}
          >
            <CertificatePreview
              name={name}
              achievement={achievement}
              issuedBy={issuedBy}
              date={date}
              subtitle={subtitle}
              border={border}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Album Sheet Tab ───────────────────────────────────────────────────────────
type LayoutKey = "2x2" | "2x3" | "3x3";

const LAYOUTS: Record<
  LayoutKey,
  { cols: number; rows: number; label: string }
> = {
  "2x2": { cols: 2, rows: 2, label: "2×2 (4 photos)" },
  "2x3": { cols: 2, rows: 3, label: "2×3 (6 photos)" },
  "3x3": { cols: 3, rows: 3, label: "3×3 (9 photos)" },
};

interface PhotoSlot {
  id: number;
  url: string | null;
  caption: string;
}

function AlbumTab() {
  const [layout, setLayout] = useState<LayoutKey>("2x2");
  const [title, setTitle] = useState("");
  const [slots, setSlots] = useState<PhotoSlot[]>(
    Array(9)
      .fill(null)
      .map((_, i) => ({ id: i, url: null, caption: "" })),
  );
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const totalSlots = LAYOUTS[layout].cols * LAYOUTS[layout].rows;
  const activeSlots = slots.slice(0, totalSlots);

  const handleImageUpload = (idx: number, file: File) => {
    const url = URL.createObjectURL(file);
    setSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, url } : s)));
  };

  const handleCaption = (idx: number, caption: string) => {
    setSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, caption } : s)));
  };

  const handlePrint = () => {
    const el = document.getElementById("album-preview");
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    const images = el.querySelectorAll("img");
    const promises = Array.from(images).map(
      (img) =>
        new Promise<void>((res) => {
          if (img.complete) res();
          else {
            img.onload = () => res();
            img.onerror = () => res();
          }
        }),
    );
    Promise.all(promises).then(() => {
      win.document.write(`
        <html><head><title>Album Sheet</title>
        <style>body{margin:16px;font-family:sans-serif;}@media print{body{margin:0;}}</style>
        </head><body>${el.outerHTML}<script>window.onload=()=>{window.print();window.close();}<\/script></body></html>
      `);
      win.document.close();
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm no-print">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1">
            <Label htmlFor="album-title">Album Sheet Title</Label>
            <Input
              id="album-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Graduation Day 2026"
              className="mt-1"
              data-ocid="album.input"
            />
          </div>
          <div>
            <Label className="mb-1 block">Layout</Label>
            <div className="flex gap-2">
              {(
                Object.entries(LAYOUTS) as [
                  LayoutKey,
                  (typeof LAYOUTS)[LayoutKey],
                ][]
              ).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  data-ocid={`album.${k}.toggle`}
                  onClick={() => setLayout(k)}
                  className={`px-3 py-2 rounded-lg text-sm border-2 font-medium transition-all ${
                    layout === k
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div id="album-preview">
          {title && (
            <h2
              style={{
                textAlign: "center",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "28px",
                fontWeight: 700,
                color: "#1a1a2e",
                marginBottom: "20px",
                letterSpacing: "1px",
                borderBottom: "2px solid #daa520",
                paddingBottom: "12px",
              }}
            >
              {title}
            </h2>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${LAYOUTS[layout].cols}, 1fr)`,
              gap: "12px",
            }}
          >
            {activeSlots.map((slot, idx) => (
              <div
                key={slot.id}
                className="flex flex-col gap-1"
                data-ocid={`album.item.${idx + 1}`}
              >
                {/* Photo slot */}
                <button
                  type="button"
                  className="relative overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-50 cursor-pointer group w-full"
                  style={{ aspectRatio: "4/3" }}
                  onClick={() => fileRefs.current[idx]?.click()}
                >
                  {slot.url ? (
                    <img
                      src={slot.url}
                      alt={slot.caption || `Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="text-sm font-medium">
                        Click to upload
                      </span>
                    </div>
                  )}
                  {slot.url && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload size={24} className="text-white" />
                    </div>
                  )}
                  <input
                    ref={(el) => {
                      fileRefs.current[idx] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    data-ocid="album.upload_button"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(idx, f);
                    }}
                  />
                </button>
                {/* Caption */}
                <input
                  type="text"
                  value={slot.caption}
                  onChange={(e) => handleCaption(idx, e.target.value)}
                  placeholder="Caption (optional)"
                  className="text-xs text-center border border-gray-200 rounded px-2 py-1 text-gray-600 focus:outline-none focus:border-blue-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Print button */}
        <div className="mt-6 flex justify-center no-print">
          <Button
            onClick={handlePrint}
            className="bg-blue-700 hover:bg-blue-800 px-8"
            data-ocid="album.print.button"
          >
            <Printer size={16} className="mr-2" /> Print Album Sheet
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function CertificateAlbumPage() {
  // Inject print styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = PRINT_STYLE;
    style.id = "cert-album-print-styles";
    document.head.appendChild(style);
    return () => {
      document.getElementById("cert-album-print-styles")?.remove();
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#0B2A4A] text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Award size={32} className="text-yellow-400" />
            <h1 className="text-3xl font-bold tracking-wide">
              Certificate & Album Sheet
            </h1>
          </div>
          <p className="text-blue-200 text-sm">
            Create and print professional certificates and photo album sheets
            instantly
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Tabs defaultValue="certificate">
          <TabsList className="mb-6 no-print">
            <TabsTrigger value="certificate" data-ocid="certificate.tab">
              🏆 Certificate
            </TabsTrigger>
            <TabsTrigger value="album" data-ocid="album.tab">
              📷 Album Sheet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certificate">
            <CertificateTab />
          </TabsContent>

          <TabsContent value="album">
            <AlbumTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-6 no-print">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          caffeine.ai
        </a>
      </footer>
    </main>
  );
}
