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
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
      {pills.map((pill) => (
        <button
          key={pill.key}
          type="button"
          onClick={() => onRemove(pill.key)}
          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
        >
          {pill.label}
          <span aria-hidden="true">×</span>
        </button>
      ))}
      <button type="button" onClick={onClearAll} className="text-xs font-semibold uppercase text-slate-500 underline">
        Clear all
      </button>
    </div>
  );
}


