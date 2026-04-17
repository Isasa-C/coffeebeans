"use client";

import { useState } from "react";
import { useLanguage, type Language } from "@/components/language-provider";

type TabKey = "roasts" | "drinks" | "match";

type PreviewCard = {
  title: string;
  description: string;
};

type RoastCard = {
  name: string;
  notes: string;
  bestFor: string;
  swatch: string;
};

type DrinkCard = {
  name: string;
  recipe: string;
  roastLabel: string;
  pillClassName: string;
  taste: string;
};

type Temperature = "hot" | "iced";
type MilkType = "regular" | "oat";

type MatchRow = {
  drink: string;
  roastLabel: string;
  pillClassName: string;
  recipe: string;
};

type GuideCopy = {
  previewEyebrow: string;
  previewTitle: string;
  previewDescription: string;
  openGuide: string;
  previewCards: PreviewCard[];
  heroTitle: string;
  heroSubtitle: string;
  tabs: Array<{ key: TabKey; label: string }>;
  roastsSectionLabel: string;
  drinksSectionLabel: string;
  matchSectionLabel: string;
  toggles: {
    hot: string;
    iced: string;
    regularMilk: string;
    oatMilk: string;
  };
  recipeLabel: string;
  roastCards: RoastCard[];
  matchRows: MatchRow[];
  espressoGroupLabel: string;
  americanoGroupLabel: string;
  latteGroupLabel: string;
  espressoCards: Record<Temperature, DrinkCard>;
  americanoCards: Record<Temperature, DrinkCard>;
  latteCards: Record<MilkType, Record<Temperature, DrinkCard>>;
};

const pillClassNames = {
  light: "bg-[#EAF3DE] text-[#3B6D11]",
  "medium-light": "bg-[#FAEEDA] text-[#854F0B]",
  medium: "bg-[#FAC775] text-[#633806]",
  "medium-dark": "bg-[#F5C4B3] text-[#993C1D]",
};

const roastSwatches = ["#F5E6C8", "#D4A96A", "#9C6B3C", "#5C3D1E", "#1E1007"];

const guideCopy: Record<Language, GuideCopy> = {
  en: {
    previewEyebrow: "Coffee Guide",
    previewTitle: "Choose the right beans for your coffee.",
    previewDescription:
      "Understand roast levels, coffee styles, and which beans work best for latte, americano, espresso, and more.",
    openGuide: "Open Coffee Guide",
    previewCards: [
      { title: "Bean Roast Types", description: "Light to dark roast explained simply." },
      { title: "Popular Drinks", description: "See how common coffee drinks are built." },
      { title: "Quick Roast Match", description: "Find the roast level that fits each drink." },
    ],
    heroTitle: "Coffee bean guide",
    heroSubtitle: "Understand roast levels, flavour profiles, and which drinks each roast works best with.",
    tabs: [
      { key: "roasts", label: "Bean roast types" },
      { key: "drinks", label: "Popular drinks" },
      { key: "match", label: "Quick roast match" },
    ],
    roastsSectionLabel: "Bean roast types",
    drinksSectionLabel: "Popular drinks",
    matchSectionLabel: "Quick roast match",
    toggles: {
      hot: "Hot",
      iced: "Iced",
      regularMilk: "Regular milk",
      oatMilk: "Oat milk",
    },
    recipeLabel: "Recipe",
    roastCards: [
      { name: "Light roast", notes: "Bright acidity, floral, citrus, berry notes.", bestFor: "Best for: pour-over, cold brew, fruit-forward drinks", swatch: roastSwatches[0] },
      { name: "Medium-light roast", notes: "Balanced sweetness and acidity, honey, nut, caramel.", bestFor: "Best for: filter coffee, lighter americanos", swatch: roastSwatches[1] },
      { name: "Medium roast", notes: "Balanced, nutty, caramel, chocolate.", bestFor: "Best for: americano, latte, flat white, dirty, oat latte", swatch: roastSwatches[2] },
      { name: "Medium-dark roast", notes: "Fuller body, dark chocolate, roasted nuts, spice.", bestFor: "Best for: espresso, cappuccino, mocha, vanilla latte, hazelnut latte", swatch: roastSwatches[3] },
      { name: "Dark roast", notes: "Bold, bitter, smoky, burnt sugar, low acidity.", bestFor: "Best for: strong americano, bold espresso drinks", swatch: roastSwatches[4] },
    ],
    matchRows: [
      { drink: "Pour-over", roastLabel: "Light / Medium-light", pillClassName: pillClassNames.light, recipe: "15g coffee + 250ml water" },
      { drink: "Cold brew", roastLabel: "Light / Medium-light", pillClassName: pillClassNames.light, recipe: "1:8 ratio (for example 50g coffee + 400ml water, steep 12-18h)" },
      { drink: "Orange / coconut coffee", roastLabel: "Light / Medium-light", pillClassName: pillClassNames.light, recipe: "36g espresso + 100-150ml juice or coconut water" },
      { drink: "Americano", roastLabel: "Medium / Dark", pillClassName: pillClassNames.medium, recipe: "36g espresso + 150-250ml water" },
      { drink: "Latte", roastLabel: "Medium / Medium-dark", pillClassName: pillClassNames.medium, recipe: "36g espresso + 180-240ml milk" },
      { drink: "Flat white", roastLabel: "Medium / Medium-dark", pillClassName: pillClassNames.medium, recipe: "36g espresso + 120-160ml milk" },
      { drink: "Dirty", roastLabel: "Medium", pillClassName: pillClassNames.medium, recipe: "36g espresso + 150-200ml cold milk" },
      { drink: "Cappuccino", roastLabel: "Medium-dark", pillClassName: pillClassNames["medium-dark"], recipe: "36g espresso + 120-150ml milk (thick foam)" },
      { drink: "Espresso", roastLabel: "Medium-dark / Dark", pillClassName: pillClassNames["medium-dark"], recipe: "36g espresso" },
      { drink: "Vanilla / Hazelnut / Mocha", roastLabel: "Medium-dark", pillClassName: pillClassNames["medium-dark"], recipe: "36g espresso + milk + 10-20g syrup" },
    ],
    espressoGroupLabel: "Espresso",
    americanoGroupLabel: "Americano",
    latteGroupLabel: "Latte",
    espressoCards: {
      hot: { name: "Hot espresso", recipe: "36g espresso", roastLabel: "Medium-dark to dark", pillClassName: pillClassNames["medium-dark"], taste: "Strong, bold" },
      iced: { name: "Iced espresso", recipe: "36g espresso over ice", roastLabel: "Medium-dark to dark", pillClassName: pillClassNames["medium-dark"], taste: "Sharp, refreshing" },
    },
    americanoCards: {
      hot: { name: "Hot americano", recipe: "36g espresso + 150-250ml hot water", roastLabel: "Medium to dark", pillClassName: pillClassNames.medium, taste: "Smooth, light" },
      iced: { name: "Iced americano", recipe: "Ice + 36g espresso + 150-250ml cold water", roastLabel: "Medium to dark", pillClassName: pillClassNames.medium, taste: "Clean, refreshing" },
    },
    latteCards: {
      regular: {
        hot: { name: "Hot latte", recipe: "36g espresso + 180-240ml milk + microfoam", roastLabel: "Medium to medium-dark", pillClassName: pillClassNames.medium, taste: "Creamy, balanced" },
        iced: { name: "Iced latte", recipe: "Ice + 36g espresso + 180-240ml cold milk", roastLabel: "Medium to medium-dark", pillClassName: pillClassNames.medium, taste: "Smooth, milky" },
      },
      oat: {
        hot: { name: "Hot oat latte", recipe: "36g espresso + 180-240ml oat milk + microfoam", roastLabel: "Medium", pillClassName: pillClassNames.medium, taste: "Creamy, slightly sweet, nutty" },
        iced: { name: "Iced oat latte", recipe: "Ice + 36g espresso + 180-240ml oat milk", roastLabel: "Medium", pillClassName: pillClassNames.medium, taste: "Smooth, refreshing, naturally sweet" },
      },
    },
  },
  fr: {
    previewEyebrow: "Guide cafe",
    previewTitle: "Choisissez les bons grains pour votre cafe.",
    previewDescription:
      "Comprenez les niveaux de torrefaction, les styles de cafe et les grains les plus adaptes au latte, a l'americano, a l'espresso et plus encore.",
    openGuide: "Ouvrir le guide cafe",
    previewCards: [
      { title: "Types de torrefaction", description: "Du clair au fonce, explique simplement." },
      { title: "Boissons populaires", description: "Voyez comment les boissons cafe sont composees." },
      { title: "Accord rapide de torrefaction", description: "Trouvez le niveau de torrefaction adapte a chaque boisson." },
    ],
    heroTitle: "Guide des grains de cafe",
    heroSubtitle: "Comprenez les niveaux de torrefaction, les profils aromatiques et les boissons qui vont le mieux avec chaque torrefaction.",
    tabs: [
      { key: "roasts", label: "Types de torrefaction" },
      { key: "drinks", label: "Boissons populaires" },
      { key: "match", label: "Accord rapide de torrefaction" },
    ],
    roastsSectionLabel: "Types de torrefaction",
    drinksSectionLabel: "Boissons populaires",
    matchSectionLabel: "Accord rapide de torrefaction",
    toggles: {
      hot: "Chaud",
      iced: "Glace",
      regularMilk: "Lait classique",
      oatMilk: "Lait d'avoine",
    },
    recipeLabel: "Recette",
    roastCards: [
      { name: "Torrefaction claire", notes: "Acidite vive, notes florales, agrumes et fruits rouges.", bestFor: "Ideal pour : pour-over, cold brew, boissons fruitees", swatch: roastSwatches[0] },
      { name: "Clair-moyen", notes: "Douceur et acidite equilibrees, miel, noix, caramel.", bestFor: "Ideal pour : cafe filtre, americanos plus legers", swatch: roastSwatches[1] },
      { name: "Moyenne", notes: "Equilibree, notes de noix, caramel et chocolat.", bestFor: "Ideal pour : americano, latte, flat white, dirty, oat latte", swatch: roastSwatches[2] },
      { name: "Moyen-fonce", notes: "Corps plus plein, chocolat noir, noix torrefiees, epices.", bestFor: "Ideal pour : espresso, cappuccino, mocha, vanilla latte, hazelnut latte", swatch: roastSwatches[3] },
      { name: "Foncee", notes: "Puissante, amere, fumee, sucre brule, faible acidite.", bestFor: "Ideal pour : americano fort, boissons espresso intenses", swatch: roastSwatches[4] },
    ],
    matchRows: [
      { drink: "Pour-over", roastLabel: "Clair / Clair-moyen", pillClassName: pillClassNames.light, recipe: "15g de cafe + 250ml d'eau" },
      { drink: "Cold brew", roastLabel: "Clair / Clair-moyen", pillClassName: pillClassNames.light, recipe: "Ratio 1:8 (par exemple 50g de cafe + 400ml d'eau, infusion 12-18h)" },
      { drink: "Cafe orange / coco", roastLabel: "Clair / Clair-moyen", pillClassName: pillClassNames.light, recipe: "36g d'espresso + 100-150ml de jus ou d'eau de coco" },
      { drink: "Americano", roastLabel: "Moyen / Fonce", pillClassName: pillClassNames.medium, recipe: "36g d'espresso + 150-250ml d'eau" },
      { drink: "Latte", roastLabel: "Moyen / Moyen-fonce", pillClassName: pillClassNames.medium, recipe: "36g d'espresso + 180-240ml de lait" },
      { drink: "Flat white", roastLabel: "Moyen / Moyen-fonce", pillClassName: pillClassNames.medium, recipe: "36g d'espresso + 120-160ml de lait" },
      { drink: "Dirty", roastLabel: "Moyen", pillClassName: pillClassNames.medium, recipe: "36g d'espresso + 150-200ml de lait froid" },
      { drink: "Cappuccino", roastLabel: "Moyen-fonce", pillClassName: pillClassNames["medium-dark"], recipe: "36g d'espresso + 120-150ml de lait (mousse epaisse)" },
      { drink: "Espresso", roastLabel: "Moyen-fonce / Fonce", pillClassName: pillClassNames["medium-dark"], recipe: "36g d'espresso" },
      { drink: "Vanille / Noisette / Mocha", roastLabel: "Moyen-fonce", pillClassName: pillClassNames["medium-dark"], recipe: "36g d'espresso + lait + 10-20g de sirop" },
    ],
    espressoGroupLabel: "Espresso",
    americanoGroupLabel: "Americano",
    latteGroupLabel: "Latte",
    espressoCards: {
      hot: { name: "Espresso chaud", recipe: "36g d'espresso", roastLabel: "Moyen-fonce a fonce", pillClassName: pillClassNames["medium-dark"], taste: "Fort, intense" },
      iced: { name: "Espresso glace", recipe: "36g d'espresso sur glace", roastLabel: "Moyen-fonce a fonce", pillClassName: pillClassNames["medium-dark"], taste: "Vif, rafraichissant" },
    },
    americanoCards: {
      hot: { name: "Americano chaud", recipe: "36g d'espresso + 150-250ml d'eau chaude", roastLabel: "Moyen a fonce", pillClassName: pillClassNames.medium, taste: "Doux, leger" },
      iced: { name: "Americano glace", recipe: "Glace + 36g d'espresso + 150-250ml d'eau froide", roastLabel: "Moyen a fonce", pillClassName: pillClassNames.medium, taste: "Net, rafraichissant" },
    },
    latteCards: {
      regular: {
        hot: { name: "Latte chaud", recipe: "36g d'espresso + 180-240ml de lait + micro-mousse", roastLabel: "Moyen a moyen-fonce", pillClassName: pillClassNames.medium, taste: "Cremé, equilibre" },
        iced: { name: "Latte glace", recipe: "Glace + 36g d'espresso + 180-240ml de lait froid", roastLabel: "Moyen a moyen-fonce", pillClassName: pillClassNames.medium, taste: "Doux, lacte" },
      },
      oat: {
        hot: { name: "Latte avoine chaud", recipe: "36g d'espresso + 180-240ml de lait d'avoine + micro-mousse", roastLabel: "Moyen", pillClassName: pillClassNames.medium, taste: "Cremé, legerement sucre, note de noix" },
        iced: { name: "Latte avoine glace", recipe: "Glace + 36g d'espresso + 180-240ml de lait d'avoine", roastLabel: "Moyen", pillClassName: pillClassNames.medium, taste: "Doux, rafraichissant, naturellement sucre" },
      },
    },
  },
  ko: {
    previewEyebrow: "커피 가이드",
    previewTitle: "내 커피에 맞는 원두를 고르세요.",
    previewDescription:
      "로스트 단계와 커피 스타일을 이해하고, 라테, 아메리카노, 에스프레소 등에 잘 맞는 원두를 빠르게 찾으세요.",
    openGuide: "커피 가이드 열기",
    previewCards: [
      { title: "원두 로스트 종류", description: "라이트부터 다크까지 쉽게 이해할 수 있어요." },
      { title: "인기 있는 음료", description: "대표적인 커피 음료 구성을 볼 수 있어요." },
      { title: "빠른 로스트 매치", description: "각 음료에 맞는 로스트를 빠르게 찾으세요." },
    ],
    heroTitle: "커피 원두 가이드",
    heroSubtitle: "로스트 단계, 향미 특징, 그리고 각 로스트에 잘 어울리는 음료를 이해해 보세요.",
    tabs: [
      { key: "roasts", label: "원두 로스트 종류" },
      { key: "drinks", label: "인기 있는 음료" },
      { key: "match", label: "빠른 로스트 매치" },
    ],
    roastsSectionLabel: "원두 로스트 종류",
    drinksSectionLabel: "인기 있는 음료",
    matchSectionLabel: "빠른 로스트 매치",
    toggles: {
      hot: "따뜻하게",
      iced: "아이스",
      regularMilk: "일반 우유",
      oatMilk: "오트 밀크",
    },
    recipeLabel: "레시피",
    roastCards: [
      { name: "라이트 로스트", notes: "밝은 산미, 플로럴, 시트러스, 베리 노트.", bestFor: "잘 맞는 음료: 푸어오버, 콜드브루, 과일감 있는 음료", swatch: roastSwatches[0] },
      { name: "미디엄-라이트 로스트", notes: "균형 잡힌 단맛과 산미, 꿀, 너트, 카라멜.", bestFor: "잘 맞는 음료: 필터 커피, 더 가벼운 아메리카노", swatch: roastSwatches[1] },
      { name: "미디엄 로스트", notes: "균형감 있고 너트, 카라멜, 초콜릿 노트.", bestFor: "잘 맞는 음료: 아메리카노, 라테, 플랫화이트, 더티, 오트 라테", swatch: roastSwatches[2] },
      { name: "미디엄-다크 로스트", notes: "더 묵직한 바디감, 다크 초콜릿, 로스티드 넛, 스파이스.", bestFor: "잘 맞는 음료: 에스프레소, 카푸치노, 모카, 바닐라 라테, 헤이즐넛 라테", swatch: roastSwatches[3] },
      { name: "다크 로스트", notes: "강하고 쌉쌀하며 스모키하고 탄 설탕 느낌, 낮은 산미.", bestFor: "잘 맞는 음료: 진한 아메리카노, 진한 에스프레소 음료", swatch: roastSwatches[4] },
    ],
    matchRows: [
      { drink: "푸어오버", roastLabel: "라이트 / 미디엄-라이트", pillClassName: pillClassNames.light, recipe: "원두 15g + 물 250ml" },
      { drink: "콜드브루", roastLabel: "라이트 / 미디엄-라이트", pillClassName: pillClassNames.light, recipe: "1:8 비율 (예: 원두 50g + 물 400ml, 12-18시간 추출)" },
      { drink: "오렌지 / 코코넛 커피", roastLabel: "라이트 / 미디엄-라이트", pillClassName: pillClassNames.light, recipe: "에스프레소 36g + 주스 또는 코코넛 워터 100-150ml" },
      { drink: "아메리카노", roastLabel: "미디엄 / 다크", pillClassName: pillClassNames.medium, recipe: "에스프레소 36g + 물 150-250ml" },
      { drink: "라테", roastLabel: "미디엄 / 미디엄-다크", pillClassName: pillClassNames.medium, recipe: "에스프레소 36g + 우유 180-240ml" },
      { drink: "플랫화이트", roastLabel: "미디엄 / 미디엄-다크", pillClassName: pillClassNames.medium, recipe: "에스프레소 36g + 우유 120-160ml" },
      { drink: "더티", roastLabel: "미디엄", pillClassName: pillClassNames.medium, recipe: "에스프레소 36g + 차가운 우유 150-200ml" },
      { drink: "카푸치노", roastLabel: "미디엄-다크", pillClassName: pillClassNames["medium-dark"], recipe: "에스프레소 36g + 우유 120-150ml (두꺼운 거품)" },
      { drink: "에스프레소", roastLabel: "미디엄-다크 / 다크", pillClassName: pillClassNames["medium-dark"], recipe: "에스프레소 36g" },
      { drink: "바닐라 / 헤이즐넛 / 모카", roastLabel: "미디엄-다크", pillClassName: pillClassNames["medium-dark"], recipe: "에스프레소 36g + 우유 + 시럽 10-20g" },
    ],
    espressoGroupLabel: "에스프레소",
    americanoGroupLabel: "아메리카노",
    latteGroupLabel: "라테",
    espressoCards: {
      hot: { name: "따뜻한 에스프레소", recipe: "에스프레소 36g", roastLabel: "미디엄-다크 ~ 다크", pillClassName: pillClassNames["medium-dark"], taste: "강하고 진한 맛" },
      iced: { name: "아이스 에스프레소", recipe: "얼음 위에 에스프레소 36g", roastLabel: "미디엄-다크 ~ 다크", pillClassName: pillClassNames["medium-dark"], taste: "선명하고 산뜻한 맛" },
    },
    americanoCards: {
      hot: { name: "따뜻한 아메리카노", recipe: "에스프레소 36g + 뜨거운 물 150-250ml", roastLabel: "미디엄 ~ 다크", pillClassName: pillClassNames.medium, taste: "부드럽고 가벼운 맛" },
      iced: { name: "아이스 아메리카노", recipe: "얼음 + 에스프레소 36g + 찬물 150-250ml", roastLabel: "미디엄 ~ 다크", pillClassName: pillClassNames.medium, taste: "깔끔하고 시원한 맛" },
    },
    latteCards: {
      regular: {
        hot: { name: "따뜻한 라테", recipe: "에스프레소 36g + 우유 180-240ml + 마이크로폼", roastLabel: "미디엄 ~ 미디엄-다크", pillClassName: pillClassNames.medium, taste: "크리미하고 균형 잡힌 맛" },
        iced: { name: "아이스 라테", recipe: "얼음 + 에스프레소 36g + 차가운 우유 180-240ml", roastLabel: "미디엄 ~ 미디엄-다크", pillClassName: pillClassNames.medium, taste: "부드럽고 밀키한 맛" },
      },
      oat: {
        hot: { name: "따뜻한 오트 라테", recipe: "에스프레소 36g + 오트 밀크 180-240ml + 마이크로폼", roastLabel: "미디엄", pillClassName: pillClassNames.medium, taste: "크리미하고 약간 달며 고소한 맛" },
        iced: { name: "아이스 오트 라테", recipe: "얼음 + 에스프레소 36g + 오트 밀크 180-240ml", roastLabel: "미디엄", pillClassName: pillClassNames.medium, taste: "부드럽고 산뜻하며 자연스러운 단맛" },
      },
    },
  },
};

function TabPill({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-block rounded-[20px] px-3 py-1 text-[11px] font-medium ${className}`}
    >
      {label}
    </span>
  );
}

function SegmentedToggle({
  options,
  value,
  onChange,
  small = false,
}: {
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
  small?: boolean;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-[8px] border-[0.5px] border-[rgba(47,36,28,0.16)]">
      {options.map((option, index) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`border-r-[0.5px] border-[rgba(47,36,28,0.16)] px-3 py-2 transition last:border-r-0 ${
              small ? "text-xs" : "text-sm"
            } ${
              isActive
                ? "bg-[#eee8df] font-medium text-[#2f241c]"
                : "bg-transparent font-normal text-[#8a8076]"
            } ${index === 0 ? "" : ""}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function CoffeeGuidePreview() {
  const { language } = useLanguage();
  const copy = guideCopy[language];

  return (
    <section
      className="scroll-mt-24 rounded-[12px] border-[0.5px] border-[rgba(47,36,28,0.12)] bg-white px-6 py-7 font-sans"
      id="guide-preview"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-medium tracking-[0.2em] text-[#8a8076] uppercase">
            {copy.previewEyebrow}
          </p>
          <h2 className="text-3xl font-semibold text-[#2f241c] sm:text-4xl">
            {copy.previewTitle}
          </h2>
          <p className="text-base leading-8 text-[#6e5a49]">
            {copy.previewDescription}
          </p>
        </div>
        <a
          href="#coffee-guide"
          className="inline-flex items-center justify-center rounded-[8px] border-[0.5px] border-[rgba(47,36,28,0.16)] bg-[#f7f4ef] px-5 py-3 text-sm font-medium text-[#2f241c] transition hover:bg-[#f0ebe3]"
        >
          {copy.openGuide}
        </a>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {copy.previewCards.map((card) => (
          <a
            key={card.title}
            href="#coffee-guide"
            className="rounded-[12px] border-[0.5px] border-[rgba(47,36,28,0.12)] bg-white px-5 py-4"
          >
            <h3 className="text-base font-medium text-[#2f241c]">{card.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[#6e5a49]">{card.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export function CoffeeGuideSection() {
  const { language } = useLanguage();
  const copy = guideCopy[language];
  const [activeTab, setActiveTab] = useState<TabKey>("roasts");
  const [espressoTemperature, setEspressoTemperature] = useState<Temperature>("hot");
  const [americanoTemperature, setAmericanoTemperature] = useState<Temperature>("hot");
  const [latteTemperature, setLatteTemperature] = useState<Temperature>("hot");
  const [latteMilkType, setLatteMilkType] = useState<MilkType>("regular");
  const espressoCard = copy.espressoCards[espressoTemperature];
  const americanoCard = copy.americanoCards[americanoTemperature];
  const latteCard = copy.latteCards[latteMilkType][latteTemperature];

  return (
    <section
      className="scroll-mt-24 rounded-[12px] border-[0.5px] border-[rgba(47,36,28,0.12)] bg-white px-6 py-8 font-sans sm:px-8"
      id="coffee-guide"
    >
      <div className="max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-[rgba(47,36,28,0.12)] bg-[#faf7f2] text-lg">
            ☕
          </span>
          <div>
            <h1 className="text-3xl font-semibold text-[#2f241c] sm:text-4xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-1 text-sm leading-7 text-[#6e5a49]">
              {copy.heroSubtitle}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {copy.tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-[8px] border-[0.5px] px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "border-[rgba(47,36,28,0.28)] bg-[#eee8df] font-medium text-[#2f241c]"
                    : "border-[rgba(47,36,28,0.12)] bg-white font-normal text-[#6e5a49] hover:bg-[#faf7f2]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <div className={activeTab === "roasts" ? "block" : "hidden"}>
          <p className="text-xs font-medium tracking-[0.2em] text-[#8a8076] uppercase">
            {copy.roastsSectionLabel}
          </p>
          <div className="mt-4 space-y-4">
            {copy.roastCards.map((roast) => (
              <article
                key={roast.name}
                className="flex items-start gap-4 rounded-[12px] border-[0.5px] border-[rgba(47,36,28,0.12)] bg-white px-5 py-4"
              >
                <span
                  className="mt-1 h-10 w-10 shrink-0 rounded-full border-[0.5px] border-[rgba(47,36,28,0.08)]"
                  style={{ backgroundColor: roast.swatch }}
                />
                <div className="space-y-2">
                  <h3 className="text-base font-medium text-[#2f241c]">{roast.name}</h3>
                  <p className="text-sm leading-7 text-[#6e5a49]">{roast.notes}</p>
                  <p className="text-sm text-[#2f241c]">{roast.bestFor}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={activeTab === "drinks" ? "block" : "hidden"}>
          <p className="text-xs font-medium tracking-[0.2em] text-[#8a8076] uppercase">
            {copy.drinksSectionLabel}
          </p>
          <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
            <div>
              <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[#8a8076] uppercase">
                {copy.espressoGroupLabel}
              </p>
              <article className="rounded-[12px] border-[0.5px] border-[rgba(47,36,28,0.12)] bg-white px-5 py-4">
                <SegmentedToggle
                  options={[
                    { label: copy.toggles.hot, value: "hot" },
                    { label: copy.toggles.iced, value: "iced" },
                  ]}
                  value={espressoTemperature}
                  onChange={(value) => setEspressoTemperature(value as Temperature)}
                />
                <div className="mt-4">
                  <h3 className="text-base font-semibold text-[#2f241c]">{espressoCard.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6e5a49]">{espressoCard.recipe}</p>
                  <div className="mt-4">
                    <TabPill label={espressoCard.roastLabel} className={espressoCard.pillClassName} />
                  </div>
                  <p className="mt-3 text-sm text-[#8a8076]">{espressoCard.taste}</p>
                </div>
              </article>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[#8a8076] uppercase">
                {copy.americanoGroupLabel}
              </p>
              <article className="rounded-[12px] border-[0.5px] border-[rgba(47,36,28,0.12)] bg-white px-5 py-4">
                <SegmentedToggle
                  options={[
                    { label: copy.toggles.hot, value: "hot" },
                    { label: copy.toggles.iced, value: "iced" },
                  ]}
                  value={americanoTemperature}
                  onChange={(value) => setAmericanoTemperature(value as Temperature)}
                />
                <div className="mt-4">
                  <h3 className="text-base font-semibold text-[#2f241c]">{americanoCard.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6e5a49]">{americanoCard.recipe}</p>
                  <div className="mt-4">
                    <TabPill label={americanoCard.roastLabel} className={americanoCard.pillClassName} />
                  </div>
                  <p className="mt-3 text-sm text-[#8a8076]">{americanoCard.taste}</p>
                </div>
              </article>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[#8a8076] uppercase">
                {copy.latteGroupLabel}
              </p>
              <article className="rounded-[12px] border-[0.5px] border-[rgba(47,36,28,0.12)] bg-white px-5 py-4">
                <SegmentedToggle
                  options={[
                    { label: copy.toggles.hot, value: "hot" },
                    { label: copy.toggles.iced, value: "iced" },
                  ]}
                  value={latteTemperature}
                  onChange={(value) => setLatteTemperature(value as Temperature)}
                />
                <div className="mt-3">
                  <SegmentedToggle
                  options={[
                      { label: copy.toggles.regularMilk, value: "regular" },
                      { label: copy.toggles.oatMilk, value: "oat" },
                    ]}
                    value={latteMilkType}
                    onChange={(value) => setLatteMilkType(value as MilkType)}
                    small
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-base font-semibold text-[#2f241c]">{latteCard.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6e5a49]">{latteCard.recipe}</p>
                  <div className="mt-4">
                    <TabPill label={latteCard.roastLabel} className={latteCard.pillClassName} />
                  </div>
                  <p className="mt-3 text-sm text-[#8a8076]">{latteCard.taste}</p>
                </div>
              </article>
            </div>
          </div>
        </div>

        <div className={activeTab === "match" ? "block" : "hidden"}>
          <div>
            {copy.matchRows.map((row) => (
              <div
                key={row.drink}
                className="grid grid-cols-[1fr_auto] items-center gap-4 border-b-[0.5px] border-[rgba(47,36,28,0.12)] py-3 first:pt-0 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="text-base font-medium text-[#2f241c]">{row.drink}</p>
                  <p className="mt-1 text-xs leading-5 text-[#a19386]">
                    {copy.recipeLabel}: {row.recipe}
                  </p>
                </div>
                <TabPill label={row.roastLabel} className={row.pillClassName} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
