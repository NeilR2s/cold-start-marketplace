type TagChipProps = {
  label: string;
  selected?: boolean;
  onToggle: (label: string) => void;
};

const baseClasses =
  "rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase transition-colors active:scale-95";

export function TagChip({ label, selected = false, onToggle }: TagChipProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(label)}
      className={`${baseClasses} ${selected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600"}`}
    >
      {label}
    </button>
  );
}


