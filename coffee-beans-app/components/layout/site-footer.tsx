import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { NAV_ITEMS, type NavKey } from "@/lib/navigation";

interface SiteFooterProps {
  onNavigate: (target: NavKey) => void;
}

export function SiteFooter({ onNavigate }: SiteFooterProps) {
  const { language, setLanguage, messages, languageOptions } = useLanguage();

  return (
    <footer className="card-surface flex flex-col gap-4 rounded-[28px] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <nav aria-label="Footer" className="grid grid-cols-5 gap-1 rounded-[24px] bg-card p-1 text-center">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            className="min-w-0 break-words rounded-[20px] px-1 py-3 text-[10px] font-semibold leading-tight text-muted transition hover:bg-[#f0e5d8] hover:text-accent sm:px-3 sm:text-xs"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/case-study"
          className="text-sm font-semibold text-accent underline decoration-2 underline-offset-4"
        >
          About →
        </Link>

        <label htmlFor="languageSwitcher" className="mr-2 text-sm font-semibold text-foreground">
          {messages.languageLabel}
        </label>

        <select
          id="languageSwitcher"
          value={language}
          onChange={(event) => setLanguage(event.target.value as typeof language)}
          className="rounded-full bg-transparent text-sm font-semibold text-accent outline-none"
        >
          {languageOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </footer>
  );
}
