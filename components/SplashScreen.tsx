"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
 * Tamil letter அ — cinematic hand-drawn splash
 * Glyph paths: NotoSansTamil-Regular.ttf extracted via opentype.js
 * ViewBox: 0 55 215 162
 *
 * STROKE ORDER (from reference video + brief):
 *  S1 — Inner eye      : tight clockwise circle from ~10 o'clock
 *  S2 — Curved bowl    : from top of eye, sweeps left-down, arches up-right
 *  S3 — Horizontal bar : extends right from the bowl to the pillar
 *  S4 — Vertical drop  : reappears top-right, drops straight down
 */

// S1 — Inner eye (clockwise from top-left, ~10 o'clock)
const S1 =
  "M82.50 79.60 " +
  "Q89.20 74.60 98.60 74.60 " +
  "Q104 74.80 108.10 83.70 Q109.60 88.40 109.60 94 " +
  "Q109.60 102.80 105.10 107.50 Q100.60 112.20 93 112.20 " +
  "Q84.80 112.20 80.30 107.10 Q75.80 102 75.80 94.60 " +
  "Q75.80 84.60 82.50 79.60 Z";

// S2 — Curved bowl: starts at top of letter, sweeps LEFT-DOWN,
//      arches around, comes back UP-RIGHT, closes into bar level
const S2 =
  "M80.90 64.30 " +
  // swoop down-left (outer left edge)
  "Q71.60 67.80 65.80 75.40 Q60 83 60 95.40 " +
  "Q60 110.60 69.50 118.20 Q79 125.80 92.60 125.80 " +
  "Q108.40 125.80 116.80 117.30 Q125.20 108.80 125.20 94.80 " +
  "Q125.20 90.40 123.80 86.30 Q122.40 82.20 120.20 78.60 " +
  // arch up-right (outer right edge)
  "Q133.60 84.40 139.80 96.90 Q146 109.40 146 123.80 " +
  "Q146 131.80 144.20 138.80 " +
  // sweep back across to close (bottom base approach)
  "L41.20 138.80 " +
  "Q33.20 138.80 28.30 139.40 Q23.40 140 20.40 141.20 " +
  "Q17.40 142.40 14.80 144.20 Q10.20 147.40 8 152.20 " +
  "Q5.80 157 5.80 162 " +
  "Q5.80 178.20 20.50 188.50 Q35.20 198.80 64.20 198.80 " +
  "L68.40 198.80 " +
  "Q89.60 198.80 107.40 193.60 Q125.20 188.40 138.20 178.20 " +
  "Q151.20 168 157.80 153.20";

// S3 — Horizontal glide: straight right toward the pillar
const S3 =
  "M157.80 153.20 L189.40 153.20 " +
  "L162 138.80 L189.40 138.80";

// S4 — Vertical drop: reappears top-right, falls to bottom
const S4 =
  "M189.40 63.20 L206.60 63.20 " +
  "L206.60 204.80 L189.40 204.80 " +
  "L189.40 153.20";

// Complete fill paths (used when letter fills gold)
const FILL_OUTER =
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

const FILL_EYE = S1;   // rendered in BG colour to create hole

const BG          = "#1A0308";
const GOLD        = "#E8B84B";
const GOLD_LIGHT  = "#F5D78E";
const GOLD_BRIGHT = "#FFF8DC";

// ── Stardust particles ────────────────────────────────────────────────────────
interface Particle { id: number; x: number; y: number; size: number; delay: number; dur: number; opacity: number; }
function makeParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x:       Math.random() * 100,
    y:       Math.random() * 100,
    size:    Math.random() * 2.5 + 0.8,
    delay:   Math.random() * 5,
    dur:     Math.random() * 4 + 3,
    opacity: Math.random() * 0.45 + 0.08,
  }));
}

// Timing (seconds for SVG animateMotion / Framer Motion)
const T = {
  s1Start: 0.3,  s1Dur: 0.7,
  s2Start: 1.1,  s2Dur: 1.6,
  s3Start: 2.8,  s3Dur: 0.45,
  s4Start: 3.35, s4Dur: 0.65,
  // all strokes done ≈ 4.0s
  fillMs:  4100,
  burstMs: 4700,
  flashMs: 5500,
  doneMs:  6200,
};

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [phase,   setPhase]   = useState(0);
  // 0=drawing  1=filled  2=burst  3=flash/reveal

  const particles = useMemo(() => makeParticles(55), []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), T.fillMs);
    const t2 = setTimeout(() => setPhase(2), T.burstMs);
    const t3 = setTimeout(() => setPhase(3), T.flashMs);
    const t4 = setTimeout(() => setVisible(false), T.doneMs);
    return () => { [t1,t2,t3,t4].forEach(clearTimeout); };
  }, []);

  const filled   = phase >= 1;
  const bursting = phase >= 2;
  const flashing = phase >= 3;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] overflow-hidden select-none"
          style={{ background: `radial-gradient(ellipse at 50% 38%, #3D0A14 0%, ${BG} 100%)` }}
        >

          {/* ── Floating stardust particles ────────────────────────────────── */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left:   `${p.x}%`,
                top:    `${p.y}%`,
                width:  p.size,
                height: p.size,
                background: GOLD,
                boxShadow:  `0 0 ${p.size * 3}px ${GOLD}`,
              }}
              animate={{
                y:       [0, -50, 0],
                opacity: bursting ? [p.opacity, 0] : [p.opacity, p.opacity * 1.6, p.opacity],
              }}
              transition={{
                y:       { duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: bursting ? 0.4 : p.dur, delay: p.delay, repeat: bursting ? 0 : Infinity },
              }}
            />
          ))}

          {/* ── Centred layout ─────────────────────────────────────────────── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">

            {/* Soft ambient glow around letter (always present) */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 420, height: 300,
                background: "radial-gradient(ellipse, rgba(232,184,75,0.11) 0%, transparent 70%)",
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2 }}
            />

            {/* ── GOLDEN LIGHT BURST ─────────────────────────────────────── */}
            {/* Main radial flood */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                inset: 0,
                background: `radial-gradient(ellipse at 50% 47%,
                  ${GOLD_BRIGHT} 0%,
                  ${GOLD_LIGHT}  6%,
                  ${GOLD}        20%,
                  #C9922A        38%,
                  transparent    62%)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale:   bursting ? 5.5 : 0,
                opacity: bursting ? (flashing ? 0 : 1) : 0,
              }}
              transition={{
                scale:   { duration: 1.0, ease: [0.15, 0, 0.05, 1] },
                opacity: { duration: flashing ? 0.55 : 0.12 },
              }}
            />

            {/* Expanding shockwave rings */}
            {bursting && [0,1,2,3,4].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 210, height: 170,
                  border: `${Math.max(0.8, 2.5 - i * 0.4)}px solid rgba(245,215,142,${0.85 - i * 0.14})`,
                  boxShadow: `0 0 12px rgba(232,184,75,${0.4 - i * 0.07})`,
                }}
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 9, opacity: 0 }}
                transition={{ duration: 1.6, delay: i * 0.13, ease: "easeOut" }}
              />
            ))}

            {/* ── SVG letter அ ───────────────────────────────────────────── */}
            <motion.div
              animate={{ opacity: flashing ? 0 : 1 }}
              transition={{ duration: 0.38 }}
            >
              <svg
                viewBox="0 55 215 162"
                width="290"
                height="218"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Tamil letter அ"
                overflow="visible"
              >
                <defs>
                  {/* Trail glow */}
                  <filter id="trail-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  {/* Bright nib glow */}
                  <filter id="nib-glow" x="-120%" y="-120%" width="340%" height="340%">
                    <feGaussianBlur stdDeviation="7" result="b1" />
                    <feGaussianBlur stdDeviation="14" result="b2" />
                    <feMerge>
                      <feMergeNode in="b2" />
                      <feMergeNode in="b1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  {/* Fill glow */}
                  <filter id="fill-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* ════ STROKE 1 — Inner eye (clockwise from 10 o'clock) ════ */}
                <motion.path d={S1}
                  stroke={GOLD} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
                  fill="none" filter="url(#trail-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: T.s1Dur, ease: [0.4,0,0.2,1], delay: T.s1Start },
                    opacity:    { duration: 0.1, delay: T.s1Start },
                  }}
                />
                {/* Nib */}
                <circle r="8" fill={GOLD_BRIGHT} filter="url(#nib-glow)">
                  <animateMotion dur={`${T.s1Dur}s`} begin={`${T.s1Start}s`} fill="freeze" path={S1} />
                </circle>

                {/* ════ STROKE 2 — Curved bowl (swoop down-left, arch up-right) ════ */}
                <motion.path d={S2}
                  stroke={GOLD} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
                  fill="none" filter="url(#trail-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: T.s2Dur, ease: [0.4,0,0.2,1], delay: T.s2Start },
                    opacity:    { duration: 0.1, delay: T.s2Start },
                  }}
                />
                <circle r="8" fill={GOLD_BRIGHT} filter="url(#nib-glow)">
                  <animateMotion dur={`${T.s2Dur}s`} begin={`${T.s2Start}s`} fill="freeze" path={S2} />
                </circle>

                {/* ════ STROKE 3 — Horizontal glide (straight right) ════ */}
                <motion.path d={S3}
                  stroke={GOLD} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
                  fill="none" filter="url(#trail-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: T.s3Dur, ease: [0.4,0,0.2,1], delay: T.s3Start },
                    opacity:    { duration: 0.1, delay: T.s3Start },
                  }}
                />
                <circle r="8" fill={GOLD_BRIGHT} filter="url(#nib-glow)">
                  <animateMotion dur={`${T.s3Dur}s`} begin={`${T.s3Start}s`} fill="freeze" path={S3} />
                </circle>

                {/* ════ STROKE 4 — Vertical drop (top-right → straight down) ════ */}
                {/* Brief pause then nib reappears at top-right */}
                <motion.path d={S4}
                  stroke={GOLD} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
                  fill="none" filter="url(#trail-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: T.s4Dur, ease: [0.5,0,0.3,1], delay: T.s4Start },
                    opacity:    { duration: 0.08, delay: T.s4Start },
                  }}
                />
                <circle r="8" fill={GOLD_BRIGHT} filter="url(#nib-glow)">
                  <animateMotion dur={`${T.s4Dur}s`} begin={`${T.s4Start}s`} fill="freeze" path={S4} />
                </circle>

                {/* ════ FILL LAYERS (appear after all strokes) ════ */}
                <motion.path d={FILL_OUTER} fill={GOLD} stroke="none" filter="url(#fill-glow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: filled ? 1 : 0 }}
                  transition={{ duration: 0.45 }}
                />
                {/* Knock-out inner eye (BG colour to create hole) */}
                <motion.path d={FILL_EYE} fill={BG} stroke="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: filled ? 1 : 0 }}
                  transition={{ duration: 0.45 }}
                />

                {/* Letter pulse flash at fill moment */}
                <motion.path d={FILL_OUTER} fill={GOLD_BRIGHT} stroke="none" filter="url(#nib-glow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: filled ? [0, 0.95, 0] : 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                />
              </svg>
            </motion.div>

            {/* ── Subtitle fades in with fill, washed away by burst ─────── */}
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: filled && !flashing ? 1 : 0, y: filled ? 0 : 8 }}
              transition={{ duration: 0.65 }}
            >
              <p
                className="font-display text-gold-light text-xl sm:text-2xl font-bold tracking-widest"
                style={{ textShadow: "0 0 24px rgba(232,184,75,0.7)" }}
              >
                மாதவம்
              </p>
              <p className="font-body text-cream/35 text-[11px] tracking-[0.45em] uppercase mt-1">
                Maathavam
              </p>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
