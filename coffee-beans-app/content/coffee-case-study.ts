export const coffeeCaseStudyContent = {
  hero: {
    sectionIndex: "01",
    sectionTitle: "Project Intro",
    title: "Coffee Beans",
    emoji: "☕",
    subtitle: "Coffee Guide & Roast Matching Experience",
    description:
      "An interactive coffee discovery platform that helps users explore coffee bean roast types, understand popular drinks, and find their ideal coffee through a simple guided matching experience.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    liveSiteLabel: "Live site",
    liveSiteUrl: "https://coffeebeans.vercel.app",
    liveSiteDisplay: "coffeebeans.vercel.app",
    ctaLabel: "View Live",
    mockup: {
      appName: "Coffee Beans",
      appMode: "Guided discovery",
      roastCards: [
        {
          title: "Light roast",
          note: "Bright acidity",
          tone: "from-[#f2dfcb] to-[#ead0b0]",
        },
        {
          title: "Medium roast",
          note: "Balanced body",
          tone: "from-[#d3ad84] to-[#b78259]",
        },
        {
          title: "Dark roast",
          note: "Bold finish",
          tone: "from-[#6e4b33] to-[#3e271c]",
        },
      ],
      quizTitle: "Quick roast match",
      quizMeta: "3 questions",
      resultLabel: "Best match",
      resultValue: "Medium Roast",
      resultTags: ["Espresso", "Latte", "Americano"],
      profileTags: ["Bright", "Balanced", "Bold"],
      mobileCardTitle: "Popular drinks",
      mobileCardDescription: "Taste profile + roast pairing",
    },
  },
  features: {
    sectionIndex: "02",
    sectionTitle: "What It Does",
    title: "What the Product Does",
    description:
      "A guided coffee education experience that keeps core learning, drink discovery, and matching logic easy to scan at a glance.",
    cards: [
      {
        key: "roasts",
        title: "Bean Roast Types",
        description:
          "Learn about light, medium, and dark roast and understand how each profile changes flavor, body, and aroma.",
        previewTitle: "Roast overview",
        previewAccent: "from-[#f1e1cf] via-[#dfbc97] to-[#8d5b3c]",
        badge: "Feature",
      },
      {
        key: "drinks",
        title: "Popular Drinks",
        description:
          "Explore drinks like espresso, latte, and americano with taste profiles and recommended roast pairings.",
        previewTitle: "Drink pairings",
        previewAccent: "from-[#efe4d8] via-[#d9b089] to-[#6b432d]",
        badge: "Feature",
      },
      {
        key: "match",
        title: "Quick Roast Match",
        description:
          "Answer 3 simple questions and get a roast recommendation based on preference, strength, and flavor direction.",
        previewTitle: "Match flow",
        previewAccent: "from-[#faeee3] via-[#e2c3a5] to-[#936347]",
        badge: "Feature",
      },
    ],
  },
  design: {
    sectionIndex: "03",
    sectionTitle: "Design & Experience",
    title: "Design & Experience",
    description:
      "The product is framed as a calm, guided experience: clear navigation, warm visuals, and a layout that supports learning before decision-making.",
    tabs: ["Roasts", "Drinks", "Match"],
    points: [
      {
        key: "guide",
        title: "Guide-style Interface",
        description: "Structured like a learning guide that helps users understand before choosing.",
      },
      {
        key: "tabs",
        title: "Tab Navigation",
        description: "Switches between roast types, drinks, and matching to keep the journey simple.",
      },
      {
        key: "visuals",
        title: "Visual Coffee Story",
        description: "Warm tones and coffee-inspired visuals make the experience feel inviting and clear.",
      },
      {
        key: "responsive",
        title: "Responsive Design",
        description: "Desktop and mobile layouts stay readable, calm, and easy to browse.",
      },
    ],
  },
  logic: {
    sectionIndex: "04",
    sectionTitle: "How It Works",
    title: "How It Works",
    description:
      "The roast matcher is intentionally simple: preference inputs are translated into taste attributes, scored against roast profiles, and returned with a clear recommendation and explanation.",
    steps: [
      {
        key: "input",
        title: "User Input",
        description: "User answers 3 simple questions about taste preference.",
      },
      {
        key: "mapping",
        title: "Preference Mapping",
        description: "Answers are mapped to strength, bitterness, and flavor profile.",
      },
      {
        key: "logic",
        title: "Matching Logic",
        description: "Light, medium, and dark roast are scored by similarity.",
      },
      {
        key: "selection",
        title: "Best Match Selection",
        description: "The highest-scoring roast becomes the recommended fit.",
      },
      {
        key: "result",
        title: "Result & Guidance",
        description: "The product explains the match and suggests drinks to try next.",
      },
    ],
    factorsTitle: "Matching Factors",
    factors: [
      "Flavor (bright / balanced / bold)",
      "Strength (light / medium / strong)",
      "Bitterness level",
      "Usage (espresso / milk-based / filter)",
    ],
    outputTitle: "Matching Output",
    output: `{
  "recommendedRoast": "Medium Roast",
  "reason": "Balanced flavor and acidity",
  "bestFor": ["Latte", "Americano"],
  "explanation": "A smooth match for users who want clarity without heavy bitterness."
}`,
  },
} as const;
