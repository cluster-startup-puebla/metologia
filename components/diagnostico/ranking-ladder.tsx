import type { RankingReport } from "@/lib/methodology/report"
import { sessionById } from "./session-theme"
import { formatScore } from "./score-copy"

const RANK_COLOR = sessionById("n2").color

export function rankingHeadline(title: string): string {
  return title.replace(/\s*\([^)]*rompehielos[^)]*\)\s*$/i, "").trim()
}

export function RankingLadder({ rankings }: { rankings: RankingReport[] }) {
  if (rankings.length === 0) return null

  return (
    <section className="space-y-5">
      <div className="max-w-prose space-y-1">
        <h2 className="text-lg font-semibold">Prioridades que ordenó la empresa</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          El lugar 1 es el problema de mayor impacto. La barra es el puntaje del tabulador para ese lugar.
          La media del tabulador no cambia si se invierte el orden.
        </p>
      </div>
      {rankings.map((ranking) => (
        <RankingCard key={ranking.questionId} ranking={ranking} />
      ))}
    </section>
  )
}

function RankingCard({ ranking }: { ranking: RankingReport }) {
  const title = rankingHeadline(ranking.title)

  if (ranking.tabulador.status === "blocked" || ranking.tabuladorMean == null) {
    return (
      <article className="space-y-2 rounded-3xl border border-dashed px-4 py-4">
        <h3 className="text-base font-medium leading-snug">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Falta ordenar los {ranking.factorCount} factores. Sin el orden completo, este ranking no entra al cálculo.
        </p>
      </article>
    )
  }

  const rows = ranking.tabulador.value.slice().sort((a, b) => a.rank - b.rank)

  return (
    <article className="space-y-4 rounded-3xl border px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-medium leading-snug">{title}</h3>
        <p className="shrink-0 text-right text-xs text-muted-foreground">
          <span className="block text-sm font-semibold text-foreground">{formatScore(ranking.tabuladorMean)}</span>
          media
        </p>
      </div>
      <ol className="space-y-3">
        {rows.map((row) => (
          <li key={row.factorId} className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-3">
            <span
              className="flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: RANK_COLOR }}
            >
              {row.rank}
            </span>
            <div className="min-w-0 space-y-1.5 pt-0.5">
              <p className="text-sm leading-snug">{row.label.replace(/\.\s*$/, "")}</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${row.score}%`, backgroundColor: RANK_COLOR }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-xs font-medium tabular-nums text-muted-foreground">
                  {formatScore(row.score)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}
