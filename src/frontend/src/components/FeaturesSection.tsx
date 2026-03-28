import { CloudOff, Download, Lock } from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: Lock,
    title: "100% Private",
    description:
      "Your files never leave your device. All conversions happen entirely in your browser — no data sent to any server.",
    iconBg: "oklch(0.94 0.06 195)",
    iconColor: "oklch(0.52 0.14 185)",
  },
  {
    icon: CloudOff,
    title: "No Upload Required",
    description:
      "We process everything client-side. That means zero wait time for uploads, zero bandwidth usage, and zero storage concerns.",
    iconBg: "oklch(0.94 0.04 260)",
    iconColor: "oklch(0.50 0.13 260)",
  },
  {
    icon: Download,
    title: "Instant Download",
    description:
      "Converted files are ready in seconds. Download directly to your device with a single click — no email, no links.",
    iconBg: "oklch(0.95 0.05 155)",
    iconColor: "oklch(0.50 0.14 155)",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="how-it-works"
      className="py-20"
      style={{ background: "oklch(0.97 0.005 240)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Why DocConvert?
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Built with privacy and speed as the top priorities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-8 shadow-card text-center"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: feat.iconBg }}
              >
                <feat.icon
                  className="w-7 h-7"
                  style={{ color: feat.iconColor }}
                />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {feat.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
