"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Printer, X } from "lucide-react"
import { ClusterLogo } from "@/components/logos"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { EvaluationReport } from "@/lib/methodology/report"
import type { ScoreResult, TechnicalScore } from "@/lib/methodology/types"
import { rankingHeadline } from "./ranking-ladder"
import { explainScore, formatScore } from "./score-copy"
import { SectorPlace } from "./sector-place"
import { sessionById } from "./session-theme"

const PRINT_STYLES = `
  @media print {
    @page { size: A4; margin: 12mm; }
    html, body {
      width: 100%;
      height: auto;
      background: #fff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .no-print { display: none !important; }
    body > div:not(.print-root),
    nextjs-portal { display: none !important; }
    .print-root,
    .print-sheet-frame {
      position: static !important;
      display: block !important;
      min-height: 0 !important;
      overflow: visible !important;
      padding: 0 !important;
      background: #fff !important;
    }
    .print-sheet {
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
    }
    .print-sheet input {
      display: block !important;
      width: 100% !important;
      border: none !important;
      padding: 2px 0 !important;
      min-height: auto !important;
      resize: none !important;
      overflow: visible !important;
      box-shadow: none !important;
      background: transparent !important;
    }
    .print-sheet .print-avoid-break {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`

interface ResultsSheetProps {
  sectorLabel: string
  report: EvaluationReport
  onClose: () => void
}

export function ResultsSheet({ sectorLabel, report, onClose }: ResultsSheetProps) {
  const [mounted, setMounted] = useState(false)
  const [company, setCompany] = useState("")
  const score = sessionById("score")
  const level = sessionById("n2")
  const date = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <div className="print-root fixed inset-0 z-50 flex min-h-screen flex-col bg-slate-100">
        <div className="no-print sticky top-0 z-50 flex items-center justify-between gap-3 border-b bg-white py-3 pl-4 pr-16 shadow-sm sm:pl-6">
          <h2 className="text-sm font-semibold">
            Hoja de resultados <span className="hidden text-muted-foreground sm:inline">· vista previa</span>
          </h2>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="gap-1.5 rounded-lg">
              <X className="size-4" />
              Cerrar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5 rounded-lg text-white"
              style={{ backgroundColor: score.color, color: score.ink }}
            >
              <Printer className="size-4" />
              Imprimir
            </Button>
          </div>
        </div>

        <div className="print-sheet-frame flex-1 overflow-y-auto p-3 sm:p-8">
          <div className={cn("print-sheet mx-auto w-full max-w-[210mm] space-y-7 bg-white px-5 py-8 shadow-sm sm:px-12 sm:py-12 sm:shadow-xl")}>
            <header className="print-avoid-break flex flex-col items-center border-b pb-7 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div className="order-2 mt-5 sm:order-1 sm:mt-0">
                <p className="text-sm font-medium" style={{ color: level.color }}>
                  Diagnóstico regional Puebla–Tlaxcala
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">Hoja de resultados</h1>
              </div>
              <ClusterLogo className="order-1 h-16 w-auto text-foreground sm:order-2 sm:h-20" />
            </header>

            <div className="print-avoid-break grid grid-cols-2 gap-x-6 gap-y-5 border-b pb-7 text-sm sm:grid-cols-3">
              <label className="col-span-2 sm:col-span-1">
                <span className="text-xs font-semibold text-muted-foreground">Empresa</span>
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Nombre de la empresa"
                  className="mt-1 w-full border-0 bg-transparent p-0 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground"
                />
              </label>
              <InfoItem label="Sector" value={sectorLabel} />
              <InfoItem label="Fecha" value={date} />
            </div>

            <div className="print-avoid-break grid gap-5 border-b pb-7 sm:grid-cols-2">
              <ScoreLine title="Entorno normativo" result={report.sen} />
              <ScoreLine title="Score técnico, auditoría" result={report.technicalAuditoria} />
              <ScoreLine title="Auditoría y complejidad" result={report.technicalAxes} />
              <ScoreLine title="Todas las opciones con puntaje" result={report.technicalAllNumeric} />
            </div>

            <p className="print-avoid-break text-sm leading-relaxed text-muted-foreground">
              La fórmula escrita es {report.isms.formula}. El documento no dice cómo juntar los rankings, así que esta hoja no publica un índice sectorial oficial.
            </p>

            <SectorPlace sectorLabel={sectorLabel} />

            <div className="space-y-6">
              <h2 className="text-base font-semibold" style={{ color: level.color }}>
                Prioridades que ordenó la empresa
              </h2>
              {report.rankings.map((ranking) => (
                <div key={ranking.questionId} className="print-avoid-break space-y-2">
                  <h3 className="text-sm font-semibold leading-snug">{rankingHeadline(ranking.title)}</h3>
                  {ranking.tabulador.status === "blocked" ? (
                    <p className="text-sm text-muted-foreground">Sin orden completo. No entra al cálculo.</p>
                  ) : (
                    <ol className="space-y-1.5">
                      {ranking.tabulador.value
                        .slice()
                        .sort((a, b) => a.rank - b.rank)
                        .map((row) => (
                          <li key={row.factorId} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3rem] gap-2 text-sm">
                            <span className="font-semibold tabular-nums" style={{ color: level.color }}>
                              {row.rank}
                            </span>
                            <span className="leading-snug">{row.label.replace(/\.\s*$/, "")}</span>
                            <span className="text-right tabular-nums text-muted-foreground">{formatScore(row.score)}</span>
                          </li>
                        ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>

            <footer className="print-avoid-break border-t pt-5 text-center">
              <p className="text-xs font-semibold">Clúster de Startups Puebla</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Diagnóstico regional Puebla–Tlaxcala</p>
            </footer>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-snug">{value}</p>
    </div>
  )
}

function ScoreLine({ title, result }: { title: string; result: ScoreResult<number> | ScoreResult<TechnicalScore> }) {
  const value = result.status === "ok" ? (typeof result.value === "number" ? result.value : result.value.score) : null
  return (
    <div>
      <p className="text-xs text-muted-foreground">{title}</p>
      {value == null ? (
        <p className="mt-1 text-sm leading-snug text-muted-foreground">{explainScore(result)}</p>
      ) : (
        <p className="mt-1 text-2xl font-semibold tabular-nums" style={{ color: sessionById("score").color }}>
          {formatScore(value)}
        </p>
      )}
    </div>
  )
}
