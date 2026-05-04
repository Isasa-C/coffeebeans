import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "cup"
  | "bag"
  | "pin"
  | "users"
  | "timer"
  | "search"
  | "user"
  | "arrow"
  | "play";

interface LineIconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const ICON_PATHS: Record<IconName, ReactNode> = {
  cup: (
    <>
      <path d="M6 9h9a4 4 0 0 1 0 8H9a3 3 0 0 1-3-3V9Z" />
      <path d="M15 11h2a2 2 0 0 1 0 4h-2" />
      <path d="M7 5c.6.8.6 1.5 0 2.2" />
      <path d="M11 5c.6.8.6 1.5 0 2.2" />
    </>
  ),
  bag: (
    <>
      <path d="M7 8h10l1 12H6L7 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
      <path d="M10 13h4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.3 6-11a6 6 0 0 0-12 0c0 5.7 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  users: (
    <>
      <path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4" />
      <circle cx="12" cy="9" r="3" />
      <path d="M20 18c0-1.6-1.1-2.9-2.6-3.3" />
      <path d="M17 7.3a2.4 2.4 0 0 1 0 4.4" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 13V9" />
      <path d="M9 3h6" />
      <path d="M12 3v3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c1.2-3 3.5-5 7-5s5.8 2 7 5" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  play: <path d="M9 7.5v9l8-4.5-8-4.5Z" />,
};

const SOLID_ICONS: IconName[] = ["play"];

export function LineIcon({ name, className, ...props }: LineIconProps) {
  const isSolid = SOLID_ICONS.includes(name);

  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill={isSolid ? "currentColor" : "none"}
      stroke={isSolid ? "none" : "currentColor"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...props}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
