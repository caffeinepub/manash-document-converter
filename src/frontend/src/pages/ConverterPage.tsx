import { Download, FileImage, FileText, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AdBanner from "../components/AdBanner";
import { Button } from "../components/ui/button";

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

export function ConverterPage() {
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
    <div className="min-h-screen bg-[#F3F5F8] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1 text-blue-700 text-xs font-semibold mb-4">
            <span>&#x1F512;</span> Manash Document Converter
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2A4A] mb-3">
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
                <p className="font-bold text-[#0B2A4A] text-sm">File ready!</p>
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

        {/* How it works */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-[#0B2A4A] mb-4">How it works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Choose Type",
                desc: "Select the conversion format you need",
              },
              {
                step: "2",
                title: "Upload File",
                desc: "Drop or browse to pick your file",
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
