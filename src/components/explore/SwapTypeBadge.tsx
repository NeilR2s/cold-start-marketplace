import { BarterType } from "../../types/explore";

const badgeStyles: Record<BarterType, string> = {
  "1:1 Swap": "bg-emerald-100 text-emerald-700",
  "1-to-Many Swap": "bg-sky-100 text-sky-700",
  "Group Swap": "bg-purple-100 text-purple-700",
};

type SwapTypeBadgeProps = {
  type: BarterType;
};

export function SwapTypeBadge({ type }: SwapTypeBadgeProps) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[type]}`}>{type}</span>;
}

