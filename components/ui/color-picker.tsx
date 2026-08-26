"use client";

import { ACCENT_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ACCENT_COLORS.map((color) => {
        const isSelected = value === color.value;
        return (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={cn(
              "w-9 h-9 rounded-xl transition-all duration-200 flex items-center justify-center",
              "border-2 hover:scale-110",
              isSelected
                ? "border-white/50 shadow-lg scale-110"
                : "border-transparent"
            )}
            style={{
              backgroundColor: color.value,
              boxShadow: isSelected ? `0 0 16px ${color.value}60` : undefined,
            }}
            title={color.name}
          >
            {isSelected && <Check size={14} className="text-white drop-shadow-md" />}
          </button>
        );
      })}
    </div>
  );
}
