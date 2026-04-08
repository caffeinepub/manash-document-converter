import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Download,
  Eraser,
  Info,
  Lock,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCw,
  Scissors,
  Sliders,
  Sparkles,
  Type,
  Unlock,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import AdBanner from "../components/AdBanner";

type Tool =
  | "compress"
  | "resize"
  | "convert"
  | "bg-remove"
  | "crop"
  | "rotate"
  | "filter"
  | "text";

const tools: {
  id: Tool;
  label: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
  isSky?: boolean;
}[] = [
  {
    id: "compress",
    label: "Compress",
    desc: "Reduce file size",
    icon: <Minimize2 size={22} />,
    accent: "pink",
  },
  {
    id: "resize",
    label: "Resize",
    desc: "Change dimensions",
    icon: <Maximize2 size={22} />,
    accent: "sky",
    isSky: true,
  },
  {
    id: "convert",
    label: "Convert",
    desc: "Change format",
    icon: <RefreshCw size={22} />,
    accent: "pink",
  },
  {
    id: "bg-remove",
    label: "BG Remover",
    desc: "AI background removal",
    icon: <Eraser size={22} />,
    accent: "sky",
    isSky: true,
  },
  {
    id: "crop",
    label: "Crop",
    desc: "Crop to area",
    icon: <Scissors size={22} />,
    accent: "pink",
  },
  {
    id: "rotate",
    label: "Rotate & Flip",
    desc: "Rotate or mirror",
    icon: <RotateCw size={22} />,
    accent: "sky",
    isSky: true,
  },
  {
    id: "filter",
    label: "Grayscale",
    desc: "Apply filters",
    icon: <Sliders size={22} />,
    accent: "pink",
  },
  {
    id: "text",
    label: "Add Text",
    desc: "Overlay text",
    icon: <Type size={22} />,
    accent: "sky",
    isSky: true,
  },
];

// ── Shared iOS styles ────────────────────────────────────────────────────────
const pinkGrad = "linear-gradient(135deg, #FFB6D9 0%, #ff8fc6 100%)";
const skyGrad = "linear-gradient(135deg, #B4E7FF 0%, #7dd3fc 100%)";
const glassBg = "rgba(255,255,255,0.82)";
const glassBorder = "1px solid rgba(255,182,217,0.35)";

function DownloadBtn({
  onClick,
  label = "Download",
  dataOcid,
}: { onClick: () => void; label?: string; dataOcid?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={dataOcid}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all active:scale-95 shadow-sm"
      style={{ background: pinkGrad }}
    >
      <Download size={15} />
      {label}
    </button>
  );
}

function UploadZone({
  onFile,
  accept = "image/*",
}: { onFile: (f: File) => void; accept?: string }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) onFile(file);
    },
    [onFile],
  );

  return (
    <button
      type="button"
      data-ocid="imagetool.dropzone"
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
      style={{
        borderColor: drag ? "#FFB6D9" : "rgba(255,182,217,0.5)",
        background: drag ? "rgba(255,182,217,0.12)" : "rgba(255,255,255,0.6)",
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
        style={{ background: pinkGrad }}
      >
        <Upload size={24} className="text-white" />
      </div>
      <p className="font-semibold text-gray-700">
        Drop image here or tap to upload
      </p>
      <p className="text-gray-400 text-sm mt-1">JPG, PNG, WebP supported</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </button>
  );
}

function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  mimeType = "image/jpeg",
  quality = 0.92,
) {
  canvas.toBlob(
    (blob) => {
      if (!blob) {
        toast.error("Failed to generate image");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      toast.success("Image downloaded!");
    },
    mimeType,
    quality,
  );
}

function loadImageToCanvas(
  file: File,
): Promise<{ canvas: HTMLCanvasElement; img: HTMLImageElement }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve({ canvas, img });
    };
    img.onerror = reject;
    img.src = url;
  });
}

// ── COMPRESS ────────────────────────────────────────────────────────────────
function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(75);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const compress = async () => {
    if (!file) return;
    try {
      const { canvas } = await loadImageToCanvas(file);
      const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
      downloadCanvas(
        canvas,
        `compressed_${file.name.replace(/\.[^.]+$/, ".jpg")}`,
        mime,
        quality / 100,
      );
    } catch {
      toast.error("Failed to compress image");
    }
  };

  const estSize = file ? Math.round((file.size * quality) / 100 / 1024) : 0;

  return (
    <div className="space-y-4">
      {!file ? (
        <UploadZone onFile={setFile} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded-2xl border border-pink-100"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {file.name}
              </p>
              <p className="text-sm text-gray-400">
                Original: {Math.round(file.size / 1024)} KB
              </p>
              <p className="text-sm text-gray-400">Estimated: ~{estSize} KB</p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-gray-300 hover:text-red-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div>
            <Label className="text-gray-700 font-semibold">
              Quality: {quality}%
            </Label>
            <Slider
              min={10}
              max={100}
              step={1}
              value={[quality]}
              onValueChange={([v]) => setQuality(v)}
              className="mt-2"
            />
          </div>
          <DownloadBtn
            onClick={compress}
            label="Compress & Download"
            dataOcid="imagetool.compress.primary_button"
          />
        </div>
      )}
    </div>
  );
}

// ── RESIZE ───────────────────────────────────────────────────────────────────
function ResizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [locked, setLocked] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const ratio = useRef(1);

  const handleFile = async (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setW(img.naturalWidth);
      setH(img.naturalHeight);
      ratio.current = img.naturalWidth / img.naturalHeight;
    };
    img.src = url;
  };

  const handleW = (val: number) => {
    setW(val);
    if (locked) setH(Math.round(val / ratio.current));
  };
  const handleH = (val: number) => {
    setH(val);
    if (locked) setW(Math.round(val * ratio.current));
  };

  const resize = async () => {
    if (!file) return;
    try {
      const { img } = await loadImageToCanvas(file);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      downloadCanvas(canvas, `resized_${file.name}`, file.type || "image/jpeg");
    } catch {
      toast.error("Failed to resize");
    }
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <UploadZone onFile={handleFile} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded-2xl border border-sky-100"
              />
            )}
            <div>
              <p className="font-semibold text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-400">
                Original: {origW} × {origH}px
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="text-gray-300 hover:text-red-400 transition-colors ml-auto"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 font-semibold">Width (px)</Label>
              <Input
                type="number"
                value={w}
                onChange={(e) => handleW(Number(e.target.value))}
                className="mt-1 rounded-xl"
                data-ocid="imagetool.resize.input"
              />
            </div>
            <div>
              <Label className="text-gray-700 font-semibold">Height (px)</Label>
              <Input
                type="number"
                value={h}
                onChange={(e) => handleH(Number(e.target.value))}
                className="mt-1 rounded-xl"
                data-ocid="imagetool.resize.input"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocked(!locked)}
              className="transition-colors"
              style={{ color: "#B4E7FF" }}
            >
              {locked ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
            <span className="text-sm text-gray-500">
              {locked ? "Aspect ratio locked" : "Aspect ratio unlocked"}
            </span>
          </div>
          <DownloadBtn
            onClick={resize}
            label="Resize & Download"
            dataOcid="imagetool.resize.primary_button"
          />
        </div>
      )}
    </div>
  );
}

// ── CONVERT ──────────────────────────────────────────────────────────────────
function ConvertTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<
    "image/jpeg" | "image/png" | "image/webp"
  >("image/jpeg");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const convert = async () => {
    if (!file) return;
    try {
      const { canvas } = await loadImageToCanvas(file);
      const ext =
        format === "image/jpeg"
          ? "jpg"
          : format === "image/png"
            ? "png"
            : "webp";
      downloadCanvas(
        canvas,
        `converted_${file.name.replace(/\.[^.]+$/, `.${ext}`)}`,
        format,
      );
    } catch {
      toast.error("Conversion failed");
    }
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <UploadZone onFile={setFile} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded-2xl border border-pink-100"
              />
            )}
            <div>
              <p className="font-semibold text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-400">{file.type}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="text-gray-300 hover:text-red-400 transition-colors ml-auto"
            >
              <X size={18} />
            </button>
          </div>
          <div>
            <Label className="text-gray-700 font-semibold">Convert to</Label>
            <Select
              value={format}
              onValueChange={(v) => setFormat(v as typeof format)}
            >
              <SelectTrigger
                className="mt-1 rounded-xl"
                data-ocid="imagetool.convert.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image/jpeg">JPEG (.jpg)</SelectItem>
                <SelectItem value="image/png">PNG (.png)</SelectItem>
                <SelectItem value="image/webp">WebP (.webp)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DownloadBtn
            onClick={convert}
            label="Convert & Download"
            dataOcid="imagetool.convert.primary_button"
          />
        </div>
      )}
    </div>
  );
}

// ── BG REMOVE ────────────────────────────────────────────────────────────────
function BgRemoveTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const removeBackground = async () => {
    if (!file) return;
    setLoading(true);
    setProgress("Connecting to remove.bg API...");
    try {
      const formData = new FormData();
      formData.append("image_file", file);
      formData.append("size", "auto");
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": "UputND68rsXjraZifg5jTM7d" },
        body: formData,
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error: ${response.status} - ${errText}`);
      }
      setProgress("Processing complete!");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setProgress("");
      toast.success("Background removed!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove background. Please try again.");
      setProgress("");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `bg_removed_${file.name.replace(/\.[^.]+$/, ".png")}`;
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <div className="space-y-4">
      <div
        className="flex items-start gap-2 rounded-2xl p-3 text-sm"
        style={{
          background: "rgba(180,231,255,0.18)",
          border: "1px solid rgba(180,231,255,0.5)",
          color: "#0369a1",
        }}
      >
        <Info
          size={16}
          className="mt-0.5 shrink-0"
          style={{ color: "#B4E7FF" }}
        />
        <span>
          Powered by <strong>remove.bg API</strong> — professional AI background
          removal. Get a clean transparent PNG instantly.
        </span>
      </div>
      {!file ? (
        <UploadZone onFile={setFile} />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">
                Original
              </p>
              {preview && (
                <img
                  src={preview}
                  alt="original"
                  className="w-full h-40 object-contain rounded-2xl border border-pink-100 bg-gray-50"
                />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Result</p>
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="result"
                  className="w-full h-40 object-contain rounded-2xl border border-sky-100"
                  style={{
                    background:
                      "repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 0 0/16px 16px",
                  }}
                />
              ) : (
                <div className="w-full h-40 rounded-2xl border border-dashed border-sky-200 flex items-center justify-center text-gray-400 text-sm bg-sky-50/30">
                  Result appears here
                </div>
              )}
            </div>
          </div>
          {loading && (
            <p
              className="text-sm font-medium animate-pulse"
              style={{ color: "#B4E7FF" }}
              data-ocid="imagetool.bgremove.loading_state"
            >
              {progress}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={removeBackground}
              disabled={loading}
              data-ocid="imagetool.bgremove.primary_button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all active:scale-95 shadow-sm disabled:opacity-50"
              style={{ background: skyGrad, color: "#0f172a" }}
            >
              <Sparkles size={15} />
              {loading ? "Processing..." : "Remove Background"}
            </button>
            {resultUrl && (
              <DownloadBtn
                onClick={download}
                label="Download PNG"
                dataOcid="imagetool.bgremove.secondary_button"
              />
            )}
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
                setResultUrl(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm text-gray-500 hover:text-gray-700 transition-colors border border-gray-200"
            >
              <X size={14} /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CROP ─────────────────────────────────────────────────────────────────────
function CropTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  const [cw, setCw] = useState(0);
  const [ch, setCh] = useState(0);

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setCx(0);
      setCy(0);
      setCw(img.naturalWidth);
      setCh(img.naturalHeight);
    };
    img.src = url;
  };

  const crop = async () => {
    if (!file) return;
    try {
      const { img } = await loadImageToCanvas(file);
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      canvas.getContext("2d")!.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch);
      downloadCanvas(canvas, `cropped_${file.name}`, file.type || "image/jpeg");
    } catch {
      toast.error("Crop failed");
    }
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <UploadZone onFile={handleFile} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded-2xl border border-pink-100"
              />
            )}
            <div>
              <p className="font-semibold text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-400">
                Original: {origW} × {origH}px
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="text-gray-300 hover:text-red-400 transition-colors ml-auto"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "X (px)", val: cx, set: setCx },
              { label: "Y (px)", val: cy, set: setCy },
              { label: "Width (px)", val: cw, set: setCw },
              { label: "Height (px)", val: ch, set: setCh },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <Label className="text-gray-700 font-semibold">{label}</Label>
                <Input
                  type="number"
                  value={val}
                  onChange={(e) => set(Number(e.target.value))}
                  className="mt-1 rounded-xl"
                  data-ocid="imagetool.crop.input"
                />
              </div>
            ))}
          </div>
          <DownloadBtn
            onClick={crop}
            label="Crop & Download"
            dataOcid="imagetool.crop.primary_button"
          />
        </div>
      )}
    </div>
  );
}

// ── ROTATE & FLIP ─────────────────────────────────────────────────────────────
function RotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const resultBlobRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const applyTransform = async (mode: string) => {
    if (!file) return;
    try {
      const sourceCanvas =
        resultBlobRef.current || (await loadImageToCanvas(file)).canvas;
      const sw = sourceCanvas.width;
      const sh = sourceCanvas.height;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      if (mode === "cw" || mode === "ccw") {
        canvas.width = sh;
        canvas.height = sw;
        ctx.translate(sh / 2, sw / 2);
        ctx.rotate(((mode === "cw" ? 90 : -90) * Math.PI) / 180);
        ctx.drawImage(sourceCanvas, -sw / 2, -sh / 2);
      } else if (mode === "180") {
        canvas.width = sw;
        canvas.height = sh;
        ctx.translate(sw / 2, sh / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(sourceCanvas, -sw / 2, -sh / 2);
      } else if (mode === "flipH") {
        canvas.width = sw;
        canvas.height = sh;
        ctx.translate(sw, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(sourceCanvas, 0, 0);
      } else if (mode === "flipV") {
        canvas.width = sw;
        canvas.height = sh;
        ctx.translate(0, sh);
        ctx.scale(1, -1);
        ctx.drawImage(sourceCanvas, 0, 0);
      }
      resultBlobRef.current = canvas;
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      canvas.toBlob((blob) => {
        if (blob) setResultUrl(URL.createObjectURL(blob));
      });
    } catch {
      toast.error("Transform failed");
    }
  };

  const download = () => {
    if (!resultBlobRef.current || !file) return;
    downloadCanvas(
      resultBlobRef.current,
      `rotated_${file.name}`,
      file.type || "image/jpeg",
    );
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <UploadZone
          onFile={(f) => {
            setFile(f);
            resultBlobRef.current = null;
            setResultUrl(null);
          }}
        />
      ) : (
        <div className="space-y-4">
          {resultUrl && (
            <img
              src={resultUrl}
              alt="result"
              className="max-h-48 mx-auto rounded-2xl border border-sky-100 object-contain"
            />
          )}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "↻ 90° CW", mode: "cw" },
              { label: "↺ 90° CCW", mode: "ccw" },
              { label: "↕ 180°", mode: "180" },
              { label: "↔ Flip H", mode: "flipH" },
              { label: "↕ Flip V", mode: "flipV" },
            ].map(({ label, mode }) => (
              <button
                key={mode}
                type="button"
                onClick={() => applyTransform(mode)}
                data-ocid="imagetool.rotate.button"
                className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all active:scale-95"
                style={{
                  borderColor: "rgba(180,231,255,0.5)",
                  color: "#0369a1",
                  background: "rgba(180,231,255,0.1)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            {resultUrl && (
              <DownloadBtn
                onClick={download}
                dataOcid="imagetool.rotate.primary_button"
              />
            )}
            <button
              type="button"
              onClick={() => {
                setFile(null);
                resultBlobRef.current = null;
                setResultUrl(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-gray-500 hover:text-gray-700 border border-gray-200 transition-colors"
            >
              <X size={14} /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FILTER ───────────────────────────────────────────────────────────────────
function FilterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const resultCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const apply = async (type: "gray" | "bw") => {
    if (!file) return;
    try {
      const { canvas } = await loadImageToCanvas(file);
      const ctx = canvas.getContext("2d")!;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        const avg = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        const val = type === "bw" ? (avg > 128 ? 255 : 0) : avg;
        d[i] = d[i + 1] = d[i + 2] = val;
      }
      ctx.putImageData(data, 0, 0);
      resultCanvas.current = canvas;
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      canvas.toBlob((blob) => {
        if (blob) setResultUrl(URL.createObjectURL(blob));
      });
    } catch {
      toast.error("Filter failed");
    }
  };

  const download = () => {
    if (!resultCanvas.current || !file) return;
    downloadCanvas(
      resultCanvas.current,
      `filtered_${file.name}`,
      file.type || "image/jpeg",
    );
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <UploadZone onFile={setFile} />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {preview && (
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  Original
                </p>
                <img
                  src={preview}
                  alt="original"
                  className="w-full h-40 object-contain rounded-2xl border border-pink-100"
                />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Result</p>
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="result"
                  className="w-full h-40 object-contain rounded-2xl border border-sky-100"
                />
              ) : (
                <div className="w-full h-40 rounded-2xl border border-dashed border-pink-200 flex items-center justify-center text-gray-400 text-sm">
                  Click a filter
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {["Grayscale", "Black & White"].map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => apply(i === 0 ? "gray" : "bw")}
                data-ocid="imagetool.filter.button"
                className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all active:scale-95"
                style={{
                  borderColor: "rgba(255,182,217,0.5)",
                  color: "#be185d",
                  background: "rgba(255,182,217,0.1)",
                }}
              >
                {label}
              </button>
            ))}
            {resultUrl && (
              <DownloadBtn
                onClick={download}
                dataOcid="imagetool.filter.primary_button"
              />
            )}
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setResultUrl(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-gray-500 border border-gray-200 transition-colors"
            >
              <X size={14} /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ADD TEXT ─────────────────────────────────────────────────────────────────
function AddTextTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [text, setText] = useState("Your Text Here");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ffffff");
  const [xPct, setXPct] = useState(50);
  const [yPct, setYPct] = useState(50);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const resultCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const apply = async () => {
    if (!file || !text) return;
    try {
      const { canvas } = await loadImageToCanvas(file);
      const ctx = canvas.getContext("2d")!;
      const fontStyle = `${italic ? "italic " : ""}${bold ? "bold " : ""}${fontSize}px sans-serif`;
      ctx.font = fontStyle;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const x = (xPct / 100) * canvas.width;
      const y = (yPct / 100) * canvas.height;
      ctx.fillText(text, x, y);
      resultCanvas.current = canvas;
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      canvas.toBlob((blob) => {
        if (blob) setResultUrl(URL.createObjectURL(blob));
      });
    } catch {
      toast.error("Failed to apply text");
    }
  };

  const download = () => {
    if (!resultCanvas.current || !file) return;
    downloadCanvas(
      resultCanvas.current,
      `text_${file.name}`,
      file.type || "image/jpeg",
    );
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <UploadZone onFile={setFile} />
      ) : (
        <div className="space-y-4">
          {(resultUrl || preview) && (
            <img
              src={resultUrl || preview || ""}
              alt="preview"
              className="max-h-48 mx-auto rounded-2xl border border-pink-100 object-contain"
            />
          )}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-gray-700 font-semibold">Text</Label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-1 rounded-xl"
                data-ocid="imagetool.text.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-700 font-semibold">
                  Font Size: {fontSize}px
                </Label>
                <Slider
                  min={12}
                  max={120}
                  step={1}
                  value={[fontSize]}
                  onValueChange={([v]) => setFontSize(v)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-semibold">Color</Label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border cursor-pointer"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-700 font-semibold">
                  X: {xPct}%
                </Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[xPct]}
                  onValueChange={([v]) => setXPct(v)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-semibold">
                  Y: {yPct}%
                </Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[yPct]}
                  onValueChange={([v]) => setYPct(v)}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={bold}
                  onCheckedChange={(v) => setBold(!!v)}
                  id="bold"
                  data-ocid="imagetool.text.checkbox"
                />
                <label
                  htmlFor="bold"
                  className="text-sm font-bold cursor-pointer"
                >
                  Bold
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={italic}
                  onCheckedChange={(v) => setItalic(!!v)}
                  id="italic"
                  data-ocid="imagetool.text.checkbox"
                />
                <label
                  htmlFor="italic"
                  className="text-sm italic cursor-pointer"
                >
                  Italic
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={apply}
              data-ocid="imagetool.text.primary_button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all active:scale-95 shadow-sm"
              style={{ background: pinkGrad }}
            >
              Apply Text
            </button>
            {resultUrl && (
              <DownloadBtn
                onClick={download}
                dataOcid="imagetool.text.secondary_button"
              />
            )}
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setResultUrl(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-gray-500 border border-gray-200 transition-colors"
            >
              <X size={14} /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────
const toolComponents: Record<Tool, React.ReactNode> = {
  compress: <CompressTool />,
  resize: <ResizeTool />,
  convert: <ConvertTool />,
  "bg-remove": <BgRemoveTool />,
  crop: <CropTool />,
  rotate: <RotateTool />,
  filter: <FilterTool />,
  text: <AddTextTool />,
};

export function ImageToolsPage({
  navigate: _navigate,
}: { navigate: (p: Page) => void }) {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  return (
    <main
      className="min-h-screen pb-16"
      style={{
        background: "linear-gradient(160deg, #fff5fb 0%, #f0f9ff 100%)",
      }}
    >
      {/* Hero */}
      <div
        className="py-10 px-4"
        style={{
          background: "linear-gradient(135deg, #FFB6D9 0%, #B4E7FF 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-semibold text-white/90 mb-4">
            <Sparkles size={13} />
            100% In-Browser Processing
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2 text-white"
            style={{ textShadow: "0 2px 12px rgba(255,182,217,0.5)" }}
          >
            Image Tools
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Professional image editing — your photos never leave your device
          </p>
        </div>
      </div>

      <AdBanner slot="8914192550" className="max-w-5xl mx-auto px-4" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tool Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          data-ocid="imagetool.panel"
        >
          {tools.map((t) => {
            const isActive = activeTool === t.id;
            const isSky = t.isSky;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTool(t.id === activeTool ? null : t.id)}
                data-ocid={`imagetool.${t.id}.button`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all text-center active:scale-95"
                style={{
                  background: isActive ? (isSky ? skyGrad : pinkGrad) : glassBg,
                  border: isActive ? "none" : glassBorder,
                  boxShadow: isActive
                    ? `0 8px 24px ${isSky ? "rgba(180,231,255,0.4)" : "rgba(255,182,217,0.4)"}`
                    : "0 2px 12px rgba(255,182,217,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: isActive
                      ? "rgba(255,255,255,0.3)"
                      : isSky
                        ? "linear-gradient(135deg, rgba(180,231,255,0.3), rgba(180,231,255,0.1))"
                        : "linear-gradient(135deg, rgba(255,182,217,0.3), rgba(255,182,217,0.1))",
                    color: isActive ? "white" : isSky ? "#0369a1" : "#be185d",
                  }}
                >
                  {t.icon}
                </span>
                <span
                  className={`font-semibold text-sm leading-tight ${isActive ? "text-white" : "text-gray-700"}`}
                >
                  {t.label}
                </span>
                <span
                  className={`text-xs leading-tight ${isActive ? "text-white/80" : "text-gray-400"}`}
                >
                  {t.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tool Panel */}
        {activeTool && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              background: glassBg,
              border: glassBorder,
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(255,182,217,0.15)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{
                    background: tools.find((t) => t.id === activeTool)?.isSky
                      ? skyGrad
                      : pinkGrad,
                  }}
                >
                  <span className="text-white">
                    {tools.find((t) => t.id === activeTool)?.icon}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {tools.find((t) => t.id === activeTool)?.label}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveTool(null)}
                className="text-gray-300 hover:text-red-400 transition-colors w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50"
                data-ocid="imagetool.close_button"
              >
                <X size={18} />
              </button>
            </div>
            {toolComponents[activeTool]}
          </div>
        )}

        {!activeTool && (
          <div
            className="text-center py-16 rounded-2xl"
            data-ocid="imagetool.empty_state"
            style={{
              background: glassBg,
              border: glassBorder,
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,182,217,0.2), rgba(180,231,255,0.2))",
              }}
            >
              <Sparkles size={28} style={{ color: "#FFB6D9" }} />
            </div>
            <p className="text-lg font-semibold text-gray-600">
              Select a tool above to get started
            </p>
            <p className="text-sm text-gray-400 mt-1">
              8 professional image tools, all free
            </p>
          </div>
        )}
      </div>

      <AdBanner slot="8914192550" className="max-w-5xl mx-auto px-4" />

      <footer className="text-center text-xs text-gray-400 mt-8">
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
