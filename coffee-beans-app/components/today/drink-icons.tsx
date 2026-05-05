export function DrinkIcon({ type }: { type: string }) {
  switch (type) {
    case "iced-latte":
      return <IcedLatteIcon />;
    case "americano":
      return <AmericanoIcon />;
    case "espresso":
      return <EspressoIcon />;
    case "cappuccino":
      return <CappuccinoIcon />;
    case "pour-over":
      return <PourOverIcon />;
    case "cold-brew":
      return <ColdBrewIcon />;
    default:
      return <AmericanoIcon />;
  }
}

function IcedLatteIcon() {
  return (
    <svg viewBox="0 0 60 60">
      <rect x="20" y="14" width="20" height="34" rx="2" fill="#fff" stroke="#5c3d1e" strokeWidth="1.5" />
      <rect x="21" y="32" width="18" height="14" fill="#c89868" />
      <rect x="21" y="40" width="18" height="6" fill="#a87a4a" />
      <line x1="22" y1="8" x2="22" y2="22" stroke="#5c3d1e" strokeWidth="1.5" />
      <rect x="20" y="14" width="20" height="3" fill="#fff" stroke="#5c3d1e" strokeWidth="1.5" />
    </svg>
  );
}

function AmericanoIcon() {
  return (
    <svg viewBox="0 0 60 60">
      <ellipse cx="28" cy="32" rx="14" ry="15" fill="#fff" stroke="#5c3d1e" strokeWidth="1.5" />
      <ellipse cx="28" cy="22" rx="13" ry="3.5" fill="#3a2418" />
      <path d="M42 25 Q49 32 42 38" fill="none" stroke="#5c3d1e" strokeWidth="1.5" />
    </svg>
  );
}

function EspressoIcon() {
  return (
    <svg viewBox="0 0 60 60">
      <path d="M22 28 L40 28 L37 44 L25 44 Z" fill="#fff" stroke="#5c3d1e" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="31" cy="28" rx="9" ry="2.5" fill="#3a2418" />
      <path d="M40 32 Q46 36 40 40" fill="none" stroke="#5c3d1e" strokeWidth="1.5" />
      <ellipse cx="31" cy="46" rx="8" ry="1" fill="#5c3d1e" opacity="0.3" />
    </svg>
  );
}

function CappuccinoIcon() {
  return (
    <svg viewBox="0 0 60 60">
      <ellipse cx="28" cy="35" rx="15" ry="13" fill="#fff" stroke="#5c3d1e" strokeWidth="1.5" />
      <ellipse cx="28" cy="25" rx="14" ry="3.5" fill="#e8d5b8" />
      <path d="M22 24 Q28 22 34 24" fill="none" stroke="#a87a4a" strokeWidth="1" strokeLinecap="round" />
      <path d="M44 28 Q50 35 44 41" fill="none" stroke="#5c3d1e" strokeWidth="1.5" />
    </svg>
  );
}

function PourOverIcon() {
  return (
    <svg viewBox="0 0 60 60">
      <path d="M18 14 L42 14 L36 30 L24 30 Z" fill="#fff" stroke="#5c3d1e" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="22" y="34" width="16" height="16" rx="2" fill="#fff" stroke="#5c3d1e" strokeWidth="1.5" />
      <path d="M28 34 L28 50" stroke="#a87a4a" strokeWidth="1.5" />
      <circle cx="30" cy="50" r="1" fill="#5c3d1e" />
    </svg>
  );
}

function ColdBrewIcon() {
  return (
    <svg viewBox="0 0 60 60">
      <path d="M22 12 L38 12 L36 50 L24 50 Z" fill="#fff" stroke="#5c3d1e" strokeWidth="1.5" />
      <rect x="22" y="22" width="16" height="28" fill="#3a2418" />
      <circle cx="27" cy="28" r="2" fill="rgba(255,255,255,0.4)" />
      <circle cx="33" cy="35" r="2" fill="rgba(255,255,255,0.4)" />
      <circle cx="28" cy="42" r="1.5" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}
