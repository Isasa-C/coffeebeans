import type { ReactNode } from "react";

type Benefit = {
  title: ReactNode;
  description: ReactNode;
  icon: "leaf" | "cup" | "heart" | "star";
};

const benefits: Benefit[] = [
  {
    icon: "heart",
    title: (
      <>
        Brew with
        <br />
        confidence
      </>
    ),
    description: (
      <>
        Easy steps
        <br />
        you can repeat.
      </>
    ),
  },
  {
    icon: "star",
    title: (
      <>
        Your coffee,
        <br />
        your way
      </>
    ),
    description: (
      <>
        Adjust and
        <br />
        make it yours.
      </>
    ),
  },
];

function BenefitIcon({ icon }: { icon: Benefit["icon"] }) {
  if (icon === "leaf") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 19c-7 0-7-7-7-9 0-2 0-7 6-7 6 0 7 7 7 9 0 7-6 7-6 7z" />
        <path d="M11 19l4-12" />
      </svg>
    );
  }

  if (icon === "cup") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 8 L17 8 L17 16 A3 3 0 0 1 14 19 L8 19 A3 3 0 0 1 5 16 Z" />
        <path d="M17 10 L19 10 A2 2 0 0 1 19 14 L17 14" />
        <path d="M9 4 V6 M13 4 V6" />
      </svg>
    );
  }

  if (icon === "heart") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 20 C5 16 3 12 3 8 A4 4 0 0 1 12 8 A4 4 0 0 1 21 8 C21 12 19 16 12 20 Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 19 L6 22 L7 15 L2 10 L9 9 Z" />
    </svg>
  );
}

export default function BenefitsStrip() {
  return (
    <section className="mt-12 grid grid-cols-1 gap-6 rounded-3xl bg-[#f5e6d8] px-8 py-7 sm:grid-cols-2 lg:grid-cols-4">
      {benefits.map((benefit) => (
        <div key={benefit.icon} className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#2b1b12] [&>svg]:h-5 [&>svg]:w-5">
            <BenefitIcon icon={benefit.icon} />
          </div>
          <div>
            <h4 className="font-serif text-[15px] font-medium leading-tight text-[#2b1b12]">
              {benefit.title}
            </h4>
            <p className="mt-1 text-xs leading-snug text-[#8b7a6d]">
              {benefit.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
