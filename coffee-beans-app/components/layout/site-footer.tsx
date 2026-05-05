import Link from "next/link";

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(76,44,23,0.10)] bg-[#ede4d5] px-6 pb-8 pt-16 sm:px-12">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 border-b border-[rgba(76,44,23,0.10)] pb-12 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12">
        <div className="flex flex-col gap-3">
          <div className="mb-1 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2b1b12] font-serif text-base text-white">
              C
            </span>
            <span className="font-serif text-lg font-medium text-[#2b1b12]">
              Coffee Daily
            </span>
          </div>
          <p className="mt-2 text-xs text-[#9b7b62]">
            © 2026 Xuejing. All rights reserved.
          </p>
        </div>

        <nav aria-label="Site">
          <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9b7b62]">
            Explore
          </h4>
          <ul className="flex list-none flex-col gap-2.5 p-0">
            <li>
              <Link className="text-sm text-[#8b7a6d] transition hover:text-[#5a351f]" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-sm text-[#8b7a6d] transition hover:text-[#5a351f]" href="/today">
                Today
              </Link>
            </li>
            <li>
              <Link className="text-sm text-[#8b7a6d] transition hover:text-[#5a351f]" href="/explore">
                Explore
              </Link>
            </li>
            <li>
              <Link className="text-sm text-[#8b7a6d] transition hover:text-[#5a351f]" href="/learn">
                Learn
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9b7b62]">
            Get in touch
          </h4>
          <ul className="flex list-none flex-col gap-2.5 p-0">
            <li>
              <a
                href="mailto:isasa57@outlook.com"
                className="inline-flex items-center gap-2 text-sm text-[#8b7a6d] transition hover:text-[#5a351f]"
              >
                <EmailIcon />
                isasa57@outlook.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 pt-6 text-xs text-[#9b7b62] sm:flex-row sm:justify-between">
        <p>Built with Next.js, TypeScript, and care.</p>
        <p>Photos curated from Unsplash.</p>
      </div>
    </footer>
  );
}
