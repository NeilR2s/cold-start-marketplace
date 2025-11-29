import { ComponentType } from "react";
import {
  Utensils,
  Laptop,
  WashingMachine,
  Shirt,
  Music4,
  Lamp,
  Palette,
  Sparkles,
  Plane,
} from "lucide-react";
import { CategoryName } from "../../types/explore";

const categoryIcons: Record<CategoryName, ComponentType<{ className?: string }>> = {
  "Food & Pasalubong": Utensils,
  Electronics: Laptop,
  Appliances: WashingMachine,
  "Fashion & Accessories": Shirt,
  "K-pop & Collectibles": Music4,
  "Home & Living": Lamp,
  "Hobbies & Crafts": Palette,
  Services: Sparkles,
  "Travel & Bitbit Trips": Plane,
};

type CategoryChipProps = {
  label: CategoryName;
  selected?: boolean;
  onToggle: (label: CategoryName) => void;
};

const baseClasses =
  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors active:scale-[0.98]";

export function CategoryChip({ label, selected = false, onToggle }: CategoryChipProps) {
  const Icon = categoryIcons[label];

  return (
    <button
      type="button"
      onClick={() => onToggle(label)}
      className={`${baseClasses} ${selected ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600"}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

