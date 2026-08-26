"use client";

import { FOLDER_ICONS } from "@/lib/constants";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  accentColor?: string;
}

export function IconPicker({ value, onChange, accentColor }: IconPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {FOLDER_ICONS.map((item) => {
        const isSelected = value === item.icon;

        return (
          <button
            key={item.icon}
            type="button"
            onClick={() => onChange(item.icon)}
            className={cn(
              "flex items-center justify-center p-3 rounded-xl transition-all duration-200",
              "border hover:scale-105",
              isSelected
                ? "border-accent-primary bg-accent-primary/15 shadow-lg"
                : "border-border-custom bg-surface hover:border-border-hover hover:bg-surface-hover"
            )}
            style={
              isSelected && accentColor
                ? {
                    borderColor: accentColor,
                    backgroundColor: `${accentColor}20`,
                  }
                : undefined
            }
            title={item.name}
          >
            <DynamicIcon
              name={item.icon}
              size={20}
              className={cn(
                isSelected ? "text-accent-primary" : "text-foreground-secondary"
              )}
              style={isSelected && accentColor ? { color: accentColor } : undefined}
            />
          </button>
        );
      })}
    </div>
  );
}
