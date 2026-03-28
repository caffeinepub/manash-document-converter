import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ConversionResult,
  FORMAT_LABELS,
  type FileFormat,
  SUPPORTED_CONVERSIONS,
  convertFile,
  detectFormat,
  downloadBlob,
  downloadMultipleAsZip,
} from "@/utils/converter";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Download,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";

interface ConversionCardProps {
  presetFrom?: FileFormat;
  presetTo?: FileFormat;
}

export function ConversionCard({ presetFrom, presetTo }: ConversionCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fromFormat, setFromFormat] = useState<FileFormat | null>(
    presetFrom ?? null,
  );
  const [toFormat, setToFormat] = useState<FileFormat | null>(presetTo ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "converting" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  const handleFile = useCallback(
    (f: File) => {
      setFile(f);
      setStatus("idle");
      setError(null);
      setResult(null);
      const detected = detectFormat(f);
      if (detected) {
        setFromFormat(detected);
        const available = SUPPORTED_CONVERSIONS[detected];
        if (presetTo && available.includes(presetTo)) {
          setToFormat(presetTo);
        } else {
          setToFormat(available[0]);
        }
      }
    },
    [presetTo],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleConvert = async () => {
    if (!file || !fromFormat || !toFormat) return;
    setStatus("converting");
    setError(null);
    try {
      const res = await convertFile(file, fromFormat, toFormat);
      setResult(res);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    if (result.isMultiple) {
      const ext = toFormat === "jpg" ? "jpg" : "png";
      downloadMultipleAsZip(
        result.blobs,
        result.filename.replace(/\..*$/, ""),
        ext,
      );
    } else {
      downloadBlob(result.blobs[0], result.filename);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFromFormat(presetFrom ?? null);
    setToFormat(presetTo ?? null);
    setStatus("idle");
    setError(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const availableTargets = fromFormat ? SUPPORTED_CONVERSIONS[fromFormat] : [];

  return (
    <div
      id="convert"
      className="bg-card rounded-2xl shadow-card-lg p-6 sm:p-8 w-full max-w-xl mx-auto"
      data-ocid="converter.card"
    >
      {/* Drop zone: use a label wrapping the hidden input for accessibility */}
      <div
        className="relative rounded-xl border-2 border-dashed transition-colors mb-6"
        style={{
          borderColor: isDragging
            ? "oklch(0.62 0.12 185)"
            : "oklch(0.68 0.06 220)",
          background: isDragging
            ? "oklch(0.94 0.02 195)"
            : "oklch(0.96 0.015 240)",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        data-ocid="converter.dropzone"
      >
        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="sr-only"
          onChange={onInputChange}
          data-ocid="converter.upload_button"
        />
        <label
          htmlFor={fileInputId}
          className="flex flex-col items-center gap-3 py-10 px-4 cursor-pointer"
        >
          {file ? (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  Drag &amp; Drop Files Here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or{" "}
                  <span className="text-primary font-medium underline underline-offset-2">
                    Choose File
                  </span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, PDF
              </p>
            </>
          )}
        </label>
        {file && (
          <div className="flex justify-center pb-4">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground underline"
              onClick={handleReset}
            >
              Choose different file
            </button>
          </div>
        )}
      </div>

      {/* Format selectors */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            From
          </p>
          <Select
            value={fromFormat ?? ""}
            onValueChange={(v) => {
              setFromFormat(v as FileFormat);
              setToFormat(SUPPORTED_CONVERSIONS[v as FileFormat][0]);
            }}
          >
            <SelectTrigger className="w-full" data-ocid="converter.select">
              <SelectValue placeholder="Auto detect" />
            </SelectTrigger>
            <SelectContent>
              {(["jpg", "png", "pdf"] as FileFormat[]).map((f) => (
                <SelectItem key={f} value={f}>
                  {FORMAT_LABELS[f]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center mt-5">
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            To
          </p>
          <Select
            value={toFormat ?? ""}
            onValueChange={(v) => setToFormat(v as FileFormat)}
          >
            <SelectTrigger className="w-full" data-ocid="converter.select">
              <SelectValue placeholder="Select output" />
            </SelectTrigger>
            <SelectContent>
              {availableTargets.map((f) => (
                <SelectItem key={f} value={f}>
                  {FORMAT_LABELS[f]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error */}
      {status === "error" && error && (
        <div
          className="flex items-start gap-2 rounded-lg p-3 mb-4 text-sm"
          style={{
            background: "oklch(0.95 0.04 27)",
            color: "oklch(0.45 0.18 27)",
          }}
          data-ocid="converter.error_state"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CTA */}
      {status === "success" && result ? (
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 text-base"
          onClick={handleDownload}
          data-ocid="converter.primary_button"
        >
          <Download className="w-5 h-5 mr-2" />
          Download {result.isMultiple ? `${result.blobs.length} Pages` : "File"}
        </Button>
      ) : (
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 text-base"
          disabled={
            !file || !fromFormat || !toFormat || status === "converting"
          }
          onClick={handleConvert}
          data-ocid="converter.submit_button"
        >
          {status === "converting" ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            "Convert Now"
          )}
        </Button>
      )}

      {/* Footer note */}
      <p className="text-center text-xs text-muted-foreground mt-3">
        Max file size: 50MB · All processing done locally in your browser
      </p>

      {status === "success" && (
        <div
          className="mt-4 flex items-center gap-2 justify-center text-sm"
          style={{ color: "oklch(0.55 0.12 155)" }}
          data-ocid="converter.success_state"
        >
          <CheckCircle className="w-4 h-4" />
          Conversion complete! Your file is ready to download.
        </div>
      )}
    </div>
  );
}
