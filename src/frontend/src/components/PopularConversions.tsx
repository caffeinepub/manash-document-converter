import type { FileFormat } from "@/utils/converter";
import { motion } from "motion/react";

interface Conversion {
  from: FileFormat;
  to: FileFormat;
  label: string;
  fromColor: string;
  toColor: string;
  fromBg: string;
  toBg: string;
}

const CONVERSIONS: Conversion[] = [
  {
    from: "jpg",
    to: "pdf",
    label: "JPG → PDF",
    fromColor: "#E8734A",
    toColor: "#E84A4A",
    fromBg: "#FEF0EB",
    toBg: "#FEEBEB",
  },
  {
    from: "pdf",
    to: "jpg",
    label: "PDF → JPG",
    fromColor: "#E84A4A",
    toColor: "#E8734A",
    fromBg: "#FEEBEB",
    toBg: "#FEF0EB",
  },
  {
    from: "jpg",
    to: "png",
    label: "JPG → PNG",
    fromColor: "#E8734A",
    toColor: "#4A8CE8",
    fromBg: "#FEF0EB",
    toBg: "#EBF2FE",
  },
  {
    from: "png",
    to: "jpg",
    label: "PNG → JPG",
    fromColor: "#4A8CE8",
    toColor: "#E8734A",
    fromBg: "#EBF2FE",
    toBg: "#FEF0EB",
  },
  {
    from: "png",
    to: "pdf",
    label: "PNG → PDF",
    fromColor: "#4A8CE8",
    toColor: "#E84A4A",
    fromBg: "#EBF2FE",
    toBg: "#FEEBEB",
  },
  {
    from: "pdf",
    to: "png",
    label: "PDF → PNG",
    fromColor: "#E84A4A",
    toColor: "#4A8CE8",
    fromBg: "#FEEBEB",
    toBg: "#EBF2FE",
  },
];

interface PopularConversionsProps {
  onSelect: (from: FileFormat, to: FileFormat) => void;
}

export function PopularConversions({ onSelect }: PopularConversionsProps) {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Popular Conversions
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            One click to start your conversion
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {CONVERSIONS.map((conv, i) => (
            <motion.button
              key={conv.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => {
                onSelect(conv.from, conv.to);
                document
                  .getElementById("convert")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-card rounded-xl border border-border p-5 text-left hover:shadow-card transition-all hover:-translate-y-0.5 group"
              data-ocid={`popular.item.${i + 1}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ background: conv.fromBg, color: conv.fromColor }}
                >
                  {conv.from.toUpperCase()}
                </span>
                <span className="text-muted-foreground text-sm">→</span>
                <span
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ background: conv.toBg, color: conv.toColor }}
                >
                  {conv.to.toUpperCase()}
                </span>
              </div>
              <p className="font-semibold text-foreground text-sm">
                {conv.label}
              </p>
              <span
                className="text-xs font-medium mt-2 inline-block"
                style={{ color: "oklch(0.62 0.12 185)" }}
              >
                Convert now →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
