"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";
import { TopNav } from "@/components/layout/top-nav";
import { CoffeeCalendar } from "@/components/today/coffee-calendar";
import { CoffeeColumn } from "@/components/today/coffee-column";
import { TimelineSidebar } from "@/components/today/timeline-sidebar";
import {
  DRINK_TYPES,
  getDrinkType,
  type CoffeeTimelineEntry,
  type DrinkTypeId,
  type LoggedCup,
} from "@/lib/drink-types";
import { useLocalUser } from "@/hooks/use-local-user";
import type { NavKey } from "@/lib/navigation";

const COFFEE_LIMIT = 3;
const HISTORY_STORAGE_KEY = "coffee-daily-history-v1";
const PARIS_TIME_ZONE = "Europe/Paris";

const INITIAL_CUPS: LoggedCup[] = [
  { id: "1", typeId: "iced-latte", loggedAt: "08:30" },
  { id: "2", typeId: "americano", loggedAt: "11:45" },
  { id: "3", typeId: "cappuccino", loggedAt: "15:30" },
];

const INITIAL_TIMELINE_ENTRIES: CoffeeTimelineEntry[] = INITIAL_CUPS.map((cup) => {
  const drink = getDrinkType(cup.typeId);

  return {
    id: cup.id,
    type: "coffee",
    drinkTypeId: cup.typeId,
    name: drink.name,
    caffeineMg: drink.caffeineMg,
    date: "2026-05-05",
    time: cup.loggedAt,
  };
});

function loadStoredHistory() {
  try {
    if (typeof window === "undefined") {
      return INITIAL_TIMELINE_ENTRIES;
    }

    const storedHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!storedHistory) {
      return INITIAL_TIMELINE_ENTRIES;
    }

    const parsed = JSON.parse(storedHistory);
    if (!Array.isArray(parsed)) {
      return INITIAL_TIMELINE_ENTRIES;
    }

    return parsed.filter(isCoffeeTimelineEntry);
  } catch {
    return INITIAL_TIMELINE_ENTRIES;
  }
}

function isCoffeeTimelineEntry(entry: unknown): entry is CoffeeTimelineEntry {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  const candidate = entry as Partial<CoffeeTimelineEntry>;
  return (
    candidate.type === "coffee" &&
    typeof candidate.id === "string" &&
    typeof candidate.drinkTypeId === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.caffeineMg === "number" &&
    typeof candidate.date === "string" &&
    typeof candidate.time === "string"
  );
}

function getParisDateKey() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
}

function getParisTimeLabel() {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: PARIS_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(new Date());
}

export function TodayPage() {
  const [todayDate, setTodayDate] = useState(getParisDateKey);
  const [timelineEntries, setTimelineEntries] = useState<CoffeeTimelineEntry[]>(
    INITIAL_TIMELINE_ENTRIES,
  );
  const cups = timelineEntries
    .filter((entry) => entry.date === todayDate)
    .slice()
    .reverse()
    .map((entry) => ({
      id: entry.id,
      typeId: entry.drinkTypeId,
      loggedAt: entry.time,
    }));
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const toastTimerRef = useRef<number | null>(null);
  const router = useRouter();
  const { user, login, logout } = useLocalUser();
  const totalCaffeineMg = cups.reduce((sum, cup) => {
    const drink = DRINK_TYPES.find((drinkType) => drinkType.id === cup.typeId);
    return sum + (drink?.caffeineMg ?? 0);
  }, 0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTimelineEntries(loadStoredHistory());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTodayDate(getParisDateKey());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(timelineEntries),
    );
  }, [timelineEntries]);

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

  function showToast(message: string) {
    setToastMessage(message);
    setIsToastVisible(true);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setIsToastVisible(false), 2400);
  }

  function addCup(typeId: DrinkTypeId) {
    if (cups.length >= 4) {
      showToast("That's a lot of caffeine — consider water instead");
      return;
    }

    const drink = getDrinkType(typeId);
    const time = getParisTimeLabel();
    const newCup: LoggedCup = {
      id: Date.now().toString(),
      typeId,
      loggedAt: time,
    };

    setTimelineEntries((entries) => [
      {
        id: newCup.id,
        type: "coffee",
        drinkTypeId: typeId,
        name: drink.name,
        caffeineMg: drink.caffeineMg,
        date: todayDate,
        time,
      },
      ...entries,
    ]);
    showToast(`${drink.name} logged`);
  }

  function removeLastCup() {
    if (cups.length === 0) {
      return;
    }

    const removed = cups[cups.length - 1];
    setTimelineEntries((entries) =>
      entries.filter((entry) => entry.id !== removed.id),
    );
  }

  return (
    <>
      <TopNav
        view="today"
        onNavigate={navigateTo}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      <main className="today-page">
        <section className="today-layout">
          <section className="today-left-column">
            <CoffeeColumn
              cups={cups}
              coffeeLimit={COFFEE_LIMIT}
              totalCaffeineMg={totalCaffeineMg}
              onAddCup={addCup}
              onRemoveLastCup={removeLastCup}
            />
          </section>

          <section className="today-right-column">
            <CoffeeCalendar entries={timelineEntries} todayDate={todayDate} />
            <TimelineSidebar entries={timelineEntries} todayDate={todayDate} />
          </section>
        </section>
      </main>
      <div className={`toast ${isToastVisible ? "visible" : ""}`}>{toastMessage}</div>
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
