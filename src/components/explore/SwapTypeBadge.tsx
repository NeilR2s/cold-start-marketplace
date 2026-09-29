import { BarterType } from "../../types/explore";
import { Badge } from "@/components/ui";

const barterTypeVariantMap: Record<BarterType, "success" | "groupOrder" | "pasabuy"> = {
  "1:1 Swap": "success",
  "1-to-Many Swap": "groupOrder",
  "Group Swap": "pasabuy",
};

type SwapTypeBadgeProps = {
  type: BarterType;
  className?: string;
};

export function SwapTypeBadge({ type, className }: SwapTypeBadgeProps) {
  return (
    <Badge
      variant={barterTypeVariantMap[type] || "neutral"}
      pill
      className={className}
    >
      {type}
    </Badge>
  );
}



