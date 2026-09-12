"use client";

import { useEffect, useState } from "react";

const TAMIL_CHARS = [
  "அ","ஆ","இ","ஈ","உ","ஊ","எ","ஏ","ஐ","ஒ","ஓ","ஔ",
  "க","ச","ட","த","ந","ப","ம","ய","ர","ல","வ","ழ","ள","ற","ன",
  "ஞ","ண","ங","ஜ","ஷ","ஸ",
  "கி","மா","தி","ரா","வி","லை","கா","ணி","ரி","தா","மி",
  "தமிழ்","இயல்","இசை",
];

interface Particle {
  id: number;
  char: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  isGold: boolean;
  animName: string;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function FloatingTamilLetters() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [keyframes, setKeyframes] = useState("");

  useEffect(() => {
    const items: Particle[] = [];
    let kf = "";

    for (let i = 0; i < 24; i++) {
      const drift = rand(-45, 45);
      const name  = `tf${i}`;
      kf += `
        @keyframes ${name} {
          0%   { transform: translateY(0px) translateX(0px) rotate(-5deg); opacity: 0; }
          10%  { opacity: 0.22; }
          50%  { transform: translateY(-50vh) translateX(${drift}px) rotate(3deg); opacity: 0.18; }
          90%  { opacity: 0.12; }
          100% { transform: translateY(-108vh) translateX(${drift * 1.5}px) rotate(10deg); opacity: 0; }
        }
      `;
      items.push({
        id: i,
        char: TAMIL_CHARS[Math.floor(Math.random() * TAMIL_CHARS.length)],
        left: rand(1, 99),
        size: rand(1.1, 3.4),
        duration: rand(13, 33),
        delay: rand(0, 28),
        // alternate between two gold shades
        isGold: Math.random() > 0.5,
        animName: name,
      });
    }

    setKeyframes(kf);
    setParticles(items);
  }, []);

  return (
    <>
      {keyframes && <style>{keyframes}</style>}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 10 }}
      >
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute font-display select-none will-change-transform"
            style={{
              bottom: "-6rem",
              left: `${p.left}%`,
              fontSize: `${p.size}rem`,
              color: p.isGold ? "#C9922A" : "#E8B84B",
              // backwards fill-mode keeps opacity:0 during the delay — no static letters
              animation: `${p.animName} ${p.duration}s linear ${p.delay}s infinite normal backwards`,
            }}
          >
            {p.char}
          </span>
        ))}
      </div>
    </>
  );
}

