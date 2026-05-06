import { useCallback, useState } from "react";
import type { NavKey } from "@/lib/navigation";

export type ViewState =
  | "home"
  | "today"
  | "beans"
  | "cafes"
  | "prices"
  | "guide"
  | "recipes"
  | "explore"
  | "learn"
  | "tools";

interface UseViewStateReturn {
  view: ViewState;
  isAddBeanOpen: boolean;
  navigateTo: (target: NavKey | ViewState) => void;
  openAddBean: () => void;
  closeAddBean: () => void;
}

const SCROLL_BEHAVIOR: ScrollBehavior = "smooth";

function scrollToTop() {
  if (typeof window === "undefined") {
    return;
  }

  window.scrollTo({ top: 0, behavior: SCROLL_BEHAVIOR });
}

function scrollToElement(id: string) {
  if (typeof window === "undefined") {
    return;
  }

  document.getElementById(id)?.scrollIntoView({
    behavior: SCROLL_BEHAVIOR,
    block: "start",
  });
}

export function useViewState(): UseViewStateReturn {
  const [view, setView] = useState<ViewState>("home");
  const [isAddBeanOpen, setIsAddBeanOpen] = useState(false);

  const navigateTo = useCallback((target: NavKey | ViewState) => {
    if (target === "beans") {
      setView("beans");
      window.setTimeout(() => scrollToElement("coffee-beans"), 0);
      return;
    }

    setView(target);
    window.setTimeout(scrollToTop, 0);
  }, []);

  const openAddBean = useCallback(() => setIsAddBeanOpen(true), []);
  const closeAddBean = useCallback(() => setIsAddBeanOpen(false), []);

  return {
    view,
    isAddBeanOpen,
    navigateTo,
    openAddBean,
    closeAddBean,
  };
}
