import React from 'react';

export const AppBottomNav = ({ items, value, onChange }) => {
  return (
    <nav className="grid grid-cols-5 bg-white">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = value === item.value;
        const iconElement = React.createElement(Icon, {
          className: `h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-current'}`,
        });

        return (
          <button
            key={item.value}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange(item.value)}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 px-2 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {iconElement}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
