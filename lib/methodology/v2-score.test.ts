import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { V2_EXAMPLES, scoreExample } from "./v2-examples.ts"
import { V2_ORDINAL_SCORES, ordinalScore, scoreLive, scoreV2 } from "./v2-score.ts"
import type { V2Answers, V2Question } from "./v2-types.ts"

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

interface Item {
  id: string
  score: number | null
  // "single" (default) answers with the option; "text" answers with free text.
  kind?: "single" | "text"
}

function question(item: Item, level: "n1" | "n2"): V2Question {
  return {
    id: item.id,
    level,
    sectorId: null,
    section: "test",
    widget: "test",
    title: item.id,
    prompt: item.id,
    microcopy: null,
    type: item.kind === "text" ? "single_select_text" : level === "n1" ? "likert_5" : "single_select",
    prefilled: false,
    options: [{ value: `${item.id}-opt`, label: item.id, score: item.score }],
  }
}

function build(items: Item[], levelOf: (id: string) => "n1" | "n2" = (id) => (/^(ED|INO|COM)-/.test(id) ? "n1" : "n2")) {
  const questions = items.map((item) => question(item, levelOf(item.id)))
  const answers: V2Answers = {}
  for (const item of items) {
    answers[item.id] =
      item.kind === "text"
        ? { kind: "text", optionValue: `${item.id}-opt`, text: "respuesta libre" }
        : { kind: "single", optionValue: `${item.id}-opt` }
  }
  return { questions, answers }
}

function fixture(opts: { ed: number[]; ino: number[]; com: number[]; sat: number[]; p5Text?: boolean }) {
  const items: Item[] = []
  opts.ed.forEach((s, i) => items.push({ id: `ED-0${i + 1}`, score: s }))
  opts.ino.forEach((s, i) => items.push({ id: `INO-0${i + 1}`, score: s }))
  opts.com.forEach((s, i) => items.push({ id: `COM-0${i + 1}`, score: s }))
  const satIds = ["P1", "P2", "P3", "P4", "P5", "TECH-06", "TECH-07"]
  satIds.forEach((id, i) => {
    if (id === "P5" && opts.p5Text) {
      // The option score (20) is deliberately NOT 60: the 60 must come from the text-answer constant.
      items.push({ id, score: 20, kind: "text" })
    } else {
      items.push({ id, score: opts.sat[i] })
    }
  })
  return build(items)
}

test("Automotriz troquelados matches the ficha", () => {
  const { questions, answers } = fixture({
    ed: [40, 50, 50, 60, 60], // mean 52 exactly
    ino: [50, 50, 62.5, 62.5], // mean 56.25 exactly
    com: [75, 75, 100], // mean 250/3
    sat: [60, 60, 60, 60, 60, 50, 50],
  })
  assert.equal(round2(250 / 3), 83.33)
  const s = scoreV2(questions, answers)
  assert.equal(s.estadoDerecho, 52)
  assert.equal(s.innovacion, 56.25)
  assert.equal(s.comercial, 83.33)
  assert.equal(s.ismsNivel1, 62.68)
  assert.equal(s.satNivel2, 57.14)
  assert.equal(s.ismsNivel2, 59.91)
  assert.equal(s.ib, 5.54)
  assert.equal(s.band, "plata")
})

test("Plasticos matches the ficha (P5 text answer contributes constant 60)", () => {
  const { questions, answers } = fixture({
    ed: [40, 40, 40, 40, 40],
    ino: [25, 25, 37.5, 37.5],
    com: [50, 50, 50],
    sat: [20, 40, 20, 20, 0, 25, 25],
    p5Text: true,
  })
  const s = scoreV2(questions, answers)
  assert.equal(s.estadoDerecho, 40)
  assert.equal(s.innovacion, 31.25)
  assert.equal(s.comercial, 50)
  assert.equal(s.ismsNivel1, 40.38)
  assert.equal(s.satNivel2, 30)
  assert.equal(s.ismsNivel2, 35.19)
  assert.equal(s.ib, 10.38)
  assert.equal(s.band, "bronce")
})

test("P5 with a null option score contributes 60", () => {
  const { questions, answers } = fixture({
    ed: [40, 40, 40, 40, 40],
    ino: [25, 25, 37.5, 37.5],
    com: [50, 50, 50],
    sat: [20, 40, 20, 20, 0, 25, 25],
  })
  const p5 = questions.find((q) => q.id === "P5")!
  p5.options = [{ value: "P5-opt", label: "P5", score: null }]
  const s = scoreV2(questions, answers)
  assert.equal(s.satNivel2, 30)
})

test("Hospital San Jose matches the ficha", () => {
  const { questions, answers } = fixture({
    ed: [50, 50, 60, 60, 60], // mean 56
    ino: [75, 75, 62.5, 62.5], // mean 68.75
    com: [75, 75, 100], // mean 250/3
    sat: [80, 80, 80, 80, 60, 85, 75],
  })
  const s = scoreV2(questions, answers)
  assert.equal(s.estadoDerecho, 56)
  assert.equal(s.innovacion, 68.75)
  assert.equal(s.comercial, 83.33)
  assert.equal(s.ismsNivel1, 68.03)
  assert.equal(s.satNivel2, 77.14)
  assert.equal(s.ismsNivel2, 72.59)
  assert.equal(s.ib, -9.11)
  assert.equal(s.band, "oro")
})

test("Logistica matches the ficha", () => {
  const { questions, answers } = fixture({
    ed: [40, 40, 40, 40, 40],
    ino: [50, 50, 37.5, 37.5], // mean 43.75
    com: [75, 75, 75],
    sat: [40, 60, 40, 40, 60, 50, 50],
  })
  const s = scoreV2(questions, answers)
  assert.equal(s.estadoDerecho, 40)
  assert.equal(s.innovacion, 43.75)
  assert.equal(s.comercial, 75)
  assert.equal(s.ismsNivel1, 51.63)
  assert.equal(s.satNivel2, 48.57)
  assert.equal(s.ismsNivel2, 50.1)
  assert.equal(s.ib, 3.06)
  assert.equal(s.band, "plata")
})

test("missing ED-03 throws naming the id", () => {
  const { questions, answers } = fixture({
    ed: [40, 40, 40, 40, 40],
    ino: [50, 50, 50, 50],
    com: [50, 50, 50],
    sat: [50, 50, 50, 50, 50, 50, 50],
  })
  assert.throws(
    () =>
      scoreV2(
        questions.filter((q) => q.id !== "ED-03"),
        answers,
      ),
    /ED-03/,
  )
  const missingAnswer = { ...answers }
  delete missingAnswer["ED-03"]
  assert.throws(() => scoreV2(questions, missingAnswer), /ED-03/)
})

test("null score on a non-P5 item throws naming the id", () => {
  const { questions, answers } = fixture({
    ed: [40, 40, 40, 40, 40],
    ino: [50, 50, 50, 50],
    com: [50, 50, 50],
    sat: [50, 50, 50, 50, 50, 50, 50],
  })
  questions.find((q) => q.id === "P2")!.options = [{ value: "P2-opt", label: "P2", score: null }]
  assert.throws(() => scoreV2(questions, answers), /P2/)
})

test("band thresholds are inclusive at 85, 70 and 50", () => {
  const cases: Array<[number, string]> = [
    [85, "platino"],
    [84.99, "oro"],
    [70, "oro"],
    [69.99, "plata"],
    [50.1, "plata"],
    [50, "plata"],
    [49.99, "bronce"],
  ]
  for (const [score, band] of cases) {
    const { questions, answers } = fixture({
      ed: [score, score, score, score, score],
      ino: [score, score, score, score],
      com: [score, score, score],
      sat: [score, score, score, score, score, score, score],
    })
    const s = scoreV2(questions, answers)
    assert.equal(s.ismsNivel2, score)
    assert.equal(s.band, band)
  }
})

// ---------------------------------------------------------------------------
// Part A: the four fichas of Ejemplos.md replayed through the existing engine.
// ---------------------------------------------------------------------------

test("fichas: stated nivel-1 item scores + stated SAT parts reproduce the headline", () => {
  for (const example of V2_EXAMPLES) {
    const s = scoreExample(example)
    const label = `${example.company}`
    assert.equal(s.ismsNivel1, example.expected.ismsNivel1, `${label} isms1`)
    assert.equal(s.satNivel2, example.expected.satNivel2, `${label} sat`)
    assert.equal(s.ismsNivel2, example.expected.ismsNivel2, `${label} isms2`)
    assert.equal(s.band, example.expected.band, `${label} band`)
    if (example.expected.ib !== undefined) assert.equal(s.ib, example.expected.ib, `${label} ib`)
  }
  // Literal headline numbers, independent of the data file.
  const byKey = Object.fromEntries(V2_EXAMPLES.map((e) => [e.key, e.expected.ismsNivel2]))
  assert.deepEqual(byKey, { automotriz: 59.91, plasticos: 35.19, "medico-hospitalario": 72.59, logistica: 50.1 })
})

// ---------------------------------------------------------------------------
// Part B: replay against the real question bank.
// The bank is read straight from the JSON files (v2-bank.ts uses the "@/" alias,
// which node's type stripping cannot resolve). Same files, same content.
// ---------------------------------------------------------------------------

function loadQuestions(path: string): V2Question[] {
  return JSON.parse(readFileSync(new URL(`../../content/methodology/v2/${path}`, import.meta.url), "utf8")).questions
}

const realN1 = loadQuestions("n1.json")
const realN2: Record<string, V2Question[]> = Object.fromEntries(
  V2_EXAMPLES.map((e) => [e.sectorId, loadQuestions(`n2/${e.sectorId}.json`)]),
)
const TECH_PREFIX: Record<string, string> = {
  automotriz: "AU",
  plasticos: "PL",
  "medico-hospitalario": "MD",
  logistica: "LG",
}

function n1Question(id: string): V2Question {
  const q = realN1.find((x) => x.id === id)
  assert.ok(q, `real n1 question ${id} exists`)
  return q
}

function n2Question(sectorId: string, n: number): V2Question {
  const id = `${TECH_PREFIX[sectorId]}-TECH-0${n}`
  const q = realN2[sectorId].find((x) => x.id === id)
  assert.ok(q, `real n2 question ${id} exists`)
  return q
}

function hasScore(q: V2Question, score: number): boolean {
  return (q.options ?? []).some((o) => o.score === score)
}

test("replay: every ED item of the four fichas finds a real option with that score", () => {
  for (const example of V2_EXAMPLES) {
    example.ed.forEach((score, i) => {
      const id = `ED-0${i + 1}`
      assert.ok(hasScore(n1Question(id), score), `${example.company} ${id}=${score} has a real option`)
    })
  }
})

test("replay: INO/COM option cards carry no printed score, so no ficha value is reachable by option.score", () => {
  const unscored: string[] = []
  for (const id of ["INO-01", "INO-02", "INO-03", "INO-04", "COM-01", "COM-02", "COM-03"]) {
    const q = n1Question(id)
    assert.equal(q.options?.length, 4, `${id} has 4 option cards`)
    if (q.options!.every((o) => o.score === null)) unscored.push(id)
  }
  // Exactly these ids: a future card change that adds scores must fail here.
  assert.deepEqual(unscored, ["INO-01", "INO-02", "INO-03", "INO-04", "COM-01", "COM-02", "COM-03"])

  // Consequently every INO/COM value used by the fichas is "missing" under option.score ...
  const missingByOptionScore = new Set<string>()
  // ... and, under the manual's ordinal map (card position -> 25/50/75/100), reachable only if it is in that set.
  const missingByOrdinal = new Set<string>()
  for (const example of V2_EXAMPLES) {
    const items: Array<[string, number]> = [
      ...example.ino.map((v, i): [string, number] => [`INO-0${i + 1}`, v]),
      ...example.com.map((v, i): [string, number] => [`COM-0${i + 1}`, v]),
    ]
    for (const [id, value] of items) {
      if (!hasScore(n1Question(id), value)) missingByOptionScore.add(`${example.key}:${id}=${value}`)
      if (!V2_ORDINAL_SCORES.includes(value)) missingByOrdinal.add(`${example.key}:${id}=${value}`)
    }
  }
  assert.equal(missingByOptionScore.size, 4 * 7, "all 28 INO/COM ficha items are unreachable by option.score")
  assert.deepEqual([...missingByOrdinal], [], "every INO/COM ficha value is on the 25/50/75/100 ordinal map")
  // The 20/40/60/80/100 scale does not apply to INO/COM cards: 25/50/75 are not card scores.
  for (const value of [25, 50, 75]) {
    for (const id of ["INO-01", "COM-01"]) assert.equal(hasScore(n1Question(id), value), false)
  }
})

test("replay: TECH-06/TECH-07 are 4 unscored cards on the 25/50/75/100 ordinal map; 85 is not emittable", () => {
  assert.deepEqual([...V2_ORDINAL_SCORES], [25, 50, 75, 100])
  for (const example of V2_EXAMPLES) {
    for (const [slot, value] of [
      [6, example.sat[5]],
      [7, example.sat[6]],
    ] as const) {
      const q = n2Question(example.sectorId, slot)
      assert.equal(q.options?.length, 4)
      assert.ok(q.options!.every((o) => o.score === null))
      if (example.key === "medico-hospitalario" && slot === 6) {
        assert.equal(value, 85)
        assert.equal(V2_ORDINAL_SCORES.indexOf(value), -1, "85 is rejected by the ordinal map")
      } else {
        assert.notEqual(V2_ORDINAL_SCORES.indexOf(value), -1, `${example.company} TECH-0${slot}=${value} is emittable`)
      }
    }
  }
  // No card index can ever yield 85.
  for (let i = 0; i < 4; i++) assert.notEqual(ordinalScore("MD-TECH-06", i), 85)
  assert.throws(() => ordinalScore("MD-TECH-06", 4), /MD-TECH-06/)
  // The hospital narrative (mermas < 1%, IAAS < 0.8%) falls inside the third card, scored 75.
  const hospital06 = n2Question("medico-hospitalario", 6)
  assert.match(hospital06.options![2].label, /^Mermas de reactivos entre 0\.5% y 2%/)
  assert.equal(ordinalScore(hospital06.id, 2), 75)
})

test("replay: TECH-01..04 (P1..P4) have no printed scores, so no card index is claimed for them", () => {
  for (const example of V2_EXAMPLES) {
    for (const slot of [1, 2, 3, 4]) {
      const q = n2Question(example.sectorId, slot)
      assert.ok((q.options ?? []).every((o) => o.score === null), `${q.id} options are unscored`)
    }
  }
})

// ---------------------------------------------------------------------------
// Part C: scoreLive against the real bank.
// ---------------------------------------------------------------------------

function pickByIndex(q: V2Question, index: number) {
  return { kind: "single" as const, optionValue: q.options![index].value }
}

function liveSession(sectorId = "automotriz", overrides: Record<string, number> = {}) {
  const example = V2_EXAMPLES.find((e) => e.sectorId === sectorId)!
  const questions = [...realN1, ...realN2[sectorId]]
  const answers: V2Answers = {}
  const byId = (id: string) => questions.find((q) => q.id === id)!
  const idx = (id: string, i: number) => overrides[id] ?? i
  example.ed.forEach((score, i) => {
    const id = `ED-0${i + 1}`
    answers[id] = pickByIndex(byId(id), idx(id, byId(id).options!.findIndex((o) => o.score === score)))
  })
  ;[...example.ino.map((v, i) => [`INO-0${i + 1}`, v] as const), ...example.com.map((v, i) => [`COM-0${i + 1}`, v] as const)].forEach(
    ([id, value]) => {
      answers[id] = pickByIndex(byId(id), idx(id, value / 25 - 1))
    },
  )
  const prefix = TECH_PREFIX[sectorId]
  for (const n of [1, 2, 3, 4, 5]) answers[`${prefix}-TECH-0${n}`] = pickByIndex(byId(`${prefix}-TECH-0${n}`), 0)
  answers[`${prefix}-TECH-06`] = pickByIndex(byId(`${prefix}-TECH-06`), idx(`${prefix}-TECH-06`, 1))
  answers[`${prefix}-TECH-07`] = pickByIndex(byId(`${prefix}-TECH-07`), idx(`${prefix}-TECH-07`, 1))
  return { questions, answers }
}

test("scoreLive: real automotriz session scores nivel 1 and reports TECH-01..04 as missing", () => {
  const { questions, answers } = liveSession()
  const s = scoreLive(questions, answers)
  assert.equal(typeof s.ismsNivel1, "number")
  assert.equal(s.estadoDerecho, 52)
  assert.equal(s.innovacion, 56.25)
  assert.equal(s.comercial, 83.33)
  assert.equal(s.ismsNivel1, 62.68)
  assert.deepEqual(s.missing, ["AU-TECH-01", "AU-TECH-02", "AU-TECH-03", "AU-TECH-04"])
  assert.equal(s.satNivel2, null)
  assert.equal(s.ismsNivel2, null)
  assert.equal(s.ib, null)
  assert.equal(s.band, null)
})

test("scoreLive: TECH-06/07 ordinal index maps 0..3 to 25/50/75/100 and rejects other indexes", () => {
  // Only exercised through the ordinal helper: the live session cannot produce sat while TECH-01..04 are unscored.
  assert.deepEqual([0, 1, 2, 3].map((i) => ordinalScore("AU-TECH-06", i)), [25, 50, 75, 100])
  assert.throws(() => ordinalScore("AU-TECH-07", 4), /AU-TECH-07/)
  assert.throws(() => ordinalScore("AU-TECH-07", -1), /AU-TECH-07/)
})

test("scoreLive: unanswered ED item throws naming the id; unanswered TECH-06 is reported missing", () => {
  const { questions, answers } = liveSession()
  const noEd = { ...answers }
  delete noEd["ED-02"]
  assert.throws(() => scoreLive(questions, noEd), /ED-02/)
  const noTech = { ...answers }
  delete noTech["AU-TECH-06"]
  assert.ok(scoreLive(questions, noTech).missing.includes("AU-TECH-06"))
})

test("scoreLive: synthetic ids with scored options behave like scoreV2 for nivel 1", () => {
  const { questions, answers } = fixture({
    ed: [40, 50, 50, 60, 60],
    ino: [50, 50, 62.5, 62.5],
    com: [75, 75, 100],
    sat: [60, 60, 60, 60, 60, 50, 50],
  })
  const live = scoreLive(questions, answers)
  assert.equal(live.ismsNivel1, scoreV2(questions, answers).ismsNivel1)
  assert.equal(live.satNivel2, null)
})
