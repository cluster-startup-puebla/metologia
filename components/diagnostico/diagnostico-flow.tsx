"use client"

import { useEffect, useMemo, useState } from "react"
import { isAnswerComplete } from "@/lib/methodology/answers"
import { n1Questions, questionsBySector, methodologyRules, sectorLabel } from "@/lib/methodology/bank"
import { artesGraficasExample } from "@/lib/methodology/examples"
import { evaluateSession, sectorIdFromAnswers } from "@/lib/methodology/report"
import type { Answer, Answers, LikertQuestion, Question, RankQuestion, SingleQuestion } from "@/lib/methodology/types"
import { Button } from "@/components/ui/button"
import { ClusterLogo } from "@/components/logos"
import { ChoiceList } from "./choice-list"
import { LikertScale } from "./likert-scale"
import { QuestionFrame } from "./question-frame"
import { RankBoard } from "./rank-board"
import { ResultPanel } from "./result-panel"
import { SESSIONS, sessionById, sessionForLevel } from "./session-theme"

const STORAGE_KEY = "poc-diagnostico-v1"

const BLOCK_LABEL: Record<string, string> = {
  perfilado: "Perfil",
  enrutamiento: "Sector",
  fricciones: "Fricciones del último año",
  entorno: "Entorno normativo",
  ecosistema: "Ecosistema",
  traccion: "Tracción comercial",
  norma: "Madurez normativa",
  absorcion: "Capacidad de absorción",
  colaboracion: "Colaboración",
  expansion: "Expansión",
  borda_r00: "Rompehielos",
  auditoria_tecnica: "Auditoría técnica",
  complejidad: "Complejidad",
  bienes_club: "Bienes de club",
}

type Screen = "intro" | "questions" | "results"

interface SavedSession {
  screen: Screen
  index: number
  answers: Answers
}

export function DiagnosticoFlow() {
  const [screen, setScreen] = useState<Screen>("intro")
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [ready, setReady] = useState(false)

  const sectorId = sectorIdFromAnswers(answers)
  const sequence = useMemo(() => {
    const sectorQuestions = sectorId ? (questionsBySector[sectorId] ?? []) : []
    return [...n1Questions, ...sectorQuestions]
  }, [sectorId])
  const question = sequence[index]
  const report = useMemo(
    () => evaluateSession([...n1Questions, ...(sectorId ? questionsBySector[sectorId] ?? [] : [])], answers, methodologyRules, sectorId),
    [answers, sectorId],
  )

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const saved = JSON.parse(raw) as SavedSession
        setScreen(saved.screen ?? "intro")
        setIndex(saved.index ?? 0)
        setAnswers(saved.answers ?? {})
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const payload: SavedSession = { screen, index, answers }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [ready, screen, index, answers])

  useEffect(() => {
    if (index > sequence.length - 1) setIndex(Math.max(sequence.length - 1, 0))
  }, [index, sequence.length])

  function restart() {
    setAnswers({})
    setIndex(0)
    setScreen("intro")
    window.localStorage.removeItem(STORAGE_KEY)
  }

  function loadExample() {
    const sample = artesGraficasExample([...n1Questions, ...(questionsBySector["artes-graficas"] ?? [])])
    setAnswers(sample)
    setScreen("results")
  }

  function updateAnswer(current: Question, answer: Answer) {
    setAnswers((previous) => {
      const next = { ...previous, [current.id]: answer }
      const previousSector = previous["N1-02"]
      if (
        current.id === "N1-02" &&
        answer.kind === "single" &&
        previousSector?.kind === "single" &&
        previousSector.optionValue !== answer.optionValue
      ) {
        for (const key of Object.keys(next)) {
          if (key.startsWith("N2-")) delete next[key]
        }
      }
      return next
    })
  }

  if (!ready) {
    return <div className="min-h-screen bg-background" />
  }

  if (screen === "intro") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="p-4 md:p-6">
          <ClusterLogo className="h-8 text-foreground md:h-10" />
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
          <div className="max-w-md space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-balance md:text-4xl">Diagnóstico regional</h1>
              <p className="text-lg font-medium" style={{ color: sessionById("n1").color }}>
                Puebla–Tlaxcala
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {SESSIONS.map((session) => (
                <span key={session.id} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: session.color }}>
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: session.color }} />
                  {session.name}
                </span>
              ))}
            </div>
            <p className="leading-relaxed text-muted-foreground">
              Primero contestas el Nivel 1, común a todas las empresas. En la pregunta de sector se abre solo el
              instrumento de ese sector: {n1Questions.length} reactivos comunes y después entre 14 y 20 del sector.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                size="lg"
                className="rounded-2xl px-10 py-6 text-base text-white"
                style={{ backgroundColor: sessionById("n1").color }}
                onClick={() => setScreen("questions")}
              >
                Comenzar evaluación
              </Button>
              <Button type="button" variant="outline" className="rounded-2xl" onClick={loadExample}>
                Ver el ejemplo de artes gráficas
              </Button>
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
      </div>
    )
  }

  if (screen === "results" || !question) {
    return <ResultPanel sectorLabel={sectorLabel(sectorId)} report={report} rules={methodologyRules} onRestart={restart} />
  }

  const session = sessionForLevel(question.level)
  const position = sequence.filter((item) => item.level === question.level).findIndex((item) => item.id === question.id) + 1
  const levelTotal = sequence.filter((item) => item.level === question.level).length
  const complete = isAnswerComplete(question, answers[question.id])
  const isLast = index === sequence.length - 1

  return (
    <QuestionFrame
      session={session}
      progress={(position / levelTotal) * 100}
      stepLabel={`${session.name} · ${position} de ${levelTotal}`}
      blockLabel={BLOCK_LABEL[question.block] ?? question.block}
      title={question.title}
      prompt={question.prompt}
      note={question.note}
      canContinue={complete}
      continueLabel={isLast ? "Ver diagnóstico" : "Continuar"}
      onBack={() => {
        if (index === 0) setScreen("intro")
        else setIndex(index - 1)
      }}
      onContinue={() => {
        if (isLast) setScreen("results")
        else setIndex(index + 1)
      }}
    >
      <QuestionBody
        question={question}
        answer={answers[question.id]}
        accent={session.color}
        accentInk={session.ink}
        onChange={(answer) => updateAnswer(question, answer)}
      />
    </QuestionFrame>
  )
}

function QuestionBody({
  question,
  answer,
  accent,
  accentInk,
  onChange,
}: {
  question: Question
  answer: Answer | undefined
  accent: string
  accentInk: string
  onChange: (answer: Answer) => void
}) {
  if (question.type === "single_select") {
    return <SingleBody question={question} answer={answer} accent={accent} accentInk={accentInk} onChange={onChange} />
  }
  if (question.type === "likert_7") return <LikertBody question={question} answer={answer} onChange={onChange} />
  return <RankBody question={question} answer={answer} accent={accent} accentInk={accentInk} onChange={onChange} />
}

function SingleBody({
  question,
  answer,
  accent,
  accentInk,
  onChange,
}: {
  question: SingleQuestion
  answer: Answer | undefined
  accent: string
  accentInk: string
  onChange: (answer: Answer) => void
}) {
  return (
    <ChoiceList
      options={question.options}
      value={answer?.kind === "single" ? answer.optionValue : null}
      accent={accent}
      accentInk={accentInk}
      onChange={(optionValue) => onChange({ kind: "single", optionValue })}
    />
  )
}

function LikertBody({
  question,
  answer,
  onChange,
}: {
  question: LikertQuestion
  answer: Answer | undefined
  onChange: (answer: Answer) => void
}) {
  return (
    <LikertScale
      value={answer?.kind === "likert" ? answer.value : null}
      minLabel={question.minLabel}
      maxLabel={question.maxLabel}
      onChange={(value) => onChange({ kind: "likert", value })}
    />
  )
}

function RankBody({
  question,
  answer,
  accent,
  accentInk,
  onChange,
}: {
  question: RankQuestion
  answer: Answer | undefined
  accent: string
  accentInk: string
  onChange: (answer: Answer) => void
}) {
  const ranks = answer?.kind === "rank" ? answer.ranks : {}
  const cost = answer?.kind === "rank" ? answer.costMxn : null
  return (
    <div className="space-y-4">
      <RankBoard
        factors={question.factors}
        ranks={ranks}
        accent={accent}
        accentInk={accentInk}
        onChange={(next) => onChange({ kind: "rank", ranks: next, costMxn: cost })}
      />
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Costo anual estimado en pesos. Se guarda y no entra al puntaje.</span>
        <input
          type="number"
          min={0}
          inputMode="decimal"
          value={cost ?? ""}
          onChange={(event) => {
            const raw = event.target.value
            onChange({
              kind: "rank",
              ranks,
              costMxn: raw === "" ? null : Number(raw),
            })
          }}
          className="w-full rounded-2xl border bg-background px-3 py-2"
        />
      </label>
    </div>
  )
}
