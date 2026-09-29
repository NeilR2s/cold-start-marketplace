import { X } from "lucide-react";
import { Button, Badge } from "@/components/ui";

type Pill = {
  key: string;
  label: string;
};

type FilterPillsProps = {
  pills: Pill[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
};

export function FilterPills({ pills, onRemove, onClearAll }: FilterPillsProps) {
  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
      {pills.map((pill) => (
        <Badge
          key={pill.key}
          variant="success"
          pill
          className="cursor-pointer gap-1.5 py-1 px-3 text-xs font-semibold hover:bg-emerald-100 transition-colors"
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
        className="h-auto p-0 text-xs font-semibold uppercase text-slate-500 hover:text-slate-900 hover:bg-transparent underline"
      >
        Clear all
      </Button>
    </div>
  );
}



