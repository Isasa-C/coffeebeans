import type { CSSProperties, Dispatch, SetStateAction } from "react";

interface WaterColumnProps {
  waterMl: number;
  setWaterMl: Dispatch<SetStateAction<number>>;
  waterGoal: number;
  onShowToast: (message: string) => void;
}

export function WaterColumn({
  waterMl,
  setWaterMl,
  waterGoal,
  onShowToast,
}: WaterColumnProps) {
  const percent = Math.round((waterMl / waterGoal) * 100);
  const fillPercent = Math.min(waterMl / 1500, 1);

  function addWater(ml: number) {
    const nextWaterMl = waterMl + ml;
    setWaterMl(nextWaterMl);
    onShowToast(nextWaterMl >= waterGoal ? "Daily water goal reached!" : `+${ml} ml logged`);
  }

  function removeWater() {
    if (waterMl === 0) return;
    setWaterMl((ml) => Math.max(0, ml - 250));
  }

  return (
    <div className="col-water">
      <div className="stat-block">
        <div className="stat-eyebrow">Water today</div>
        <div className="stat-number serif">{waterMl} ml</div>
        <div className="stat-meta">
          Goal {waterGoal} ml · {percent}%
        </div>
      </div>

      <div className="bottle-container">
        <WaterBottleVisual fillPercent={fillPercent} waterMl={waterMl} />
      </div>

      <div
        className={`limit-text ${waterMl >= waterGoal ? "reached" : ""}`}
        style={waterMl >= waterGoal ? { color: "var(--water-deep)" } : undefined}
      >
        {waterMl >= waterGoal ? "Goal reached today ✓" : `${waterGoal - waterMl} ml to go`}
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-water"
          type="button"
          onClick={() => addWater(250)}
        >
          + 250 ml
        </button>
        <button
          className="btn btn-water"
          type="button"
          onClick={() => addWater(500)}
        >
          + 500 ml
        </button>
        <button
          className="btn"
          type="button"
          onClick={removeWater}
        >
          Remove last
        </button>
      </div>
    </div>
  );
}

function WaterBottleVisual({
  fillPercent,
  waterMl,
}: {
  fillPercent: number;
  waterMl: number;
}) {
  const fillHeightPercent = fillPercent * 78;
  const hasWater = waterMl > 0;

  return (
    <div
      className={`water-bottle-visual ${hasWater ? "has-water" : ""}`}
      style={
        {
          "--water-fill": `${fillHeightPercent}%`,
        } as CSSProperties
      }
    >
      <div className="water-bottle-cap" aria-hidden />
      <div className="water-bottle-neck" aria-hidden />
      <div className="water-bottle-inner">
        <div className="water-fill" />
        <div className="water-surface" />
      </div>
      <div className="water-bottle-mark" aria-hidden>
        1.5L
      </div>
    </div>
  );
}
