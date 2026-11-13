"use client"

import { useEffect, useMemo, useState } from "react"
import Confetti from "react-confetti"
import { cn } from "@/lib/utils"
import { v2Index, v2InstrumentLabel, v2N1Questions, v2QuestionsBySector } from "@/lib/methodology/v2-bank"
import type { V2Answer, V2Answers, V2Question } from "@/lib/methodology/v2-types"
import { Button } from "@/components/ui/button"
import { ClusterLogo } from "@/components/logos"
import { ChoiceList } from "./choice-list"
import { ChoiceWithText } from "./choice-with-text"
import { LikertFive } from "./likert-five"
import { PrefilledChoice } from "./prefilled-choice"
import { QuestionFrame } from "./question-frame"
import { RankBoard } from "./rank-board"
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

const UPDATED_ON = "12 de noviembre de 2026"

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

  function restart() {
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
    return <Intro onStart={() => setScreen("pick")} />
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
            Resultado
          </p>
          <h1 className="text-3xl font-semibold">Próximamente</h1>
          <p className="leading-relaxed text-muted-foreground">
            {v2InstrumentLabel(instrumentId)}. La calificación de esta versión todavía no está.
          </p>
        </div>
        <Button type="button" className="h-12 rounded-2xl text-white" style={{ backgroundColor: INSTRUMENT_1.color }} onClick={restart}>
          Volver a empezar
        </Button>
      </main>
    )
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

function Intro({ onStart }: { onStart: () => void }) {
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
            específico: {generalCount} preguntas comunes y 19 del sector. La calificación todavía no está.
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
