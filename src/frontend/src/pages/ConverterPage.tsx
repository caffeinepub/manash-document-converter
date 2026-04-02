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
    label: "JPG \u2192 PDF",
    from: "JPG",
    to: "PDF",
    icon: "\uD83D\uDDBC\uFE0F",
  },
  {
    value: "png-to-pdf",
    label: "PNG \u2192 PDF",
    from: "PNG",
    to: "PDF",
    icon: "\uD83D\uDDBC\uFE0F",
  },
  {
    value: "pdf-to-jpg",
    label: "PDF \u2192 JPG",
    from: "PDF",
    to: "JPG",
    icon: "\uD83D\uDCC4",
  },
  {
    value: "pdf-to-png",
    label: "PDF \u2192 PNG",
    from: "PDF",
    to: "PNG",
    icon: "\uD83D\uDCC4",
  },
  {
    value: "jpg-to-png",
    label: "JPG \u2192 PNG",
    from: "JPG",
    to: "PNG",
    icon: "\uD83D\uDDBC\uFE0F",
  },
  {
    value: "png-to-jpg",
    label: "PNG \u2192 JPG",
    from: "PNG",
    to: "JPG",
    icon: "\uD83D\uDDBC\uFE0F",
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

const MAX_BULK = 50;

interface BulkImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

// ─── Bulk JPG→PDF Section ────────────────────────────────────────────────────
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

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      for (const i of itemsRef.current) {
        URL.revokeObjectURL(i.previewUrl);
      }
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
      if (arr.length > remaining) {
        toast.error(
          `Only ${remaining} more images can be added (max ${MAX_BULK}).`,
        );
      }
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
    for (const i of items) {
      URL.revokeObjectURL(i.previewUrl);
    }
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
          // addPage with same size as current image
          (doc as any).addPage([img.width, img.height], orientation);
        }

        const pw = (doc as any).internal.pageSize.getWidth();
        const ph = (doc as any).internal.pageSize.getHeight();
        (doc as any).addImage(dataUrl, fmt, 0, 0, pw, ph);
      }

      setProgress(100);
      setProgressLabel("Generating PDF...");

      const pdfBytes = (doc as any).output("arraybuffer");
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
      {/* Header info */}
      <div className="bg-gradient-to-r from-[#0B2A4A] to-[#1E4A7A] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Images size={20} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Bulk JPG / PNG → PDF</h2>
            <p className="text-blue-200 text-xs">
              Combine up to 50 images into one PDF file
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className="bg-white/15 rounded-lg px-3 py-1">
            <span className="font-bold text-yellow-300">{items.length}</span>
            <span className="text-blue-200"> / {MAX_BULK} images</span>
          </span>
          <span className="text-blue-200 text-xs">
            Images appear in the order you select them
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl transition-all ${
          bulkDragging
            ? "border-[#1E88FF] bg-blue-50 scale-[1.01]"
            : "border-gray-300 hover:border-[#1E88FF] bg-white"
        }`}
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
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mx-auto mb-4">
            <Upload size={28} className="text-[#1E88FF]" />
          </div>
          <p className="font-semibold text-gray-700 mb-1">
            Drop images here or click to browse
          </p>
          <p className="text-xs text-gray-400">
            JPG and PNG files • Up to{" "}
            <span className="font-bold text-[#1E88FF]">{MAX_BULK} images</span>
          </p>
        </button>
      </div>

      {/* Thumbnails grid */}
      {items.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-[#0B2A4A]">
              Selected Images ({items.length}/{MAX_BULK})
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
                className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square"
                data-ocid={`converter.item.${idx + 1}`}
              >
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="w-full h-full object-cover"
                />
                {/* Order badge */}
                <div className="absolute top-1 left-1 w-5 h-5 bg-[#0B2A4A]/80 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  aria-label={`Remove ${item.file.name}`}
                  data-ocid={`converter.delete_button.${idx + 1}`}
                >
                  <X size={12} />
                </button>
                {/* File name tooltip on hover */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.file.name}
                </div>
              </div>
            ))}
            {/* Add more button if space */}
            {items.length < MAX_BULK && (
              <button
                type="button"
                onClick={() => bulkInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#1E88FF] flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#1E88FF] transition-colors"
                aria-label="Add more images"
              >
                <Upload size={20} />
                <span className="text-xs font-medium">Add more</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress bar while converting */}
      {converting && (
        <div
          className="bg-white border border-blue-200 rounded-2xl p-5"
          data-ocid="converter.loading_state"
        >
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="animate-spin h-5 w-5 text-[#1E88FF]"
              viewBox="0 0 24 24"
              fill="none"
              aria-label="Loading"
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
            <span className="text-sm font-semibold text-[#0B2A4A]">
              {progressLabel || "Converting..."}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-400 mt-2 text-right">
            {progress}% complete
          </p>
        </div>
      )}

      {/* Convert button */}
      <Button
        onClick={handleConvertAll}
        disabled={items.length === 0 || converting}
        data-ocid="converter.primary_button"
        className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 transition-colors"
      >
        {converting ? (
          <span className="flex items-center justify-center gap-2">
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
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <FileText size={18} />
            Convert {items.length > 0 ? items.length : "All"} Image
            {items.length !== 1 ? "s" : ""} → Single PDF
          </span>
        )}
      </Button>

      {/* Success result */}
      {resultUrl && !converting && (
        <div
          className="bg-white rounded-2xl border border-green-300 p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          data-ocid="converter.success_state"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="font-bold text-[#0B2A4A]">PDF Ready!</p>
              <p className="text-xs text-gray-500">
                {items.length} page{items.length !== 1 ? "s" : ""} combined into
                one PDF
              </p>
            </div>
          </div>
          <a
            href={resultUrl}
            download="combined-images.pdf"
            data-ocid="converter.secondary_button"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
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
      style={{ background: "oklch(0.12 0.03 250)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold mb-4"
            style={{
              background: "oklch(0.78 0.18 65 / 0.15)",
              border: "1px solid oklch(0.78 0.18 65 / 0.4)",
              color: "oklch(0.78 0.18 65)",
            }}
          >
            <span>&#x1F512;</span> Manash Document Converter
          </div>
          <h1 className="text-3xl font-extrabold mb-3 font-display gradient-text-gold">
            Document Converter
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Convert documents between JPG, PNG, and PDF formats &#8212; entirely
            in your browser.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-green-600 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            All conversions happen in your browser. No files are uploaded to any
            server.
          </div>
        </div>

        <AdBanner slot="6033081600" />

        {/* Mode Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6 flex gap-2">
          <button
            type="button"
            data-ocid="converter.tab"
            onClick={() => setMode("single")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              mode === "single"
                ? "bg-[#0B2A4A] text-white shadow"
                : "text-gray-500 hover:text-[#0B2A4A] hover:bg-gray-50"
            }`}
          >
            <FileImage size={16} />
            Single File Convert
          </button>
          <button
            type="button"
            data-ocid="converter.tab"
            onClick={() => setMode("bulk")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              mode === "bulk"
                ? "bg-gradient-to-r from-[#0B2A4A] to-[#1E88FF] text-white shadow"
                : "text-gray-500 hover:text-[#0B2A4A] hover:bg-gray-50"
            }`}
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
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
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold border-2 transition-all ${
                      convType === c.value
                        ? "bg-[#0B2A4A] border-[#0B2A4A] text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-[#0B2A4A] hover:text-[#0B2A4A]"
                    }`}
                  >
                    <span className="text-base">{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className={`relative bg-white rounded-2xl shadow-sm border-2 border-dashed transition-all mb-6 ${
                dragging
                  ? "border-[#1E88FF] bg-blue-50"
                  : "border-gray-300 hover:border-[#1E88FF]"
              }`}
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
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    {selectedConv.from === "PDF" ? (
                      <FileText size={24} className="text-[#1E88FF]" />
                    ) : (
                      <FileImage size={24} className="text-[#1E88FF]" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#0B2A4A] text-sm">
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
                    className="ml-2 text-gray-400 hover:text-red-400"
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
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mx-auto mb-4">
                    <Upload size={28} className="text-gray-300" />
                  </div>
                  <p className="font-semibold text-gray-600 mb-1">
                    Drop your {selectedConv.from} file here
                  </p>
                  <p className="text-xs text-gray-400">
                    or{" "}
                    <span className="text-[#1E88FF] font-semibold">
                      click to browse
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Accepts: .{selectedConv.from.toLowerCase()} files
                  </p>
                </button>
              )}
            </div>

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              disabled={!file || converting}
              data-ocid="converter.primary_button"
              className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 mb-6"
            >
              {converting ? (
                <span className="flex items-center justify-center gap-2">
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
                </span>
              ) : (
                `Convert ${selectedConv.from} \u2192 ${selectedConv.to}`
              )}
            </Button>

            {/* Result */}
            {resultUrl && (
              <div
                className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                data-ocid="converter.success_state"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <span className="text-2xl">&#x2705;</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#0B2A4A] text-sm">
                      File ready!
                    </p>
                    <p className="text-xs text-gray-500">{resultFilename}</p>
                  </div>
                </div>
                <a
                  href={resultUrl}
                  download={resultFilename}
                  data-ocid="converter.secondary_button"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  <Download size={16} /> Download {selectedConv.to}
                </a>
              </div>
            )}
          </>
        )}

        {/* How it works */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-[#0B2A4A] mb-4">How it works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Choose Type",
                desc:
                  mode === "bulk"
                    ? "Switch to Bulk mode"
                    : "Select the conversion format you need",
              },
              {
                step: "2",
                title: "Upload File(s)",
                desc:
                  mode === "bulk"
                    ? "Drop or browse to pick up to 50 images"
                    : "Drop or browse to pick your file",
              },
              {
                step: "3",
                title: "Download",
                desc: "Click Convert then Download",
              },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0B2A4A] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
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
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <span className="text-2xl">&#x1F512;</span>
          <div>
            <p className="font-semibold text-blue-800 text-sm">100% Private</p>
            <p className="text-xs text-blue-600 mt-0.5">
              All conversions happen entirely in your browser using JavaScript.
              Your files never leave your device and are never uploaded to any
              server.
            </p>
          </div>
        </div>

        <AdBanner slot="6033081600" />

        {/* Footer */}
        <div className="mt-10 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1E88FF] hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
