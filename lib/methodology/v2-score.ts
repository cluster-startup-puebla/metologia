import type { V2Answers, V2Question } from "./v2-types.ts"

export type V2Band = "platino" | "oro" | "plata" | "bronce"

export interface V2Score {
  estadoDerecho: number
  innovacion: number
  comercial: number
  ismsNivel1: number
  satNivel2: number
  ismsNivel2: number
  ib: number
  band: V2Band
}

const ED_IDS = ["ED-01", "ED-02", "ED-03", "ED-04", "ED-05"]
const INO_IDS = ["INO-01", "INO-02", "INO-03", "INO-04"]
const COM_IDS = ["COM-01", "COM-02", "COM-03"]
const SAT_IDS = ["P1", "P2", "P3", "P4", "P5", "TECH-06", "TECH-07"]
const P5_FALLBACK = 60

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function mean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

function itemScore(questions: V2Question[], answers: V2Answers, id: string): number {
  const question = questions.find((q) => q.id === id)
  if (!question) throw new Error(`Missing question: ${id}`)
  const answer = answers[id]
  if (!answer) throw new Error(`Missing answer: ${id}`)
  if (answer.kind === "rank") throw new Error(`Unsupported rank answer for scored question: ${id}`)

  if (id === "P5" && answer.kind === "text") return P5_FALLBACK

  const option = question.options?.find((o) => o.value === answer.optionValue)
  if (!option) throw new Error(`Unknown option "${answer.optionValue}" for question: ${id}`)
  if (option.score === null) {
    if (id === "P5") return P5_FALLBACK
    throw new Error(`Option "${answer.optionValue}" has null score for question: ${id}`)
  }
  return option.score
}

function groupMean(questions: V2Question[], answers: V2Answers, ids: string[]): number {
  return mean(ids.map((id) => itemScore(questions, answers, id)))
}

function bandFor(ismsNivel2: number): V2Band {
  if (ismsNivel2 >= 85) return "platino"
  if (ismsNivel2 >= 70) return "oro"
  if (ismsNivel2 >= 50) return "plata"
  return "bronce"
}

export function scoreV2(questions: V2Question[], answers: V2Answers): V2Score {
  const edRaw = groupMean(questions, answers, ED_IDS)
  const inoRaw = groupMean(questions, answers, INO_IDS)
  const comRaw = groupMean(questions, answers, COM_IDS)

  const estadoDerecho = round2(edRaw)
  const innovacion = round2(inoRaw)
  const comercial = round2(comRaw)
  const satNivel2 = round2(groupMean(questions, answers, SAT_IDS))

  // NOTE: weighting the already-rounded components (e.g. comercial = 83.33) yields
  // 62.67 / 68.02 for Automotriz / Hospital, which contradicts the ficha (62.68 / 68.03).
  // The ficha only reproduces when nivel 1 is weighted from the unrounded means.
  const ismsNivel1 = round2(0.4 * edRaw + 0.3 * inoRaw + 0.3 * comRaw)
  const ismsNivel2 = round2(0.5 * ismsNivel1 + 0.5 * satNivel2)
  const ib = round2(ismsNivel1 - satNivel2)

  return {
    estadoDerecho,
    innovacion,
    comercial,
    ismsNivel1,
    satNivel2,
    ismsNivel2,
    ib,
    band: bandFor(ismsNivel2),
  }
}

// ---------------------------------------------------------------------------
// Live scorer for a real session (real question bank ids).
// ---------------------------------------------------------------------------

/** Ordinal map for 4-option single selects whose options carry no printed points (manual: 25/50/75/100). */
export const V2_ORDINAL_SCORES: readonly number[] = [25, 50, 75, 100]

/** Maps an option index (0..3) to its ordinal score. Throws naming the id for any other index. */
export function ordinalScore(id: string, index: number): number {
  if (!Number.isInteger(index) || index < 0 || index >= V2_ORDINAL_SCORES.length) {
    throw new Error(`Option index ${index} has no ordinal score for question: ${id}`)
  }
  return V2_ORDINAL_SCORES[index]
}

export interface V2LiveScore {
  estadoDerecho: number
  innovacion: number
  comercial: number
  ismsNivel1: number
  satNivel2: number | null
  ismsNivel2: number | null
  ib: number | null
  band: V2Band | null
  missing: string[]
}

const SAT_ID_PATTERN = /(?:^|-)TECH-0([1-7])$/
const SYNTHETIC_SAT_IDS: Record<string, number> = { P1: 1, P2: 2, P3: 3, P4: 4, P5: 5 }

function satSlot(id: string): number | null {
  const match = SAT_ID_PATTERN.exec(id)
  if (match) return Number(match[1])
  return SYNTHETIC_SAT_IDS[id] ?? null
}

function selectedOption(question: V2Question, answers: V2Answers, id: string) {
  const answer = answers[id]
  if (!answer) throw new Error(`Missing answer: ${id}`)
  if (answer.kind === "rank") throw new Error(`Unsupported rank answer for scored question: ${id}`)
  const index = question.options?.findIndex((o) => o.value === answer.optionValue) ?? -1
  if (index < 0) throw new Error(`Unknown option "${answer.optionValue}" for question: ${id}`)
  return { option: question.options![index], index }
}

function liveGroupMean(questions: V2Question[], answers: V2Answers, ids: string[], ordinalFallback: boolean): number {
  const scores = ids.map((id) => {
    const question = questions.find((q) => q.id === id)
    if (!question) throw new Error(`Missing question: ${id}`)
    const { option, index } = selectedOption(question, answers, id)
    if (option.score !== null) return option.score
    // INO/COM cards print no points; the manual defines them as ordinal 25/50/75/100.
    if (ordinalFallback) return ordinalScore(id, index)
    throw new Error(`Option "${option.value}" has null score for question: ${id}`)
  })
  return mean(scores)
}

export function scoreLive(questions: V2Question[], answers: V2Answers): V2LiveScore {
  const edRaw = liveGroupMean(questions, answers, ED_IDS, false)
  const inoRaw = liveGroupMean(questions, answers, INO_IDS, true)
  const comRaw = liveGroupMean(questions, answers, COM_IDS, true)

  const estadoDerecho = round2(edRaw)
  const innovacion = round2(inoRaw)
  const comercial = round2(comRaw)
  const ismsNivel1 = round2(0.4 * edRaw + 0.3 * inoRaw + 0.3 * comRaw)

  const missing: string[] = []
  const satScores = new Map<number, number>()
  for (const question of questions) {
    const slot = satSlot(question.id)
    if (slot === null) continue
    if (slot <= 4) {
      // TECH-01..04 (P1..P4) are not scored by the live scorer.
      missing.push(question.id)
      continue
    }
    if (!answers[question.id]) {
      missing.push(question.id)
      continue
    }
    if (slot === 5) {
      satScores.set(slot, P5_FALLBACK)
      continue
    }
    const { option, index } = selectedOption(question, answers, question.id)
    satScores.set(slot, option.score !== null ? option.score : ordinalScore(question.id, index))
  }

  const complete = missing.length === 0 && [1, 2, 3, 4, 5, 6, 7].every((slot) => satScores.has(slot))
  const satNivel2 = complete ? round2(mean([...satScores.values()])) : null
  const ismsNivel2 = satNivel2 === null ? null : round2(0.5 * ismsNivel1 + 0.5 * satNivel2)
  const ib = satNivel2 === null ? null : round2(ismsNivel1 - satNivel2)

  return {
    estadoDerecho,
    innovacion,
    comercial,
    ismsNivel1,
    satNivel2,
    ismsNivel2,
    ib,
    band: ismsNivel2 === null ? null : bandFor(ismsNivel2),
    missing,
  }
}

export interface V2LevelStep {
  band: V2Band
  min: number
  max: number | null
  actions: string[]
}

/** Sector sheet cuts. A score on the boundary belongs to the higher level. */
export function levelStepFor(score: number, steps: V2LevelStep[]): V2LevelStep | null {
  const ordered = [...steps].sort((a, b) => b.min - a.min)
  return ordered.find((step) => score >= step.min && (step.max === null || score < step.max)) ?? null
}
