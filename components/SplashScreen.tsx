"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tamil vowels + consonants to stream across the screen
const ALPHABET = [
  "அ","ஆ","இ","ஈ","உ","ஊ","எ","ஏ","ஐ","ஒ","ஓ","ஔ",
  "க","ங","ச","ஞ","ட","ண","த","ந","ப","ம","ய","ர","ல","வ","ழ","ள","ற","ன",
];

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [letterIndex, setLetterIndex] = useState(0);

  // Stream through letters
  useEffect(() => {
    if (!visible) return;
    if (letterIndex >= ALPHABET.length) return;
    const t = setTimeout(() => setLetterIndex((i) => i + 1), 80);
    return () => clearTimeout(t);
  }, [letterIndex, visible]);

  // Auto-dismiss after 3.2 s
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 flex flex-col items-center justify-center z-[200] select-none"
          style={{ background: "radial-gradient(ellipse at top, #8B2A3E 0%, #6B1A2A 55%, #3A0D18 100%)" }}
        >
          {/* Streaming alphabet letters only */}
          <div className="flex flex-wrap justify-center gap-4 px-8 max-w-3xl">
            {ALPHABET.slice(0, letterIndex).map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="font-display text-4xl md:text-5xl font-bold"
                style={{ color: i % 2 === 0 ? "#E8B84B" : "#C9922A" }}
              >
                {ch}
              </motion.span>
            ))}
          </div>

          {/* Skip hint */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            onClick={() => setVisible(false)}
            className="absolute bottom-8 text-cream/30 hover:text-cream/60 font-body text-xs tracking-widest transition-colors duration-200"
          >
            tap to skip ↓
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
