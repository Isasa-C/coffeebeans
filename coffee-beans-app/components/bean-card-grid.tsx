import { type BeanRecord } from "@/lib/utils";
import { BeanCard } from "./bean-card";
import { EmptyState } from "./empty-state";

type BeanCardGridProps = {
  beans: BeanRecord[];
};

export function BeanCardGrid({ beans }: BeanCardGridProps) {
  if (beans.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {beans.map((bean, index) => (
        <div
          key={`${bean.id}-${bean.updatedAt}`}
          className="animate-rise"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <BeanCard bean={bean} />
        </div>
      ))}
    </div>
  );
}
