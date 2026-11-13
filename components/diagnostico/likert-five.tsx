import type { Choice } from "@/lib/methodology/types"
import { cn } from "@/lib/utils"

interface LikertFiveProps {
  options: Choice[]
  value: string | null
  accent: string
  accentInk: string
  onChange: (value: string) => void
}

/** Highest score on top (green), lowest on the bottom (red), same reading as the 7-point scale. */
export function LikertFive({ options, value, onChange }: LikertFiveProps) {
  const ordered = [...options].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  const last = ordered.length - 1

  return (
    <div className="flex flex-col gap-2">
      {ordered.map((option, index) => {
        const selected = option.value === value
        const tone = toneFor(index, last)
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex w-full items-start gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors sm:py-3",
              selected ? "border-transparent" : "border-border bg-background hover:bg-muted",
            )}
            style={selected ? { backgroundColor: tone.wash, color: tone.ink } : undefined}
          >
            <Face amount={last === 0 ? 1 : 1 - index / last} color={tone.dot} />
            <span className="flex-1 text-sm leading-snug">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function toneFor(index: number, last: number) {
  const amount = last === 0 ? 1 : 1 - index / last
  const hue = 4 + amount * 138
  return {
    dot: `hsl(${hue} 78% 46%)`,
    wash: `hsl(${hue} 82% 93%)`,
    ink: `hsl(${hue} 48% 24%)`,
  }
}

function Face({ amount, color }: { amount: number; color: string }) {
  const smile = amount * 2 - 1
  const y = 15.2 - smile * 1.1
  const bend = smile * 2.1
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 size-6 shrink-0" style={{ color }} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path
        d={`M8.2 ${y}c1.1 ${bend * 0.7} 2.3 ${bend} 3.8 ${bend}s2.7 ${bend * -0.3} 3.8 ${-bend}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
