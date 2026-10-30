import { cn } from "@/lib/utils"

interface RankBoardProps {
  factors: { id: string; label: string }[]
  ranks: Record<string, number>
  accent: string
  accentInk: string
  onChange: (ranks: Record<string, number>) => void
}

export function RankBoard({ factors, ranks, accent, accentInk, onChange }: RankBoardProps) {
  const used = new Set(Object.values(ranks))
  const nextRank = Array.from({ length: factors.length }, (_, index) => index + 1).find((rank) => !used.has(rank))

  function toggle(factorId: string) {
    if (ranks[factorId] != null) {
      const next = { ...ranks }
      delete next[factorId]
      onChange(next)
      return
    }
    if (nextRank == null) return
    onChange({ ...ranks, [factorId]: nextRank })
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {nextRank == null
          ? `Los ${factors.length} lugares ya tienen causa. Toca una para soltarla.`
          : `Toca una causa para asignarle el lugar ${nextRank}. El 1 es el mayor impacto.`}
      </p>
      <div className="flex flex-col gap-2">
        {factors.map((factor) => {
          const rank = ranks[factor.id]
          return (
            <button
              key={factor.id}
              type="button"
              onClick={() => toggle(factor.id)}
              className={cn(
                "flex items-start gap-3 rounded-2xl border px-3 py-3 text-left text-sm leading-relaxed",
                rank == null && "border-border hover:bg-muted",
              )}
              style={rank != null ? { backgroundColor: accent, borderColor: accent, color: accentInk } : undefined}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs">
                {rank ?? "·"}
              </span>
              <span>{factor.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
