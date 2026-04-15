"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 0,
  className
}) {
  const [internalValue, setInternalValue] = useState(value || "")

  // sync external value
  useEffect(() => {
    setInternalValue(value || "")
  }, [value])

  // debounce logic
  useEffect(() => {
    if (!debounce) {
      onChange(internalValue)
      return
    }

    const timer = setTimeout(() => {
      onChange(internalValue)
    }, debounce)

    return () => clearTimeout(timer)
  }, [internalValue, debounce])

  return (
    <div
      className={cn(
        "relative flex items-center",
        className
      )}
    >
      {/* SEARCH ICON */}
      <Search
        size={16}
        className="absolute left-3 text-muted-foreground pointer-events-none"
      />

      {/* INPUT */}
      <Input
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="
          pl-9 pr-9
          h-9
          rounded-full
          bg-muted/50
          border border-transparent
          focus:bg-background
          focus:border-border
          focus:ring-1 focus:ring-ring
          transition-all
        "
      />

      {/* CLEAR BUTTON */}
      {internalValue && (
        <button
          onClick={() => setInternalValue("")}
          className="
            absolute right-2
            p-1 rounded-full
            hover:bg-muted
            transition
          "
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}