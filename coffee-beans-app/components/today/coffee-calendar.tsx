"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DrinkIcon } from "@/components/today/drink-icons";
import { getDrinkType, type CoffeeTimelineEntry } from "@/lib/drink-types";

interface CoffeeCalendarProps {
  entries: CoffeeTimelineEntry[];
  todayDate: string;
}

type CalendarDrink = {
  type: string;
  count: number;
};

const DAY_HEADERS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function CoffeeCalendar({ entries, todayDate }: CoffeeCalendarProps) {
  const today = useMemo(() => new Date(`${todayDate}T00:00:00`), [todayDate]);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [isSelectedDayModalOpen, setIsSelectedDayModalOpen] = useState(false);
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const startOffset = (new Date(selectedYear, selectedMonth, 1).getDay() + 6) % 7;
  const selectedDateKey = getDateKey(selectedYear, selectedMonth, selectedDay);
  const monthEntries = entries.filter((entry) => {
    const entryDate = new Date(`${entry.date}T00:00:00`);
    return (
      entryDate.getFullYear() === selectedYear &&
      entryDate.getMonth() === selectedMonth
    );
  });
  const selectedEntries = entries
    .filter((entry) => entry.date === selectedDateKey)
    .sort((left, right) => left.time.localeCompare(right.time));
  const drinksByDay = groupEntriesByDay(monthEntries);
  const uniqueTypes = new Set(monthEntries.map((entry) => entry.drinkTypeId));
  const activeDays = new Set(monthEntries.map((entry) => entry.date));

  function updateMonth(month: number) {
    setSelectedMonth(month);
    setSelectedDay((day) =>
      Math.min(day, new Date(selectedYear, month + 1, 0).getDate()),
    );
  }

  function updateYear(year: number) {
    setSelectedYear(year);
    setSelectedDay((day) =>
      Math.min(day, new Date(year, selectedMonth + 1, 0).getDate()),
    );
  }

  useEffect(() => {
    if (!isSelectedDayModalOpen) {
      return;
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSelectedDayModalOpen(false);
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isSelectedDayModalOpen]);

  return (
    <section className="calendar-section">
      <div className="coffee-calendar">
        <div className="calendar-main">
          <div className="calendar-header">
            <div className="calendar-controls">
              <select
                aria-label="Select month"
                className="calendar-select"
                value={selectedMonth}
                onChange={(event) => updateMonth(Number(event.target.value))}
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <input
                aria-label="Select year"
                className="calendar-year-input"
                type="number"
                min="2020"
                max="2035"
                value={selectedYear}
                onChange={(event) => updateYear(Number(event.target.value))}
              />
            </div>
            <div className="calendar-heading serif">
              {MONTHS[selectedMonth]} {selectedYear}
            </div>
          </div>

          <div className="calendar-grid">
            {DAY_HEADERS.map((header, index) => (
              <div className="day-header" key={`${header}-${index}`}>
                {header}
              </div>
            ))}

            {Array.from({ length: startOffset }).map((_, index) => (
              <div className="day-cell empty" key={`empty-${index}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const drink = drinksByDay[day];
              const isToday =
                selectedYear === today.getFullYear() &&
                selectedMonth === today.getMonth() &&
                day === today.getDate();
              const isSelected = day === selectedDay;
              const classes = [
                "day-cell",
                drink ? "has-icon" : "",
                isToday ? "day-today" : "",
                isSelected ? "selected" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  className={classes}
                  key={day}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day);
                    setIsSelectedDayModalOpen(true);
                  }}
                  title={
                    drink
                      ? `${drink.count} ${drink.type.replace("-", " ")}${
                          drink.count > 1 ? "s" : ""
                        }`
                      : `${MONTHS[selectedMonth]} ${day}`
                  }
                >
                  {drink ? (
                    <>
                      <div className="day-icon">
                        <DrinkIcon type={drink.type} />
                      </div>
                      {drink.count > 1 ? (
                        <span className="day-count">+{drink.count - 1}</span>
                      ) : null}
                    </>
                  ) : (
                    <span className="day-number">{day}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="calendar-summary">
            <div className="summary-stat">
              <span className="summary-number">{monthEntries.length}</span>
              <span className="summary-label">cups</span>
            </div>
            <div className="summary-stat">
              <span className="summary-number">{activeDays.size}</span>
              <span className="summary-label">active days</span>
            </div>
            <div className="summary-stat">
              <span className="summary-number">{uniqueTypes.size}</span>
              <span className="summary-label">types</span>
            </div>
          </div>
        </div>
      </div>

      {isSelectedDayModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="calendar-day-modal-title"
          className="calendar-day-modal-backdrop"
          onClick={() => setIsSelectedDayModalOpen(false)}
        >
          <div
            className="calendar-day-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close selected day details"
              className="calendar-day-modal-close"
              onClick={() => setIsSelectedDayModalOpen(false)}
            >
              ×
            </button>

            <span className="section-label">Selected day</span>
            <h3 id="calendar-day-modal-title" className="calendar-detail-title serif">
              {MONTHS[selectedMonth]} {selectedDay}, {selectedYear}
            </h3>
            <p className="calendar-detail-meta">
              {selectedEntries.length}{" "}
              {selectedEntries.length === 1 ? "drink" : "drinks"} logged
            </p>

            <div className="calendar-detail-list">
              {selectedEntries.length > 0 ? (
                selectedEntries.map((entry) => {
                  const drink = getDrinkType(entry.drinkTypeId);

                  return (
                    <div className="calendar-detail-entry" key={entry.id}>
                      <div className="entry-icon">
                        <Image
                          src={drink.image}
                          alt=""
                          width={40}
                          height={40}
                          className="entry-thumb"
                        />
                      </div>
                      <div className="calendar-detail-copy">
                        <span className="entry-name serif">{entry.name}</span>
                        <span className="entry-meta">
                          {entry.time} · {entry.caffeineMg} mg
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="calendar-empty-copy">No coffee logged on this day.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function groupEntriesByDay(entries: CoffeeTimelineEntry[]) {
  return entries.reduce<Record<number, CalendarDrink>>((days, entry) => {
    const day = new Date(`${entry.date}T00:00:00`).getDate();
    const current = days[day];

    if (!current) {
      days[day] = {
        type: entry.drinkTypeId,
        count: 1,
      };
      return days;
    }

    current.count += 1;
    return days;
  }, {});
}

function getDateKey(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
}
