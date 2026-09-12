"use client";

/*
 * A rectangular kolam border that wraps the மாதவம் title.
 * - Faint white kolam frame with corner lotus ornaments
 * - ONE single golden light traces the entire perimeter continuously
 */
export default function HeroKolam() {
  // Frame dimensions (SVG units)
  const W = 580;   // total SVG width
  const H = 200;   // total SVG height
  const pad = 16;  // inset from SVG edge to frame edge
  const r = 18;    // corner ornament half-size

  // The single continuous path the light follows:
  // Outer rectangle with small diamond peaks at each corner and mid-side
  const mx = W / 2;       // horizontal mid
  const my = H / 2;       // vertical mid
  const left   = pad;
  const right  = W - pad;
  const top    = pad;
  const bottom = H - pad;

  // Corner points (inset from true corners to allow diamond ornament)
  const cornerInset = r + 4;

  // Path: start at top-left corner peak, go clockwise
  // Each corner: diamond peak outward
  // Each mid-side: small inward notch (like a kolam pulli holder)
  const path = [
    // top-left corner diamond (peak at corner)
    `M ${left + cornerInset},${top}`,
    // top edge left half
    `L ${mx - r},${top}`,
    // top mid ornament — small upward peak
    `L ${mx},${top - 10} L ${mx + r},${top}`,
    // top edge right half to corner
    `L ${right - cornerInset},${top}`,
    // top-right corner diamond
    `L ${right},${top + cornerInset}`,
    // right edge top half
    `L ${right},${my - r}`,
    // right mid ornament — small rightward peak
    `L ${right + 10},${my} L ${right},${my + r}`,
    // right edge bottom half
    `L ${right},${bottom - cornerInset}`,
    // bottom-right corner diamond
    `L ${right - cornerInset},${bottom}`,
    // bottom edge right half
    `L ${mx + r},${bottom}`,
    // bottom mid ornament — small downward peak
    `L ${mx},${bottom + 10} L ${mx - r},${bottom}`,
    // bottom edge left half
    `L ${left + cornerInset},${bottom}`,
    // bottom-left corner diamond
    `L ${left},${bottom - cornerInset}`,
    // left edge bottom half
    `L ${left},${my + r}`,
    // left mid ornament — small leftward peak
    `L ${left - 10},${my} L ${left},${my - r}`,
    // left edge top half back to start
    `L ${left},${top + cornerInset}`,
    // close: back to top-left peak
    `L ${left + cornerInset},${top}`,
    "Z",
  ].join(" ");

  // Corner dot ornaments (kolam pulli)
  const corners = [
    [left,  top],
    [right, top],
    [right, bottom],
    [left,  bottom],
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[90vw] max-w-[640px]"
      >
        <defs>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Static white kolam frame ──────────────────────────────────── */}
        <path
          d={path}
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.18"
          fill="none"
        />

        {/* Inner echo rectangle (slightly inset, even more faint) */}
        <path
          d={[
            `M ${left + cornerInset + 8},${top + 8}`,
            `L ${right - cornerInset - 8},${top + 8}`,
            `L ${right - 8},${top + cornerInset + 8}`,
            `L ${right - 8},${bottom - cornerInset - 8}`,
            `L ${right - cornerInset - 8},${bottom - 8}`,
            `L ${left + cornerInset + 8},${bottom - 8}`,
            `L ${left + 8},${bottom - cornerInset - 8}`,
            `L ${left + 8},${top + cornerInset + 8}`,
            "Z",
          ].join(" ")}
          stroke="white"
          strokeWidth="0.6"
          strokeOpacity="0.1"
          fill="none"
        />

        {/* Corner lotus dots */}
        {corners.map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="3.5" fill="white" fillOpacity="0.18" />
            <circle cx={cx} cy={cy} r="1.5" fill="white" fillOpacity="0.3" />
          </g>
        ))}

        {/* Mid-side pulli dots */}
        {[
          [mx, top], [right, my], [mx, bottom], [left, my],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="white" fillOpacity="0.15" />
        ))}

        {/* ── Single golden light tracer ────────────────────────────────── */}
        <path
          d={path}
          stroke="#E8B84B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#glow)"
          style={{
            strokeDasharray: "55 2000",
            strokeOpacity: 1,
            animation: "kolam-trace 9s linear infinite",
          }}
        />

        <style>{`
          @keyframes kolam-trace {
            from { stroke-dashoffset: 0; }
            to   { stroke-dashoffset: -2100; }
          }
        `}</style>
      </svg>
    </div>
  );
}
