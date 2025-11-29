import { ReactNode } from "react";

type FilterGroupProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function FilterGroup({ title, subtitle, children }: FilterGroupProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <div>
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}


