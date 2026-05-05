import type { ReactNode } from "react";
import Image from "next/image";
import { LineIcon, type IconName } from "@/components/icons/line-icon";

interface FeatureGridProps {
  onBeansClick: () => void;
  onCafesClick: () => void;
  onCommunityClick: () => void;
  onToolsClick: () => void;
}

export function FeatureGrid({
  onBeansClick,
  onCafesClick,
  onCommunityClick,
  onToolsClick,
}: FeatureGridProps) {
  return (
    <section aria-label="Explore Coffee Daily" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <ImageFeatureCard
        title="Coffee Beans"
        icon="bag"
        image="/coffee-beans.png"
        imageAlt="Coffee bean bag"
        onClick={onBeansClick}
      />

      <ImageFeatureCard
        title="Cafes"
        icon="pin"
        image="/cafes.png"
        imageAlt="Warm cafe interior"
        onClick={onCafesClick}
      />

      <ImageFeatureCard
        title="Community"
        icon="users"
        image="/community.png"
        imageAlt="Coffee study table"
        onClick={onCommunityClick}
      />

      <FeatureCard title="Tools" icon="timer" onClick={onToolsClick}>
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
    "card-surface group flex min-h-[270px] flex-col justify-between rounded-[28px] bg-card p-4 text-left transition hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(76,44,23,0.12)]";

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

interface ImageFeatureCardProps {
  title: string;
  icon: IconName;
  image: string;
  imageAlt: string;
  onClick: () => void;
}

function ImageFeatureCard({
  title,
  icon,
  image,
  imageAlt,
  onClick,
}: ImageFeatureCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-surface group min-h-[270px] overflow-hidden rounded-[28px] bg-card text-left transition hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(76,44,23,0.12)]"
    >
      <div className="relative h-44 overflow-hidden bg-[#f5efe5]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="flex items-center justify-between px-5 py-5">
        <span className="text-2xl font-semibold text-foreground">
          {title}
        </span>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white">
          <LineIcon name={icon} />
        </span>
      </div>
    </button>
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
