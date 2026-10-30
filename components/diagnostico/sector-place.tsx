import { sessionById } from "./session-theme"

/** Sample position until a sector cohort exists. Not a calculated rank. */
export const SECTOR_PLACE_PLACEHOLDER = {
  status: "placeholder" as const,
  rank: 60,
  cohortSize: 200,
}

export function SectorPlace({ sectorLabel }: { sectorLabel: string }) {
  const { rank, cohortSize } = SECTOR_PLACE_PLACEHOLDER
  const color = sessionById("score").color
  const position = cohortSize <= 1 ? 0 : ((rank - 1) / (cohortSize - 1)) * 100

  return (
    <section className="space-y-4 rounded-3xl border border-dashed p-4" aria-label="Lugar en el sector, placeholder">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Lugar en el sector</h2>
          <p className="text-sm text-muted-foreground">{sectorLabel}</p>
        </div>
        <p className="shrink-0 text-right">
          <span className="block text-3xl font-semibold tabular-nums leading-none" style={{ color }}>
            #{rank}
          </span>
          <span className="text-sm text-muted-foreground">de {cohortSize}</span>
        </p>
      </div>

      <div>
        <div className="relative h-10" aria-hidden>
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />
          <span
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-background"
            style={{ left: `${position}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Mayor puntaje · #1</span>
          <span>Menor puntaje · #{cohortSize}</span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Placeholder. El lugar #{rank} de {cohortSize} es de muestra. Cuando haya otras empresas del mismo sector, el
        promedio final las ordena y este indicador muestra el lugar real.
      </p>
    </section>
  )
}
