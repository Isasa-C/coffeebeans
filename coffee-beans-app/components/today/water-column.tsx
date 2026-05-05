import type { Dispatch, SetStateAction } from "react";

interface WaterColumnProps {
  waterMl: number;
  setWaterMl: Dispatch<SetStateAction<number>>;
  waterGoal: number;
  onShowToast: (message: string) => void;
}

const BOTTLE_TOP = 150;
const BOTTLE_BOTTOM = 516;
const WATER_HEIGHT_RANGE = BOTTLE_BOTTOM - BOTTLE_TOP;

export function WaterColumn({
  waterMl,
  setWaterMl,
  waterGoal,
  onShowToast,
}: WaterColumnProps) {
  const percent = Math.round((waterMl / waterGoal) * 100);
  const fillPercent = Math.min(waterMl / 1500, 1);
  const waterHeight = WATER_HEIGHT_RANGE * fillPercent;
  const waterY = BOTTLE_BOTTOM - waterHeight;

  void BOTTLE_TOP;

  function addWater(ml: number) {
    const nextWaterMl = waterMl + ml;
    setWaterMl(nextWaterMl);
    onShowToast(nextWaterMl >= waterGoal ? "Daily water goal reached!" : `+${ml} ml logged`);
  }

  function removeWater() {
    if (waterMl === 0) return;
    setWaterMl((ml) => Math.max(0, ml - 250));
  }

  return (
    <div className="col-water">
      <div className="stat-block">
        <div className="stat-eyebrow">Water today</div>
        <div className="stat-number serif">{waterMl} ml</div>
        <div className="stat-meta">
          Goal {waterGoal} ml · {percent}%
        </div>
      </div>

      <div className="bottle-container">
        <BottleSvg waterY={waterY} waterHeight={waterHeight} />
      </div>

      <div
        className={`limit-text ${waterMl >= waterGoal ? "reached" : ""}`}
        style={waterMl >= waterGoal ? { color: "var(--water-deep)" } : undefined}
      >
        {waterMl >= waterGoal ? "Goal reached today ✓" : `${waterGoal - waterMl} ml to go`}
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-water"
          type="button"
          onClick={() => addWater(250)}
        >
          + 250 ml
        </button>
        <button
          className="btn btn-water"
          type="button"
          onClick={() => addWater(500)}
        >
          + 500 ml
        </button>
        <button
          className="btn"
          type="button"
          onClick={removeWater}
        >
          Remove last
        </button>
      </div>
    </div>
  );
}

function BottleSvg({
  waterY,
  waterHeight,
}: {
  waterY: number;
  waterHeight: number;
}) {
  const iceY = Math.max(BOTTLE_TOP + 4, Math.min(waterY - 30, BOTTLE_BOTTOM - 88));

  return (
    <svg className="bottle-svg" viewBox="0 0 260 560" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="bottle-shape">
          <path d="M92 70 L168 70 L168 154 C197 170 210 196 210 230 L210 502 C210 523 195 536 174 536 L86 536 C65 536 50 523 50 502 L50 230 C50 196 63 170 92 154 Z" />
        </clipPath>
        <linearGradient id="water-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(186, 207, 210, 0.72)" />
          <stop offset="100%" stopColor="rgba(231, 239, 238, 0.46)" />
        </linearGradient>
        <linearGradient id="glass-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="34%" stopColor="rgba(255,255,255,0.46)" />
          <stop offset="56%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="cork-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9b7146" />
          <stop offset="100%" stopColor="#6f4b2d" />
        </linearGradient>
        <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <ellipse cx="132" cy="540" rx="66" ry="9" fill="rgba(47, 36, 28, 0.13)" filter="url(#soft-shadow)" />

      {/* Water fill */}
      <rect
        className="bottle-water"
        x="50"
        y={waterY}
        width="160"
        height={waterHeight}
        fill="url(#water-gradient)"
        clipPath="url(#bottle-shape)"
      />

      {/* Water surface */}
      <line
        className="bottle-surface"
        x1="52"
        y1={waterY}
        x2="208"
        y2={waterY}
        stroke="#6f7d7d"
        strokeWidth="2"
        clipPath="url(#bottle-shape)"
      />

      <g clipPath="url(#bottle-shape)" opacity="0.76" transform={`translate(0 ${iceY - 206})`}>
        <rect x="70" y="194" width="46" height="46" rx="8" fill="rgba(255,255,255,0.42)" stroke="rgba(88,98,98,0.46)" strokeWidth="1.4" transform="rotate(-20 93 217)" />
        <rect x="112" y="198" width="48" height="48" rx="8" fill="rgba(255,255,255,0.46)" stroke="rgba(88,98,98,0.48)" strokeWidth="1.4" transform="rotate(24 136 222)" />
        <rect x="156" y="196" width="43" height="43" rx="8" fill="rgba(255,255,255,0.40)" stroke="rgba(88,98,98,0.42)" strokeWidth="1.4" transform="rotate(-14 177.5 217.5)" />
        <rect x="95" y="232" width="50" height="50" rx="9" fill="rgba(255,255,255,0.44)" stroke="rgba(88,98,98,0.40)" strokeWidth="1.4" transform="rotate(-36 120 257)" />
        <rect x="150" y="246" width="43" height="43" rx="8" fill="rgba(255,255,255,0.36)" stroke="rgba(88,98,98,0.36)" strokeWidth="1.4" transform="rotate(26 171.5 267.5)" />
        <path d="M70 218 C96 210 114 230 139 218 C162 207 181 220 202 214" fill="none" stroke="rgba(80,91,91,0.55)" strokeWidth="1.2" />
      </g>

      <g clipPath="url(#bottle-shape)" opacity="0.45">
        <circle cx="116" cy="322" r="2" fill="none" stroke="#879394" strokeWidth="1" />
        <circle cx="144" cy="352" r="3" fill="none" stroke="#879394" strokeWidth="1" />
        <circle cx="128" cy="382" r="2" fill="none" stroke="#879394" strokeWidth="1" />
        <circle cx="154" cy="433" r="2" fill="none" stroke="#879394" strokeWidth="1" />
        <circle cx="114" cy="462" r="1.5" fill="none" stroke="#879394" strokeWidth="0.8" />
      </g>

      {/* Bottle outline */}
      <path
        d="M92 70 L168 70 L168 154 C197 170 210 196 210 230 L210 502 C210 523 195 536 174 536 L86 536 C65 536 50 523 50 502 L50 230 C50 196 63 170 92 154 Z"
        fill="rgba(255,255,255,0.16)"
        stroke="#3d403d"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M92 70 L168 70"
        fill="none"
        stroke="#242824"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse cx="130" cy="536" rx="70" ry="12" fill="none" stroke="#7f8581" strokeWidth="1.4" opacity="0.65" />
      <ellipse cx="130" cy="526" rx="55" ry="7" fill="none" stroke="#a4aaa5" strokeWidth="1" opacity="0.55" />
      <path
        d="M74 162 C61 181 54 201 54 230 L54 502 C54 517 65 529 84 532"
        fill="none"
        stroke="rgba(255,255,255,0.72)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.46"
      />
      <rect x="86" y="76" width="18" height="440" fill="url(#glass-shine)" opacity="0.65" clipPath="url(#bottle-shape)" />
      <rect x="136" y="78" width="24" height="438" fill="url(#glass-shine)" opacity="0.38" clipPath="url(#bottle-shape)" />

      {/* Cap */}
      <rect x="92" y="26" width="76" height="44" fill="url(#cork-gradient)" rx="6" />
      <rect x="92" y="26" width="76" height="8" fill="rgba(255,255,255,0.18)" rx="5" />
      <g opacity="0.22" stroke="#3c2417" strokeWidth="0.8" strokeLinecap="round">
        <path d="M100 36 C108 30 117 40 125 34" />
        <path d="M132 42 C140 35 150 45 160 38" />
        <path d="M104 56 C115 48 122 60 133 52" />
        <path d="M142 60 C150 54 158 62 166 56" />
      </g>

      {/* Measurement marks */}
      <g stroke="#735d4d" strokeWidth="1.1" opacity="0.7">
        <line x1="22" y1="150" x2="36" y2="150" />
        <line x1="22" y1="223" x2="36" y2="223" />
        <line x1="22" y1="296" x2="36" y2="296" />
        <line x1="22" y1="369" x2="36" y2="369" />
        <line x1="22" y1="442" x2="36" y2="442" />
      </g>

      {/* Measurement labels */}
      <g fontSize="14" fill="#735d4d" textAnchor="end" fontFamily="Inter, sans-serif">
        <text x="16" y="155">
          1500
        </text>
        <text x="16" y="228">
          1200
        </text>
        <text x="16" y="301">
          900
        </text>
        <text x="16" y="374">
          600
        </text>
        <text x="16" y="447">
          300
        </text>
      </g>
    </svg>
  );
}
