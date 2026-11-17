import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { levelStepFor, scoreLive } from "../lib/methodology/v2-score.ts"
import type { V2Band, V2LevelStep } from "../lib/methodology/v2-score.ts"
import type { V2Answer, V2Answers, V2Question } from "../lib/methodology/v2-types.ts"

const root = path.resolve(import.meta.dirname, "..")
const content = path.join(root, "content/methodology/v2")
const targets: V2Band[] = ["bronce", "plata", "oro"]

interface Recipe {
  ed: number
  ino: number
  com: number
}

const recipes: Record<"wide" | "high", Record<V2Band, Recipe>> = {
  wide: {
    bronce: { ed: 20, ino: 25, com: 25 },
    plata: { ed: 40, ino: 50, com: 50 },
    oro: { ed: 60, ino: 75, com: 75 },
  },
  high: {
    bronce: { ed: 20, ino: 25, com: 25 },
    plata: { ed: 60, ino: 50, com: 50 },
    oro: { ed: 80, ino: 75, com: 75 },
  },
}

interface SectorFile {
  sectorId: string
  label: string
  questions: V2Question[]
  roadmap: V2LevelStep[]
}

function familyOf(roadmap: V2LevelStep[]) {
  const oro = roadmap.find((step) => step.band === "oro")
  return oro && oro.min >= 70 ? "high" : "wide"
}

function optionFor(question: V2Question, wanted: number, ordinal: boolean) {
  const options = question.options ?? []
  const printed = options.find((option) => option.score === wanted)
  if (printed) return printed
  if (ordinal) {
    const index = [25, 50, 75, 100].indexOf(wanted)
    const option = options[index]
    if (option) return option
  }
  throw new Error(`${question.id} has no option worth ${wanted}`)
}

function pickIndex(length: number, band: V2Band) {
  if (band === "bronce") return 0
  if (band === "plata") return Math.floor((length - 1) / 2)
  return Math.max(0, length - 2)
}

function answerQuestion(question: V2Question, band: V2Band, sectorId: string): V2Answer {
  if (question.id === "MOD0-WEB-01") return { kind: "single", optionValue: sectorId }
  if (question.type === "multi_select" && question.factors?.length) {
    const count = band === "bronce" ? 1 : band === "plata" ? 3 : 4
    return { kind: "checks", selected: question.factors.slice(0, count).map((factor) => factor.id) }
  }
  if (question.type === "rank" && question.factors?.length) {
    const factors = [...question.factors]
    if (band === "plata") {
      const first = factors.shift()
      if (first) factors.push(first)
    }
    if (band === "oro") factors.reverse()
    return {
      kind: "rank",
      ranks: Object.fromEntries(factors.map((factor, index) => [factor.id, index + 1])),
    }
  }
  const options = (question.options ?? []).filter((option) => option.value !== question.text?.optionValue)
  const choices = options.length ? options : (question.options ?? [])
  if (!choices.length) throw new Error(`${question.id} has nothing to answer`)
  const scored = choices.every((option) => typeof option.score === "number")
  const ranked = scored ? [...choices].sort((a, b) => (a.score ?? 0) - (b.score ?? 0)) : choices
  const index = Math.min(pickIndex(ranked.length, band), 4)
  const option = ranked[index]
  if (question.type === "single_select_text") {
    const free = question.text?.optionValue === option.value
    return { kind: "text", optionValue: option.value, text: free ? "Proyecto descrito en la simulación." : "" }
  }
  return { kind: "single", optionValue: option.value }
}

function resolved(question: V2Question, answer: V2Answer) {
  if (answer.kind === "checks") {
    const labels = answer.selected.map((id) => question.factors?.find((factor) => factor.id === id)?.label ?? id)
    return { chosenLabel: labels.join(" | "), chosenScore: Math.min(100, answer.selected.length * 20) }
  }
  if (answer.kind === "rank") {
    const order = Object.entries(answer.ranks)
      .sort((a, b) => a[1] - b[1])
      .map(([id, rank]) => {
        const label = question.factors?.find((factor) => factor.id === id)?.label ?? id
        return `${rank}. ${label}`
      })
    return { chosenLabel: order.join(" | "), chosenScore: null }
  }
  const option = question.options?.find((item) => item.value === answer.optionValue)
  return { chosenLabel: option?.label ?? answer.optionValue, chosenScore: option?.score ?? null }
}

const n1 = JSON.parse(await readFile(path.join(content, "n1.json"), "utf8")) as { questions: V2Question[] }
const sectorNames = (await readdir(path.join(content, "n2"))).filter((name) => name.endsWith(".json")).sort()
const sessions = []
const failures: string[] = []

for (const fileName of sectorNames) {
  const sector = JSON.parse(await readFile(path.join(content, "n2", fileName), "utf8")) as SectorFile
  const family = familyOf(sector.roadmap)
  const questions = [...n1.questions, ...sector.questions]
  for (const target of targets) {
    const recipe = recipes[family][target]
    const answers: V2Answers = {}
    for (const question of questions) {
      answers[question.id] = answerQuestion(question, target, sector.sectorId)
    }
    for (const id of ["ED-01", "ED-02", "ED-03", "ED-04", "ED-05"]) {
      const question = questions.find((item) => item.id === id)
      if (!question) throw new Error(`missing ${id}`)
      answers[id] = { kind: "single", optionValue: optionFor(question, recipe.ed, false).value }
    }
    for (const id of ["INO-01", "INO-02", "INO-03", "INO-04", "COM-01", "COM-02", "COM-03"]) {
      const question = questions.find((item) => item.id === id)
      if (!question) throw new Error(`missing ${id}`)
      const wanted = id.startsWith("INO") ? recipe.ino : recipe.com
      answers[id] = { kind: "single", optionValue: optionFor(question, wanted, true).value }
    }

    const result = scoreLive(questions, answers)
    const scoreUsed = result.ismsNivel2 ?? result.ismsNivel1
    const level = levelStepFor(scoreUsed, sector.roadmap)
    const achieved = level?.band ?? null
    if (achieved !== target) failures.push(`${sector.sectorId} ${target} landed on ${achieved} with ${scoreUsed}`)

    sessions.push({
      id: `${sector.sectorId}-${target}`,
      sectorId: sector.sectorId,
      sectorLabel: sector.label,
      targetBand: target,
      achievedBand: achieved,
      scoreUsedForLevel: result.ismsNivel2 === null ? "ismsNivel1" : "ismsNivel2",
      family,
      recipe,
      thresholds: sector.roadmap.map((step) => ({ band: step.band, min: step.min, max: step.max })),
      result,
      answers: questions.map((question) => {
        const answer = answers[question.id]
        const choice = resolved(question, answer)
        return {
          id: question.id,
          level: question.level,
          section: question.section,
          prompt: question.prompt,
          type: question.type,
          answer,
          chosenLabel: choice.chosenLabel,
          chosenScore: choice.chosenScore,
        }
      }),
    })
  }
}

if (failures.length) {
  console.error(failures.join("\n"))
  process.exit(1)
}

const tally = Object.fromEntries(targets.map((band) => [band, sessions.filter((session) => session.achievedBand === band).length]))
const document = {
  generatedAt: "2026-11-17",
  description:
    "Tres llenados por sector, armados para caer en bronce, plata y oro. El nivel usa la madurez de conjunto cuando el SAT ya cierra, y si no, la madurez que reporta la dirección. P1 suma 20 por casilla (una sola, si la tarjeta no deja marcar varias). P2 a P4 usan el puntaje escrito o, si no hay, 20, 40, 60, 80 y 100 según el lugar de la opción.",
  sectorCount: sectorNames.length,
  sessionCount: sessions.length,
  tally,
  sessions,
}

const out = path.join(root, "data/simulacion-v2-bandas.json")
await writeFile(out, JSON.stringify(document, null, 2) + "\n")
console.log(`wrote ${out}`)
console.log(tally)
for (const session of sessions) {
  console.log(
    `${session.sectorId.padEnd(22)} ${session.targetBand.padEnd(7)} isms1=${String(session.result.ismsNivel1).padStart(5)} level=${session.achievedBand}`,
  )
}
