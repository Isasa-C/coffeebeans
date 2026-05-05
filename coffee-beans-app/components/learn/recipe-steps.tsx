type Props = {
  steps: string[];
};

export default function RecipeSteps({ steps }: Props) {
  return (
    <ol className="list-none p-0">
      {steps.map((step, index) => (
        <li
          key={step}
          className="flex items-start gap-4 py-1.5 text-[15px] leading-normal text-[#2b1b12]"
        >
          <span className="min-w-6 shrink-0 font-serif text-lg font-medium leading-normal text-[#d4673e]">
            {index + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}
