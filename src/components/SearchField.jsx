import React from 'react';
import { Search } from 'lucide-react';

export const SearchField = ({
  value,
  onChange,
  placeholder,
  icon: Icon = Search,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const iconElement = React.createElement(Icon, { className: 'h-5 w-5 text-slate-400' });

  return (
    <label
      className={`flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm ${className}`}
    >
      {iconElement}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 ${inputClassName}`}
        {...props}
      />
    </label>
  );
};
