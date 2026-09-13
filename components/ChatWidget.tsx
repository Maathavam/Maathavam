"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

const WELCOME: Message = {
  role: "model",
  parts: [{ text: "வணக்கம்! 🙏\nI'm the மாதவம் assistant. Ask me anything about our events, Tamil culture, or how to get involved!\n\nHello! How can I help you today?" }],
};

const SUGGESTIONS = [
  "What is Maathavam?",
  "மாதவம் நிகழ்வுகள் என்ன?",
  "How to join?",
  "Tell me about Pongal Vizha",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setShowSuggestions(false);

    const userMsg: Message = { role: "user", parts: [{ text }] };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const json = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: json.text ?? "மன்னிக்கவும், மீண்டும் முயற்சிக்கவும். Sorry, please try again." }] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Connection error. Please try again." }] },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Chat Panel ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] max-w-sm flex flex-col rounded-3xl overflow-hidden shadow-2xl"
            style={{ height: "min(520px, 80vh)" }}
          >
            {/* Header */}
            <div className="bg-maroon-dark px-4 py-3.5 flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                  <Bot size={18} className="text-gold-light" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-maroon-dark" />
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-gold-light text-sm leading-tight">மாதவம் உதவியாளர்</p>
                <p className="text-cream/40 text-xs font-body">Maathavam Assistant · Online</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-cream/40 hover:text-cream transition-colors duration-200 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-cream px-3 py-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "model" && (
                    <div className="w-6 h-6 rounded-full bg-maroon flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <Bot size={12} className="text-gold" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm font-body leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-maroon text-cream-dark rounded-br-sm"
                        : "bg-white text-ink shadow-sm rounded-bl-sm border border-cream-dark"
                    }`}
                  >
                    {msg.parts[0].text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-maroon flex items-center justify-center flex-shrink-0">
                    <Bot size={12} className="text-gold" />
                  </div>
                  <div className="bg-white border border-cream-dark rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm flex items-center gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 bg-maroon/40 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: d * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {showSuggestions && messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs font-body text-maroon border border-maroon/30 bg-white hover:bg-maroon hover:text-cream px-2.5 py-1.5 rounded-full transition-all duration-200"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="bg-white border-t border-cream-dark px-3 py-3 flex items-center gap-2 flex-shrink-0"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type in Tamil or English..."
                disabled={loading}
                className="flex-1 bg-cream rounded-xl px-3 py-2 text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60 placeholder:text-ink-light/60"
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || loading}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-maroon text-cream disabled:opacity-40 hover:bg-maroon-dark transition-colors duration-200 flex-shrink-0"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ──────────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((p) => !p)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-maroon shadow-maroon-glow flex items-center justify-center"
        aria-label="Open Maathavam chat assistant"
        id="chat-widget-toggle"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={22} className="text-cream-dark" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle size={24} className="text-gold-light" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full bg-maroon"
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </motion.button>
    </>
  );
}
