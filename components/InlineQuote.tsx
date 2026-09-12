"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "@/data/quotes";

interface InlineQuoteProps {
  quotes: Quote[];
  intervalMs?: number;
}

export default function InlineQuote({ quotes, intervalMs = 5000 }: InlineQuoteProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % quotes.length);
  }, [quotes.length]);

  useEffect(() => {
    const timer = setInterval(goNext, intervalMs);
    return () => clearInterval(timer);
  }, [goNext, intervalMs]);

  const variants = {
    enter: (dir: number) => ({ y: dir > 0 ? 16 : -16, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit:  (dir: number) => ({ y: dir > 0 ? -16 : 16, opacity: 0 }),
  };

  return (
    <div className="mt-8 text-center min-h-[56px] flex items-center justify-center px-4">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.p
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="font-display text-base md:text-xl text-maroon/80 italic leading-relaxed"
        >
          &ldquo;{quotes[current].text}&rdquo;
          {quotes[current].author && (
            <span className="not-italic text-gold font-body text-sm md:text-base ml-2">
              — {quotes[current].author}
            </span>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
