export const DRINK_TYPES = [
  {
    id: "iced-latte",
    name: "Iced Latte",
    image: "/images/drinks/iced-latte.png",
    caffeineMg: 80,
    stackHeight: 220,
    color: "#c89868",
  },
  {
    id: "americano",
    name: "Americano",
    image: "/images/drinks/americano.png",
    caffeineMg: 120,
    stackHeight: 180,
    color: "#5c3d1e",
  },
  {
    id: "espresso",
    name: "Espresso",
    image: "/images/drinks/espresso.png",
    caffeineMg: 60,
    stackHeight: 120,
    color: "#3a2418",
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    image: "/images/drinks/cappuccino.png",
    caffeineMg: 80,
    stackHeight: 160,
    color: "#a87a4a",
  },
  {
    id: "pour-over",
    name: "Pour-over",
    image: "/images/drinks/pour-over.png",
    caffeineMg: 100,
    stackHeight: 200,
    color: "#6b4628",
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    image: "/images/drinks/cold-brew.png",
    caffeineMg: 150,
    stackHeight: 200,
    color: "#2a1a10",
  },
] as const;

export type DrinkType = (typeof DRINK_TYPES)[number];
export type DrinkTypeId = DrinkType["id"];

export type LoggedCup = {
  id: string;
  typeId: DrinkTypeId;
  loggedAt: string;
};

export type CoffeeTimelineEntry = {
  id: string;
  type: "coffee";
  drinkTypeId: DrinkTypeId;
  name: string;
  caffeineMg: number;
  date: string;
  time: string;
};

export function getDrinkType(typeId: DrinkTypeId) {
  return DRINK_TYPES.find((drink) => drink.id === typeId) ?? DRINK_TYPES[0];
}
