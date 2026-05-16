"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";
import { AddBeanModal } from "@/components/beans/add-bean-modal";
import { cafes } from "@/components/cafes-view";
import { LanguageProvider } from "@/components/language-provider";
import { TopNav } from "@/components/layout/top-nav";
import { useLocalUser, type LocalUser } from "@/hooks/use-local-user";
import type { NavKey } from "@/lib/navigation";
import { formatCurrency, type BeanRecord } from "@/lib/utils";

interface ExplorePageProps {
  catalog: BeanRecord[];
}

type ExploreMode = "beans" | "cafes" | "guide";
type BeanLibraryView = "focused" | "cards";

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
const OWNER_EMAIL = "xuejingcao@outlook.com";

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
  const { user, signIn, signUp, saveFavoriteBean, favoriteBeans, logout } = useLocalUser();

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

  function selectExploreMode(mode: ExploreMode) {
    setSelectedMode(mode);
    router.replace(mode === "beans" ? "/explore" : `/explore?mode=${mode}`, {
      scroll: false,
    });
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

            <ExploreSelector selectedMode={selectedMode} onSelect={selectExploreMode} />
          </div>

          <ExploreMainPanel
            beans={catalog}
            selectedMode={selectedMode}
            user={user}
            favoriteBeanIds={new Set(favoriteBeans.map((bean) => bean.id))}
            onSaveFavorite={(bean) =>
              saveFavoriteBean({
                id: bean.id,
                brand: bean.brand,
                roast: bean.bestFor,
                imageUrl: bean.imageUrl,
                price: bean.price,
              })
            }
            onAddBeanClick={() => setIsAddBeanOpen(true)}
          />
        </section>
      </main>

      <AddBeanModal isOpen={isAddBeanOpen} onClose={() => setIsAddBeanOpen(false)} />
      <LoginModal
        isOpen={isLoginOpen}
        user={user}
        onClose={() => setIsLoginOpen(false)}
        onSignIn={signIn}
        onSignUp={signUp}
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
  user,
  favoriteBeanIds,
  onSaveFavorite,
  onAddBeanClick,
}: {
  beans: BeanRecord[];
  selectedMode: ExploreMode;
  user: LocalUser | null;
  favoriteBeanIds: Set<string>;
  onSaveFavorite: (bean: BeanRecord) => { ok: boolean; error?: string };
  onAddBeanClick: () => void;
}) {
  if (selectedMode === "cafes") {
    return <CafePanel />;
  }

  if (selectedMode === "guide") {
    return <BeanGuidePanel />;
  }

  return (
    <BeansLibraryPanel
      beans={beans}
      user={user}
      favoriteBeanIds={favoriteBeanIds}
      onSaveFavorite={onSaveFavorite}
      onAddBeanClick={onAddBeanClick}
    />
  );
}

function BeansLibraryPanel({
  beans,
  user,
  favoriteBeanIds,
  onSaveFavorite,
  onAddBeanClick,
}: {
  beans: BeanRecord[];
  user: LocalUser | null;
  favoriteBeanIds: Set<string>;
  onSaveFavorite: (bean: BeanRecord) => { ok: boolean; error?: string };
  onAddBeanClick: () => void;
}) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<BeanLibraryView>("cards");
  const sortedBeans = [...beans].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
  const [rankOrder, setRankOrder] = useState(() => sortedBeans.map((bean) => bean.id));
  const [draggedBeanId, setDraggedBeanId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(sortedBeans[0]?.id);
  const [busyBeanId, setBusyBeanId] = useState<string | null>(null);
  const isOwner = user?.email.toLowerCase() === OWNER_EMAIL;
  const rankedBeans = useMemo(() => {
    const byId = new Map(sortedBeans.map((bean) => [bean.id, bean]));
    const ordered = rankOrder
      .map((id) => byId.get(id))
      .filter((bean): bean is BeanRecord => Boolean(bean));
    const missing = sortedBeans.filter((bean) => !rankOrder.includes(bean.id));
    return [...ordered, ...missing];
  }, [sortedBeans, rankOrder]);

  const selectedBean =
    rankedBeans.find((bean) => bean.id === selectedId) ?? rankedBeans[0];

  function moveBeanToPosition(targetBeanId: string) {
    if (!draggedBeanId || draggedBeanId === targetBeanId) {
      return;
    }

    setRankOrder((current) => {
      const fromIndex = current.findIndex((id) => id === draggedBeanId);
      const toIndex = current.findIndex((id) => id === targetBeanId);

      if (fromIndex < 0 || toIndex < 0) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  async function handleEditPrice(bean: BeanRecord) {
    if (!user || !isOwner || busyBeanId) {
      return;
    }

    const nextPriceRaw = window.prompt(`Update price for ${bean.brand}`, String(bean.price));
    if (!nextPriceRaw) {
      return;
    }

    const nextPrice = Number(nextPriceRaw);
    if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
      window.alert("Please enter a valid positive price.");
      return;
    }

    const payload = new FormData();
    payload.append("brand", bean.brand);
    payload.append("price", String(nextPrice));
    payload.append("quantity", String(bean.quantity));
    payload.append("weight", String(bean.weight));
    payload.append("rating", String(bean.rating));
    payload.append("bestFor", bean.bestFor);
    payload.append("comments", bean.comments || "");

    setBusyBeanId(bean.id);
    try {
      const response = await fetch(`/api/beans/${bean.id}`, {
        method: "PATCH",
        headers: {
          "x-user-email": user.email,
        },
        body: payload,
      });

      if (!response.ok) {
        window.alert("Could not update this bean right now.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Network error while updating the bean.");
    } finally {
      setBusyBeanId(null);
    }
  }

  async function handleDeleteBean(bean: BeanRecord) {
    if (!user || !isOwner || busyBeanId) {
      return;
    }

    const confirmed = window.confirm(`Delete ${bean.brand}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setBusyBeanId(bean.id);
    try {
      const response = await fetch(`/api/beans/${bean.id}`, {
        method: "DELETE",
        headers: {
          "x-user-email": user.email,
        },
      });

      if (!response.ok) {
        window.alert("Could not delete this bean right now.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Network error while deleting the bean.");
    } finally {
      setBusyBeanId(null);
    }
  }

  function handleSaveFavorite(bean: BeanRecord) {
    if (!user) {
      window.alert("Please sign in to save favorites.");
      return;
    }

    const result = onSaveFavorite(bean);
    if (!result.ok) {
      window.alert(result.error || "Could not save this favorite.");
      return;
    }
    window.alert(`${bean.brand} saved to your personal favorites.`);
  }

  return (
    <section className={`beans-page ${viewMode === "cards" ? "cards-view" : ""}`}>
      <aside className="bean-list-column">
        <div className="bean-list-header">
          <h1 className="section-label">Purchased beans</h1>
          <BeanViewSwitch value={viewMode} onChange={setViewMode} />
        </div>

        <div className="bean-rows">
          {rankedBeans.map((bean, index) => (
            <button
              key={bean.id}
              type="button"
              draggable
              className={`bean-row ${selectedBean?.id === bean.id ? "active" : ""}`}
              onClick={() => {
                setSelectedId(bean.id);
                setViewMode("focused");
              }}
              onDragStart={() => setDraggedBeanId(bean.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => moveBeanToPosition(bean.id)}
              onDragEnd={() => setDraggedBeanId(null)}
            >
              <span className="bean-rank" aria-label={`Rank ${index + 1}`}>
                {index + 1}
              </span>
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
                <span className="bean-row-price">
                  {formatCurrency(bean.price)} · {formatUnitPrice(bean)}/g
                </span>
                {user ? (
                  <span className="bean-row-actions">
                    {isOwner ? (
                      <>
                        <span
                          role="button"
                          tabIndex={0}
                          className="bean-row-action"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleEditPrice(bean);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              event.stopPropagation();
                              void handleEditPrice(bean);
                            }
                          }}
                        >
                          Edit price
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          className="bean-row-action danger"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleDeleteBean(bean);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              event.stopPropagation();
                              void handleDeleteBean(bean);
                            }
                          }}
                        >
                          {busyBeanId === bean.id ? "..." : "Delete"}
                        </span>
                      </>
                    ) : (
                      <span
                        role="button"
                        tabIndex={0}
                        className="bean-row-action"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSaveFavorite(bean);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.stopPropagation();
                            handleSaveFavorite(bean);
                          }
                        }}
                      >
                        {favoriteBeanIds.has(bean.id) ? "Saved" : "Save favorite"}
                      </span>
                    )}
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>

        <button type="button" className="add-bean-btn" onClick={onAddBeanClick}>
          <span aria-hidden="true">+</span>
          Add a bean
        </button>
      </aside>

      {viewMode === "cards" ? (
        <BeansGallery
          beans={rankedBeans}
          selectedBeanId={selectedBean?.id}
          onSelectBean={(beanId) => {
            setSelectedId(beanId);
            setViewMode("focused");
          }}
          onAddBeanClick={onAddBeanClick}
        />
      ) : selectedBean ? (
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

function BeanViewSwitch({
  value,
  onChange,
}: {
  value: BeanLibraryView;
  onChange: (value: BeanLibraryView) => void;
}) {
  return (
    <div className="bean-view-switch" aria-label="Bean library view">
      <button
        type="button"
        className={value === "focused" ? "active" : ""}
        onClick={() => onChange("focused")}
      >
        Focused
      </button>
      <button
        type="button"
        className={value === "cards" ? "active" : ""}
        onClick={() => onChange("cards")}
      >
        Big cards
      </button>
    </div>
  );
}

function BeansGallery({
  beans,
  selectedBeanId,
  onSelectBean,
  onAddBeanClick,
}: {
  beans: BeanRecord[];
  selectedBeanId?: string;
  onSelectBean: (beanId: string) => void;
  onAddBeanClick: () => void;
}) {
  if (beans.length === 0) {
    return (
      <div className="beans-gallery-empty">
        <p>No beans yet. Add your first bag to start the library.</p>
        <button type="button" className="add-bean-btn" onClick={onAddBeanClick}>
          <span aria-hidden="true">+</span>
          Add a bean
        </button>
      </div>
    );
  }

  return (
    <div className="beans-gallery">
      {beans.map((bean) => (
        <button
          key={bean.id}
          type="button"
          className={`bean-gallery-card ${selectedBeanId === bean.id ? "active" : ""}`}
          onClick={() => onSelectBean(bean.id)}
        >
          <div className="bean-gallery-image-wrap">
            <Image
              src={getBeanImageUrl(bean)}
              alt={bean.brand}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1100px) 33vw, 260px"
              className="bean-gallery-image"
            />
          </div>
          <div className="bean-gallery-copy">
            <div>
              <h2>{bean.brand}</h2>
              <p>{bean.bestFor}</p>
            </div>
            <dl>
              <div>
                <dt>Total</dt>
                <dd>{formatCurrency(bean.price)}</dd>
              </div>
              <div>
                <dt>Unit</dt>
                <dd>{formatUnitPrice(bean)}/g</dd>
              </div>
              <div>
                <dt>Weight</dt>
                <dd>{formatPurchasedWeight(bean)}g</dd>
              </div>
            </dl>
          </div>
        </button>
      ))}
    </div>
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
            <span className="detail-amount">{formatPurchasedWeight(bean)}g</span>
            <span className="detail-name">weight</span>
          </li>
          <li>
            <span className="detail-icon">
              <EuroIcon />
            </span>
            <span className="detail-amount">{formatUnitPrice(bean)}/g</span>
            <span className="detail-name">unit price</span>
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

function formatPurchasedWeight(bean: BeanRecord) {
  return bean.weight * Math.max(bean.quantity, 1);
}

function formatUnitPrice(bean: BeanRecord) {
  const totalWeight = formatPurchasedWeight(bean);

  if (totalWeight <= 0) {
    return formatCurrency(0);
  }

  return formatCurrency(bean.price / totalWeight);
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
