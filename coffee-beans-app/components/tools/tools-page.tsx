"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";
import { TopNav } from "@/components/layout/top-nav";
import { useLocalUser } from "@/hooks/use-local-user";
import type { NavKey } from "@/lib/navigation";

type ToolId = "timer" | "calculator" | "reference";

type TimerStage = {
  name: string;
  duration: number;
  instruction: string;
};

type TimerMethod = {
  id: string;
  name: string;
  totalTime: string;
  stages: TimerStage[];
};

type RatioPreset = {
  value: number;
  name: string;
  description: string;
  bestFor: string;
};

type MethodReference = {
  id: string;
  name: string;
  style: string;
  image: string;
  icon: string;
  description: string;
  tagline: string;
  grind: string;
  waterTemp: string;
  ratio: string;
  totalTime: string;
  singleCup: {
    coffee: number;
    water: number;
  };
  tastesLike: string;
  bestFor: string[];
};

const tools: Array<{
  id: ToolId;
  name: string;
  meta: string;
  icon: "timer" | "scale" | "book";
}> = [
  {
    id: "timer",
    name: "Brewing timer",
    meta: "Step-by-step pour timing",
    icon: "timer",
  },
  {
    id: "calculator",
    name: "Dose calculator",
    meta: "Coffee for any ratio",
    icon: "scale",
  },
  {
    id: "reference",
    name: "Method reference",
    meta: "Quick guide cards",
    icon: "book",
  },
];

const methods: TimerMethod[] = [
  {
    id: "french-press",
    name: "French Press",
    totalTime: "4:30",
    stages: [
      {
        name: "Pour and stir",
        duration: 30,
        instruction: "Pour hot water over grounds. Stir gently.",
      },
      {
        name: "Steep",
        duration: 240,
        instruction: "Place plunger on top. Wait - do not press.",
      },
      {
        name: "Press",
        duration: 30,
        instruction: "Press plunger down slowly and steadily.",
      },
    ],
  },
  {
    id: "v60",
    name: "V60 Pour-over",
    totalTime: "3:00",
    stages: [
      {
        name: "Bloom",
        duration: 30,
        instruction: "Pour 50g water. Wet all grounds. Wait.",
      },
      {
        name: "First pour",
        duration: 30,
        instruction: "Pour to 150g in slow circles.",
      },
      {
        name: "Second pour",
        duration: 30,
        instruction: "Pour to 250g. Keep circles even.",
      },
      {
        name: "Final pour",
        duration: 30,
        instruction: "Pour to 350g. Centre stream only.",
      },
      {
        name: "Drawdown",
        duration: 60,
        instruction: "Wait for water to fully drain through.",
      },
    ],
  },
  {
    id: "aeropress",
    name: "AeroPress",
    totalTime: "2:30",
    stages: [
      {
        name: "Pour",
        duration: 10,
        instruction: "Add water to fill chamber. Stir 5 times.",
      },
      {
        name: "Steep",
        duration: 60,
        instruction: "Place plunger lightly on top. Wait.",
      },
      {
        name: "Press",
        duration: 30,
        instruction: "Press slowly for 30 seconds.",
      },
    ],
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    totalTime: "12:00:00",
    stages: [
      {
        name: "Combine",
        duration: 60,
        instruction: "Mix coffee and cold water. Stir to saturate.",
      },
      {
        name: "Steep in fridge",
        duration: 43200,
        instruction: "Refrigerate. Patience makes it smooth.",
      },
      {
        name: "Filter",
        duration: 120,
        instruction: "Strain through filter. Discard grounds.",
      },
    ],
  },
  {
    id: "chemex",
    name: "Chemex",
    totalTime: "4:00",
    stages: [
      {
        name: "Bloom",
        duration: 45,
        instruction: "Pour enough water to saturate the bed. Let it bloom.",
      },
      {
        name: "Main pour",
        duration: 120,
        instruction: "Pour slowly in circles until you reach your target weight.",
      },
      {
        name: "Drawdown",
        duration: 75,
        instruction: "Let the thick filter finish draining fully.",
      },
    ],
  },
  {
    id: "espresso",
    name: "Espresso",
    totalTime: "0:30",
    stages: [
      {
        name: "Pre-infusion",
        duration: 5,
        instruction: "Start the shot and let the puck saturate gently.",
      },
      {
        name: "Extract",
        duration: 25,
        instruction: "Aim for a steady stream and stop near your target yield.",
      },
    ],
  },
];

const ratios: RatioPreset[] = [
  {
    value: 14,
    name: "Strong",
    description:
      "Bold, intense flavour. Use for darker roasts or when you want body.",
    bestFor: "French Press, espresso-style brewing",
  },
  {
    value: 15,
    name: "Bold",
    description: "Rich and full-bodied. Standard for most brewing methods.",
    bestFor: "V60, Chemex, drip coffee",
  },
  {
    value: 16,
    name: "Balanced",
    description:
      "The golden ratio. Sweet spot for most light to medium roasts.",
    bestFor: "V60, AeroPress, light roast pour-overs",
  },
  {
    value: 17,
    name: "Light",
    description: "Bright and tea-like. Best for highlighting delicate origins.",
    bestFor: "Light roasts, single-origin filters",
  },
  {
    value: 18,
    name: "Delicate",
    description: "Very light and clear. Almost like a coffee-flavoured tea.",
    bestFor: "Cuppings, very light roasts",
  },
];

const methodReferences: MethodReference[] = [
  {
    id: "v60",
    name: "V60 Pour-over",
    style: "Filter",
    image: "/images/methods/V60.png",
    icon: "/images/methods/V60.png",
    description:
      "A cone-shaped dripper that produces clean, bright cups with clarity. The single hole allows you to control flow with your pour, making it the most expressive of all filter methods.",
    tagline: "Bright, clean, and clear.",
    grind: "Medium-fine",
    waterTemp: "92-96",
    ratio: "1:16",
    totalTime: "3:00",
    singleCup: { coffee: 15, water: 240 },
    tastesLike:
      "Tea-like clarity. Highlights origin character. Bright acidity, clean finish.",
    bestFor: [
      "Light to medium roasts",
      "Single-origin coffees",
      "Mornings when you want clarity",
    ],
  },
  {
    id: "chemex",
    name: "Chemex",
    style: "Filter",
    image: "/images/methods/chemex.png",
    icon: "/images/methods/chemex.png",
    description:
      "An hourglass-shaped brewer with a thick paper filter that creates the cleanest cup of any method. Produces bright, clear, and almost transparent coffee.",
    tagline: "The cleanest cup possible.",
    grind: "Medium-coarse",
    waterTemp: "93-96",
    ratio: "1:17",
    totalTime: "4:00",
    singleCup: { coffee: 25, water: 425 },
    tastesLike:
      "Crystal clear. Very low body. Bright, almost wine-like acidity.",
    bestFor: [
      "Bigger batches (2-4 cups)",
      "Very light roasts",
      "Morning carafe brewing",
    ],
  },
  {
    id: "aeropress",
    name: "AeroPress",
    style: "Pressure",
    image: "/images/methods/aeropress.png",
    icon: "/images/methods/aeropress.png",
    description:
      "A hybrid immersion-and-pressure brewer that produces concentrated, smooth coffee in under three minutes. Forgiving and versatile - works with any roast.",
    tagline: "Fast, smooth, forgiving.",
    grind: "Fine to medium",
    waterTemp: "80-90",
    ratio: "1:12",
    totalTime: "2:00",
    singleCup: { coffee: 17, water: 200 },
    tastesLike:
      "Smooth and round. Lower acidity than pour-over. Fuller body.",
    bestFor: ["Travel and camping", "Single cups", "Beginners - hard to mess up"],
  },
  {
    id: "french-press",
    name: "French Press",
    style: "Immersion",
    image: "/images/methods/french-press.png",
    icon: "/images/methods/french-press.png",
    description:
      "Full immersion brewing with a metal mesh filter. The mesh allows oils and fine particles through, producing the heaviest body of any brewing method.",
    tagline: "Full body, rich oils.",
    grind: "Coarse",
    waterTemp: "93-95",
    ratio: "1:15",
    totalTime: "4:30",
    singleCup: { coffee: 17, water: 250 },
    tastesLike:
      "Heavy body. Rich texture. Sediment in the cup. Full mouthfeel.",
    bestFor: [
      "Dark roasts",
      "Cold mornings",
      "When you want body over clarity",
    ],
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    style: "Cold immersion",
    image: "/images/methods/cold-brew.png",
    icon: "/images/methods/cold-brew.png",
    description:
      "Coarsely ground coffee steeped in cold water for 12-18 hours. Produces a smooth, low-acidity concentrate that can be served neat or diluted with water or milk.",
    tagline: "Smooth, sweet, low-acid.",
    grind: "Very coarse",
    waterTemp: "Cold",
    ratio: "1:8",
    totalTime: "12-18 hours",
    singleCup: { coffee: 100, water: 800 },
    tastesLike:
      "Sweet and chocolatey. Very low acid. Smooth and easy to drink.",
    bestFor: ["Hot summers", "Sensitive stomachs", "Iced lattes"],
  },
  {
    id: "espresso",
    name: "Espresso",
    style: "Pressure",
    image: "/images/espresso-refresh.png",
    icon: "/images/espresso-refresh.png",
    description:
      "High pressure forces hot water through finely ground coffee in 25-30 seconds. The base for milk drinks and the most concentrated form of coffee.",
    tagline: "Concentrated, intense.",
    grind: "Fine",
    waterTemp: "90-96",
    ratio: "1:2",
    totalTime: "0:25-0:30",
    singleCup: { coffee: 18, water: 36 },
    tastesLike:
      "Intense, syrupy, layered. Sweet crema on top, complex body below.",
    bestFor: [
      "Milk drinks (latte, cappuccino)",
      "Quick caffeine hits",
      "Espresso machine owners",
    ],
  },
];

const ringCircumference = 2 * Math.PI * 90;

export function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolId>("timer");
  const [activeMethodId, setActiveMethodId] = useState(methods[0].id);
  const [stages, setStages] = useState<TimerStage[]>(methods[0].stages);
  const [currentStage, setCurrentStage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(methods[0].stages[0].duration);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [coffeeAmount, setCoffeeAmount] = useState(32);
  const [waterAmount, setWaterAmount] = useState(512);
  const [ratio, setRatio] = useState(16);
  const [activeField, setActiveField] = useState<"coffee" | "water">("coffee");
  const [selectedReferenceMethodId, setSelectedReferenceMethodId] = useState(
    methodReferences[0].id,
  );
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter();
  const { user, signIn, signUp, logout } = useLocalUser();

  const currentTimerStage = stages[currentStage] ?? stages[0];
  const currentDuration = currentTimerStage?.duration ?? 1;
  const progressPercent = currentDuration
    ? ((currentDuration - timeRemaining) / currentDuration) * 100
    : 0;

  const activeMethod = useMemo(
    () => methods.find((method) => method.id === activeMethodId) ?? methods[0],
    [activeMethodId],
  );
  const currentRatio = useMemo(
    () => ratios.find((ratioPreset) => ratioPreset.value === ratio) ?? ratios[2],
    [ratio],
  );
  const selectedReferenceMethod = useMemo(
    () =>
      methodReferences.find((method) => method.id === selectedReferenceMethodId) ??
      methodReferences[0],
    [selectedReferenceMethodId],
  );

  useEffect(() => {
    if (!isPlaying || activeTool !== "timer") {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeRemaining((previous) => {
        if (previous > 1) {
          return previous - 1;
        }

        const nextStage = currentStage + 1;

        if (nextStage >= stages.length) {
          setIsPlaying(false);
          playTone(isMuted ? null : "complete");
          return 0;
        }

        setCurrentStage(nextStage);
        playTone(isMuted ? null : "stage");
        return stages[nextStage].duration;
      });

      setTotalElapsed((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [activeTool, currentStage, isMuted, isPlaying, stages]);

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

  function loadMethod(method: TimerMethod) {
    setActiveMethodId(method.id);
    setStages(method.stages);
    setCurrentStage(0);
    setTimeRemaining(method.stages[0].duration);
    setTotalElapsed(0);
    setIsPlaying(false);
  }

  function togglePlay() {
    if (timeRemaining === 0 && currentStage >= stages.length - 1) {
      reset();
      setIsPlaying(true);
      return;
    }

    setIsPlaying((current) => !current);
  }

  function reset() {
    setCurrentStage(0);
    setTimeRemaining(stages[0].duration);
    setTotalElapsed(0);
    setIsPlaying(false);
  }

  function skipStage() {
    if (currentStage >= stages.length - 1) {
      setTimeRemaining(0);
      setIsPlaying(false);
      return;
    }

    const nextStage = currentStage + 1;
    setCurrentStage(nextStage);
    setTimeRemaining(stages[nextStage].duration);
  }

  function updateCoffee(value: number) {
    setActiveField("coffee");
    setCoffeeAmount(value);
    setWaterAmount(Math.round(value * ratio));
  }

  function updateWater(value: number) {
    setActiveField("water");
    setWaterAmount(value);
    setCoffeeAmount(roundCoffeeAmount(value / ratio));
  }

  function quickSet(coffee: number, water: number) {
    setCoffeeAmount(coffee);
    setWaterAmount(water);
  }

  function updateRatio(value: number) {
    setRatio(value);

    if (activeField === "coffee") {
      setWaterAmount(Math.round(coffeeAmount * value));
      return;
    }

    setCoffeeAmount(roundCoffeeAmount(waterAmount / value));
  }

  function openTimerWith(methodId: string) {
    const method = methods.find((timerMethod) => timerMethod.id === methodId);

    if (method) {
      loadMethod(method);
    }

    setActiveTool("timer");
  }

  return (
    <>
      <TopNav
        view="tools"
        onNavigate={navigateTo}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      <main className="bg-[#f5efe5] text-[#2b1b12]">
        <section className="tools-page">
          {activeTool === "reference" ? (
            <MethodsList
              methods={methodReferences}
              onBackToTools={() => setActiveTool("timer")}
              onSelectMethod={setSelectedReferenceMethodId}
              selectedMethodId={selectedReferenceMethod.id}
            />
          ) : (
            <ToolsList activeTool={activeTool} onSelectTool={setActiveTool} />
          )}

          {activeTool === "timer" ? (
            <>
              <TimerDisplay
                currentStage={currentStage}
                isPlaying={isPlaying}
                onReset={reset}
                onSkipStage={skipStage}
                onTogglePlay={togglePlay}
                progressPercent={progressPercent}
                stages={stages}
                timeRemaining={timeRemaining}
                totalElapsed={totalElapsed}
              />
              <TimerConfig
                activeMethod={activeMethod}
                currentStage={currentStage}
                isMuted={isMuted}
                methods={methods}
                onLoadMethod={loadMethod}
                onToggleMute={() => setIsMuted((current) => !current)}
                stages={stages}
              />
            </>
          ) : activeTool === "calculator" ? (
            <>
              <DoseCalculator
                activeField={activeField}
                coffeeAmount={coffeeAmount}
                onQuickSet={quickSet}
                onUpdateCoffee={updateCoffee}
                onUpdateWater={updateWater}
                ratio={ratio}
                waterAmount={waterAmount}
              />
              <DoseCalculatorConfig
                currentRatio={currentRatio}
                onSetRatio={updateRatio}
                ratio={ratio}
                ratios={ratios}
              />
            </>
          ) : activeTool === "reference" ? (
            <>
              <MethodReferenceHero method={selectedReferenceMethod} />
              <MethodReferenceSpecs
                method={selectedReferenceMethod}
                onOpenTimer={openTimerWith}
              />
            </>
          ) : (
            <>
              <ToolStub tool={tools.find((tool) => tool.id === activeTool) ?? tools[0]} />
              <StubSettings />
            </>
          )}
        </section>
      </main>

      <LoginModal
        isOpen={isLoginOpen}
        user={user}
        onClose={() => setIsLoginOpen(false)}
        onSignIn={signIn}
        onSignUp={signUp}
        onLogout={logout}
      />
    </>
  );
}

function ToolsList({
  activeTool,
  onSelectTool,
}: {
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
}) {
  return (
    <aside className="tools-list-column">
      <h1 className="page-heading">Pick a tool to use.</h1>

      <div className="tool-rows">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={`tool-row ${activeTool === tool.id ? "active" : ""}`}
            onClick={() => onSelectTool(tool.id)}
          >
            <span className="tool-icon">
              <ToolIcon icon={tool.icon} />
            </span>
            <div className="tool-info">
              <h3 className="tool-name">{tool.name}</h3>
              <span className="tool-meta">{tool.meta}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

function MethodsList({
  methods,
  onBackToTools,
  onSelectMethod,
  selectedMethodId,
}: {
  methods: MethodReference[];
  onBackToTools: () => void;
  onSelectMethod: (methodId: string) => void;
  selectedMethodId: string;
}) {
  return (
    <aside className="methods-list-column">
      <button type="button" className="back-to-tools" onClick={onBackToTools}>
        ← Back to tools
      </button>

      <h1 className="page-heading">Pick a method.</h1>

      <div className="method-rows">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            className={`method-row ${selectedMethodId === method.id ? "active" : ""}`}
            onClick={() => onSelectMethod(method.id)}
          >
            <div className="method-thumb">
              <Image
                src={method.icon}
                alt={method.name}
                width={44}
                height={44}
              />
            </div>
            <div className="method-row-info">
              <h3 className="method-row-name">{method.name}</h3>
              <span className="method-row-meta">
                {method.style} · {method.totalTime}
              </span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

function MethodReferenceHero({ method }: { method: MethodReference }) {
  return (
    <div className="method-hero">
      <Image
        className="method-hero-image"
        src={method.image}
        alt={method.name}
        width={520}
        height={520}
        priority
      />
    </div>
  );
}

function MethodReferenceSpecs({
  method,
  onOpenTimer,
}: {
  method: MethodReference;
  onOpenTimer: (methodId: string) => void;
}) {
  return (
    <div className="method-specs">
      <header className="specs-header">
        <h2 className="specs-title">{method.name}</h2>
        <p className="specs-tagline">{method.tagline}</p>
        <p className="specs-description">{method.description}</p>
      </header>

      <hr className="rule" />

      <section className="specs-section">
        <h4 className="section-label">Parameters</h4>
        <ul className="specs-list">
          <li>
            <span className="spec-icon">
              <GrinderIcon />
            </span>
            <span className="spec-name">Grind</span>
            <span className="spec-value serif">{method.grind}</span>
          </li>
          <li>
            <span className="spec-icon">
              <ThermometerIcon />
            </span>
            <span className="spec-name">Water temp</span>
            <span className="spec-value serif">{method.waterTemp}°C</span>
          </li>
          <li>
            <span className="spec-icon">
              <RatioIcon />
            </span>
            <span className="spec-name">Ratio</span>
            <span className="spec-value serif">{method.ratio}</span>
          </li>
          <li>
            <span className="spec-icon">
              <TimerIcon />
            </span>
            <span className="spec-name">Total time</span>
            <span className="spec-value serif">{method.totalTime}</span>
          </li>
          <li>
            <span className="spec-icon">
              <BeansIcon />
            </span>
            <span className="spec-name">For 1 cup</span>
            <span className="spec-value serif">
              {method.singleCup.coffee}g · {method.singleCup.water}ml
            </span>
          </li>
        </ul>
      </section>

      <hr className="rule" />

      <section className="specs-section">
        <h4 className="section-label">Tastes like</h4>
        <p className="specs-flavour">{method.tastesLike}</p>
      </section>

      <hr className="rule" />

      <section className="specs-section">
        <h4 className="section-label">Best for</h4>
        <ul className="best-for-list">
          {method.bestFor.map((item) => (
            <li key={item}>
              <span className="bullet">·</span> {item}
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        className="open-timer-btn"
        onClick={() => onOpenTimer(method.id)}
      >
        Use this method in timer →
      </button>
    </div>
  );
}

function TimerDisplay({
  currentStage,
  isPlaying,
  onReset,
  onSkipStage,
  onTogglePlay,
  progressPercent,
  stages,
  timeRemaining,
  totalElapsed,
}: {
  currentStage: number;
  isPlaying: boolean;
  onReset: () => void;
  onSkipStage: () => void;
  onTogglePlay: () => void;
  progressPercent: number;
  stages: TimerStage[];
  timeRemaining: number;
  totalElapsed: number;
}) {
  const stage = stages[currentStage] ?? stages[0];
  const nextStage = stages[currentStage + 1];
  const dashOffset =
    ringCircumference - (ringCircumference * progressPercent) / 100;

  return (
    <div className="timer-display">
      <div className="timer-stage-badge">
        Stage {currentStage + 1} of {stages.length}
      </div>

      <h2 className="timer-stage-name">{stage.name}</h2>

      <div className="timer-ring-wrapper">
        <svg className="timer-ring" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(76, 44, 23, 0.08)"
            strokeWidth="6"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 100 100)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        <div className="timer-time">
          <span className="timer-digits serif">{formatTime(timeRemaining)}</span>
          <span className="timer-label">remaining</span>
        </div>
      </div>

      <p className="timer-instruction">{stage.instruction}</p>

      <div className="timer-elapsed">
        <span>Total elapsed</span>
        <span className="serif">{formatTime(totalElapsed)}</span>
      </div>

      {nextStage ? (
        <div className="timer-next">
          <span className="next-label">Up next</span>
          <span className="next-name">
            {nextStage.name} · {formatTime(nextStage.duration)}
          </span>
        </div>
      ) : null}

      <div className="timer-controls">
        <button type="button" className="control-btn" onClick={onReset}>
          <RewindIcon /> Reset
        </button>
        <button
          type="button"
          className="control-btn primary"
          onClick={onTogglePlay}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
          {isPlaying ? "Pause" : "Start"}
        </button>
        <button type="button" className="control-btn" onClick={onSkipStage}>
          Skip <ForwardIcon />
        </button>
      </div>
    </div>
  );
}

function TimerConfig({
  activeMethod,
  currentStage,
  isMuted,
  methods,
  onLoadMethod,
  onToggleMute,
  stages,
}: {
  activeMethod: TimerMethod;
  currentStage: number;
  isMuted: boolean;
  methods: TimerMethod[];
  onLoadMethod: (method: TimerMethod) => void;
  onToggleMute: () => void;
  stages: TimerStage[];
}) {
  return (
    <div className="timer-config">
      <div className="config-heading-row">
        <h3 className="config-heading">Method</h3>
        <button
          type="button"
          className="mute-btn"
          aria-label={isMuted ? "Unmute timer sounds" : "Mute timer sounds"}
          onClick={onToggleMute}
        >
          {isMuted ? <MutedIcon /> : <SoundIcon />}
        </button>
      </div>

      <div className="method-options">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            className={`method-option ${
              activeMethod.id === method.id ? "active" : ""
            }`}
            onClick={() => onLoadMethod(method)}
          >
            <span className="method-name">{method.name}</span>
            <span className="method-meta">
              {method.totalTime} · {method.stages.length} stages
            </span>
          </button>
        ))}
      </div>

      <hr className="rule" />

      <h3 className="config-heading">Stages</h3>

      <ol className="stages-list">
        {stages.map((stage, index) => (
          <li
            key={`${stage.name}-${index}`}
            className={`stage-item ${index === currentStage ? "active" : ""} ${
              index < currentStage ? "completed" : ""
            }`}
          >
            <span className="stage-num">{index + 1}</span>
            <div className="stage-info">
              <span className="stage-item-name">{stage.name}</span>
              <span className="stage-item-duration">
                {formatTime(stage.duration)}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <button type="button" className="customize-btn">
        Customise stages →
      </button>
    </div>
  );
}

function DoseCalculator({
  activeField,
  coffeeAmount,
  onQuickSet,
  onUpdateCoffee,
  onUpdateWater,
  ratio,
  waterAmount,
}: {
  activeField: "coffee" | "water";
  coffeeAmount: number;
  onQuickSet: (coffee: number, water: number) => void;
  onUpdateCoffee: (value: number) => void;
  onUpdateWater: (value: number) => void;
  ratio: number;
  waterAmount: number;
}) {
  return (
    <div className="dose-calculator">
      <div className="calc-header">
        <span className="calc-eyebrow">Dose calculator</span>
        <h2 className="calc-title">How much do you need?</h2>
        <p className="calc-subtitle">
          Enter water or coffee - we calculate the rest.
        </p>
      </div>

      <div className="calc-inputs">
        <div className={`calc-field ${activeField === "coffee" ? "active" : ""}`}>
          <span className="calc-field-label">Coffee</span>
          <div className="calc-input-wrapper">
            <input
              type="number"
              min="0"
              value={formatNumberInput(coffeeAmount)}
              onChange={(event) =>
                onUpdateCoffee(Number.parseFloat(event.target.value) || 0)
              }
              onFocus={() => onUpdateCoffee(coffeeAmount)}
              className="calc-input serif"
              aria-label="Coffee amount in grams"
            />
            <span className="calc-unit">g</span>
          </div>
          <span className="calc-field-meta">grams of beans</span>
        </div>

        <div className="calc-divider">
          <div className="ratio-display">
            <span className="ratio-label">Ratio</span>
            <span className="ratio-value serif">1 : {ratio}</span>
          </div>
          <div className="proportion-bars" aria-hidden="true">
            <div className="bar bar-coffee" style={{ flex: 1 }} />
            <div className="bar bar-water" style={{ flex: ratio }} />
          </div>
        </div>

        <div className={`calc-field ${activeField === "water" ? "active" : ""}`}>
          <span className="calc-field-label">Water</span>
          <div className="calc-input-wrapper">
            <input
              type="number"
              min="0"
              value={formatNumberInput(waterAmount)}
              onChange={(event) =>
                onUpdateWater(Number.parseFloat(event.target.value) || 0)
              }
              onFocus={() => onUpdateWater(waterAmount)}
              className="calc-input serif"
              aria-label="Water amount in millilitres"
            />
            <span className="calc-unit">ml</span>
          </div>
          <span className="calc-field-meta">millilitres of water</span>
        </div>
      </div>

      <div className="calc-quick-actions">
        <span className="quick-label">Quick set:</span>
        <button type="button" onClick={() => onQuickSet(15, 250)}>
          One cup
        </button>
        <button type="button" onClick={() => onQuickSet(30, 500)}>
          Two cups
        </button>
        <button type="button" onClick={() => onQuickSet(20, 350)}>
          V60 standard
        </button>
        <button type="button" onClick={() => onQuickSet(60, 1000)}>
          French Press
        </button>
      </div>

      <p className="calc-caption serif">Same ratio. Repeatable taste.</p>
    </div>
  );
}

function DoseCalculatorConfig({
  currentRatio,
  onSetRatio,
  ratio,
  ratios,
}: {
  currentRatio: RatioPreset;
  onSetRatio: (ratio: number) => void;
  ratio: number;
  ratios: RatioPreset[];
}) {
  return (
    <div className="calc-config">
      <h3 className="config-heading">Ratio</h3>

      <div className="ratio-options">
        {ratios.map((ratioPreset) => (
          <button
            key={ratioPreset.value}
            type="button"
            className={`ratio-option ${
              ratio === ratioPreset.value ? "active" : ""
            }`}
            onClick={() => onSetRatio(ratioPreset.value)}
          >
            <span className="ratio-num serif">1:{ratioPreset.value}</span>
            <span className="ratio-name">{ratioPreset.name}</span>
          </button>
        ))}
      </div>

      <hr className="rule" />

      <div className="ratio-info">
        <h4 className="info-heading">{currentRatio.name}</h4>
        <p className="info-description">{currentRatio.description}</p>
        <div className="info-best-for">
          <span className="info-label">Best for</span>
          <p>{currentRatio.bestFor}</p>
        </div>
      </div>
    </div>
  );
}

function ToolStub({
  tool,
}: {
  tool: (typeof tools)[number];
}) {
  return (
    <div className="tool-stub">
      <div className="timer-stage-badge">Coming next</div>
      <h2 className="timer-stage-name">{tool.name}</h2>
      <p className="timer-instruction">
        This tool is reserved for the next pass. The brewing timer is ready to
        use now.
      </p>
    </div>
  );
}

function StubSettings() {
  return (
    <div className="timer-config">
      <h3 className="config-heading">Settings</h3>
      <p className="stub-copy">
        Timer presets are active today. Calculator and reference controls will
        land here later.
      </p>
    </div>
  );
}

function roundCoffeeAmount(value: number) {
  return Math.round(value * 10) / 10;
}

function formatNumberInput(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function playTone(kind: "stage" | "complete" | null) {
  if (!kind || typeof window === "undefined") {
    return;
  }

  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextConstructor) {
    return;
  }

  const context = new AudioContextConstructor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = kind === "complete" ? 660 : 440;
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.4);
  window.setTimeout(() => void context.close(), 500);
}

function ToolIcon({ icon }: { icon: "timer" | "scale" | "book" }) {
  if (icon === "scale") {
    return <ScaleIcon />;
  }

  if (icon === "book") {
    return <BookIcon />;
  }

  return <TimerIcon />;
}

function TimerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="13" r="8" />
      <path d="M10 2h4" />
      <path d="M12 13l3-3" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6h14l-2 14H7z" />
      <path d="M9 10c0 1.5 1.5 3 3 3s3-1.5 3-3" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 0-4-4z" />
      <path d="M5 4v12" />
      <path d="M9 8h6" />
      <path d="M9 12h5" />
    </svg>
  );
}

function RewindIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 6 4 12l7 6V6Z" />
      <path d="M20 6 13 12l7 6V6Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 5 11 7-11 7V5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14" />
      <path d="M16 5v14" />
    </svg>
  );
}

function ForwardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m13 6 7 6-7 6V6Z" />
      <path d="m4 6 7 6-7 6V6Z" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 9v6h4l5 4V5L9 9H5Z" />
      <path d="M17 9c1 1 1 5 0 6" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 9v6h4l5 4V5L9 9H5Z" />
      <path d="m18 10 3 4" />
      <path d="m21 10-3 4" />
    </svg>
  );
}

function GrinderIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    </svg>
  );
}

function ThermometerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 4a2 2 0 0 0-4 0v10a4 4 0 1 0 4 0z" />
      <path d="M12 9v5" />
    </svg>
  );
}

function RatioIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3v18" />
      <path d="M15 3v18" />
      <path d="M3 12h18" />
    </svg>
  );
}

function BeansIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="6" ry="9" />
      <path d="M12 4q-2 8 0 16" />
    </svg>
  );
}
