// Roberto's four worked examples (docs/metodologia/v2/Ejemplos.md), copied verbatim.
// Do not "correct" these numbers: they are the reference the engine is replayed against.

import { scoreV2 } from "./v2-score.ts"
import type { V2Score } from "./v2-score.ts"
import type { V2Answers, V2Question } from "./v2-types.ts"

export interface V2ExampleCase {
  key: string
  sectorId: string
  company: string
  /** ED-01..05 */
  ed: number[]
  /** INO-01..04 */
  ino: number[]
  /** COM-01..03 */
  com: number[]
  /** P1, P2, P3, P4, P5, TECH-06, TECH-07. P5's 60 is the manual's constant, not an option score. */
  sat: number[]
  expected: {
    ismsNivel1: number
    satNivel2: number
    ismsNivel2: number
    band: "platino" | "oro" | "plata" | "bronce"
    /** Only present where the ficha states it. */
    ib?: number
  }
}

export const V2_EXAMPLES: V2ExampleCase[] = [
  {
    key: "automotriz",
    sectorId: "automotriz",
    company: "Troquelados",
    ed: [60, 40, 60, 40, 60],
    ino: [50, 50, 50, 75],
    com: [100, 75, 75],
    sat: [60, 60, 60, 60, 60, 50, 50],
    expected: { ismsNivel1: 62.68, satNivel2: 57.14, ismsNivel2: 59.91, band: "plata", ib: 5.54 },
  },
  {
    key: "plasticos",
    sectorId: "plasticos",
    company: "Inyecciones",
    ed: [40, 40, 40, 40, 40],
    ino: [25, 25, 50, 25],
    com: [50, 50, 50],
    sat: [20, 40, 20, 20, 60, 25, 25],
    expected: { ismsNivel1: 40.38, satNivel2: 30, ismsNivel2: 35.19, band: "bronce" },
  },
  {
    key: "medico-hospitalario",
    sectorId: "medico-hospitalario",
    company: "Hospital San José",
    ed: [40, 60, 40, 60, 80],
    ino: [75, 50, 75, 75],
    com: [75, 75, 100],
    sat: [80, 80, 80, 80, 60, 85, 75],
    expected: { ismsNivel1: 68.03, satNivel2: 77.14, ismsNivel2: 72.59, band: "oro", ib: -9.11 },
  },
  {
    key: "logistica",
    sectorId: "logistica",
    company: "Transportes del Valle",
    ed: [40, 20, 40, 40, 60],
    ino: [50, 25, 50, 50],
    com: [75, 75, 75],
    sat: [40, 60, 40, 40, 60, 50, 50],
    expected: { ismsNivel1: 51.63, satNivel2: 48.57, ismsNivel2: 50.1, band: "plata" },
  },
]

const SAT_IDS = ["P1", "P2", "P3", "P4", "P5", "TECH-06", "TECH-07"]

/**
 * Replays an example through scoreV2 using synthetic questions: each item has a single
 * option whose score is the ficha value. P5 is answered with free text so its 60 comes
 * from the scorer's constant, not from an option score.
 */
export function scoreExample(example: V2ExampleCase): V2Score {
  const items: Array<{ id: string; score: number; text?: boolean }> = [
    ...example.ed.map((score, i) => ({ id: `ED-0${i + 1}`, score })),
    ...example.ino.map((score, i) => ({ id: `INO-0${i + 1}`, score })),
    ...example.com.map((score, i) => ({ id: `COM-0${i + 1}`, score })),
    ...SAT_IDS.map((id, i) => ({ id, score: example.sat[i], text: id === "P5" })),
  ]
  const questions: V2Question[] = items.map((item) => ({
    id: item.id,
    level: /^(ED|INO|COM)-/.test(item.id) ? "n1" : "n2",
    sectorId: null,
    section: "example",
    widget: "example",
    title: item.id,
    prompt: item.id,
    microcopy: null,
    type: item.text ? "single_select_text" : "single_select",
    prefilled: false,
    options: [{ value: `${item.id}-opt`, label: item.id, score: item.score }],
  }))
  const answers: V2Answers = {}
  for (const item of items) {
    answers[item.id] = item.text
      ? { kind: "text", optionValue: `${item.id}-opt`, text: "respuesta libre" }
      : { kind: "single", optionValue: `${item.id}-opt` }
  }
  return scoreV2(questions, answers)
}
