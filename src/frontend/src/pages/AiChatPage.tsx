import { Bot, Image, Send, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const GEMINI_API_KEY = "AIzaSyCLjvyMd0-jeQBGRjkD9c1JgAv77niQXC8";
const CHAT_MODEL = "gemini-2.0-flash";

type Mode = "chat" | "image";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  imageUrl?: string;
  streaming?: boolean;
}

function makeId() {
  return Math.random().toString(36).slice(2);
}

export function AiChatPage() {
  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll on message change
  useEffect(() => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  const sendChat = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: makeId(), role: "user", text: input.trim() };
    const assistantId = makeId();
    const history = [...messages, userMsg];
    setMessages([
      ...history,
      { id: assistantId, role: "assistant", text: "", streaming: true },
    ]);
    setInput("");
    setLoading(true);

    abortRef.current = new AbortController();

    try {
      const contents = history.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const systemContext = [
        {
          role: "user",
          parts: [
            {
              text: "You are Manash 2.0, a helpful AI assistant for NextGen IT Hub. Be concise, friendly, and helpful. You can assist with general questions, NextGen IT Hub services (electrical products, internet cafe, photo & binding), government documents, job updates, and more.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hello! I'm Manash 2.0, your AI assistant for NextGen IT Hub. How can I help you today?",
            },
          ],
        },
        ...contents,
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: systemContext }),
          signal: abortRef.current.signal,
        },
      );

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Gemini API error response:", errText);
        throw new Error(
          `Sorry, I couldn't get a response. Please try again. (Error: ${res.status})`,
        );
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr) as {
                candidates?: [{ content?: { parts?: [{ text?: string }] } }];
              };
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                accumulated += text;
                const snap = accumulated;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, text: snap, streaming: true }
                      : m,
                  ),
                );
              }
            } catch (parseErr) {
              console.error("Failed to parse SSE line:", jsonStr, parseErr);
            }
          }
        }
      } catch (streamErr: unknown) {
        const isAbort =
          streamErr instanceof DOMException && streamErr.name === "AbortError";
        if (!isAbort) {
          console.error("SSE stream parsing error:", streamErr);
          if (!accumulated) {
            throw new Error(
              "Sorry, I couldn't get a response. Please try again. (Stream error)",
            );
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text:
                  accumulated ||
                  "Sorry, I could not generate a response. Please try again.",
                streaming: false,
              }
            : m,
        ),
      );
    } catch (err: unknown) {
      const isAbort = err instanceof DOMException && err.name === "AbortError";
      if (!isAbort) {
        const errMsg =
          err instanceof Error
            ? err.message
            : "Network error. Please check your connection and try again.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  text: m.text || errMsg,
                  streaming: false,
                }
              : m,
          ),
        );
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const generateImage = async () => {
    if (!input.trim() || loading) return;
    const prompt = input.trim();
    const userMsg: Message = { id: makeId(), role: "user", text: prompt };
    const assistantId = makeId();
    const history = [...messages, userMsg];
    setMessages([
      ...history,
      {
        id: assistantId,
        role: "assistant",
        text: `Generating image for: "${prompt}"...`,
        streaming: true,
      },
    ]);
    setInput("");
    setLoading(true);

    try {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${Date.now()}`;
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = imageUrl;
        setTimeout(resolve, 10000);
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: `Here is your generated image for: "${prompt}"`,
                imageUrl,
                streaming: false,
              }
            : m,
        ),
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: "Image generation failed. Please try again with a different description.",
                streaming: false,
              }
            : m,
        ),
      );
    } finally {
      setLoading(false);
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
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-blue-300 text-xs">
                AI Assistant · Powered by Gemini · Live
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            onClick={() => {
              abortRef.current?.abort();
              setMessages([]);
              setLoading(false);
            }}
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
              {(mode === "chat"
                ? [
                    "What are the government job updates?",
                    "How to apply for Aadhaar card?",
                    "Tell me about NextGen IT Hub services",
                    "How to convert a PDF to JPG?",
                  ]
                : [
                    "A beautiful sunset over mountains",
                    "A futuristic city at night",
                    "A cute dog in a park",
                    "Abstract colorful art",
                  ]
              ).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s)}
                  className={`text-left rounded-xl px-4 py-3 text-sm transition-colors border ${
                    mode === "chat"
                      ? "bg-[#0d3460] hover:bg-blue-800 border-blue-700 text-blue-200"
                      : "bg-[#0d3460] hover:bg-purple-900 border-purple-700 text-purple-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
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
                {msg.streaming && (
                  <span className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 animate-pulse align-middle" />
                )}
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
            onClick={loading ? () => abortRef.current?.abort() : handleSend}
            disabled={!loading && !input.trim()}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              loading
                ? "bg-red-600 hover:bg-red-500"
                : mode === "image"
                  ? "bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900"
                  : "bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900"
            } disabled:cursor-not-allowed`}
            title={loading ? "Stop generating" : "Send"}
          >
            {loading ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} className="text-white" />
            )}
          </button>
        </div>
        <p className="text-center text-blue-500 text-xs mt-2">
          Manash 2.0 · Real-time AI by Google Gemini · Responses may not always
          be accurate
        </p>
      </div>
    </div>
  );
}
