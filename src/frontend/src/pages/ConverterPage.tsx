import { Download, FileImage, FileText, Images, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AdBanner from "../components/AdBanner";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";

type ConversionType =
  | "jpg-to-pdf"
  | "png-to-pdf"
  | "pdf-to-jpg"
  | "pdf-to-png"
  | "jpg-to-png"
  | "png-to-jpg";

interface ConversionOption {
  value: ConversionType;
  label: string;
  from: string;
  to: string;
  icon: string;
}

const CONVERSIONS: ConversionOption[] = [
  {
    value: "jpg-to-pdf",
    label: "JPG → PDF",
    from: "JPG",
    to: "PDF",
    icon: "🖼️",
  },
  {
    value: "png-to-pdf",
    label: "PNG → PDF",
    from: "PNG",
    to: "PDF",
    icon: "🖼️",
  },
  {
    value: "pdf-to-jpg",
    label: "PDF → JPG",
    from: "PDF",
    to: "JPG",
    icon: "📄",
  },
  {
    value: "pdf-to-png",
    label: "PDF → PNG",
    from: "PDF",
    to: "PNG",
    icon: "📄",
  },
  {
    value: "jpg-to-png",
    label: "JPG → PNG",
    from: "JPG",
    to: "PNG",
    icon: "🖼️",
  },
  {
    value: "png-to-jpg",
    label: "PNG → JPG",
    from: "PNG",
    to: "JPG",
    icon: "🖼️",
  },
];

function getAcceptedMimes(type: ConversionType): string {
  if (type.startsWith("jpg")) return "image/jpeg,.jpg,.jpeg";
  if (type.startsWith("png")) return "image/png,.png";
  if (type.startsWith("pdf")) return "application/pdf,.pdf";
  return "*";
}

declare global {
  interface Window {
    jspdf: {
      jsPDF: new (
        opts?: object,
      ) => {
        addImage: (
          data: string,
          fmt: string,
          x: number,
          y: number,
          w: number,
          h: number,
        ) => void;
        addPage: (format: number[], orientation: string) => void;
        save: (name: string) => void;
        output: (type: string) => ArrayBuffer;
        internal: {
          pageSize: { getWidth: () => number; getHeight: () => number };
        };
      };
    };
    pdfjsLib: {
      getDocument: (opts: object) => {
        promise: Promise<{
          numPages: number;
          getPage: (n: number) => Promise<{
            getViewport: (opts: { scale: number }) => {
              width: number;
              height: number;
            };
            render: (ctx: object) => { promise: Promise<void> };
          }>;
        }>;
      };
      GlobalWorkerOptions: { workerSrc: string };
    };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
}

async function ensureJsPDF() {
  if (!window.jspdf) {
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    );
  }
}

async function ensurePdfJs() {
  if (!window.pdfjsLib) {
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
    );
    // @ts-expect-error dynamically loaded
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
}

async function convertFile(
  file: File,
  type: ConversionType,
): Promise<{ blob: Blob; filename: string }> {
  const base = file.name.replace(/\.[^.]+$/, "");

  if (type === "jpg-to-pdf" || type === "png-to-pdf") {
    await ensureJsPDF();
    const dataUrl = await fileToDataUrl(file);
    const img = await loadImage(dataUrl);
    const { jsPDF } = window.jspdf;
    const orientation = img.width > img.height ? "l" : "p";
    const doc = new jsPDF({
      orientation,
      unit: "px",
      format: [img.width, img.height],
    });
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    doc.addImage(
      dataUrl,
      type.startsWith("jpg") ? "JPEG" : "PNG",
      0,
      0,
      pw,
      ph,
    );
    const pdfBytes = doc.output("arraybuffer");
    return {
      blob: new Blob([pdfBytes], { type: "application/pdf" }),
      filename: `${base}.pdf`,
    };
  }

  if (type === "pdf-to-jpg" || type === "pdf-to-png") {
    await ensurePdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer })
      .promise;
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    const mimeType = type === "pdf-to-jpg" ? "image/jpeg" : "image/png";
    const ext = type === "pdf-to-jpg" ? "jpg" : "png";
    const blob = await new Promise<Blob>((res) =>
      canvas.toBlob((b) => res(b!), mimeType, 0.92),
    );
    return { blob, filename: `${base}.${ext}` };
  }

  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  if (type === "png-to-jpg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);
  const outputMime = type === "jpg-to-png" ? "image/png" : "image/jpeg";
  const outputExt = type === "jpg-to-png" ? "png" : "jpg";
  const blob = await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b!), outputMime, 0.92),
  );
  return { blob, filename: `${base}.${outputExt}` };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// iOS shared style tokens
const pinkGrad = "linear-gradient(135deg, #FFB6D9 0%, #ff8fc6 100%)";
const glassBg = "rgba(255,255,255,0.85)";
const glassBorder = "1px solid rgba(255,182,217,0.3)";

const MAX_BULK = 50;

interface BulkImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

// ─── Bulk Converter ──────────────────────────────────────────────────────────
function BulkConverter() {
  const [items, setItems] = useState<BulkImageItem[]>([]);
  const [bulkDragging, setBulkDragging] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<BulkImageItem[]>([]);
  const resultUrlRef = useRef<string | null>(null);
  itemsRef.current = items;
  resultUrlRef.current = resultUrl;

  useEffect(() => {
    return () => {
      for (const i of itemsRef.current) URL.revokeObjectURL(i.previewUrl);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(
      (f) =>
        f.type.startsWith("image/jpeg") ||
        f.type.startsWith("image/png") ||
        f.name.match(/\.(jpg|jpeg|png)$/i),
    );
    setItems((prev) => {
      const remaining = MAX_BULK - prev.length;
      if (remaining <= 0) {
        toast.error(`Maximum ${MAX_BULK} images allowed.`);
        return prev;
      }
      const toAdd = arr.slice(0, remaining).map((f) => ({
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
      }));
      if (arr.length > remaining)
        toast.error(
          `Only ${remaining} more images can be added (max ${MAX_BULK}).`,
        );
      return [...prev, ...toAdd];
    });
    setResultUrl(null);
  }, []);

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
    setResultUrl(null);
  };

  const clearAll = () => {
    for (const i of items) URL.revokeObjectURL(i.previewUrl);
    setItems([]);
    setResultUrl(null);
  };

  const handleBulkDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setBulkDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleConvertAll = async () => {
    if (items.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }
    setConverting(true);
    setProgress(0);
    setResultUrl(null);
    try {
      await ensureJsPDF();
      const { jsPDF } = window.jspdf;
      let doc: ReturnType<typeof jsPDF.prototype.constructor> | null = null;

      for (let i = 0; i < items.length; i++) {
        setProgressLabel(`Processing ${i + 1} / ${items.length}...`);
        setProgress(Math.round((i / items.length) * 100));
        const dataUrl = await fileToDataUrl(items[i].file);
        const img = await loadImage(dataUrl);
        const orientation = img.width >= img.height ? "l" : "p";
        const fmt = items[i].file.type === "image/png" ? "PNG" : "JPEG";
        if (i === 0) {
          doc = new jsPDF({
            orientation,
            unit: "px",
            format: [img.width, img.height],
          });
        } else {
          (
            doc as unknown as {
              addPage: (size: number[], orientation: string) => void;
            }
          ).addPage([img.width, img.height], orientation);
        }
        const pw = (
          doc as unknown as {
            internal: {
              pageSize: { getWidth: () => number; getHeight: () => number };
            };
          }
        ).internal.pageSize.getWidth();
        const ph = (
          doc as unknown as {
            internal: {
              pageSize: { getWidth: () => number; getHeight: () => number };
            };
          }
        ).internal.pageSize.getHeight();
        (
          doc as unknown as {
            addImage: (
              url: string,
              fmt: string,
              x: number,
              y: number,
              w: number,
              h: number,
            ) => void;
          }
        ).addImage(dataUrl, fmt, 0, 0, pw, ph);
      }
      setProgress(100);
      setProgressLabel("Generating PDF...");
      const pdfBytes = (
        doc as unknown as { output: (type: string) => ArrayBuffer }
      ).output("arraybuffer");
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      toast.success(
        `PDF created with ${items.length} page${items.length > 1 ? "s" : ""}!`,
      );
    } catch (err) {
      console.error(err);
      toast.error("Conversion failed. Please try again.");
    } finally {
      setConverting(false);
      setProgressLabel("");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="rounded-2xl p-5" style={{ background: pinkGrad }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
            <Images size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">
              Bulk JPG / PNG → PDF
            </h2>
            <p className="text-white/80 text-xs">
              Combine up to 50 images into one PDF file
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className="bg-white/25 rounded-full px-3 py-1">
            <span className="font-bold text-white">{items.length}</span>
            <span className="text-white/80"> / {MAX_BULK} images</span>
          </span>
          <span className="text-white/70 text-xs">
            Images appear in selection order
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className="relative border-2 border-dashed rounded-2xl transition-all"
        style={{
          borderColor: bulkDragging ? "#FFB6D9" : "rgba(255,182,217,0.4)",
          background: bulkDragging
            ? "rgba(255,182,217,0.1)"
            : "rgba(255,255,255,0.6)",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setBulkDragging(true);
        }}
        onDragLeave={() => setBulkDragging(false)}
        onDrop={handleBulkDrop}
        data-ocid="converter.dropzone"
      >
        <input
          ref={bulkInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
          data-ocid="converter.upload_button"
        />
        <button
          type="button"
          className="w-full p-8 text-center cursor-pointer"
          onClick={() => bulkInputRef.current?.click()}
          aria-label="Add images for bulk PDF conversion"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: pinkGrad }}
          >
            <Upload size={24} className="text-white" />
          </div>
          <p className="font-semibold text-gray-700 mb-1">
            Drop images here or tap to browse
          </p>
          <p className="text-xs text-gray-400">
            JPG and PNG files • Up to{" "}
            <span className="font-bold" style={{ color: "#FFB6D9" }}>
              {MAX_BULK} images
            </span>
          </p>
        </button>
      </div>

      {/* Thumbnails grid */}
      {items.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">
              Selected ({items.length}/{MAX_BULK})
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="relative group rounded-2xl overflow-hidden border border-pink-100 bg-gray-50 aspect-square"
                data-ocid={`converter.item.${idx + 1}`}
              >
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute top-1.5 left-1.5 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm"
                  style={{ background: pinkGrad }}
                >
                  {idx + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow"
                  aria-label={`Remove ${item.file.name}`}
                  data-ocid={`converter.delete_button.${idx + 1}`}
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.file.name}
                </div>
              </div>
            ))}
            {items.length < MAX_BULK && (
              <button
                type="button"
                onClick={() => bulkInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors"
                style={{
                  borderColor: "rgba(255,182,217,0.4)",
                  color: "#FFB6D9",
                }}
                aria-label="Add more images"
              >
                <Upload size={20} />
                <span className="text-xs font-medium">Add more</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress */}
      {converting && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: glassBg,
            border: glassBorder,
            backdropFilter: "blur(10px)",
          }}
          data-ocid="converter.loading_state"
        >
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-label="Loading"
              role="img"
              style={{ color: "#FFB6D9" }}
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span className="text-sm font-semibold text-gray-700">
              {progressLabel || "Converting..."}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: pinkGrad }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">
            {progress}% complete
          </p>
        </div>
      )}

      {/* Convert button */}
      <button
        type="button"
        onClick={handleConvertAll}
        disabled={items.length === 0 || converting}
        data-ocid="converter.primary_button"
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base text-white transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg"
        style={{
          background: pinkGrad,
          boxShadow: "0 8px 24px rgba(255,182,217,0.4)",
        }}
      >
        {converting ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-label="Processing"
              role="img"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            {progressLabel || "Processing..."}
          </>
        ) : (
          <>
            <FileText size={18} />
            Convert {items.length > 0 ? items.length : "All"} Image
            {items.length !== 1 ? "s" : ""} → Single PDF
          </>
        )}
      </button>

      {/* Success */}
      {resultUrl && !converting && (
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: "rgba(236,253,245,0.9)",
            border: "1px solid rgba(134,239,172,0.4)",
          }}
          data-ocid="converter.success_state"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <p className="font-bold text-green-800">PDF Ready!</p>
              <p className="text-xs text-green-600">
                {items.length} page{items.length !== 1 ? "s" : ""} combined into
                one PDF
              </p>
            </div>
          </div>
          <a
            href={resultUrl}
            download="combined-images.pdf"
            data-ocid="converter.secondary_button"
            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-sm"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
          >
            <Download size={16} /> Download PDF
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Main Converter Page ─────────────────────────────────────────────────────
export function ConverterPage() {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [convType, setConvType] = useState<ConversionType>("jpg-to-pdf");
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFilename, setResultFilename] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevResultUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (prevResultUrl.current) URL.revokeObjectURL(prevResultUrl.current);
    };
  }, []);

  const clearResult = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultFilename("");
  };

  const handleFileSelect = (f: File) => {
    setFile(f);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultFilename("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    setConverting(true);
    clearResult();
    try {
      const { blob, filename } = await convertFile(file, convType);
      const url = URL.createObjectURL(blob);
      prevResultUrl.current = url;
      setResultUrl(url);
      setResultFilename(filename);
      toast.success("Conversion complete!");
    } catch (err) {
      console.error(err);
      toast.error("Conversion failed. Please try a different file.");
    } finally {
      setConverting(false);
    }
  };

  const selectedConv = CONVERSIONS.find((c) => c.value === convType)!;

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        background: "linear-gradient(160deg, #fff5fb 0%, #f0f9ff 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-4 text-white"
            style={{ background: pinkGrad }}
          >
            <span>🔒</span> Manash Document Converter
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-gray-800">
            Document Converter
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Convert documents between JPG, PNG, and PDF formats — entirely in
            your browser.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-green-600 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            All conversions happen in your browser. No files are uploaded to any
            server.
          </div>
        </div>

        <AdBanner slot="6033081600" />

        {/* Mode Toggle */}
        <div
          className="rounded-2xl p-2 mb-6 flex gap-2"
          style={{
            background: glassBg,
            border: glassBorder,
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            type="button"
            data-ocid="converter.tab"
            onClick={() => setMode("single")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
            style={
              mode === "single"
                ? {
                    background: pinkGrad,
                    color: "white",
                    boxShadow: "0 4px 12px rgba(255,182,217,0.4)",
                  }
                : { color: "#6b7280" }
            }
          >
            <FileImage size={16} />
            Single File Convert
          </button>
          <button
            type="button"
            data-ocid="converter.tab"
            onClick={() => setMode("bulk")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
            style={
              mode === "bulk"
                ? {
                    background: pinkGrad,
                    color: "white",
                    boxShadow: "0 4px 12px rgba(255,182,217,0.4)",
                  }
                : { color: "#6b7280" }
            }
          >
            <Images size={16} />
            Bulk JPG → PDF (50 images)
          </button>
        </div>

        {mode === "bulk" ? (
          <BulkConverter />
        ) : (
          <>
            {/* Conversion Type Selector */}
            <div
              className="rounded-2xl p-4 mb-6"
              style={{
                background: glassBg,
                border: glassBorder,
                backdropFilter: "blur(10px)",
              }}
            >
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">
                Select Conversion Type
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CONVERSIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    data-ocid="converter.tab"
                    onClick={() => {
                      setConvType(c.value);
                      setFile(null);
                      if (resultUrl) URL.revokeObjectURL(resultUrl);
                      setResultUrl(null);
                      setResultFilename("");
                    }}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold border-2 transition-all"
                    style={
                      convType === c.value
                        ? {
                            background: pinkGrad,
                            borderColor: "transparent",
                            color: "white",
                          }
                        : {
                            background: "white",
                            borderColor: "rgba(255,182,217,0.3)",
                            color: "#6b7280",
                          }
                    }
                  >
                    <span className="text-base">{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className="relative rounded-2xl border-2 border-dashed transition-all mb-6"
              style={{
                borderColor: dragging ? "#FFB6D9" : "rgba(255,182,217,0.4)",
                background: dragging
                  ? "rgba(255,182,217,0.08)"
                  : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              data-ocid="converter.dropzone"
            >
              <input
                ref={inputRef}
                type="file"
                accept={getAcceptedMimes(convType)}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
                data-ocid="converter.upload_button"
              />
              {file ? (
                <div className="p-8 flex items-center justify-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(255,182,217,0.15)" }}
                  >
                    {selectedConv.from === "PDF" ? (
                      <FileText size={24} style={{ color: "#FFB6D9" }} />
                    ) : (
                      <FileImage size={24} style={{ color: "#FFB6D9" }} />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      clearResult();
                    }}
                    className="ml-2 text-gray-300 hover:text-red-400"
                    aria-label="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full p-8 text-center cursor-pointer"
                  onClick={() => inputRef.current?.click()}
                  aria-label={`Upload ${selectedConv.from} file for conversion`}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: pinkGrad }}
                  >
                    <Upload size={24} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-700 mb-1">
                    Drop your {selectedConv.from} file here
                  </p>
                  <p className="text-xs text-gray-400">
                    or{" "}
                    <span
                      className="font-semibold"
                      style={{ color: "#FFB6D9" }}
                    >
                      tap to browse
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Accepts: .{selectedConv.from.toLowerCase()} files
                  </p>
                </button>
              )}
            </div>

            {/* Convert Button */}
            <button
              type="button"
              onClick={handleConvert}
              disabled={!file || converting}
              data-ocid="converter.primary_button"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base text-white transition-all active:scale-[0.98] disabled:opacity-50 mb-6 shadow-lg"
              style={{
                background: pinkGrad,
                boxShadow: "0 8px 24px rgba(255,182,217,0.4)",
              }}
            >
              {converting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-label="Converting"
                    role="img"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Converting...
                </>
              ) : (
                `Convert ${selectedConv.from} → ${selectedConv.to}`
              )}
            </button>

            {/* Result */}
            {resultUrl && (
              <div
                className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6"
                style={{
                  background: "rgba(236,253,245,0.9)",
                  border: "1px solid rgba(134,239,172,0.4)",
                }}
                data-ocid="converter.success_state"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                    ✅
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-sm">
                      File ready!
                    </p>
                    <p className="text-xs text-green-600">{resultFilename}</p>
                  </div>
                </div>
                <a
                  href={resultUrl}
                  download={resultFilename}
                  data-ocid="converter.secondary_button"
                  className="flex items-center gap-2 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  }}
                >
                  <Download size={16} /> Download {selectedConv.to}
                </a>
              </div>
            )}
          </>
        )}

        {/* How it works */}
        <div
          className="mt-10 rounded-2xl p-6"
          style={{
            background: glassBg,
            border: glassBorder,
            backdropFilter: "blur(10px)",
          }}
        >
          <h3 className="font-bold text-gray-800 mb-4">How it works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Choose Type",
                desc:
                  mode === "bulk"
                    ? "Switch to Bulk mode"
                    : "Select the conversion format",
              },
              {
                step: "2",
                title: "Upload File(s)",
                desc:
                  mode === "bulk"
                    ? "Drop or browse up to 50 images"
                    : "Drop or browse your file",
              },
              {
                step: "3",
                title: "Download",
                desc: "Click Convert then Download",
              },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: pinkGrad }}
                >
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-sm">
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        <div
          className="mt-6 rounded-2xl p-4 flex gap-3"
          style={{
            background: "rgba(180,231,255,0.15)",
            border: "1px solid rgba(180,231,255,0.3)",
          }}
        >
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-semibold text-sky-800 text-sm">100% Private</p>
            <p className="text-xs text-sky-600 mt-0.5">
              All conversions happen entirely in your browser using JavaScript.
              Your files never leave your device.
            </p>
          </div>
        </div>

        <AdBanner slot="6033081600" />

        <div className="mt-10 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#FFB6D9" }}
            className="hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
