import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

interface CoffeeColumnProps {
  coffeeCount: number;
  setCoffeeCount: Dispatch<SetStateAction<number>>;
  coffeeLimit: number;
  coffeePerCup: number;
  onShowToast: (message: string) => void;
}

export function CoffeeColumn({
  coffeeCount,
  setCoffeeCount,
  coffeeLimit,
  coffeePerCup,
  onShowToast,
}: CoffeeColumnProps) {
  const [cupIds, setCupIds] = useState(() =>
    Array.from({ length: coffeeCount }, (_, index) => index),
  );
  const nextCupId = useRef(coffeeCount);

  useEffect(() => {
    setCupIds((currentCupIds) => {
      if (coffeeCount > currentCupIds.length) {
        const newCupIds = Array.from(
          { length: coffeeCount - currentCupIds.length },
          () => nextCupId.current++,
        );

        return [...newCupIds, ...currentCupIds].slice(0, coffeeCount);
      }

      if (coffeeCount < currentCupIds.length) {
        return currentCupIds.slice(currentCupIds.length - coffeeCount);
      }

      return currentCupIds;
    });
  }, [coffeeCount]);

  function addCup() {
    if (coffeeCount >= 4) {
      onShowToast("That's a lot of caffeine — consider water instead");
      return;
    }

    const nextCount = coffeeCount + 1;
    setCoffeeCount(nextCount);
    onShowToast(nextCount === coffeeLimit ? "Daily limit reached" : "Coffee logged");
  }

  function removeCup() {
    if (coffeeCount === 0) return;
    setCoffeeCount((count) => count - 1);
  }

  return (
    <div className="col-coffee">
      <div className="stat-block">
        <div className="stat-eyebrow">Coffee today</div>
        <div className="stat-number serif">
          {coffeeCount} {coffeeCount === 1 ? "cup" : "cups"}
        </div>
        <div className="stat-meta">{coffeeCount * coffeePerCup} mg caffeine</div>
      </div>

      <div className="cup-stack">
        {cupIds.map((cupId, index) => (
          <div
            className="cup-svg"
            key={cupId}
            style={{
              bottom: `${index * 75}px`,
              zIndex: 10 + index,
            }}
          >
            <IcedLatteGlass />
          </div>
        ))}
      </div>

      <div className={`limit-text ${coffeeCount >= coffeeLimit ? "reached" : ""}`}>
        {getLimitText(coffeeCount, coffeeLimit)}
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          type="button"
          onClick={addCup}
        >
          + Log a cup
        </button>
        <button
          className="btn"
          type="button"
          onClick={removeCup}
        >
          Remove last
        </button>
      </div>
    </div>
  );
}

function getLimitText(coffeeCount: number, coffeeLimit: number) {
  if (coffeeCount === 0) {
    return "";
  }

  if (coffeeCount < coffeeLimit) {
    return `${coffeeLimit - coffeeCount} more before limit`;
  }

  if (coffeeCount === coffeeLimit) {
    return "Limit reached for today";
  }

  return `${coffeeCount - coffeeLimit} over limit`;
}

export function IcedLatteGlass() {
  return (
    <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
      {/* Glass shadow on table */}
      <ellipse cx="80" cy="195" rx="55" ry="4" fill="rgba(0,0,0,0.08)" />

      {/* Glass body */}
      <path
        d="M30 50 L130 50 L120 190 L40 190 Z"
        fill="rgba(255,255,255,0.4)"
        stroke="#2f241c"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Coffee/milk gradient inside */}
      <defs>
        <linearGradient id="latte-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a87a4a" />
          <stop offset="40%" stopColor="#c89868" />
          <stop offset="70%" stopColor="#e8d5b8" />
          <stop offset="100%" stopColor="#f5ead4" />
        </linearGradient>
        <clipPath id="glass-clip">
          <path d="M30 50 L130 50 L120 190 L40 190 Z" />
        </clipPath>
      </defs>

      {/* Coffee/milk content */}
      <rect
        x="30"
        y="60"
        width="100"
        height="130"
        fill="url(#latte-grad)"
        clipPath="url(#glass-clip)"
      />

      {/* Ice cubes */}
      <g clipPath="url(#glass-clip)">
        <rect
          x="42"
          y="65"
          width="22"
          height="22"
          rx="3"
          fill="rgba(255,255,255,0.55)"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1"
        />
        <rect
          x="68"
          y="78"
          width="20"
          height="20"
          rx="3"
          fill="rgba(255,255,255,0.50)"
          stroke="rgba(255,255,255,0.80)"
          strokeWidth="1"
        />
        <rect
          x="92"
          y="68"
          width="22"
          height="22"
          rx="3"
          fill="rgba(255,255,255,0.55)"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1"
        />
        <rect
          x="55"
          y="92"
          width="18"
          height="18"
          rx="3"
          fill="rgba(255,255,255,0.48)"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="1"
        />
      </g>

      {/* Glass rim highlight */}
      <ellipse
        cx="80"
        cy="50"
        rx="50"
        ry="6"
        fill="none"
        stroke="#2f241c"
        strokeWidth="2"
      />
      <ellipse cx="80" cy="50" rx="48" ry="4" fill="rgba(255,255,255,0.3)" />

      {/* Glass highlight stripe */}
      <line
        x1="38"
        y1="60"
        x2="44"
        y2="180"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
