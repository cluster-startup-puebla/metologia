"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import { illustrationsFor, type EvaluationReport } from "@/lib/methodology/report"
import type { MethodologyRules, ScoreResult, TechnicalScore } from "@/lib/methodology/types"
import { Button } from "@/components/ui/button"
import { RankingLadder } from "./ranking-ladder"
import { ResultsSheet } from "./results-sheet"
import { SectorPlace } from "./sector-place"
import { explainScore, formatScore } from "./score-copy"
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
  const [sheetOpen, setSheetOpen] = useState(false)
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

        <SectorPlace sectorLabel={sectorLabel} />

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

        <RankingLadder rankings={report.rankings} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            className="h-12 flex-1 rounded-2xl text-white"
            style={{ backgroundColor: session.color, color: session.ink }}
            onClick={() => setSheetOpen(true)}
          >
            <FileText className="mr-2 size-5" />
            Generar hoja de resultados
          </Button>
          <Button type="button" variant="outline" className="h-12 flex-1 rounded-2xl" onClick={onRestart}>
            Volver a empezar
          </Button>
        </div>
      </main>
      {sheetOpen ? <ResultsSheet sectorLabel={sectorLabel} report={report} onClose={() => setSheetOpen(false)} /> : null}
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
        <p className="text-sm text-muted-foreground">{explainScore(result)}</p>
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
        <p className="text-sm text-muted-foreground">{explainScore(result)}</p>
      )}
    </section>
  )
}

