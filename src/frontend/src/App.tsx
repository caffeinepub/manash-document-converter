import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { FeaturesSection } from "./components/FeaturesSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { PopularConversions } from "./components/PopularConversions";
import type { FileFormat } from "./utils/converter";

export default function App() {
  const [presetFrom, setPresetFrom] = useState<FileFormat | undefined>(
    undefined,
  );
  const [presetTo, setPresetTo] = useState<FileFormat | undefined>(undefined);

  const handleSelectConversion = (from: FileFormat, to: FileFormat) => {
    setPresetFrom(from);
    setPresetTo(to);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection presetFrom={presetFrom} presetTo={presetTo} />
        <PopularConversions onSelect={handleSelectConversion} />
        <FeaturesSection />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
