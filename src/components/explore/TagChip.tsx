import { Button } from "@/components/ui";

type TagChipProps = {
  label: string;
  selected?: boolean;
  onToggle: (label: string) => void;
  className?: string;
};

export function TagChip({ label, selected = false, onToggle, className }: TagChipProps) {
  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      pill
      size="sm"
      onClick={() => onToggle(label)}
      className={
        selected
          ? `h-auto py-1 px-3 text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 ${className || ""}`
          : `h-auto py-1 px-3 text-[11px] font-bold uppercase tracking-wider border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 ${className || ""}`
      }
    >
      {label}
    </Button>
  );
}



