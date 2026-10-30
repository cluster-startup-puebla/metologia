import { cn } from "@/lib/utils"

interface LikertScaleProps {
  value: number | null
  minLabel: string
  maxLabel: string
  onChange: (value: number) => void
}

const POINTS = [7, 6, 5, 4, 3, 2, 1]

export function LikertScale({ value, minLabel, maxLabel, onChange }: LikertScaleProps) {
  return (
    <div className="flex flex-col gap-2">
      {POINTS.map((point) => {
        const selected = value === point
        const tone = toneFor(point)
        const endLabel = point === 7 ? maxLabel : point === 1 ? minLabel : null
        const mood = point === 7 ? "happy" : point === 1 ? "sad" : null
        return (
          <button
            key={point}
            type="button"
            aria-pressed={selected}
            aria-label={endLabel ? `${point}. ${endLabel}` : `${point} de 7`}
            onClick={() => onChange(point)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors",
              selected ? "border-transparent" : "border-border bg-background hover:bg-muted",
            )}
            style={selected ? { backgroundColor: tone.wash, color: tone.ink } : undefined}
          >
            <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: tone.dot }} aria-hidden />
            <span className="w-4 shrink-0 text-sm font-semibold tabular-nums">{point}</span>
            {endLabel ? <span className="flex-1 text-sm leading-snug">{endLabel}</span> : <span className="flex-1" />}
            {mood ? <Face mood={mood} /> : null}
          </button>
        )
      })}
    </div>
  )
}

function toneFor(point: number) {
  const amount = (point - 1) / 6
  const hue = 4 + amount * 138
  return {
    dot: `hsl(${hue} 78% 46%)`,
    wash: `hsl(${hue} 82% 93%)`,
    ink: `hsl(${hue} 48% 24%)`,
  }
}

function Face({ mood }: { mood: "happy" | "sad" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path
        d={mood === "happy" ? "M8.2 14.2c1.1 1.5 2.3 2.1 3.8 2.1s2.7-.6 3.8-2.1" : "M8.2 16.4c1.1-1.5 2.3-2.1 3.8-2.1s2.7.6 3.8 2.1"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
