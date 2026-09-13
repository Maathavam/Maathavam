"use client";

import { useState, useEffect } from "react";
import { Quote } from "@/data/quotes";

interface InlineQuoteProps {
  quotes: Quote[];
  charDelayMs?: number;
}

export default function InlineQuote({ quotes, charDelayMs = 38 }: InlineQuoteProps) {
  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const fullText = `"${quotes[current].text}"`;

  // Typewriter: type out
  useEffect(() => {
    if (!typing) return;
    if (displayed.length >= fullText.length) {
      setTyping(false);
      return;
    }
    const t = setTimeout(() => setDisplayed(fullText.slice(0, displayed.length + 1)), charDelayMs);
    return () => clearTimeout(t);
  }, [displayed, typing, fullText, charDelayMs]);

  // After full text shown, wait then erase
  useEffect(() => {
    if (typing) return;
    const hold = setTimeout(() => {
      // erase
      const erase = setInterval(() => {
        setDisplayed((prev) => {
          if (prev.length <= 0) {
            clearInterval(erase);
            setCurrent((c) => (c + 1) % quotes.length);
            setTyping(true);
            return "";
          }
          return prev.slice(0, -1);
        });
      }, 18);
      return () => clearInterval(erase);
    }, 2800);
    return () => clearTimeout(hold);
  }, [typing, quotes.length]);

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mt-8 text-center min-h-[60px] flex flex-col items-center justify-center px-4">
      <p className="font-display text-base md:text-xl text-maroon/80 italic leading-relaxed">
        {displayed}
        <span className={`inline-block w-0.5 h-5 bg-gold ml-0.5 align-middle transition-opacity duration-100 ${showCursor ? "opacity-100" : "opacity-0"}`} />
      </p>
      {!typing && quotes[current].author && (
        <span className="text-gold font-body text-sm mt-1 block">
          — {quotes[current].author}
        </span>
      )}
    </div>
  );
}
