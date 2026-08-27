"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) &&
      !value.includes(s.toLowerCase())
  );

  function addTag(tag: string) {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-wrap gap-1.5 p-2 rounded-xl",
          "bg-background-secondary border border-border-custom",
          "focus-within:border-accent-primary focus-within:shadow-[0_0_0_3px_rgba(230,57,70,0.15)]",
          "transition-all duration-200"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span key={tag} className="tag-chip flex items-center gap-1 py-1">
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="hover:text-foreground transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-foreground placeholder:text-foreground-muted"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && input && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20 rounded-xl overflow-hidden glass border border-glass-border">
          {filteredSuggestions.slice(0, 8).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(suggestion);
              }}
              className="w-full text-left px-3 py-2 text-sm text-foreground-secondary hover:bg-surface-hover hover:text-foreground transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
