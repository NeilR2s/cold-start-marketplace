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
import { Button } from "@/components/ui";

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
  className?: string;
};

export function CategoryChip({ label, selected = false, onToggle, className }: CategoryChipProps) {
  const Icon = categoryIcons[label];

  return (
    <Button
      type="button"
      variant={selected ? "emerald" : "outline"}
      pill
      size="sm"
      onClick={() => onToggle(label)}
      className={
        selected
          ? `h-auto py-1.5 px-3 text-xs font-medium border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 ${className || ""}`
          : `h-auto py-1.5 px-3 text-xs font-medium border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 ${className || ""}`
      }
    >
      <Icon className="h-3.5 w-3.5 mr-1.5 shrink-0" />
      <span>{label}</span>
    </Button>
  );
}


