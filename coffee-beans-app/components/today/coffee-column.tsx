import Image from "next/image";
import type { CSSProperties } from "react";
import {
  DRINK_TYPES,
  getDrinkType,
  type DrinkTypeId,
  type LoggedCup,
} from "@/lib/drink-types";

const QUICK_ADD_DRINKS = DRINK_TYPES.filter(
  (drink) => drink.id !== "pour-over" && drink.id !== "cold-brew",
);

interface CoffeeColumnProps {
  cups: LoggedCup[];
  coffeeLimit: number;
  totalCaffeineMg: number;
  onAddCup: (typeId: DrinkTypeId) => void;
  onRemoveLastCup: () => void;
}

export function CoffeeColumn({
  cups,
  coffeeLimit,
  totalCaffeineMg,
  onAddCup,
  onRemoveLastCup,
}: CoffeeColumnProps) {
  return (
    <div className="col-coffee">
      <div className="stat-block">
        <div className="stat-eyebrow">Coffee today</div>
        <div className="stat-number serif">
          {cups.length} {cups.length === 1 ? "cup" : "cups"}
        </div>
        <div className="stat-meta">{totalCaffeineMg} mg caffeine</div>
      </div>

      <div className="cup-stack">
        {cups.map((cup, index) => {
          const drinkType = getDrinkType(cup.typeId);

          return (
            <div
              key={cup.id}
              className="stacked-cup"
              data-drink-type={cup.typeId}
              style={{
                top: `${getStackTop(getSameTypeIndex(cup, index, cups))}px`,
                "--stack-x": getStackX(cup, cups),
                zIndex: 10 + index,
              } as CSSProperties}
            >
              <Image
                src={drinkType.image}
                alt={drinkType.name}
                width={200}
                height={drinkType.stackHeight}
                className="stacked-cup-image"
                priority={index === cups.length - 1}
              />
            </div>
          );
        })}
      </div>

      <div className={`limit-text ${cups.length >= coffeeLimit ? "reached" : ""}`}>
        {getLimitText(cups.length, coffeeLimit)}
      </div>

      <div className="quick-add-section">
        <span className="quick-add-label">Quick Log</span>
        <div className="drink-buttons">
          {QUICK_ADD_DRINKS.map((drink) => (
            <button
              key={drink.id}
              className="drink-btn"
              type="button"
              onClick={() => onAddCup(drink.id)}
              disabled={cups.length >= 4}
              style={{ "--drink-accent": drink.color } as CSSProperties}
            >
              <div className="drink-btn-thumb">
                <Image src={drink.image} alt="" width={48} height={48} />
              </div>
              <span className="drink-btn-name">{drink.name}</span>
            </button>
          ))}
        </div>

        {cups.length > 0 ? (
          <button
            className="remove-last-btn"
            type="button"
            onClick={onRemoveLastCup}
          >
            Remove last cup
          </button>
        ) : null}
      </div>
    </div>
  );
}

function getLimitText(coffeeCount: number, coffeeLimit: number) {
  if (coffeeCount === 0) {
    return "";
  }

  if (coffeeCount < coffeeLimit) {
    return `${coffeeLimit - coffeeCount} more before limit`;
  }

  if (coffeeCount === coffeeLimit) {
    return "Limit reached for today";
  }

  return `${coffeeCount - coffeeLimit} over limit`;
}

function getStackTop(index: number) {
  const stackTops = [190, 125, 60, -5];
  return stackTops[index] ?? -5;
}

function getSameTypeIndex(cup: LoggedCup, cupIndex: number, cups: LoggedCup[]) {
  return cups
    .slice(0, cupIndex)
    .filter((previousCup) => previousCup.typeId === cup.typeId).length;
}

function getStackX(cup: LoggedCup, cups: LoggedCup[]) {
  const laneOrder = ["0px", "-125px", "125px", "0px"];
  const uniqueTypeIds = Array.from(new Set(cups.map((loggedCup) => loggedCup.typeId)));
  const laneIndex = uniqueTypeIds.indexOf(cup.typeId);

  return laneOrder[laneIndex] ?? "0px";
}
