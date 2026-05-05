"use client";

import { type KeyboardEvent, useState } from "react";
import { LineIcon, type IconName } from "@/components/icons/line-icon";

interface FeatureGridProps {
  onBeansClick: () => void;
  onCafesClick: () => void;
  onCommunityClick: () => void;
  onToolsClick: () => void;
}

interface FeatureCardData {
  id: string;
  title: string;
  heading: string;
  description: string;
  image: string;
  imagePosition?: string;
  icon: IconName;
  imageAlt: string;
  onOpen: () => void;
}

export function FeatureGrid({
  onBeansClick,
  onCafesClick,
  onCommunityClick,
  onToolsClick,
}: FeatureGridProps) {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const cards: FeatureCardData[] = [
    {
      id: "beans",
      title: "Coffee Beans",
      heading: "Your bean library",
      description:
        "Track every bean, rate after brewing, remember what to repurchase.",
      image: "/images/coffee-beans.png",
      imagePosition: "center 45%",
      icon: "bag",
      imageAlt: "Coffee bean bag",
      onOpen: onBeansClick,
    },
    {
      id: "cafes",
      title: "Cafes",
      heading: "Paris cafes",
      description:
        "Curated quiet spots with wifi and good coffee.",
      image: "/images/cafes.png",
      icon: "pin",
      imageAlt: "Warm cafe interior",
      onOpen: onCafesClick,
    },
    {
      id: "community",
      title: "Community",
      heading: "Share what you drink",
      description:
        "Compare bean libraries with friends.",
      image: "/images/community.png",
      imagePosition: "center 45%",
      icon: "users",
      imageAlt: "Coffee study table",
      onOpen: onCommunityClick,
    },
    {
      id: "tools",
      title: "Tools",
      heading: "Brewing tools",
      description:
        "Timer, dose calculator, method reference.",
      image: "/images/brewing-timer.png",
      imagePosition: "center 45%",
      icon: "timer",
      imageAlt: "Brewing timer",
      onOpen: onToolsClick,
    },
  ];

  return (
    <section
      aria-label="Explore Coffee Daily"
      className="grid w-full max-w-[96vw] grid-cols-4 gap-8"
    >
      {cards.map((card) => (
        <FlipFeatureCard
          key={card.id}
          card={card}
          isFlipped={flippedCard === card.id}
          onToggle={() =>
            setFlippedCard((current) => (current === card.id ? null : card.id))
          }
        />
      ))}
    </section>
  );
}

function FlipFeatureCard({
  card,
  isFlipped,
  onToggle,
}: {
  card: FeatureCardData;
  isFlipped: boolean;
  onToggle: () => void;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${card.title} - tap to learn more`}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className={`flip-card group aspect-[1/1.2] w-full cursor-pointer [perspective:1000px] ${
        isFlipped ? "is-flipped" : ""
      }`}
    >
      <div
        className={`flip-card-inner relative h-full w-full rounded-[4px] transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div
          aria-hidden
          className="absolute inset-0 z-0 scale-110 bg-cover bg-center blur-[20px]"
          style={{ backgroundImage: `url(${card.image})` }}
        />

        <div className="flip-card-face flip-card-front absolute inset-0 z-[1] flex flex-col overflow-hidden rounded-[4px] border-[0.5px] border-transparent bg-white shadow-[0_12px_40px_rgba(76,44,23,0.12)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
          <div
          className="relative flex-1 bg-cover bg-center brightness-[1.05] saturate-[0.85]"
            style={{
              backgroundImage: `url(${card.image})`,
              backgroundPosition: card.imagePosition,
            }}
            role="img"
            aria-label={card.imageAlt}
          >
            <span className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#2f241c] shadow-[0_8px_24px_rgba(76,44,23,0.14)] [&>svg]:h-4 [&>svg]:w-4">
              <LineIcon name={card.icon} />
            </span>
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium tracking-[0.02em] text-accent backdrop-blur-[8px] transition-opacity group-hover:opacity-0 [-webkit-backdrop-filter:blur(8px)]">
              Tap to flip ↻
            </span>
          </div>
          <div className="flex h-14 items-center bg-white px-4">
            <h2 className="font-serif text-base font-medium text-[#2f241c]">
              {card.title}
            </h2>
          </div>
        </div>

        <div className="flip-card-face flip-card-back absolute inset-0 z-[1] flex flex-col items-center justify-center rounded-[4px] border-[0.5px] border-white/80 bg-white/60 p-5 text-center shadow-[0_12px_40px_rgba(76,44,23,0.12)] backdrop-blur-[8px] backdrop-saturate-[1.4] [-webkit-backdrop-filter:blur(8px)_saturate(140%)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="mb-1 text-accent [&>svg]:h-6 [&>svg]:w-6">
            <LineIcon name={card.icon} />
          </span>
          <h3 className="font-serif text-base font-medium text-[#2f241c]">
            {card.heading}
          </h3>
          <p className="mt-2 max-w-[22ch] text-xs leading-[1.5] text-[#2f241c]">
            {card.description}
          </p>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              card.onOpen();
            }}
            className="mt-2 text-[11px] font-medium text-accent"
          >
            Open →
          </button>
        </div>
      </div>
    </div>
  );
}
