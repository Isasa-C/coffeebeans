"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";
import { TopNav } from "@/components/layout/top-nav";
import { BalanceIndicator } from "@/components/today/balance-indicator";
import { CoffeeCalendar } from "@/components/today/coffee-calendar";
import { CoffeeColumn } from "@/components/today/coffee-column";
import { TimelineSidebar } from "@/components/today/timeline-sidebar";
import { WaterColumn } from "@/components/today/water-column";
import { useLocalUser } from "@/hooks/use-local-user";
import type { NavKey } from "@/lib/navigation";

const COFFEE_LIMIT = 3;
const WATER_GOAL = 1500;
const COFFEE_PER_CUP = 80;

export function TodayPage() {
  const [coffeeCount, setCoffeeCount] = useState(3);
  const [waterMl, setWaterMl] = useState(750);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const toastTimerRef = useRef<number | null>(null);
  const router = useRouter();
  const { user, login, logout } = useLocalUser();

  function navigateTo(target: NavKey) {
    const routes: Record<NavKey, string> = {
      home: "/",
      today: "/today",
      explore: "/explore",
      learn: "/learn",
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

  return (
    <>
      <TopNav
        view="today"
        onNavigate={navigateTo}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      <main className="today-page">
        <section className="hero-columns">
          <BalanceIndicator coffeeCount={coffeeCount} waterMl={waterMl} />
          <CoffeeColumn
            coffeeCount={coffeeCount}
            setCoffeeCount={setCoffeeCount}
            coffeeLimit={COFFEE_LIMIT}
            coffeePerCup={COFFEE_PER_CUP}
            onShowToast={showToast}
          />
          <WaterColumn
            waterMl={waterMl}
            setWaterMl={setWaterMl}
            waterGoal={WATER_GOAL}
            onShowToast={showToast}
          />
        </section>
        <TimelineSidebar />
        <CoffeeCalendar />
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
