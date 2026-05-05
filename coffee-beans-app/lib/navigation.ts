import type { IconName } from "@/components/icons/line-icon";

export type NavKey =
  | "home"
  | "today"
  | "explore"
  | "learn";

export interface NavItem {
  key: NavKey;
  label: string;
  icon: IconName;
  href?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", icon: "cup", href: "/" },
  { key: "today", label: "Today", icon: "timer", href: "/today" },
  { key: "explore", label: "Explore", icon: "pin", href: "/explore" },
  { key: "learn", label: "Learn", icon: "arrow", href: "/learn" },
];