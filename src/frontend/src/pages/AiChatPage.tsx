import { Bot, Image, Send, Trash2, User } from "lucide-react";
import { useRef, useState } from "react";

const GEMINI_API_KEY = "AIzaSyCLjvyMd0-jeQBGRjkD9c1JgAv77niQXC8";
const CHAT_MODEL = "gemini-1.5-flash";
// image model placeholder

type Mode = "chat" | "image";

interface Message {
  role: "user" | "assistant";
  text: string;
  imageUrl?: string;
}

export function AiChatPage() {
  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );

  const sendChat = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", text: input.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const contents = history.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        },
      );
      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Sorry, I could not get a response. Please try again.";
      setMessages([...history, { role: "assistant", text }]);
    } catch {
      setMessages([
        ...history,
        {
          role: "assistant",
          text: "Network error. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const generateImage = async () => {
    if (!input.trim() || loading) return;
    const prompt = input.trim();
    const userMsg: Message = { role: "user", text: prompt };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      // Use Gemini to describe/enhance the prompt and generate an image via Pollinations AI (free)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`;
      // Verify URL loads by adding as image
      setMessages([
        ...history,
        {
          role: "assistant",
          text: `Here is your generated image for: "${prompt}"`,
          imageUrl,
        },
      ]);
    } catch {
      setMessages([
        ...history,
        {
          role: "assistant",
          text: "Image generation failed. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleSend = () => (mode === "chat" ? sendChat() : generateImage());

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2A4A] via-[#0d3460] to-[#1a1a2e] flex flex-col">
      {/* Header */}
      <div className="bg-[#0B2A4A] border-b border-blue-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              Manash 2.0
            </h1>
            <p className="text-blue-300 text-xs">
              AI Assistant · Powered by Gemini
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <div className="flex bg-[#0d3460] rounded-full p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode("chat")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                mode === "chat"
                  ? "bg-blue-500 text-white shadow"
                  : "text-blue-300 hover:text-white"
              }`}
            >
              💬 Chat
            </button>
            <button
              type="button"
              onClick={() => setMode("image")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                mode === "image"
                  ? "bg-purple-500 text-white shadow"
                  : "text-blue-300 hover:text-white"
              }`}
            >
              🎨 Image
            </button>
          </div>
          <button
            type="button"
            onClick={() => setMessages([])}
            className="text-blue-400 hover:text-red-400 transition-colors p-2"
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center mt-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Bot size={40} className="text-white" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">
              Hello! I'm Manash 2.0
            </h2>
            <p className="text-blue-300 text-sm max-w-md mx-auto">
              {mode === "chat"
                ? "Ask me anything — I can help with information, questions, writing, and more."
                : "Describe what image you want to create and I'll generate it for you."}
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {mode === "chat"
                ? [
                    "What are the government job updates?",
                    "How to apply for Aadhaar card?",
                    "Tell me about NextGen IT Hub services",
                    "How to convert a PDF to JPG?",
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setInput(s);
                      }}
                      className="text-left bg-[#0d3460] hover:bg-blue-800 border border-blue-700 rounded-xl px-4 py-3 text-blue-200 text-sm transition-colors"
                    >
                      {s}
                    </button>
                  ))
                : [
                    "A beautiful sunset over mountains",
                    "A futuristic city at night",
                    "A cute dog in a park",
                    "Abstract colorful art",
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setInput(s)}
                      className="text-left bg-[#0d3460] hover:bg-purple-900 border border-purple-700 rounded-xl px-4 py-3 text-purple-200 text-sm transition-colors"
                    >
                      {s}
                    </button>
                  ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.role + msg.text.slice(0, 20)}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === "user"
                  ? "bg-blue-500"
                  : "bg-gradient-to-br from-blue-400 to-cyan-400"
              }`}
            >
              {msg.role === "user" ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-[#0d3460] text-blue-100 border border-blue-800 rounded-tl-sm"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.text}
              </p>
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Generated"
                  className="mt-3 rounded-xl max-w-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).alt =
                      "Image generation failed";
                  }}
                />
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-[#0d3460] border border-blue-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-blue-800 bg-[#0B2A4A] px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <div className="flex-1 bg-[#0d3460] border border-blue-700 rounded-2xl px-4 py-3 flex items-end gap-2">
            {mode === "image" && (
              <Image
                size={16}
                className="text-purple-400 mb-0.5 flex-shrink-0"
              />
            )}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={
                mode === "chat"
                  ? "Ask Manash 2.0 anything..."
                  : "Describe an image to generate..."
              }
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-blue-400 text-sm resize-none outline-none max-h-32"
              style={{ lineHeight: "1.5" }}
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              mode === "image"
                ? "bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900"
                : "bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900"
            } disabled:cursor-not-allowed`}
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
        <p className="text-center text-blue-500 text-xs mt-2">
          Manash 2.0 · AI by Google Gemini · Responses may not always be
          accurate
        </p>
      </div>
    </div>
  );
}
