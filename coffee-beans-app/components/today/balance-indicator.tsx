interface BalanceIndicatorProps {
  coffeeCount: number;
  waterMl: number;
}

export function BalanceIndicator({ coffeeCount, waterMl }: BalanceIndicatorProps) {
  const coffeeMl = coffeeCount * 250;
  const ratio = coffeeMl === 0 ? "-" : `1:${(waterMl / coffeeMl).toFixed(1)}`;

  return (
    <div className="balance-indicator">
      <span className="balance-label">Balance</span>
      <span className="balance-ratio serif">{ratio}</span>
      <span className="balance-status">Drink more water</span>
    </div>
  );
}
