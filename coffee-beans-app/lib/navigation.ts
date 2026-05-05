import type { IconName } from "@/components/icons/line-icon";

export type NavKey =
  | "home"
  | "today"
  | "beans"
  | "cafes"
  | "prices"
  | "guide"
  | "recipes";

export interface NavItem {
  key: NavKey;
  label: string;
  icon: IconName;
  href?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", icon: "cup" },
  { key: "today", label: "Today", icon: "timer" },
  { key: "beans", label: "My Beans", icon: "bag" },
  { key: "cafes", label: "Paris Cafes", icon: "pin" },
  { key: "prices", label: "Cafe Prices", icon: "timer", href: "/coffee-shop-prices" },
  { key: "guide", label: "Bean Guide", icon: "users" },
  { key: "recipes", label: "Recipes", icon: "arrow" },
];
