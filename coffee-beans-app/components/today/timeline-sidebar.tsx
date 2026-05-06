import Image from "next/image";
import { getDrinkType, type CoffeeTimelineEntry } from "@/lib/drink-types";

interface TimelineSidebarProps {
  entries: CoffeeTimelineEntry[];
  todayDate: string;
}

export function TimelineSidebar({ entries, todayDate }: TimelineSidebarProps) {
  const todayEntries = entries.filter((entry) => entry.date === todayDate);
  const subtitleDate = new Date(`${todayDate}T00:00:00`);
  const subtitle = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(subtitleDate);

  return (
    <aside className="timeline-sidebar">
      <h3 className="serif">Today&apos;s drinks</h3>
      <p className="timeline-subtitle">{subtitle}</p>

      <div className="timeline-entries">
        {todayEntries.length > 0 ? (
          todayEntries.map((entry) => {
            const drink = getDrinkType(entry.drinkTypeId);

            return (
              <div className="entry" key={entry.id}>
                <div className="entry-header">
                  <div className="entry-icon">
                    <Image
                      src={drink.image}
                      alt=""
                      width={40}
                      height={40}
                      className="entry-thumb"
                    />
                  </div>
                  <span className="entry-name serif">{entry.name}</span>
                  <span className="entry-time">{entry.time}</span>
                </div>
                <div className="entry-meta">{entry.caffeineMg} mg</div>
              </div>
            );
          })
        ) : (
          <div className="today-placeholder timeline-placeholder">
            No coffee logged yet
          </div>
        )}
      </div>
    </aside>
  );
}
