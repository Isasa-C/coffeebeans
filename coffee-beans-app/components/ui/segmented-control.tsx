"use client";

type Option<T extends string> = {
  label: string;
  value: T;
};

type SegmentedControlProps<T extends string> = {
  label?: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  fullWidth?: boolean;
};

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  fullWidth = false,
}: SegmentedControlProps<T>) {
  return (
    <div className="space-y-2.5">
      {label ? (
        <p className="text-[11px] font-semibold tracking-[0.18em] text-accent/70 uppercase">
          {label}
        </p>
      ) : null}
      <div
        role="group"
        aria-label={label}
        className={`inline-flex flex-wrap rounded-[1.1rem] border border-[rgba(97,68,44,0.12)] bg-[rgba(255,252,248,0.86)] p-1 shadow-[0_14px_30px_rgba(76,44,23,0.05)] ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              disabled={disabled}
              aria-pressed={isActive}
              className={`min-w-[72px] rounded-[0.9rem] px-4 py-2.5 text-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(138,75,42,0.28)] ${
                fullWidth ? "flex-1" : ""
              } ${
                isActive
                  ? "bg-[rgba(138,75,42,0.13)] font-semibold text-accent shadow-[inset_0_0_0_1px_rgba(138,75,42,0.16),0_8px_18px_rgba(138,75,42,0.08)]"
                  : "text-muted hover:bg-[rgba(138,75,42,0.06)] hover:text-foreground"
              } ${disabled ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted" : ""}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
