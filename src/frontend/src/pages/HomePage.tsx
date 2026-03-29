import {
  Bot,
  ChevronRight,
  Image,
  MessageCircle,
  Monitor,
  Scissors,
  Send,
  Sparkles,
  Star,
  Wand2,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Page } from "../App";
import AdBanner from "../components/AdBanner";
import { Button } from "../components/ui/button";
import { useInView } from "../hooks/useInView";
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

  // InView hooks for scroll-triggered sections
  const { ref: categoriesRef, inView: categoriesInView } = useInView();
  const { ref: productsRef, inView: productsInView } = useInView();
  const { ref: servicesRef, inView: servicesInView } = useInView();
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView();
  const { ref: newsletterRef, inView: newsletterInView } = useInView();
  const { ref: imageToolsRef, inView: imageToolsInView } = useInView();

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

  // Chat Widget State
  type ChatMode = "chat" | "image";
  interface ChatMessage {
    role: "user" | "assistant";
    text: string;
    imageUrl?: string;
  }
  const GEMINI_KEY = "AIzaSyCLjvyMd0-jeQBGRjkD9c1JgAv77niQXC8";
  const [chatMode, setChatMode] = useState<ChatMode>("chat");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: "user", text: chatInput.trim() };
    const history = [...chatMessages, userMsg];
    setChatMessages(history);
    setChatInput("");
    setChatLoading(true);
    setTimeout(
      () => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );

    try {
      if (chatMode === "chat") {
        const contents = history.map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents }),
          },
        );
        const data = await res.json();
        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ??
          "Sorry, I could not get a response.";
        setChatMessages([...history, { role: "assistant", text }]);
      } else {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(userMsg.text)}?width=512&height=512&nologo=true`;
        setChatMessages([
          ...history,
          {
            role: "assistant",
            text: `Here is your generated image for: "${userMsg.text}"`,
            imageUrl,
          },
        ]);
      }
    } catch {
      setChatMessages([
        ...history,
        { role: "assistant", text: "Network error. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
      setTimeout(
        () => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  };

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
      <section className="w-full overflow-hidden">
        <img
          src="/assets/uploads/1774353229398-019d3a15-c257-750f-9a66-8798cd7598e4-1.png"
          alt="NextGen IT Hub - One Stop for All Solution"
          className="w-full object-cover animate-fade-up"
          style={{ maxHeight: "420px", objectPosition: "center" }}
        />
      </section>

      {/* Visitor Counter Bar */}
      <section
        className="bg-[#0B2A4A] py-2.5 px-4 animate-slide-in-top"
        data-ocid="visitor.panel"
      >
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
      <section
        ref={imageToolsRef as React.RefObject<HTMLElement>}
        className="bg-gradient-to-r from-[#0B2A4A] to-[#1a3f6b] py-10 px-6"
      >
        <div
          className={`max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 ${
            imageToolsInView ? "animate-fade-up" : "opacity-0"
          }`}
        >
          <div className="text-white text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Wand2
                size={24}
                className={`text-blue-300 ${
                  imageToolsInView ? "animate-float" : ""
                }`}
              />
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
              ].map((t, i) => (
                <span
                  key={t}
                  className="bg-white/10 text-white text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                  style={{
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={() => navigate("image-tools")}
              className="bg-[#1E88FF] hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg flex items-center gap-2 animate-pulse-glow hover-scale"
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
      <section
        ref={categoriesRef as React.RefObject<HTMLElement>}
        className="bg-[#F3F5F8] py-16 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-2xl font-bold text-center text-[#0B2A4A] uppercase tracking-widest mb-10 ${
              categoriesInView ? "animate-fade-up" : "opacity-0"
            }`}
          >
            Browse Our Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <button
                type="button"
                key={cat.slug}
                onClick={() => navigate("shop")}
                className={`bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 text-left group border border-gray-100 hover-lift ${
                  categoriesInView ? "animate-fade-up" : "opacity-0"
                }`}
                style={{
                  animationDelay: categoriesInView ? `${(i + 1) * 0.1}s` : "0s",
                }}
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
      <section
        ref={productsRef as React.RefObject<HTMLElement>}
        className="py-16 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-2xl font-bold text-center text-[#0B2A4A] uppercase tracking-widest mb-10 ${
              productsInView ? "animate-fade-up" : "opacity-0"
            }`}
          >
            Featured Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((p, i) => (
              <button
                type="button"
                key={p.id}
                onClick={() => navigate("product", { productId: p.id })}
                className={`bg-white rounded-xl border border-gray-100 shadow hover:shadow-lg transition-shadow overflow-hidden text-left group hover-lift ${
                  productsInView ? "animate-fade-up" : "opacity-0"
                }`}
                style={{
                  animationDelay: productsInView ? `${(i + 1) * 0.1}s` : "0s",
                }}
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
          <div
            className={`text-center mt-8 ${
              productsInView ? "animate-fade-up stagger-5" : "opacity-0"
            }`}
          >
            <Button
              onClick={() => navigate("shop")}
              className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white px-10 py-3 rounded-full hover-scale"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* ✨ Manash 2.0 Chat Widget — HIGHLIGHTED */}
      <section
        className="relative py-16 px-6 overflow-hidden"
        data-ocid="chat.section"
        style={{
          background:
            "linear-gradient(135deg, #020c1b 0%, #0B2A4A 40%, #0d3460 70%, #1a1a2e 100%)",
        }}
      >
        {/* Animated glow rings */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #60a5fa 0%, transparent 70%)",
              animation: "pulse 3s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, #818cf8 0%, transparent 70%)",
              animation: "pulse 2s ease-in-out infinite 0.5s",
            }}
          />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* ✨ Highlight Banner */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg mb-3 uppercase tracking-wider">
              <Sparkles size={14} className="animate-pulse" />
              AI Powered · Gemini
              <Sparkles size={14} className="animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight animate-fade-up">
              🤖 Try{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #60a5fa, #a78bfa, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Manash 2.0
              </span>
            </h2>
            <p className="text-blue-300 text-sm max-w-md mx-auto animate-fade-up stagger-1">
              Your AI Assistant — Chat, ask questions, generate images & more in
              real time
            </p>
          </div>

          {/* Glowing border wrapper */}
          <div
            className="rounded-2xl p-0.5"
            style={{
              background:
                "linear-gradient(135deg, #60a5fa, #818cf8, #34d399, #60a5fa)",
              backgroundSize: "300% 300%",
              animation: "gradientShift 4s ease infinite",
              boxShadow: "0 0 40px rgba(96, 165, 250, 0.4)",
            }}
          >
            <div className="rounded-2xl overflow-hidden">
              {/* Section Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ background: "#0a1f35" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
                    <Bot size={22} className="text-white animate-float" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl leading-tight">
                      Chat with Manash 2.0
                    </h2>
                    <p className="text-blue-300 text-xs">
                      AI Assistant · Powered by Gemini
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Mode Toggle */}
                  <div className="flex bg-[#0a2040] rounded-full p-1 gap-1 border border-blue-800">
                    <button
                      type="button"
                      onClick={() => setChatMode("chat")}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        chatMode === "chat"
                          ? "bg-blue-500 text-white shadow"
                          : "text-blue-300 hover:text-white"
                      }`}
                      data-ocid="chat.tab"
                    >
                      💬 Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatMode("image")}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        chatMode === "image"
                          ? "bg-purple-500 text-white shadow"
                          : "text-blue-300 hover:text-white"
                      }`}
                      data-ocid="chat.tab"
                    >
                      🎨 Image
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("ai-chat")}
                    className="text-xs text-blue-300 hover:text-white border border-blue-700 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 hover-scale"
                    data-ocid="chat.open_modal_button"
                  >
                    <MessageCircle size={12} />
                    Full Chat
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="bg-[#0a2040] border-t border-blue-800">
                <div
                  className="h-80 overflow-y-auto px-4 py-4 space-y-4"
                  data-ocid="chat.panel"
                >
                  {chatMessages.length === 0 && (
                    <div
                      className="flex flex-col items-center justify-center h-full text-center"
                      data-ocid="chat.empty_state"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mb-3 shadow-lg animate-float">
                        <Bot size={28} className="text-white" />
                      </div>
                      <p className="text-white font-semibold mb-1">
                        Hello! I'm Manash 2.0
                      </p>
                      <p className="text-blue-400 text-xs max-w-xs">
                        {chatMode === "chat"
                          ? "Ask me anything — products, jobs, documents & more."
                          : "Describe what image you want me to generate."}
                      </p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div
                      key={`${msg.role}-${i}-${msg.text.slice(0, 10)}`}
                      className={`flex gap-2 animate-fade-up ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                      data-ocid={`chat.item.${i + 1}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
                          msg.role === "user"
                            ? "bg-blue-500"
                            : "bg-gradient-to-br from-blue-400 to-cyan-400"
                        }`}
                      >
                        {msg.role === "user" ? (
                          "U"
                        ) : (
                          <Bot size={13} className="text-white" />
                        )}
                      </div>
                      <div
                        className={`max-w-[78%] rounded-xl px-3 py-2 text-sm ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-[#0d3460] text-blue-100 border border-blue-800 rounded-tl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {msg.text}
                        </p>
                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            alt="Generated"
                            className="mt-2 rounded-lg max-w-full"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex gap-2" data-ocid="chat.loading_state">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                        <Bot size={13} className="text-white" />
                      </div>
                      <div className="bg-[#0d3460] border border-blue-800 rounded-xl rounded-tl-sm px-3 py-2">
                        <div className="flex gap-1 items-center">
                          <span
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Input */}
                <div className="border-t border-blue-800 bg-[#0B2A4A] px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSend();
                        }
                      }}
                      placeholder={
                        chatMode === "chat"
                          ? "Ask Manash 2.0 anything..."
                          : "Describe an image to generate..."
                      }
                      className="flex-1 bg-[#0d3460] border border-blue-700 rounded-xl px-4 py-2.5 text-white placeholder-blue-400 text-sm outline-none focus:border-blue-500"
                      data-ocid="chat.input"
                    />
                    <button
                      type="button"
                      onClick={handleChatSend}
                      disabled={!chatInput.trim() || chatLoading}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 hover-scale ${
                        chatMode === "image"
                          ? "bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/50"
                          : "bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50"
                      } disabled:cursor-not-allowed`}
                      data-ocid="chat.submit_button"
                    >
                      <Send size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </section>

      {/* Services */}
      <section
        ref={servicesRef as React.RefObject<HTMLElement>}
        className="bg-[#F3F5F8] py-16 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-2xl font-bold text-center text-[#0B2A4A] uppercase tracking-widest mb-10 ${
              servicesInView ? "animate-fade-up" : "opacity-0"
            }`}
          >
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
            ].map((s, i) => (
              <div
                key={s.title}
                className={`bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover-lift hover-scale ${
                  servicesInView ? "animate-fade-up" : "opacity-0"
                }`}
                style={{
                  animationDelay: servicesInView ? `${(i + 1) * 0.15}s` : "0s",
                }}
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#1E88FF] mb-4 transition-transform group-hover:scale-110">
                  {s.icon}
                </div>
                <h3 className="font-bold text-[#0B2A4A] mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{s.desc}</p>
                <button
                  type="button"
                  onClick={() => navigate("shop")}
                  className="text-[#1E88FF] text-sm font-semibold hover:underline transition-all"
                >
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={testimonialsRef as React.RefObject<HTMLElement>}
        className="py-16 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-2xl font-bold text-center text-[#0B2A4A] uppercase tracking-widest mb-10 ${
              testimonialsInView ? "animate-fade-up" : "opacity-0"
            }`}
          >
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
            ].map((t, i) => (
              <div
                key={t.name}
                className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover-lift ${
                  testimonialsInView ? "animate-fade-up" : "opacity-0"
                }`}
                style={{
                  animationDelay: testimonialsInView
                    ? `${(i + 1) * 0.15}s`
                    : "0s",
                }}
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }, (_, idx) => idx).map(
                    (idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    ),
                  )}
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
      <section
        ref={newsletterRef as React.RefObject<HTMLElement>}
        className="bg-[#0B2A4A] py-12 px-6"
      >
        <div
          className={`max-w-3xl mx-auto text-center text-white ${
            newsletterInView ? "animate-fade-up" : "opacity-0"
          }`}
        >
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
            <Button className="bg-[#1E88FF] hover:bg-blue-600 text-white rounded-full px-8 whitespace-nowrap hover-scale">
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
                  className="text-sm py-1 hover:text-white cursor-pointer transition-colors"
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
                className="text-sm py-1 hover:text-white cursor-pointer transition-colors"
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
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="hover:text-white transition-colors underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
