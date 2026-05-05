export type Recipe = {
  id: string;
  name: string;
  caffeine: string;
  ratio: string;
  ingredients: string[];
  steps: string[];
  cupStyle: "latte" | "americano" | "allonge" | "espresso";
};

export const recipes: Recipe[] = [
  {
    id: "iced-oat-latte",
    name: "Iced Oat Latte",
    caffeine: "80 mg",
    ratio: "36g espresso + 180ml oat milk + 120g ice",
    ingredients: ["36g espresso", "180ml oat milk", "120g ice"],
    steps: ["Add 120g ice", "Pour 180ml oat milk", "Top with 36g espresso"],
    cupStyle: "latte",
  },
  {
    id: "iced-americano",
    name: "Iced Americano",
    caffeine: "120 mg",
    ratio: "36g espresso + 180ml cold water + 120g ice",
    ingredients: ["36g espresso", "180ml cold water", "120g ice"],
    steps: ["Add 120g ice", "Pour 180ml cold water", "Top with 36g espresso"],
    cupStyle: "americano",
  },
  {
    id: "cafe-allonge",
    name: "Café Allongé",
    caffeine: "80 mg",
    ratio: "36g espresso + 80ml hot water",
    ingredients: ["36g espresso", "80ml hot water"],
    steps: ["Extract 36g espresso", "Add 80ml hot water", "Serve warm"],
    cupStyle: "allonge",
  },
  {
    id: "espresso",
    name: "Espresso",
    caffeine: "80 mg",
    ratio: "18g coffee in → 36g espresso out",
    ingredients: ["18g ground coffee", "36g espresso"],
    steps: ["Dose 18g coffee", "Extract 36g espresso", "Aim for 25–30 seconds"],
    cupStyle: "espresso",
  },
];