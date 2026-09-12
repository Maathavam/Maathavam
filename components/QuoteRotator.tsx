"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Quote } from "@/data/quotes";

interface QuoteRotatorProps {
  quotes: Quote[];
  intervalMs?: number;
}

export default function QuoteRotator({ quotes, intervalMs = 4500 }: QuoteRotatorProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % quotes.length);
  }, [quotes.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + quotes.length) % quotes.length);
  }, [quotes.length]);

  useEffect(() => {
    const timer = setInterval(goNext, intervalMs);
    return () => clearInterval(timer);
  }, [goNext, intervalMs]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4">
      {/* Quote box */}
      <div className="relative bg-maroon rounded-3xl px-8 py-10 md:px-14 md:py-14 shadow-maroon-glow overflow-hidden">
        {/* Decorative corner ornaments */}
        <span className="absolute top-4 left-4 text-gold/20 text-5xl font-display select-none">&ldquo;</span>
        <span className="absolute bottom-4 right-6 text-gold/20 text-5xl font-display select-none rotate-180">&rdquo;</span>

        <div className="min-h-[120px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-center"
            >
              <p className="font-display text-xl md:text-2xl lg:text-3xl text-cream leading-relaxed mb-4">
                {quotes[current].text}
              </p>
              {quotes[current].author && (
                <p className="text-gold font-body text-sm md:text-base font-medium">
                  — {quotes[current].author}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            id="quote-prev"
            onClick={goPrev}
            aria-label="Previous quote"
            className="w-9 h-9 rounded-full bg-gold/20 hover:bg-gold/40 text-gold flex items-center justify-center transition-colors duration-200"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2" role="tablist" aria-label="Quote indicators">
            {quotes.map((_, i) => (
              <button
                key={i}
                role="tab"
                id={`quote-dot-${i}`}
                aria-selected={i === current}
                aria-label={`Go to quote ${i + 1}`}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? "bg-gold w-6 h-2"
                    : "bg-gold/30 hover:bg-gold/50 w-2 h-2"
                }`}
              />
            ))}
          </div>

          <button
            id="quote-next"
            onClick={goNext}
            aria-label="Next quote"
            className="w-9 h-9 rounded-full bg-gold/20 hover:bg-gold/40 text-gold flex items-center justify-center transition-colors duration-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
