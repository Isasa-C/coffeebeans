import type { ReactNode } from "react";
import Image from "next/image";
import { LineIcon, type IconName } from "@/components/icons/line-icon";

interface FeatureGridProps {
  onBeansClick: () => void;
  onDiscoverClick: () => void;
}

export function FeatureGrid({ onBeansClick, onDiscoverClick }: FeatureGridProps) {
  return (
    <section aria-label="Explore" className="grid gap-4 lg:grid-cols-4">
      <BeansFeatureCard onClick={onBeansClick} />

      <FeatureCard title="Cafes" icon="pin" onClick={onDiscoverClick}>
        <CafeIllustration />
      </FeatureCard>

      <FeatureCard title="Community" icon="users">
        <CommunityIllustration />
      </FeatureCard>

      <FeatureCard title="Tools" icon="timer">
        <TimerIllustration />
      </FeatureCard>
    </section>
  );
}

interface FeatureCardProps {
  title: string;
  icon: IconName;
  children: ReactNode;
  onClick?: () => void;
}

function FeatureCard({ title, icon, children, onClick }: FeatureCardProps) {
  const className =
    "card-surface group flex min-h-[270px] flex-col justify-between rounded-[28px] bg-card p-4 text-left transition hover:-translate-y-0.5";

  const content = (
    <>
      {children}
      <div className="mt-5 flex items-center justify-between">
        <span className="text-2xl font-semibold text-foreground">{title}</span>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-accent">
          <LineIcon name={icon} />
        </span>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <article className={className}>{content}</article>;
}

function BeansFeatureCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-surface group min-h-[270px] overflow-hidden rounded-[28px] bg-card text-left transition hover:-translate-y-0.5 lg:col-span-2"
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src="/hero-coffee.png"
          alt="Coffee bean bag and beans"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex items-center justify-between px-5 py-5">
        <span className="text-2xl font-semibold text-foreground">
          Coffee Beans
        </span>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white">
          <LineIcon name="arrow" />
        </span>
      </div>
    </button>
  );
}

function CafeIllustration() {
  return (
    <div
      className="relative h-32 rounded-[22px] bg-gradient-to-br from-[#f3d5af] via-[#d2a171] to-[#6d4027]"
      aria-hidden
    >
      <span className="absolute bottom-4 left-5 h-12 w-20 rounded-t-full border border-white/50 bg-white/25" />
      <span className="absolute bottom-4 right-5 h-16 w-12 rounded-t-2xl bg-[#2b1b12]/35" />
    </div>
  );
}

function CommunityIllustration() {
  const avatarColors = ["#5a351f", "#d49a6a", "#2b1b12"];

  return (
    <div
      className="relative h-32 rounded-[22px] bg-gradient-to-br from-[#f6e9d4] via-[#c99c72] to-[#7b5137]"
      aria-hidden
    >
      <span className="absolute bottom-5 left-5 h-16 w-16 rounded-full bg-white/45" />
      <span className="absolute right-5 top-5 flex -space-x-2">
        {avatarColors.map((bg) => (
          <span
            key={bg}
            className="h-9 w-9 rounded-full border-2 border-card"
            style={{ backgroundColor: bg }}
          />
        ))}
      </span>
    </div>
  );
}

function TimerIllustration() {
  return (
    <div className="flex h-32 items-center justify-between rounded-[22px] bg-[#f5eadc] px-5">
      <span className="text-4xl font-bold tabular-nums text-foreground">02:30</span>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
        <LineIcon name="play" />
      </span>
    </div>
  );
}
