"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
 * Actual glyph paths for Tamil letter அ (U+0B85)
 * Extracted from NotoSansTamil-Regular.ttf at 200 px via opentype.js
 * ViewBox: 0 55 215 162
 *
 * NOTE: Stroke order will be updated once reference video is reviewed.
 * Current order: vertical pillar → outer loop → inner eye → base foot
 *
 * Stroke 1 — right vertical pillar (the tall upright bar)
 * Stroke 2 — outer loop / head of அ  (the curved bowl to the left)
 * Stroke 3 — inner eye  (small oval inside the loop)
 * Stroke 4 — base foot  (wide curved foot at the bottom)
 */

// Stroke 1: right vertical pillar  L189.40,63.20 → L206.60,63.20 → L206.60,204.80 → L189.40,204.80
const PATH_PILLAR =
  "M189.40 63.20 L206.60 63.20 L206.60 204.80 L189.40 204.80 Z";

// Stroke 2: outer loop (the main curved bowl of அ, connected to pillar at 138.80)
const PATH_LOOP =
  "M162 138.80 " +
  "Q163.20 131.60 163.20 123.60 Q163.20 111.60 159.20 100.40 " +
  "Q155.20 89.20 147.30 80.20 Q139.40 71.20 127.70 66 " +
  "Q116 60.80 100.60 60.80 " +
  "Q90.20 60.80 80.90 64.30 Q71.60 67.80 65.80 75.40 " +
  "Q60 83 60 95.40 " +
  "Q60 110.60 69.50 118.20 Q79 125.80 92.60 125.80 " +
  "Q108.40 125.80 116.80 117.30 Q125.20 108.80 125.20 94.80 " +
  "Q125.20 90.40 123.80 86.30 Q122.40 82.20 120.20 78.60 " +
  "Q133.60 84.40 139.80 96.90 Q146 109.40 146 123.80 " +
  "Q146 131.80 144.20 138.80 " +
  "L41.20 138.80 " +
  "Q33.20 138.80 28.30 139.40 Q23.40 140 20.40 141.20 " +
  "Q17.40 142.40 14.80 144.20 Q10.20 147.40 8 152.20 " +
  "Q5.80 157 5.80 162 " +
  "Q5.80 178.20 20.50 188.50 Q35.20 198.80 64.20 198.80 " +
  "L68.40 198.80 " +
  "Q89.60 198.80 107.40 193.60 Q125.20 188.40 138.20 178.20 " +
  "Q151.20 168 157.80 153.20 " +
  "L189.40 153.20 L189.40 138.80 Z";

// Stroke 3: inner eye (the small oval cut-out inside the loop)
const PATH_INNER =
  "M75.80 94.60 " +
  "Q75.80 84.60 82.50 79.60 Q89.20 74.60 98.60 74.60 " +
  "Q100.80 74.60 102.80 74.80 " +
  "Q106.60 79 108.10 83.70 Q109.60 88.40 109.60 94 " +
  "Q109.60 102.80 105.10 107.50 Q100.60 112.20 93 112.20 " +
  "Q84.80 112.20 80.30 107.10 Q75.80 102 75.80 94.60 Z";

// Stroke 4: base foot (curved horizontal element at the bottom)
const PATH_BASE =
  "M139 153.20 " +
  "Q130.80 166.80 113.60 175.50 Q96.40 184.20 68.80 184.20 " +
  "L65.40 184.20 " +
  "Q44 184.20 33.40 178.40 Q22.80 172.60 22.80 162.80 " +
  "Q22.80 158.40 25.80 156 Q27.40 154.80 29 154.20 " +
  "Q30.60 153.60 33.90 153.40 Q37.20 153.20 43.40 153.20 Z";

const BG = "#2A0508";
const GOLD = "#E8B84B";

// ── Phases ────────────────────────────────────────────────────────────────────
// 0 → drawing strokes
// 1 → fill letter gold
// 2 → light burst expands across screen
// 3 → white flash → fade out to site

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Stroke 1 starts at 0.2s (0.6s duration)
    // Stroke 2 starts at 0.9s (1.4s duration) → ends ~2.3s
    // Stroke 3 starts at 2.4s (0.5s duration) → ends ~2.9s
    // Stroke 4 starts at 2.5s (0.5s duration) → ends ~3.0s
    const t1 = setTimeout(() => setPhase(1), 3200);  // fill gold
    const t2 = setTimeout(() => setPhase(2), 3700);  // light burst
    const t3 = setTimeout(() => setPhase(3), 4400);  // white flash
    const t4 = setTimeout(() => setVisible(false), 5000); // unmount
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const filled = phase >= 1;
  const bursting = phase >= 2;
  const flashing = phase >= 3;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{ background: `radial-gradient(ellipse at center, #5A1020 0%, ${BG} 100%)` }}
        >

          {/* ── Light burst — radial glow expanding from letter center ── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: "100vw", height: "100vh",
              background: `radial-gradient(ellipse at 50% 48%, #F5D78E 0%, ${GOLD} 15%, #C9922A 35%, transparent 65%)`,
              top: 0, left: 0,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: bursting ? 4 : 0,
              opacity: bursting ? (flashing ? 0 : 0.95) : 0,
            }}
            transition={{
              scale:   { duration: 0.8, ease: [0.2, 0, 0.1, 1] },
              opacity: { duration: flashing ? 0.6 : 0.15 },
            }}
          />

          {/* ── Ripple rings expanding outward from center ── */}
          {bursting && [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none border border-gold/60"
              style={{ width: 200, height: 150 }}
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 8, opacity: 0 }}
              transition={{
                duration: 1.2,
                delay: i * 0.18,
                ease: "easeOut",
              }}
            />
          ))}

          {/* ── Ambient glow (always present) ── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 320, height: 220,
              background: "radial-gradient(ellipse, rgba(232,184,75,0.15) 0%, transparent 70%)",
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* ── Hand-drawn அ glyph ── */}
          <motion.div
            animate={{ opacity: flashing ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <svg
              viewBox="0 55 215 162"
              width="280"
              height="210"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Tamil letter அ"
            >
              <defs>
                <filter id="ink-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* === STROKE 1: vertical pillar (right bar) === */}
              <motion.path d={PATH_PILLAR}
                stroke={GOLD} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                fill="none" filter="url(#ink-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 },
                  opacity:    { duration: 0.1, delay: 0.2 },
                }}
              />
              <motion.path d={PATH_PILLAR} fill={GOLD} stroke="none" filter="url(#ink-glow)"
                initial={{ opacity: 0 }} animate={{ opacity: filled ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />

              {/* === STROKE 2: outer loop / bowl === */}
              <motion.path d={PATH_LOOP}
                stroke={GOLD} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                fill="none" filter="url(#ink-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.9 },
                  opacity:    { duration: 0.1, delay: 0.9 },
                }}
              />
              <motion.path d={PATH_LOOP} fill={GOLD} stroke="none" filter="url(#ink-glow)"
                initial={{ opacity: 0 }} animate={{ opacity: filled ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />

              {/* === STROKE 3: inner eye (drawn after loop) === */}
              <motion.path d={PATH_INNER}
                stroke={GOLD} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                fill="none" filter="url(#ink-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 2.5 },
                  opacity:    { duration: 0.1, delay: 2.5 },
                }}
              />
              {/* knock-out hole */}
              <motion.path d={PATH_INNER} fill={BG} stroke="none"
                initial={{ opacity: 0 }} animate={{ opacity: filled ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />

              {/* === STROKE 4: base foot === */}
              <motion.path d={PATH_BASE}
                stroke={GOLD} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                fill="none" filter="url(#ink-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 2.55 },
                  opacity:    { duration: 0.1, delay: 2.55 },
                }}
              />
              <motion.path d={PATH_BASE} fill={GOLD} stroke="none" filter="url(#ink-glow)"
                initial={{ opacity: 0 }} animate={{ opacity: filled ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
            </svg>
          </motion.div>

          {/* ── மாதவம் subtitle — fades in with fill, then washed away by burst ── */}
          <motion.div
            className="mt-3 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: filled && !flashing ? 1 : 0,
              y: filled ? 0 : 8,
            }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="font-display text-gold-light text-xl sm:text-2xl font-bold tracking-widest"
              style={{ textShadow: "0 0 20px rgba(232,184,75,0.6)" }}
            >
              மாதவம்
            </p>
            <p className="font-body text-cream/40 text-[11px] tracking-[0.4em] uppercase mt-1">
              Maathavam
            </p>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
