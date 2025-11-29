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
        <button
          key={pill.key}
          type="button"
          onClick={() => onRemove(pill.key)}
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm"
        >
          {pill.label}
          <span aria-hidden="true">×</span>
        </button>
      ))}
      <button type="button" onClick={onClearAll} className="text-xs font-semibold uppercase text-emerald-600 underline">
        Clear all
      </button>
    </div>
  );
}

