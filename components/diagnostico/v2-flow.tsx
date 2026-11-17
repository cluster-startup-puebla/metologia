"use client"

import { useEffect, useMemo, useState } from "react"
import Confetti from "react-confetti"
import { cn } from "@/lib/utils"
import { v2Index, v2InstrumentLabel, v2N1Questions, v2QuestionsBySector, v2Roadmap } from "@/lib/methodology/v2-bank"
import { V2_EXAMPLES, scoreExample } from "@/lib/methodology/v2-examples"
import type { V2ExampleCase } from "@/lib/methodology/v2-examples"
import { levelStepFor, scoreLive } from "@/lib/methodology/v2-score"
import type { V2Band, V2LevelStep, V2LiveScore } from "@/lib/methodology/v2-score"
import type { V2Answer, V2Answers, V2Question } from "@/lib/methodology/v2-types"
import { Button } from "@/components/ui/button"
import { ClusterLogo } from "@/components/logos"
import { ChoiceList } from "./choice-list"
import { ChoiceWithText } from "./choice-with-text"
import { LikertFive } from "./likert-five"
import { PrefilledChoice } from "./prefilled-choice"
import { QuestionFrame } from "./question-frame"
import { RankBoard } from "./rank-board"
import { ScorePentagon } from "./score-pentagon"
import type { PentagonAxis } from "./score-pentagon"
import { SessionTrail } from "./session-trail"
const MODULES: { test: RegExp; number: number; n1: string; n2: string; color: string }[] = [
  { test: /MÓDULO 0/i, number: 0, n1: "Perfil", n2: "Perfil", color: "#BE185D" },
  { test: /SECCIÓN I\b/i, number: 1, n1: "Entorno", n2: "Rompehielos", color: "#C2410C" },
  { test: /SECCIÓN II\b/i, number: 2, n1: "Innovación", n2: "Auditoría", color: "#0F766E" },
  { test: /SECCIÓN III\b/i, number: 3, n1: "Tracción", n2: "Sofisticación", color: "#6D28D9" },
  { test: /SECCIÓN IV\b/i, number: 4, n1: "Rompehielos", n2: "Bienes de club", color: "#1D4ED8" },
]

function moduleOf(section: string, level: "n1" | "n2") {
  const found = MODULES.find((item) => item.test.test(section)) ?? MODULES[0]
  return {
    number: found.number,
    label: `Módulo ${found.number}. ${level === "n1" ? found.n1 : found.n2}`,
    color: found.color,
  }
}

const INSTRUMENT_1 = { name: "General", detail: "Para todas las empresas", color: "#FF1493", ink: "#ffffff" }
const INSTRUMENT_2 = { name: "Específico de tu sector", detail: "Del sector", color: "#1F4B99", ink: "#ffffff" }

type Screen = "intro" | "pick" | "ask" | "curtain" | "done"

const UPDATED_ON = "17 de noviembre de 2026"

const BAND_LABELS: Record<V2Band, string> = {
  platino: "Platino",
  oro: "Oro",
  plata: "Plata",
  bronce: "Bronce",
}

function formatScore(value: number): string {
  return value.toFixed(2)
}

function complete(question: V2Question, answer: V2Answer | undefined): boolean {
  if (!answer) return false
  if (question.type === "rank") {
    if (answer.kind !== "rank" || !question.factors) return false
    const ranks = question.factors.map((factor) => answer.ranks[factor.id])
    if (ranks.some((rank) => rank == null)) return false
    const unique = new Set(ranks)
    return unique.size === question.factors.length
  }
  if (question.type === "single_select_text") {
    if (answer.kind !== "text" || !answer.optionValue) return false
    if (question.text?.optionValue && answer.optionValue === question.text.optionValue) return answer.text.trim().length > 0
    return true
  }
  return answer.kind === "single" && answer.optionValue.length > 0
}

export function V2Flow() {
  const [screen, setScreen] = useState<Screen>("intro")
  const [groupId, setGroupId] = useState<string | null>(null)
  const [instrumentId, setInstrumentId] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<V2Answers>({})
  const [preview, setPreview] = useState<V2ExampleCase | null>(null)

  const group = v2Index.groups.find((item) => item.id === groupId) ?? null
  const sequence = useMemo(() => {
    if (!instrumentId) return []
    const sectorQuestions = v2QuestionsBySector[instrumentId] ?? []
    return [...v2N1Questions.filter((question) => question.id !== v2Index.sectorQuestionId), ...sectorQuestions]
  }, [instrumentId])
  const question = sequence[index]
  const instrument = question?.level === "n2" ? INSTRUMENT_2 : INSTRUMENT_1

  function chooseGroup(nextGroupId: string) {
    const next = v2Index.groups.find((item) => item.id === nextGroupId)
    setGroupId(nextGroupId)
    setInstrumentId(next && next.instruments.length === 1 ? next.instruments[0] : null)
  }

  function start() {
    if (!instrumentId) return
    setAnswers({ [v2Index.sectorQuestionId]: { kind: "single", optionValue: instrumentId } })
    setIndex(0)
    setScreen("ask")
  }

  function openExample(example: V2ExampleCase) {
    setPreview(example)
    setInstrumentId(example.sectorId)
    setScreen("done")
  }

  function restart() {
    setPreview(null)
    setAnswers({})
    setIndex(0)
    setGroupId(null)
    setInstrumentId(null)
    setScreen("intro")
  }

  function openInstrument2() {
    const nextIndex = sequence.findIndex((item) => item.level === "n2")
    setIndex(nextIndex)
    setScreen("ask")
  }

  if (screen === "intro") {
    return <Intro onStart={() => setScreen("pick")} onExample={openExample} />
  }

  if (screen === "pick" || !instrumentId) {
    return (
      <Picker
        groupId={groupId}
        instrumentId={instrumentId}
        group={group}
        onGroup={chooseGroup}
        onInstrument={setInstrumentId}
        onClear={() => {
          setGroupId(null)
          setInstrumentId(null)
        }}
        onStart={start}
      />
    )
  }

  if (screen === "curtain") {
    return (
      <section className="flex min-h-screen flex-col justify-between px-6 py-10 text-white" style={{ backgroundColor: INSTRUMENT_2.color }}>
        <p className="text-sm font-medium">General listo</p>
        <div className="max-w-md space-y-4">
          <h1 className="text-4xl font-semibold text-balance">Específico de tu sector</h1>
          <p className="text-lg leading-relaxed">{v2InstrumentLabel(instrumentId)}</p>
        </div>
        <Button type="button" className="h-12 rounded-2xl bg-white text-base" style={{ color: INSTRUMENT_2.color }} onClick={openInstrument2}>
          Entrar
        </Button>
      </section>
    )
  }

  if (screen === "done" || !question) {
    return <DoneScreen instrumentId={instrumentId} sequence={sequence} answers={answers} preview={preview} onRestart={restart} />
  }

  const position = sequence.filter((item) => item.level === question.level).findIndex((item) => item.id === question.id) + 1
  const total = sequence.filter((item) => item.level === question.level).length
  const module = moduleOf(question.section, question.level)
  const moduleQuestions = sequence.filter(
    (item) => item.level === question.level && moduleOf(item.section, item.level).number === module.number,
  )
  const withinModule = moduleQuestions.findIndex((item) => item.id === question.id) + 1

  return (
    <QuestionFrame
      session={{ id: question.level === "n1" ? "n1" : "n2", ...instrument }}
      progress={(position / total) * 100}
      stepLabel=""
      blockLabel=""
      kicker={module.label}
      kickerMeta={`${withinModule}/${moduleQuestions.length}`}
      trailSteps={[
        { id: "n1", name: "General", color: INSTRUMENT_1.color },
        { id: "n2", name: "Específico", color: INSTRUMENT_2.color },
      ]}
      title={question.prompt || question.title}
      titleColor={module.color}
      prompt={question.prompt || question.title}
      note={null}
      canContinue={complete(question, answers[question.id])}
      continueLabel={index === sequence.length - 1 ? "Cerrar" : "Continuar"}
      banner={<InstrumentBanner name={instrument.name} detail={question.level === "n2" ? v2InstrumentLabel(instrumentId) : instrument.detail} color={instrument.color} />}
      onBack={() => {
        if (index === 0) setScreen("pick")
        else if (question.level === "n2" && sequence[index - 1]?.level === "n1") setScreen("curtain")
        else setIndex(index - 1)
      }}
      onContinue={() => {
        const next = sequence[index + 1]
        if (!next) setScreen("done")
        else if (question.level === "n1" && next.level === "n2") setScreen("curtain")
        else setIndex(index + 1)
      }}
    >
      <V2Body
        question={question}
        answer={answers[question.id]}
        accent={instrument.color}
        accentInk={instrument.ink}
        onChange={(answer) => setAnswers((previous) => ({ ...previous, [question.id]: answer }))}
      />
    </QuestionFrame>
  )
}

function liveScoreOrNull(sequence: V2Question[], answers: V2Answers): V2LiveScore | null {
  // scoreLive throws when a scored answer is missing: only score a session that has answers.
  if (Object.keys(answers).length === 0) return null
  try {
    return scoreLive(sequence, answers)
  } catch {
    return null
  }
}

const PENTAGON_PILLARS = [
  { id: "ED-01", label: "Trámites" },
  { id: "ED-02", label: "Seguridad" },
  { id: "ED-03", label: "Autoridad" },
  { id: "ED-04", label: "Infraestructura" },
  { id: "ED-05", label: "Justicia" },
]

function livePentagonAxes(sequence: V2Question[], answers: V2Answers): PentagonAxis[] | null {
  const axes: PentagonAxis[] = []
  for (const pillar of PENTAGON_PILLARS) {
    const question = sequence.find((item) => item.id === pillar.id)
    const answer = answers[pillar.id]
    if (!question || !answer || (answer.kind !== "single" && answer.kind !== "text")) return null
    const option = question.options?.find((item) => item.value === answer.optionValue)
    if (!option || option.score === null) return null
    axes.push({ label: pillar.label, value: option.score })
  }
  return axes
}

interface ScoreRow {
  label: string
  hint: string
  value: string
}

function scoreRow(label: string, hint: string, value: number | null): ScoreRow | null {
  if (value === null) return null
  return { label, hint, value: formatScore(value) }
}

function ScoreRows({ rows }: { rows: ScoreRow[] }) {
  return (
    <dl className="divide-y rounded-2xl border">
      {rows.map((row) => (
        <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-3">
          <div>
            <dt className="text-base font-medium">{row.label}</dt>
            <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{row.hint}</p>
          </div>
          <dd className="text-base font-semibold tabular-nums">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function DoneScreen({
  instrumentId,
  sequence,
  answers,
  preview,
  onRestart,
}: {
  instrumentId: string | null
  sequence: V2Question[]
  answers: V2Answers
  preview: V2ExampleCase | null
  onRestart: () => void
}) {
  const sectorLabel = instrumentId ? v2InstrumentLabel(instrumentId) : ""
  const example = useMemo(() => (preview ? scoreExample(preview) : null), [preview])
  const live = useMemo(() => (preview ? null : liveScoreOrNull(sequence, answers)), [preview, sequence, answers])

  let heading = "Tu resultado"
  let rows: ScoreRow[] = []
  let note: string | null = null

  if (preview && example) {
    heading = preview.company
    rows = [
      scoreRow("Entorno", "Qué tan claro es operar aquí: trámites, seguridad, autoridad, servicios y justicia.", example.estadoDerecho),
      scoreRow("Innovación", "Cuánto renuevas equipo, procesos o la forma de dar el servicio.", example.innovacion),
      scoreRow("Comercial", "Qué tan propio es lo que vendes y qué tan exigente es quien te compra.", example.comercial),
      scoreRow("Madurez que reportas", "Junta las tres anteriores. Es la nota de lo que ve la dirección.", example.ismsNivel1),
      scoreRow("Uso de tecnología", "Qué tanto aprovechas la tecnología que ya tienes en la operación.", example.satNivel2),
      scoreRow("Madurez de conjunto", "Junta lo que dice la dirección con lo que se ve en la operación.", example.ismsNivel2),
    ].filter((row): row is ScoreRow => row !== null)
  } else if (live) {
    rows = [
      scoreRow("Entorno", "Qué tan claro es operar aquí: trámites, seguridad, autoridad, servicios y justicia.", live.estadoDerecho),
      scoreRow("Innovación", "Cuánto renuevas equipo, procesos o la forma de dar el servicio.", live.innovacion),
      scoreRow("Comercial", "Qué tan propio es lo que vendes y qué tan exigente es quien te compra.", live.comercial),
      scoreRow("Madurez que reportas", "Junta las tres anteriores. Es la nota de lo que ve la dirección.", live.ismsNivel1),
      scoreRow("Uso de tecnología", "Qué tanto aprovechas la tecnología que ya tienes en la operación.", live.satNivel2),
      scoreRow("Madurez de conjunto", "Junta lo que dice la dirección con lo que se ve en la operación.", live.ismsNivel2),
      scoreRow("Brecha", "Si da positivo, la dirección se ve por encima de la operación. Si da negativo, al revés.", live.ib),
    ].filter((row): row is ScoreRow => row !== null)
  } else {
    note = "No hay respuestas para calificar."
  }

  const pentagonAxes = preview
    ? PENTAGON_PILLARS.map((pillar, i) => ({ label: pillar.label, value: preview.ed[i] }))
    : livePentagonAxes(sequence, answers)

  const level = levelOnScreen(preview, example, live, instrumentId)

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4 py-8">
      <FinishConfetti />
      <SessionTrail
        activeId="n2"
        progress={100}
        steps={[
          { id: "n1", name: "General", color: INSTRUMENT_1.color },
          { id: "n2", name: "Específico", color: INSTRUMENT_2.color },
        ]}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: INSTRUMENT_2.color }}>
          {preview ? "Ejemplo" : "Resultado"}
        </p>
        <h1 className="text-2xl font-semibold text-balance">{heading}</h1>
        <p className="text-base leading-relaxed text-muted-foreground">{sectorLabel}</p>
      </div>
      {level ? <LevelCard step={level} /> : null}
      {pentagonAxes ? <ScorePentagon axes={pentagonAxes} caption="Tu entorno para operar" /> : null}
      {rows.length > 0 ? <ScoreRows rows={rows} /> : null}
      {note ? <p className="text-base leading-relaxed text-muted-foreground">{note}</p> : null}
      <Button type="button" className="h-12 rounded-2xl text-white" style={{ backgroundColor: INSTRUMENT_1.color }} onClick={onRestart}>
        Volver a empezar
      </Button>
    </main>
  )
}

function levelOnScreen(
  preview: V2ExampleCase | null,
  example: { band: V2Band } | null,
  live: V2LiveScore | null,
  instrumentId: string | null,
): V2LevelStep | null {
  if (preview && example) {
    return v2Roadmap(preview.sectorId).find((step) => step.band === example.band) ?? null
  }
  if (!live || !instrumentId) return null
  const score = live.ismsNivel2 ?? live.ismsNivel1
  return levelStepFor(score, v2Roadmap(instrumentId))
}

const LEVEL_METAL: Record<V2Band, { ink: string; wash: string }> = {
  bronce: { ink: "#8C5A2B", wash: "#F6E7D6" },
  plata: { ink: "#5F6B7A", wash: "#EEF1F4" },
  oro: { ink: "#8A6A12", wash: "#FBF3D0" },
  platino: { ink: "#3E4C5E", wash: "#E7EEF5" },
}

function CircleStar({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z" />
    </svg>
  )
}

function presentSteps(actions: string[]) {
  const own: string[] = []
  const shared: string[] = []
  const plain: string[] = []
  for (const action of actions) {
    const inHouse = action.match(/^Capa A\s*\([^)]*\):\s*(.+)$/i)
    const withOthers = action.match(/^Capa B\s*\([^)]*\):\s*(.+)$/i)
    if (inHouse?.[1]) own.push(inHouse[1])
    else if (withOthers?.[1]) shared.push(withOthers[1])
    else plain.push(action)
  }
  return { own, shared, plain }
}

function StepList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-left text-base leading-relaxed">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function LevelCard({ step }: { step: V2LevelStep }) {
  const metal = LEVEL_METAL[step.band]
  const steps = presentSteps(step.actions)
  return (
    <section className="space-y-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div
          className="flex size-16 items-center justify-center rounded-full"
          style={{ backgroundColor: metal.wash, color: metal.ink }}
        >
          <CircleStar className="size-9" />
        </div>
        <p className="text-3xl font-semibold" style={{ color: metal.ink }}>
          {BAND_LABELS[step.band]}
        </p>
      </div>
      <div className="space-y-3">
        <p className="text-center text-sm font-medium text-muted-foreground">Siguientes pasos</p>
        {steps.plain.length > 0 ? <StepList items={steps.plain} /> : null}
        {steps.own.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">En tu empresa</p>
            <StepList items={steps.own} />
          </div>
        ) : null}
        {steps.shared.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Con otras empresas de la región</p>
            <StepList items={steps.shared} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

function FinishConfetti() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  if (size.width === 0) return null

  return (
    <Confetti
      width={size.width}
      height={size.height}
      recycle={false}
      numberOfPieces={180}
      gravity={0.18}
      colors={["#FF1493", "#1F4B99", "#0F766E", "#F5B942", "#6D28D9"]}
      style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 40 }}
    />
  )
}

function Intro({ onStart, onExample }: { onStart: () => void; onExample: (example: V2ExampleCase) => void }) {
  const generalCount = v2N1Questions.length - 1
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="p-4 md:p-6">
        <ClusterLogo className="h-8 text-foreground md:h-10" />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
        <div className="max-w-md space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-balance md:text-4xl">Diagnóstico regional</h1>
            <p className="text-lg font-medium" style={{ color: INSTRUMENT_1.color }}>
              Puebla–Tlaxcala
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: INSTRUMENT_1.color }}>
              <span className="size-2.5 rounded-full" style={{ backgroundColor: INSTRUMENT_1.color }} />
              General
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: INSTRUMENT_2.color }}>
              <span className="size-2.5 rounded-full" style={{ backgroundColor: INSTRUMENT_2.color }} />
              Específico
            </span>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            Primero contestas el instrumento general, común a todas las empresas. Después eliges el sector y contestas el
            específico: {generalCount} preguntas comunes y 19 del sector.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              size="lg"
              className="rounded-2xl px-10 py-6 text-base text-white"
              style={{ backgroundColor: INSTRUMENT_1.color }}
              onClick={onStart}
            >
              Comenzar evaluación
            </Button>
            {V2_EXAMPLES.map((example) => (
              <button
                key={example.key}
                type="button"
                className="text-sm text-muted-foreground underline"
                onClick={() => onExample(example)}
              >
                Ejemplo: {example.company}
              </button>
            ))}
            <a href="/v1" className="text-sm text-muted-foreground underline">
              Versión anterior
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            Al continuar, aceptas el{" "}
            <a href="/privacidad" className="underline">
              aviso de privacidad
            </a>
            .
          </p>
        </div>
      </main>
      <footer className="px-6 py-4 text-center text-xs text-muted-foreground">
        Versión 2.0 · Actualización {UPDATED_ON}
      </footer>
    </div>
  )
}

function InstrumentBanner({ name, detail, color }: { name: string; detail: string; color: string }) {
  return (
      <div className="px-4 py-2.5 text-white" style={{ backgroundColor: color }}>
      <div className="mx-auto flex w-full max-w-2xl items-baseline justify-between gap-4">
        <p className="text-sm font-semibold">{name}</p>
        <p className="truncate text-sm">{detail}</p>
      </div>
    </div>
  )
}

function Picker({
  groupId,
  instrumentId,
  group,
  onGroup,
  onInstrument,
  onClear,
  onStart,
}: {
  groupId: string | null
  instrumentId: string | null
  group: (typeof v2Index.groups)[number] | null
  onGroup: (id: string) => void
  onInstrument: (id: string) => void
  onClear: () => void
  onStart: () => void
}) {
  const [step, setStep] = useState<"list" | "chosen">("list")
  const splits = group != null && group.instruments.length > 1
  const narrowed = step === "chosen" && group != null

  function choose(id: string) {
    onGroup(id)
    setStep("chosen")
  }

  function back() {
    setStep("list")
    onClear()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 md:p-6">
        <ClusterLogo className="h-8 text-foreground md:h-10" />
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pb-28">
        <div className="space-y-2">
          <p className="text-sm font-medium" style={{ color: INSTRUMENT_1.color }}>
            Versión 2
          </p>
          <h1 className="text-2xl font-semibold leading-snug sm:text-3xl">{narrowed ? group.label : "Elige el sector"}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {narrowed
              ? splits
                ? "Elige el subsector. Atrás regresa a la lista por si el sector no era."
                : "Atrás regresa a la lista por si el sector no era."
              : "El signo + indica que ese sector se parte. Al elegirlo, los demás se van."}
          </p>
        </div>
        <div className="flex flex-col">
          {v2Index.groups.map((item) => {
            const hidden = narrowed && item.id !== groupId
            const selected = item.id === groupId && narrowed
            const divides = item.instruments.length > 1
            return (
              <div
                key={item.id}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-700 ease-in-out",
                  hidden ? "pointer-events-none grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
                )}
              >
                <div className="min-h-0 overflow-hidden">
                <button
                  type="button"
                  aria-pressed={selected}
                  tabIndex={hidden ? -1 : 0}
                  onClick={() => choose(item.id)}
                  className={cn(
                    "mb-2 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm leading-relaxed transition-colors duration-700 ease-in-out",
                    selected ? "border-transparent" : "border-border bg-background hover:bg-muted",
                  )}
                  style={selected ? { backgroundColor: INSTRUMENT_1.color, color: INSTRUMENT_1.ink } : undefined}
                >
                  <span>{item.label}</span>
                  {divides ? <span className="text-base font-semibold leading-none">+</span> : null}
                </button>
                </div>
              </div>
            )
          })}
        </div>
        <div
          className={cn(
            "space-y-3 overflow-hidden transition-all delay-150 duration-700 ease-in-out",
            narrowed && splits ? "max-h-96 translate-y-0 opacity-100" : "pointer-events-none max-h-0 -translate-y-1 opacity-0 delay-0",
          )}
        >
          <h2 className="text-lg font-semibold">Subsector</h2>
          {splits ? (
            <ChoiceList
              options={group.instruments.map((id) => ({ value: id, label: v2InstrumentLabel(id), score: null }))}
              value={instrumentId}
              accent={INSTRUMENT_2.color}
              accentInk={INSTRUMENT_2.ink}
              onChange={onInstrument}
            />
          ) : null}
        </div>
      </main>
      <footer
        className={cn(
          "fixed inset-x-0 bottom-0 border-t bg-background px-4 py-3 transition-opacity delay-150 duration-700 ease-in-out",
          narrowed ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="mx-auto flex w-full max-w-2xl gap-2">
          <Button type="button" variant="outline" className="h-12 rounded-2xl" onClick={back}>
            Atrás
          </Button>
          <Button
            type="button"
            className="h-12 flex-1 rounded-2xl text-white disabled:opacity-40"
            style={{ backgroundColor: INSTRUMENT_1.color }}
            disabled={!instrumentId}
            onClick={onStart}
          >
            Iniciar
          </Button>
        </div>
      </footer>
    </div>
  )
}

function V2Body({
  question,
  answer,
  accent,
  accentInk,
  onChange,
}: {
  question: V2Question
  answer: V2Answer | undefined
  accent: string
  accentInk: string
  onChange: (answer: V2Answer) => void
}) {
  if (question.type === "rank" && question.factors) {
    const ranks = answer?.kind === "rank" ? answer.ranks : {}
    return <RankBoard factors={question.factors} ranks={ranks} accent={accent} accentInk={accentInk} onChange={(next) => onChange({ kind: "rank", ranks: next })} />
  }
  if (question.type === "single_select_text" && question.options && question.text) {
    const text = answer?.kind === "text" ? answer.text : ""
    const value = answer?.kind === "text" ? answer.optionValue : null
    return (
      <ChoiceWithText
        options={question.options}
        value={value}
        text={text}
        maxLength={question.text.maxLength}
        textOptionValue={question.text.optionValue}
        accent={accent}
        accentInk={accentInk}
        onChange={(next) => onChange({ kind: "text", optionValue: next.optionValue, text: next.text })}
      />
    )
  }
  if (question.prefilled && answer?.kind === "single") {
    const label = question.options?.find((option) => option.value === answer.optionValue)?.label ?? answer.optionValue
    return <PrefilledChoice label={label} source="la elección inicial" accent={accent} accentInk={accentInk} />
  }
  const options = question.options ?? []
  const value = answer?.kind === "single" ? answer.optionValue : null
  if (question.type === "likert_5") {
    return <LikertFive options={options} value={value} accent={accent} accentInk={accentInk} onChange={(optionValue) => onChange({ kind: "single", optionValue })} />
  }
  return <ChoiceList options={options} value={value} accent={accent} accentInk={accentInk} onChange={(optionValue) => onChange({ kind: "single", optionValue })} />
}
