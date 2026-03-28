import { PDFDocument } from "pdf-lib";

export type FileFormat = "jpg" | "png" | "pdf";

export const FORMAT_LABELS: Record<FileFormat, string> = {
  jpg: "JPG",
  png: "PNG",
  pdf: "PDF",
};

export const SUPPORTED_CONVERSIONS: Record<FileFormat, FileFormat[]> = {
  jpg: ["pdf", "png"],
  png: ["pdf", "jpg"],
  pdf: ["jpg", "png"],
};

export function detectFormat(file: File): FileFormat | null {
  const mime = file.type.toLowerCase();
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (mime === "image/jpeg" || ext === "jpg" || ext === "jpeg") return "jpg";
  if (mime === "image/png" || ext === "png") return "png";
  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  return null;
}

async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

async function imageToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

// Image → PDF using pdf-lib
async function imageToPdf(file: File): Promise<Blob> {
  const bytes = await fileToArrayBuffer(file);
  const pdfDoc = await PDFDocument.create();
  const isJpg = detectFormat(file) === "jpg";
  const uint8 = new Uint8Array(bytes as ArrayBuffer);
  const image = isJpg
    ? await pdfDoc.embedJpg(uint8)
    : await pdfDoc.embedPng(uint8);
  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });
  const pdfBytes = await pdfDoc.save();
  // pdfBytes is Uint8Array — convert to ArrayBuffer to satisfy strict Blob typing
  return new Blob([pdfBytes.buffer as ArrayBuffer], {
    type: "application/pdf",
  });
}

// Image format change using Canvas
async function convertImageFormat(
  file: File,
  toFormat: "jpg" | "png",
): Promise<Blob> {
  const canvas = await imageToCanvas(file);
  return new Promise((resolve, reject) => {
    const mimeType = toFormat === "jpg" ? "image/jpeg" : "image/png";
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      mimeType,
      0.92,
    );
  });
}

// PDF → Image using pdfjs-dist (dynamic import)
async function pdfToImage(
  file: File,
  toFormat: "jpg" | "png",
): Promise<Blob[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();

  const bytes = await fileToArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(bytes as ArrayBuffer),
  }).promise;
  const blobs: Blob[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      const mimeType = toFormat === "jpg" ? "image/jpeg" : "image/png";
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Canvas toBlob failed"));
        },
        mimeType,
        0.92,
      );
    });
    blobs.push(blob);
  }
  return blobs;
}

export interface ConversionResult {
  blobs: Blob[];
  filename: string;
  isMultiple: boolean;
}

export async function convertFile(
  file: File,
  fromFormat: FileFormat,
  toFormat: FileFormat,
): Promise<ConversionResult> {
  const baseName = file.name.replace(/\.[^.]+$/, "");

  if ((fromFormat === "jpg" || fromFormat === "png") && toFormat === "pdf") {
    const blob = await imageToPdf(file);
    return { blobs: [blob], filename: `${baseName}.pdf`, isMultiple: false };
  }

  if (fromFormat === "jpg" && toFormat === "png") {
    const blob = await convertImageFormat(file, "png");
    return { blobs: [blob], filename: `${baseName}.png`, isMultiple: false };
  }

  if (fromFormat === "png" && toFormat === "jpg") {
    const blob = await convertImageFormat(file, "jpg");
    return { blobs: [blob], filename: `${baseName}.jpg`, isMultiple: false };
  }

  if (fromFormat === "pdf" && (toFormat === "jpg" || toFormat === "png")) {
    const blobs = await pdfToImage(file, toFormat);
    const ext = toFormat === "jpg" ? "jpg" : "png";
    const isMultiple = blobs.length > 1;
    return {
      blobs,
      filename: isMultiple ? `${baseName}-pages.zip` : `${baseName}.${ext}`,
      isMultiple,
    };
  }

  throw new Error(`Unsupported conversion: ${fromFormat} to ${toFormat}`);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function downloadMultipleAsZip(
  blobs: Blob[],
  baseName: string,
  ext: string,
): Promise<void> {
  blobs.forEach((blob, i) => {
    downloadBlob(blob, `${baseName}-page-${i + 1}.${ext}`);
  });
}
