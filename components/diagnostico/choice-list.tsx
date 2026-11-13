import { cn } from "@/lib/utils"
import type { Choice } from "@/lib/methodology/types"

interface ChoiceListProps {
  options: Choice[]
  value: string | null
  accent: string
  accentInk: string
  onChange: (value: string) => void
}

export function ChoiceList({ options, value, accent, accentInk, onChange }: ChoiceListProps) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-2xl border px-4 py-2.5 text-left text-sm leading-snug transition-colors sm:py-3 sm:leading-relaxed",
              selected ? "border-transparent" : "border-border bg-background hover:bg-muted",
            )}
            style={selected ? { backgroundColor: accent, color: accentInk } : undefined}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
