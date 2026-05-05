import { DrinkIcon } from "@/components/today/drink-icons";

const APRIL_DATA = {
  startOffset: 2, // April 1 is Wednesday (M=0, T=1, W=2)
  daysInMonth: 30,
  today: 28,
  // Map: day -> { type, count }
  drinks: {
    1: { type: "iced-latte", count: 1 },
    2: { type: "americano", count: 2 },
    3: { type: "pour-over", count: 1 },
    4: { type: "cappuccino", count: 1 },
    5: { type: "iced-latte", count: 3 },
    7: { type: "cold-brew", count: 1 },
    8: { type: "americano", count: 1 },
    9: { type: "iced-latte", count: 2 },
    10: { type: "espresso", count: 1 },
    12: { type: "cappuccino", count: 2 },
    14: { type: "pour-over", count: 1 },
    15: { type: "iced-latte", count: 1 },
    17: { type: "americano", count: 2 },
    18: { type: "cold-brew", count: 1 },
    20: { type: "iced-latte", count: 3 },
    21: { type: "cappuccino", count: 1 },
    23: { type: "pour-over", count: 1 },
    25: { type: "americano", count: 2 },
    27: { type: "iced-latte", count: 1 },
    28: { type: "cappuccino", count: 3 },
  },
};

const DAY_HEADERS = ["M", "T", "W", "T", "F", "S", "S"];

export function CoffeeCalendar() {
  return (
    <section className="calendar-section">
      <div className="coffee-calendar">
        <div className="calendar-header">
          <div className="calendar-year serif">2026</div>
          <div className="calendar-month serif">April</div>
        </div>

        <div className="calendar-grid">
          {DAY_HEADERS.map((header, index) => (
            <div className="day-header" key={`${header}-${index}`}>
              {header}
            </div>
          ))}

          {Array.from({ length: APRIL_DATA.startOffset }).map((_, index) => (
            <div className="day-cell" key={`empty-${index}`} />
          ))}

          {Array.from({ length: APRIL_DATA.daysInMonth }).map((_, index) => {
            const day = index + 1;
            const drink = APRIL_DATA.drinks[day as keyof typeof APRIL_DATA.drinks];
            const classes = [
              "day-cell",
              drink ? "has-icon" : "",
              day === APRIL_DATA.today ? "day-today" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                className={classes}
                key={day}
                title={
                  drink
                    ? `${drink.count} ${drink.type.replace("-", " ")}${drink.count > 1 ? "s" : ""}`
                    : undefined
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
              </div>
            );
          })}
        </div>

        <div className="calendar-summary">
          <div className="summary-stat">
            <span className="summary-number">23</span>
            <span className="summary-label">
              cups
              <br />
              consumed
            </span>
          </div>
          <div className="summary-stat">
            <span className="summary-number">8</span>
            <span className="summary-label">
              café
              <br />
              visits
            </span>
          </div>
          <div className="summary-stat">
            <span className="summary-number">5</span>
            <span className="summary-label">
              coffee
              <br />
              types
            </span>
          </div>
        </div>

        <p className="calendar-tagline">Coffee Mood</p>
      </div>
    </section>
  );
}
