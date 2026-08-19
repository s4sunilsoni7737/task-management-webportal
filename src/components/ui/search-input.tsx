"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Search icon that expands into an inline input. Live-filters the current
 * view while preserving grouping, per Scope of Work §3.7. Supports the
 * ⌘F / Ctrl+F shortcut to open + focus, as specified in the Process Flow.
 */
export function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setExpanded(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!expanded && !value) {
    return (
      <button
        type="button"
        aria-label="Search (Ctrl+F)"
        onClick={() => setExpanded(true)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-text hover:bg-surface-muted transition-colors"
      >
        <Search className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-sm border border-border bg-surface px-2 transition-all",
        "w-full sm:w-40 sm:focus-within:w-64",
      )}
    >
      <Search className="h-3.5 w-3.5 shrink-0 text-text-subtle" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={expanded}
        className="w-full min-w-0 bg-transparent text-sm text-text outline-none placeholder:text-text-subtle"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onChange("");
            setExpanded(false);
          }}
          className="text-text-subtle hover:text-text"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
