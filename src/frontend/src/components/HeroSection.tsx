import type { FileFormat } from "@/utils/converter";
import { motion } from "motion/react";
import { ConversionCard } from "./ConversionCard";

interface HeroSectionProps {
  presetFrom?: FileFormat;
  presetTo?: FileFormat;
}

export function HeroSection({ presetFrom, presetTo }: HeroSectionProps) {
  return (
    <section
      className="relative hero-gradient pt-16 pb-24 wave-bottom"
      id="convert"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Convert Your Files
            <span className="block" style={{ color: "oklch(0.75 0.13 185)" }}>
              Instantly
            </span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-lg mx-auto"
            style={{ color: "oklch(0.78 0.03 220)" }}
          >
            Fast, free, and secure format conversion right in your browser. No
            uploads. No servers. Just results.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
        >
          <ConversionCard presetFrom={presetFrom} presetTo={presetTo} />
        </motion.div>
      </div>
    </section>
  );
}
