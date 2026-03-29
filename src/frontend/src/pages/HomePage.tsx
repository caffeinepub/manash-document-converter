import {
  ChevronRight,
  Image,
  Monitor,
  Scissors,
  Star,
  Wand2,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Page } from "../App";
import AdBanner from "../components/AdBanner";
import { Button } from "../components/ui/button";
import { getProducts } from "../types";

interface Props {
  navigate: (p: Page, extra?: { productId?: string }) => void;
}

function getAndIncrementVisits(): number {
  const stored = Number.parseInt(
    localStorage.getItem("totalVisits") || "0",
    10,
  );
  const next = stored + 1;
  localStorage.setItem("totalVisits", String(next));
  return next;
}

export function HomePage({ navigate }: Props) {
  const products = getProducts();
  const featured = products.slice(0, 4);

  const totalVisitsRef = useRef<number>(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [onlineNow, setOnlineNow] = useState(
    () => Math.floor(Math.random() * 28) + 8,
  );

  useEffect(() => {
    if (totalVisitsRef.current === 0) {
      const v = getAndIncrementVisits();
      totalVisitsRef.current = v;
      setTotalVisits(v);
    }
    const id = setInterval(() => {
      setOnlineNow(Math.floor(Math.random() * 28) + 8);
    }, 12000);
    return () => clearInterval(id);
  }, []);

  const categories = [
    {
      slug: "electrical",
      label: "Electrical Products",
      icon: <Zap size={32} className="text-white" />,
      desc: "Bulbs, fans, switches & more",
    },
    {
      slug: "internet-cafe",
      label: "Internet Cafe",
      icon: <Monitor size={32} className="text-white" />,
      desc: "Browsing, gaming, printing",
    },
    {
      slug: "photo-binding",
      label: "Photo & Binding",
      icon: <Image size={32} className="text-white" />,
      desc: "Prints, lamination, binding",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="w-full">
        <img
          src="/assets/uploads/1774353229398-019d3a15-c257-750f-9a66-8798cd7598e4-1.png"
          alt="NextGen IT Hub - One Stop for All Solution"
          className="w-full object-cover"
          style={{ maxHeight: "420px", objectPosition: "center" }}
        />
      </section>

      {/* Visitor Counter Bar */}
      <section className="bg-[#0B2A4A] py-2.5 px-4" data-ocid="visitor.panel">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2 text-white text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-gray-300">👁 Live Visitors:</span>
            <span className="font-bold text-green-400">{onlineNow}</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2 text-white text-sm">
            <span className="text-gray-300">📊 Total Visits:</span>
            <span className="font-bold text-blue-300">
              {totalVisits.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </section>

      {/* Image Tools Banner */}
      <section className="bg-gradient-to-r from-[#0B2A4A] to-[#1a3f6b] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Wand2 size={24} className="text-blue-300" />
              <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">
                New Feature
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
              Image Tools
            </h2>
            <p className="text-blue-200 text-sm max-w-md">
              Compress, Resize, Convert, Remove Background, Crop, Rotate,
              Grayscale & more — all free, 100% in your browser.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {[
                "Compress",
                "Resize",
                "Convert",
                "BG Remove",
                "Crop",
                "Rotate",
                "Grayscale",
                "Add Text",
              ].map((t) => (
                <span
                  key={t}
                  className="bg-white/10 text-white text-xs px-3 py-1 rounded-full border border-white/20"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={() => navigate("image-tools")}
              className="bg-[#1E88FF] hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg flex items-center gap-2"
            >
              <Scissors size={20} />
              Open Image Tools
            </Button>
          </div>
        </div>
      </section>

      {/* AdSense - Homepage (auto) */}
      <AdBanner slot="2549132160" />

      {/* AdSense - Homepage (fluid in-feed) */}
      <AdBanner
        slot="4240548434"
        format="fluid"
        layoutKey="-fb+5w+4e-db+86"
        className="max-w-7xl mx-auto px-6"
      />

      {/* Categories */}
      <section className="bg-[#F3F5F8] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#0B2A4A] uppercase tracking-widest mb-10">
            Browse Our Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.slug}
                onClick={() => navigate("shop")}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 text-left group border border-gray-100"
              >
                <div className="w-16 h-16 bg-[#0B2A4A] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1E88FF] transition-colors">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0B2A4A] mb-1">
                  {cat.label}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{cat.desc}</p>
                <span className="text-[#1E88FF] text-sm font-semibold flex items-center gap-1">
                  Shop Now <ChevronRight size={16} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#0B2A4A] uppercase tracking-widest mb-10">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => navigate("product", { productId: p.id })}
                className="bg-white rounded-xl border border-gray-100 shadow hover:shadow-lg transition-shadow overflow-hidden text-left group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[#0B2A4A] mb-1 line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-[#1E88FF] font-bold">
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                  <span className="text-xs text-[#1E88FF] mt-2 block">
                    Shop Now →
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              onClick={() => navigate("shop")}
              className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white px-10 py-3 rounded-full"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-[#F3F5F8] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#0B2A4A] uppercase tracking-widest mb-10">
            Our Key Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap size={28} />,
                title: "Electrical Solutions",
                desc: "Quality electrical products with warranty. Installation support available.",
              },
              {
                icon: <Monitor size={28} />,
                title: "Internet Cafe",
                desc: "High-speed internet, gaming PCs, printing and scanning services.",
              },
              {
                icon: <Image size={28} />,
                title: "Photo & Binding",
                desc: "Professional photo prints, lamination, spiral binding, and more.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#1E88FF] mb-4">
                  {s.icon}
                </div>
                <h3 className="font-bold text-[#0B2A4A] mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{s.desc}</p>
                <button
                  type="button"
                  onClick={() => navigate("shop")}
                  className="text-[#1E88FF] text-sm font-semibold"
                >
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#0B2A4A] uppercase tracking-widest mb-10">
            Customer Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Rahul Sharma",
                review:
                  "Great quality products and fast delivery. The LED bulbs are excellent!",
                rating: 5,
              },
              {
                name: "Priya Singh",
                review:
                  "Internet cafe is very clean and fast internet. Perfect for gaming sessions.",
                rating: 5,
              },
              {
                name: "Amit Kumar",
                review:
                  "Photo printing quality is amazing. Spiral binding was done perfectly.",
                rating: 4,
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }, (_, i) => i).map((i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">
                  "{t.review}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0B2A4A] text-white flex items-center justify-center font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <span className="font-semibold text-[#0B2A4A] text-sm">
                    {t.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#0B2A4A] py-12 px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="text-gray-300 mb-6 text-sm">
            Get latest offers and new product alerts directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full px-5 py-3 text-gray-800 text-sm outline-none"
            />
            <Button className="bg-[#1E88FF] hover:bg-blue-600 text-white rounded-full px-8 whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1f35] text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-white text-lg mb-2">
              NextGen IT Hub
            </div>
            <div className="text-xs text-gray-400 mb-3">
              Formerly Manash PC World
            </div>
            <p className="text-sm text-gray-400">
              Your trusted partner for electrical products, internet cafe
              services, and photo binding.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Categories</div>
            {["Electrical Products", "Internet Cafe", "Photo & Binding"].map(
              (c) => (
                <div
                  key={c}
                  className="text-sm py-1 hover:text-white cursor-pointer"
                >
                  {c}
                </div>
              ),
            )}
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Quick Links</div>
            {["Home", "Shop", "My Account", "Track Order"].map((l) => (
              <div
                key={l}
                className="text-sm py-1 hover:text-white cursor-pointer"
              >
                {l}
              </div>
            ))}
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Contact</div>
            <p className="text-sm text-gray-400">📍 NextGen IT Hub Store</p>
            <p className="text-sm text-gray-400 mt-1">📞 Call us for support</p>
            <p className="text-sm text-gray-400 mt-1">✉️ info@nextgenit.com</p>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-8 border-t border-gray-700 pt-6">
          © {new Date().getFullYear()} NextGen IT Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
