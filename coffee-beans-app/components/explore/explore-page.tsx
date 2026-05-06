"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";
import { AddBeanModal } from "@/components/beans/add-bean-modal";
import { cafes } from "@/components/cafes-view";
import { LanguageProvider } from "@/components/language-provider";
import { TopNav } from "@/components/layout/top-nav";
import { useLocalUser } from "@/hooks/use-local-user";
import type { NavKey } from "@/lib/navigation";
import { formatCurrency, type BeanRecord } from "@/lib/utils";

interface ExplorePageProps {
  catalog: BeanRecord[];
}

type ExploreMode = "beans" | "cafes" | "guide";

const exploreModes: Array<{
  id: ExploreMode;
  title: string;
  meta: string;
}> = [
  { id: "beans", title: "Beans Library", meta: "Library and ratings" },
  { id: "cafes", title: "Paris Cafes", meta: "Study-friendly spots" },
  { id: "guide", title: "Bean Guide", meta: "Roasts and pairings" },
];

const roastGuide = [
  {
    name: "Light",
    color: "#f5e6c8",
    notes: "Bright acidity with floral, citrus, and berry notes.",
    bestFor: "Pour-over · Cold brew · Filter coffee",
  },
  {
    name: "Medium-Light",
    color: "#ecd6b8",
    notes: "Balanced sweetness, gentle acidity, honey, nuts, and caramel.",
    bestFor: "Filter coffee · Lighter americanos",
  },
  {
    name: "Medium",
    color: "#d8b89a",
    notes: "Smooth and versatile with nutty, caramel, and chocolate notes.",
    bestFor: "Latte · Americano · Flat white",
  },
  {
    name: "Medium-Dark",
    color: "#b89878",
    notes: "Fuller body with dark chocolate, roasted nuts, and warm spice.",
    bestFor: "Espresso · Cappuccino · Mocha",
  },
  {
    name: "Dark",
    color: "#8c6648",
    notes: "Bold, smoky, bitter-sweet, and low acidity.",
    bestFor: "Strong americano · Bold espresso",
  },
];

const beanDrinkMatches: Record<string, string[]> = {
  Light: ["Pour-over", "Cold brew", "Filter coffee"],
  "Medium-Light": ["Filter coffee", "Lighter americano", "Cold brew"],
  Medium: ["Dirty", "Americano", "Latte", "Flat white"],
  "Medium-Dark": ["Espresso", "Cappuccino", "Mocha", "Vanilla latte"],
  Dark: ["Strong americano", "Bold espresso"],
};

const defaultBeanImageUrl = "/default-bean-latest.png";

function getBeanImageUrl(bean: BeanRecord) {
  return !bean.imageUrl ||
    bean.imageUrl === "/default-bean.png" ||
    bean.imageUrl === "/default-bean.png?v=2"
    ? defaultBeanImageUrl
    : bean.imageUrl;
}

export function ExplorePage({ catalog }: ExplorePageProps) {
  return (
    <LanguageProvider>
      <ExplorePageInner catalog={catalog} />
    </LanguageProvider>
  );
}

function ExplorePageInner({ catalog }: ExplorePageProps) {
  const searchParams = useSearchParams();
  const [selectedMode, setSelectedMode] = useState<ExploreMode>(() =>
    getExploreModeFromParam(searchParams.get("mode")),
  );
  const [isAddBeanOpen, setIsAddBeanOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter();
  const { user, login, logout } = useLocalUser();

  useEffect(() => {
    setSelectedMode(getExploreModeFromParam(searchParams.get("mode")));
  }, [searchParams]);

  function navigateTo(target: NavKey) {
    const routes: Record<NavKey, string> = {
      home: "/",
      today: "/today",
      explore: "/explore",
      learn: "/learn",
      tools: "/tools",
    };

    router.push(routes[target]);
  }

  return (
    <>
      <TopNav
        view="explore"
        onNavigate={navigateTo}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      <main className="bg-[#f5efe5] text-[#2b1b12]">
        <section className="explore-page">
          <div className="explore-top">
            <header>
              <h1 className="max-w-[22ch] font-serif text-[32px] font-medium leading-[1.2] tracking-[-0.5px] text-[#2b1b12]">
                Explore beans, cafes, and roast notes.
              </h1>
            </header>

            <ExploreSelector selectedMode={selectedMode} onSelect={setSelectedMode} />
          </div>

          <ExploreMainPanel
            beans={catalog}
            selectedMode={selectedMode}
            onAddBeanClick={() => setIsAddBeanOpen(true)}
          />
        </section>
      </main>

      <AddBeanModal isOpen={isAddBeanOpen} onClose={() => setIsAddBeanOpen(false)} />
      <LoginModal
        isOpen={isLoginOpen}
        user={user}
        onClose={() => setIsLoginOpen(false)}
        onLogin={login}
        onLogout={logout}
      />
    </>
  );
}

function getExploreModeFromParam(mode: string | null): ExploreMode {
  if (mode === "cafes" || mode === "guide") {
    return mode;
  }

  return "beans";
}

function ExploreSelector({
  selectedMode,
  onSelect,
}: {
  selectedMode: ExploreMode;
  onSelect: (mode: ExploreMode) => void;
}) {
  return (
    <div className="explore-selector">
      {exploreModes.map((mode) => {
        const active = mode.id === selectedMode;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelect(mode.id)}
            className={`explore-selector-button ${active ? "active" : ""}`}
          >
            <div className="explore-selector-initial">
              {mode.title.slice(0, 1)}
            </div>

            <div>
              <h3 className="font-serif text-[17px] font-medium leading-tight text-[#2b1b12]">
                {mode.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#9b7b62]">{mode.meta}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ExploreMainPanel({
  beans,
  selectedMode,
  onAddBeanClick,
}: {
  beans: BeanRecord[];
  selectedMode: ExploreMode;
  onAddBeanClick: () => void;
}) {
  if (selectedMode === "cafes") {
    return <CafePanel />;
  }

  if (selectedMode === "guide") {
    return <BeanGuidePanel />;
  }

  return (
    <BeansLibraryPanel beans={beans} onAddBeanClick={onAddBeanClick} />
  );
}

function BeansLibraryPanel({
  beans,
  onAddBeanClick,
}: {
  beans: BeanRecord[];
  onAddBeanClick: () => void;
}) {
  const sortedBeans = [...beans].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
  const [selectedId, setSelectedId] = useState(sortedBeans[0]?.id);
  const selectedBean =
    sortedBeans.find((bean) => bean.id === selectedId) ?? sortedBeans[0];

  return (
    <section className="beans-page">
      <aside className="bean-list-column">
        <h1 className="section-label">Purchased beans</h1>

        <div className="bean-rows">
          {sortedBeans.map((bean) => (
            <button
              key={bean.id}
              type="button"
              className={`bean-row ${selectedBean?.id === bean.id ? "active" : ""}`}
              onClick={() => setSelectedId(bean.id)}
            >
              <div className="bean-thumb">
                <Image
                  src={getBeanImageUrl(bean)}
                  alt={bean.brand}
                  width={44}
                  height={44}
                />
              </div>
              <div className="bean-row-info">
                <h3 className="bean-row-brand">{bean.brand}</h3>
                <span className="bean-row-price">{formatCurrency(bean.price)}</span>
              </div>
            </button>
          ))}
        </div>

        <button type="button" className="add-bean-btn" onClick={onAddBeanClick}>
          <span aria-hidden="true">+</span>
          Add a bean
        </button>
      </aside>

      {selectedBean ? (
        <>
          <BeanHero bean={selectedBean} />
          <BeanDetails bean={selectedBean} />
        </>
      ) : (
        <div className="beans-empty-state">
          <p>No beans yet. Tap + Add a bean to get started.</p>
        </div>
      )}
    </section>
  );
}

function BeanHero({ bean }: { bean: BeanRecord }) {
  return (
    <div className="bean-hero">
      <Image
        className="bean-hero-image"
        src={getBeanImageUrl(bean)}
        alt={bean.brand}
        width={720}
        height={900}
        priority
      />
    </div>
  );
}

function BeanDetails({ bean }: { bean: BeanRecord }) {
  const roastClass = getRoastClass(bean.bestFor);
  const goodFor = beanDrinkMatches[bean.bestFor] ?? beanDrinkMatches.Medium;
  const notes = bean.comments?.trim();

  return (
    <div className="bean-details">
      <header className="details-header">
        <h2 className="bean-name-large">{bean.brand}</h2>
        <p className="bean-source">{bean.bestFor}</p>
      </header>

      <hr className="rule" />

      <section className="details-section">
        <h4 className="section-label">Details</h4>
        <ul className="details-list">
          <li>
            <span className="detail-icon">
              <EuroIcon />
            </span>
            <span className="detail-amount">{formatCurrency(bean.price)}</span>
            <span className="detail-name">price</span>
          </li>
          <li>
            <span className="detail-icon">
              <ScaleIcon />
            </span>
            <span className="detail-amount">{bean.weight}g</span>
            <span className="detail-name">weight</span>
          </li>
          <li>
            <span className="detail-icon">
              <span className={`roast-dot ${roastClass}`} />
            </span>
            <span className="detail-amount">{bean.bestFor}</span>
            <span className="detail-name">roast</span>
          </li>
        </ul>
      </section>

      <hr className="rule" />

      <section className="details-section">
        <h4 className="section-label">Good for</h4>
        <ol className="good-for-list">
          {goodFor.map((drink, index) => (
            <li key={drink}>
              <span className="step-num">{index + 1}</span>
              {drink}
            </li>
          ))}
        </ol>
      </section>

      <hr className="rule" />

      <section className="details-section">
        <h4 className="section-label">Notes</h4>
        <p className={`notes-text ${notes ? "" : "empty"}`}>
          {notes || "No notes yet. Add your tasting impressions after brewing."}
        </p>
        <button type="button" className="edit-notes-btn">
          Edit notes
        </button>
      </section>
    </div>
  );
}

function EuroIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8a5 5 0 0 0-7 7" />
      <path d="M16 16a5 5 0 0 1-7-7" />
      <path d="M7 11h6 M7 13h5" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 6h14l-2 14H7z" />
      <path d="M9 10c0 1.5 1.5 3 3 3s3-1.5 3-3" />
    </svg>
  );
}

function getRoastClass(roast: string) {
  const normalizedRoast = roast.toLowerCase();

  if (normalizedRoast.includes("light") && normalizedRoast.includes("medium")) {
    return "medium-light";
  }

  if (normalizedRoast.includes("light")) {
    return "light";
  }

  if (normalizedRoast.includes("dark") && normalizedRoast.includes("medium")) {
    return "medium-dark";
  }

  if (normalizedRoast.includes("dark")) {
    return "dark";
  }

  return "medium";
}

function CafePanel() {
  return (
    <section className="min-w-0">
      <PageHeader
        eyebrow="Paris"
        title="Cafes to study at"
        description="Quiet, wifi-friendly spots across Paris with good coffee."
      />

      <div className="cafes-grid">
        {cafes.map((cafe) => (
          <article
            key={cafe.name}
            className="overflow-hidden rounded-[18px] border border-[rgba(76,44,23,0.12)] bg-white shadow-[0_8px_24px_rgba(76,44,23,0.05)] transition hover:-translate-y-0.5"
          >
            <div
              className="h-[150px] bg-cover bg-center"
              style={{ backgroundImage: `url(${cafe.image})` }}
            />
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-serif text-[19px] font-medium leading-tight">
                  {cafe.name}
                </h3>
                <span className="rounded-full bg-[#f5e6d8] px-2 py-0.5 text-[11px] font-medium">
                  {cafe.rating}
                </span>
              </div>
              <p className="mb-3 text-[12px] leading-5 text-[#735d4d]">
                {cafe.address}
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {cafe.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#f5efe5] px-2 py-0.5 text-[10px] font-medium text-[#735d4d]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="border-t border-[rgba(76,44,23,0.10)] pt-3 text-[13px] leading-6 text-[#735d4d]">
                {cafe.notes}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BeanGuidePanel() {
  return (
    <section className="min-w-0">
      <PageHeader
        eyebrow="Guide"
        title="Bean guide"
        description="Match roast level to the drinks you actually make."
      />

      <div className="guide-grid">
        {roastGuide.map((roast) => (
          <article
            key={roast.name}
            className="rounded-[18px] border border-[rgba(76,44,23,0.12)] bg-white p-5 shadow-[0_8px_24px_rgba(76,44,23,0.05)]"
          >
            <span
              className="mb-4 block h-9 w-9 rounded-full border border-black/10"
              style={{ backgroundColor: roast.color }}
            />
            <h3 className="font-serif text-[21px] font-medium text-[#2b1b12]">
              {roast.name}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#735d4d]">{roast.notes}</p>
            <div className="mt-4 border-t border-[rgba(76,44,23,0.10)] pt-4 text-[13px] leading-6">
              <span className="font-medium text-[#2b1b12]">Best for</span>
              <br />
              <span className="text-[#735d4d]">{roast.bestFor}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-header border-b border-[rgba(76,44,23,0.15)] pb-6">
      <div className="page-header-text">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children ? <div className="page-actions">{children}</div> : null}
    </header>
  );
}
