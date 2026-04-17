"use client";

import { useEffect, useState } from "react";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 280);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`fixed right-5 bottom-5 z-40 rounded-full border border-[rgba(97,68,44,0.16)] bg-[rgba(255,252,248,0.96)] px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-accent shadow-[0_16px_30px_rgba(76,44,23,0.12)] transition duration-200 hover:border-[rgba(138,75,42,0.24)] hover:bg-white sm:right-8 sm:bottom-8 ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      TOP
    </button>
  );
}
