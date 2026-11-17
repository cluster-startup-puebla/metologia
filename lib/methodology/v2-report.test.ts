import assert from "node:assert/strict"
import test from "node:test"

import { buildReport, gapZone } from "./v2-report.ts"
import type { V2Question } from "./v2-types.ts"

test("gap zones follow the manual cuts", () => {
  assert.equal(gapZone(10.01), "Falsa complacencia")
  assert.equal(gapZone(10), "Alineado")
  assert.equal(gapZone(-10), "Alineado")
  assert.equal(gapZone(-10.01), "Cautela")
})

test("underuse above 40 and a frontier gap above 50 raise the manual signals", () => {
  const questions = [
    question("AU-TECH-02", "single_select", [{ value: "opt1", label: "Poco uso", score: 40 }]),
    question("AU-TECH-03", "single_select", [{ value: "opt1", label: "Atrasado", score: 20 }]),
    question("AU-TECH-06", "single_select", [{ value: "opt1", label: "A mano", score: 25 }]),
    question("AU-TECH-07", "single_select", [{ value: "opt1", label: "En papel", score: 25 }]),
  ]
  const answers = {
    "AU-TECH-02": { kind: "single" as const, optionValue: "opt1" },
    "AU-TECH-03": { kind: "single" as const, optionValue: "opt1" },
    "AU-TECH-06": { kind: "single" as const, optionValue: "opt1" },
    "AU-TECH-07": { kind: "single" as const, optionValue: "opt1" },
  }
  const report = buildReport(questions, answers, 12)
  assert.equal(report.underuse?.idle, 60)
  assert.equal(report.underuse?.adornment, true)
  assert.equal(report.frontier?.delta, 80)
  assert.equal(report.frontier?.behind, true)
  assert.equal(report.gapZone, "Falsa complacencia")
  assert.equal(report.signals.length, 4)
})

function question(id: string, type: V2Question["type"], options: V2Question["options"]): V2Question {
  return {
    id,
    level: "n2",
    sectorId: "automotriz",
    section: "II",
    widget: "single",
    title: id,
    prompt: id,
    microcopy: null,
    type,
    prefilled: false,
    options,
  }
}
