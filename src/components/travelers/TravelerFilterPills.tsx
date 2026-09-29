import { X } from "lucide-react";
import { Button, Badge } from "@/components/ui";

type Pill = {
  key: string;
  label: string;
};

type TravelerFilterPillsProps = {
  pills: Pill[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
};

export function TravelerFilterPills({ pills, onRemove, onClearAll }: TravelerFilterPillsProps) {
  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
      {pills.map((pill) => (
        <Badge
          key={pill.key}
          variant="outline"
          pill
          className="cursor-pointer gap-1.5 py-1 px-3 text-xs font-semibold bg-white border-emerald-200 text-emerald-800 shadow-xs hover:bg-emerald-100/60 transition-colors"
          onClick={() => onRemove(pill.key)}
        >
          <span>{pill.label}</span>
          <X className="h-3 w-3" />
        </Badge>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-auto p-0 text-xs font-semibold uppercase text-emerald-600 hover:text-emerald-800 hover:bg-transparent underline"
      >
        Clear all
      </Button>
    </div>
  );
}


