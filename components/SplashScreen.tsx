"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
 * Actual glyph paths for Tamil letter அ (U+0B85)
 * Extracted from NotoSansTamil-Regular.ttf at 200 px via opentype.js
 * ViewBox covers: x 0–215, y 55–215
 *
 * Three sub-paths in writing order:
 *  1. Outer body  — the main shape (loop + vertical pillar on right)
 *  2. Inner eye   — the small oval inside the loop (rendered as hole)
 *  3. Base        — the wide curved foot at the bottom
 */

const PATH_OUTER =
  "M68.40 198.80 L64.20 198.80 " +
  "Q35.20 198.80 20.50 188.50 Q5.80 178.20 5.80 162 " +
  "Q5.80 157 8 152.20 Q10.20 147.40 14.80 144.20 " +
  "Q17.40 142.40 20.40 141.20 Q23.40 140 28.30 139.40 " +
  "Q33.20 138.80 41.20 138.80 L144.20 138.80 " +
  "Q146 131.80 146 123.80 Q146 109.40 139.80 96.90 " +
  "Q133.60 84.40 120.20 78.60 " +
  "Q122.40 82.20 123.80 86.30 Q125.20 90.40 125.20 94.80 " +
  "Q125.20 108.80 116.80 117.30 Q108.40 125.80 92.60 125.80 " +
  "Q79 125.80 69.50 118.20 Q60 110.60 60 95.40 " +
  "Q60 83 65.80 75.40 Q71.60 67.80 80.90 64.30 " +
  "Q90.20 60.80 100.60 60.80 Q116 60.80 127.70 66 " +
  "Q139.40 71.20 147.30 80.20 Q155.20 89.20 159.20 100.40 " +
  "Q163.20 111.60 163.20 123.60 Q163.20 131.60 162 138.80 " +
  "L189.40 138.80 L189.40 63.20 L206.60 63.20 " +
  "L206.60 204.80 L189.40 204.80 L189.40 153.20 " +
  "L157.80 153.20 " +
  "Q151.20 168 138.20 178.20 Q125.20 188.40 107.40 193.60 " +
  "Q89.60 198.80 68.40 198.80 Z";

const PATH_INNER =
  "M75.80 94.60 " +
  "Q75.80 102 80.30 107.10 Q84.80 112.20 93 112.20 " +
  "Q100.60 112.20 105.10 107.50 Q109.60 102.80 109.60 94 " +
  "Q109.60 88.40 108.10 83.70 Q106.60 79 102.80 74.80 " +
  "Q100.80 74.60 98.60 74.60 " +
  "Q89.20 74.60 82.50 79.60 Q75.80 84.60 75.80 94.60 Z";

const PATH_BASE =
  "M65.40 184.20 L68.80 184.20 " +
  "Q96.40 184.20 113.60 175.50 Q130.80 166.80 139 153.20 " +
  "L43.40 153.20 " +
  "Q37.20 153.20 33.90 153.40 Q30.60 153.60 29 154.20 " +
  "Q27.40 154.80 25.80 156 Q22.80 158.40 22.80 162.80 " +
  "Q22.80 172.60 33.40 178.40 Q44 184.20 65.40 184.20 Z";

// Background color for the splash (used to "knock out" the inner eye)
const BG = "#2A0508";
const GOLD = "#E8B84B";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  // phase 0 = drawing strokes
  // phase 1 = fill appears
  // phase 2 = name subtitle shown

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 3000); // strokes done → fill
    const t2 = setTimeout(() => setPhase(2), 3400); // name fades in
    const t3 = setTimeout(() => setVisible(false), 4600); // unmount
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const filled = phase >= 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
          style={{ background: `radial-gradient(ellipse at center, #5A1020 0%, ${BG} 100%)` }}
        >
          {/* Ambient glow behind the letter */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 320, height: 220,
              background: "radial-gradient(ellipse, rgba(232,184,75,0.13) 0%, transparent 70%)",
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* ── Hand-drawn அ glyph ── */}
          <svg
            viewBox="0 55 215 162"
            width="280"
            height="210"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Tamil letter அ"
          >
            <defs>
              <filter id="ink-glow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* === Stroke 1: outer body (drawn first, ~1.8 s) === */}
            <motion.path
              d={PATH_OUTER}
              stroke={GOLD}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ink-glow)"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.8, ease: [0.3, 0, 0.2, 1], delay: 0.3 },
                opacity:     { duration: 0.15, delay: 0.3 },
              }}
            />
            {/* Fill layer for outer body (appears after drawing) */}
            <motion.path
              d={PATH_OUTER}
              fill={GOLD}
              stroke="none"
              filter="url(#ink-glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: filled ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* === Stroke 2: inner eye (drawn after body, ~0.5 s) === */}
            <motion.path
              d={PATH_INNER}
              stroke={GOLD}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ink-glow)"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 0.55, ease: [0.3, 0, 0.2, 1], delay: 2.2 },
                opacity:     { duration: 0.15, delay: 2.2 },
              }}
            />
            {/* Inner eye fill — BG colour to knock out the hole */}
            <motion.path
              d={PATH_INNER}
              fill={BG}
              stroke="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: filled ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* === Stroke 3: base/foot (drawn last, ~0.5 s) === */}
            <motion.path
              d={PATH_BASE}
              stroke={GOLD}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ink-glow)"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 0.5, ease: [0.3, 0, 0.2, 1], delay: 2.25 },
                opacity:     { duration: 0.15, delay: 2.25 },
              }}
            />
            <motion.path
              d={PATH_BASE}
              fill={GOLD}
              stroke="none"
              filter="url(#ink-glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: filled ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* ── மாதவம் subtitle ── */}
          <motion.div
            className="mt-3 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 8 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="font-display text-gold-light text-xl sm:text-2xl font-bold tracking-widest"
              style={{ textShadow: "0 0 20px rgba(232,184,75,0.5)" }}
            >
              மாதவம்
            </p>
            <p className="font-body text-cream/30 text-[11px] tracking-[0.4em] uppercase mt-1">
              Maathavam
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
