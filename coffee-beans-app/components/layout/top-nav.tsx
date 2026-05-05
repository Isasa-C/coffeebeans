import { NAV_ITEMS, type NavKey } from "@/lib/navigation";
import type { ViewState } from "@/hooks/use-view-state";
import type { LocalUser } from "@/hooks/use-local-user";
import Link from "next/link";

interface TopNavProps {
  view: ViewState;
  onNavigate: (target: NavKey) => void;
  user: LocalUser | null;
  onLoginClick: () => void;
}

export function TopNav({ view, onNavigate, user, onLoginClick }: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 flex min-h-16 items-center gap-4 border-b border-line/60 bg-white/90 px-4 backdrop-blur-xl sm:px-8">
      <BrandLogo onClick={() => onNavigate("home")} />

      <nav
        aria-label="Primary"
        className="mx-auto flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto bg-transparent p-0"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === view;

          return (
            <NavButton
              key={item.key}
              item={item}
              isActive={isActive}
              onClick={() => onNavigate(item.key)}
            />
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onLoginClick}
        aria-label={user ? `Profile for ${user.name}` : "Sign in"}
        title={user ? user.name : "Sign in"}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition hover:bg-[#f5efe5]"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/60 text-[11px] font-semibold uppercase text-foreground">
          {user ? getInitials(user.name) : "U"}
        </span>
      </button>
    </header>
  );
}

function BrandLogo({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Coffee homepage"
      className="inline-flex shrink-0 items-center gap-2 text-foreground"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-base font-semibold text-white">
        C
      </span>
      <span className="hidden font-serif text-lg sm:inline">Coffee Daily</span>
    </button>
  );
}

function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={item.href ?? "/"}
      onClick={onClick}
      aria-label={item.label}
      title={item.label}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-[#f5e6d8] text-foreground"
          : "bg-transparent text-muted hover:bg-[#f5efe5] hover:text-foreground"
      }`}
    >
      {item.label}
    </Link>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
