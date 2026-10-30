import { illustrationsFor, type EvaluationReport } from "@/lib/methodology/report"
import type { MethodologyRules, ScoreResult, TechnicalScore } from "@/lib/methodology/types"
import { Button } from "@/components/ui/button"
import { sessionById } from "./session-theme"
import { SessionTrail } from "./session-trail"

interface ResultPanelProps {
  sectorLabel: string
  report: EvaluationReport
  rules: MethodologyRules
  onRestart: () => void
}

export function ResultPanel({ sectorLabel, report, rules, onRestart }: ResultPanelProps) {
  const session = sessionById("score")
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
        <SessionTrail activeId="score" progress={100} />
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: session.color }}>
            {session.name} · {session.detail}
          </p>
          <h1 className="text-3xl font-semibold text-balance">Lo que el instrumento sí calcula</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{sectorLabel}</p>
        </div>

        <ScoreCard title="Entorno normativo (SEN)" result={report.sen} format={(value) => `${formatScore(value)} / 100`} />
        <TechnicalCard title="Score técnico, solo auditoría" result={report.technicalAuditoria} rules={rules} rankings={report.rankings} />
        <TechnicalCard title="Score técnico, auditoría y complejidad" result={report.technicalAxes} rules={rules} rankings={report.rankings} />
        <TechnicalCard title="Score técnico, todas las opciones con puntaje" result={report.technicalAllNumeric} rules={rules} rankings={report.rankings} />

        <section className="space-y-3 rounded-3xl border p-4">
          <h2 className="text-lg font-semibold">Índice sectorial</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            La fórmula escrita es {report.isms.formula}. El segundo término no tiene regla para juntar los rankings, así que no hay un ISMS oficial ni un cuadrante oficial.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Rankings</h2>
          {report.rankings.map((ranking) => (
            <article key={ranking.questionId} className="space-y-2 rounded-3xl border p-4">
              <h3 className="font-medium">{ranking.title}</h3>
              {ranking.tabulador.status === "blocked" ? (
                <p className="text-sm text-muted-foreground">Este ranking está incompleto, así que no entra a la ilustración.</p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Media del tabulador: {formatScore(ranking.tabuladorMean ?? 0)}. Esa media no cambia si se invierte el orden.
                  </p>
                  <ul className="space-y-1 text-sm">
                    {ranking.tabulador.value
                      .slice()
                      .sort((a, b) => a.rank - b.rank)
                      .map((row) => (
                        <li key={row.factorId}>
                          {row.rank}. {row.label} · tabulador {formatScore(row.score)}
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </article>
          ))}
        </section>

        <Button
          type="button"
          className="rounded-2xl text-white"
          style={{ backgroundColor: session.color, color: session.ink }}
          onClick={onRestart}
        >
          Volver a empezar
        </Button>
      </main>
    </div>
  )
}

function TechnicalCard({
  title,
  result,
  rules,
  rankings,
}: {
  title: string
  result: ScoreResult<TechnicalScore>
  rules: MethodologyRules
  rankings: EvaluationReport["rankings"]
}) {
  return (
    <section className="space-y-3 rounded-3xl border p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {result.status === "blocked" ? (
        <p className="text-sm text-muted-foreground">{explain(result)}</p>
      ) : (
        <>
          <p className="text-2xl font-semibold" style={{ color: sessionById("score").color }}>
            {formatScore(result.value.score)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatScore(result.value.obtained)} puntos de {formatScore(result.value.maximum)}, en {result.value.questionCount} preguntas.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Si este fuera el score técnico, el ISMS ilustrativo —con un Borda que el documento no elige— quedaría así:
            </p>
            <ul className="space-y-2 text-sm">
              {illustrationsFor(result.value.score, rules, rankings).map((row) => (
                <li key={`${title}-${row.label}`} className="rounded-2xl bg-muted px-3 py-2">
                  <span className="block">{row.label}</span>
                  <span className="font-medium">
                    ISMS {formatScore(row.isms)}
                    {row.quadrant.status === "ok" ? ` · cuadrante ${row.quadrant.value.id} · ${row.quadrant.value.label}` : " · sin cuadrante"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  )
}

function ScoreCard({
  title,
  result,
  format,
}: {
  title: string
  result: ScoreResult<number>
  format: (value: number) => string
}) {
  return (
    <section className="space-y-2 rounded-3xl border p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {result.status === "ok" ? (
        <p className="text-2xl font-semibold" style={{ color: sessionById("score").color }}>
          {format(result.value)}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">{explain(result)}</p>
      )}
    </section>
  )
}

function explain(result: ScoreResult<unknown>): string {
  if (result.status === "ok") return ""
  const codes = result.failures.map((failure) => failure.code)
  if (codes.includes("no_numeric_questions")) {
    return "Este conjunto no trae puntaje en las opciones. Agroindustria y logística están así en todo el instrumento."
  }
  if (codes.includes("empty_answer")) {
    const missing = codes.filter((code) => code === "empty_answer").length
    return `Faltan ${missing} respuestas. El documento no dice que se imputen ceros, así que el cálculo se detiene.`
  }
  if (codes.includes("incomplete")) return "Falta alguno de los seis reactivos del entorno."
  if (codes.includes("invalid_likert")) return "Hay una respuesta fuera de la escala 1 a 7."
  return "El cálculo se detiene con los datos que hay."
}

function formatScore(value: number): string {
  return new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(value)
}
