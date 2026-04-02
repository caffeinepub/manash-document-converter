import { Bot, Image, Send, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";

const OPENAI_API_KEY = "28f42369-c34a-4804-8657-f36363c9b67f";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const CHAT_MODEL = "gpt-4o-mini";
const GEMINI_API_KEY = "AIzaSyCLjvyMd0-jeQBGRjkD9c1JgAv77niQXC8";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT =
  "You are Manash 2.0, a helpful AI assistant for NextGen IT Hub. Be concise, friendly, and helpful.";

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

  const { ref: welcomeRef, inView: welcomeInView } = useInView();

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
      const openaiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
        })),
      ];

      const res = await fetch(OPENAI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: CHAT_MODEL,
          messages: openaiMessages,
          stream: true,
        }),
        signal: abortRef.current.signal,
      });

      // Use Gemini fallback if OpenAI returns error (invalid key, quota, etc.)
      const useGemini = !res.ok;
      if (useGemini) {
        console.warn(`OpenAI error ${res.status}, falling back to Gemini`);
      }

      let accumulated = "";

      if (!useGemini) {
        if (!res.body) throw new Error("No response body");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

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
                  choices?: [{ delta?: { content?: string }; index: number }];
                };
                const text = parsed?.choices?.[0]?.delta?.content;
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
            streamErr instanceof DOMException &&
            streamErr.name === "AbortError";
          if (!isAbort) {
            console.error("SSE stream parsing error:", streamErr);
          }
        }
      }

      // Gemini fallback (or if OpenAI returned empty)
      if (useGemini || !accumulated) {
        const geminiBody = {
          contents: history.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
        };
        const gRes = await fetch(GEMINI_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody),
          signal: abortRef.current?.signal,
        });
        if (gRes.ok && gRes.body) {
          const gReader = gRes.body.getReader();
          const gDecoder = new TextDecoder();
          try {
            while (true) {
              const { done, value } = await gReader.read();
              if (done) break;
              const chunk = gDecoder.decode(value, { stream: true });
              for (const line of chunk.split("\n")) {
                if (!line.trim()) continue;
                const dataLine = line.startsWith("data: ")
                  ? line.slice(6).trim()
                  : line.trim();
                if (!dataLine || dataLine === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(dataLine);
                  const text =
                    parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
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
                } catch {
                  // skip unparseable lines
                }
              }
            }
          } catch (gErr: unknown) {
            const isAbort =
              gErr instanceof DOMException && gErr.name === "AbortError";
            if (!isAbort) console.error("Gemini stream error:", gErr);
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
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.12 0.03 250) 0%, oklch(0.15 0.05 260) 50%, oklch(0.13 0.04 240) 100%)",
      }}
    >
      {/* Header */}
      <div
        className="border-b px-4 py-4 flex items-center justify-between animate-fade-in-up"
        style={{
          background: "oklch(0.14 0.04 250 / 0.9)",
          borderColor: "oklch(0.25 0.06 250)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center animate-glow-pulse"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.65 0.2 55))",
            }}
          >
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h1
              className="font-bold text-lg leading-tight font-display"
              style={{ color: "oklch(0.95 0.02 240)" }}
            >
              Manash 2.0
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs" style={{ color: "oklch(0.78 0.18 65)" }}>
                AI Assistant · OpenAI + Gemini · Live
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex rounded-full p-1 gap-1"
            style={{ background: "oklch(0.18 0.05 250)" }}
          >
            <button
              type="button"
              onClick={() => setMode("chat")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                mode === "chat" ? "text-white shadow" : "hover:text-white"
              }`}
              style={
                mode === "chat"
                  ? {
                      background: "oklch(0.78 0.18 65)",
                      color: "oklch(0.12 0.03 250)",
                    }
                  : { color: "oklch(0.6 0.04 240)" }
              }
            >
              💬 Chat
            </button>
            <button
              type="button"
              onClick={() => setMode("image")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                mode === "image" ? "text-white shadow" : "hover:text-white"
              }`}
              style={
                mode === "image"
                  ? {
                      background: "oklch(0.55 0.18 280)",
                      color: "oklch(0.95 0.02 240)",
                    }
                  : { color: "oklch(0.6 0.04 240)" }
              }
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
            className="transition-colors p-2"
            style={{ color: "oklch(0.6 0.04 240)" }}
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <div
            ref={welcomeRef as React.RefObject<HTMLDivElement>}
            className={`text-center mt-16 transition-all duration-700 ${
              welcomeInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.65 0.2 55))",
              }}
            >
              <Bot size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 font-display gradient-text-gold">
              Hello! I'm Manash 2.0
            </h2>
            <p
              className="text-sm max-w-md mx-auto"
              style={{ color: "oklch(0.6 0.04 240)" }}
            >
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
              ).map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s)}
                  className="text-left rounded-xl px-4 py-3 text-sm transition-all border hover-lift animate-scale-in"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    background: "oklch(0.18 0.05 250)",
                    borderColor: "oklch(0.25 0.06 250)",
                    color: "oklch(0.78 0.04 240)",
                  }}
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
            className={`flex gap-3 animate-fade-in-up ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{
                background:
                  msg.role === "user"
                    ? "oklch(0.35 0.12 240)"
                    : "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.65 0.2 55))",
              }}
            >
              {msg.role === "user" ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
              }`}
              style={{
                background:
                  msg.role === "user"
                    ? "oklch(0.35 0.12 240)"
                    : "oklch(0.18 0.05 250)",
                border:
                  msg.role === "assistant"
                    ? "1px solid oklch(0.25 0.06 250)"
                    : "none",
                color: "oklch(0.92 0.02 240)",
              }}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.text}
                {msg.streaming && (
                  <span
                    className="inline-block w-0.5 h-4 ml-0.5 animate-pulse align-middle"
                    style={{ background: "oklch(0.78 0.18 65)" }}
                  />
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
      <div
        className="border-t px-4 py-4"
        style={{
          borderColor: "oklch(0.25 0.06 250)",
          background: "oklch(0.14 0.04 250 / 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <div
            className="flex-1 rounded-2xl px-4 py-3 flex items-end gap-2"
            style={{
              background: "oklch(0.18 0.05 250)",
              border: "1px solid oklch(0.25 0.06 250)",
            }}
          >
            {mode === "image" && (
              <Image
                size={16}
                className="mb-0.5 flex-shrink-0"
                style={{ color: "oklch(0.72 0.18 200)" }}
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
              className="flex-1 bg-transparent text-sm resize-none outline-none max-h-32"
              style={{
                lineHeight: "1.5",
                color: "oklch(0.95 0.02 240)",
              }}
            />
          </div>
          <button
            type="button"
            onClick={loading ? () => abortRef.current?.abort() : handleSend}
            disabled={!loading && !input.trim()}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: loading
                ? "oklch(0.55 0.2 25)"
                : "oklch(0.78 0.18 65)",
              color: "oklch(0.12 0.03 250)",
            }}
            title={loading ? "Stop generating" : "Send"}
          >
            {loading ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        <p
          className="text-center text-xs mt-2"
          style={{ color: "oklch(0.45 0.04 240)" }}
        >
          Manash 2.0 · OpenAI + Gemini Fallback · Responses may not always be
          accurate
        </p>
      </div>
    </div>
  );
}
