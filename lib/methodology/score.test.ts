import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"
import { artesGraficasExample } from "./examples.ts"
import { evaluateSession, illustrationsFor } from "./report.ts"
import {
  bordaFactorScore,
  isms,
  mean,
  quadrantFromIsms,
  scoreTechnical,
  senScore,
} from "./score.ts"
import type { MethodologyRules, QuadrantBand, Question, ScoreResult, SingleQuestion } from "./types.ts"

function quadrantId(rows: Map<number, { quadrant: ScoreResult<QuadrantBand> }>, borda: number) {
  const row = rows.get(borda)
  assert.ok(row)
  assert.equal(row.quadrant.status, "ok")
  if (row.quadrant.status !== "ok") return ""
  return row.quadrant.value.id
}

const root = join(import.meta.dirname, "../..")
const content = join(root, "content/methodology")

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T
}

function close(actual: number, expected: number) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≠ ${expected}`)
}

const rules = readJson<MethodologyRules>(join(content, "rules.json"))

test("SEN de la muestra G.4 es 36.111...", () => {
  const result = senScore([2, 3, 3, 4, 2, 5])
  assert.equal(result.status, "ok")
  if (result.status === "ok") close(result.value, (13 / 36) * 100)
})

test("SEN se detiene si falta un reactivo o el valor sale de 1 a 7", () => {
  assert.equal(senScore([2, 3, 3, 4, 2]).status, "blocked")
  assert.equal(senScore([2, 3, 3, 4, 2, 8]).status, "blocked")
})

test("Borda del tabulador y del reporte para N=8", () => {
  const tabulador = [1, 2, 3, 4, 5, 6, 7, 8].map((rank) => bordaFactorScore(8, rank, "tabulador"))
  const reporte = [1, 2, 3, 4, 5, 6, 7, 8].map((rank) => bordaFactorScore(8, rank, "reporte"))
  close(tabulador[0], 100)
  close(tabulador[1], 87.5)
  close(mean(tabulador), 56.25)
  close(tabulador.reduce((sum, value) => sum + value, 0), 450)
  close(reporte[0], (8 / 36) * 100)
  close(mean(reporte), 12.5)
  close(reporte.reduce((sum, value) => sum + value, 0), 100)
  const reversed = [8, 7, 6, 5, 4, 3, 2, 1].map((rank) => bordaFactorScore(8, rank, "tabulador"))
  close(mean(reversed), mean(tabulador))
})

test("el rango 1 del tabulador vale 100 también con N=6", () => {
  close(bordaFactorScore(6, 1, "tabulador"), 100)
  close(mean([1, 2, 3, 4, 5, 6].map((rank) => bordaFactorScore(6, rank, "tabulador"))), 350 / 6)
})

test("un 39.5 no cae en ningún cuadrante", () => {
  assert.equal(quadrantFromIsms(39.5, rules.quadrants).status, "blocked")
  assert.equal(quadrantFromIsms(39, rules.quadrants).status, "ok")
  assert.equal(quadrantFromIsms(40, rules.quadrants).status, "ok")
  assert.equal(quadrantFromIsms(100, rules.quadrants).status, "ok")
  assert.equal(quadrantFromIsms(100.1, rules.quadrants).status, "blocked")
})

test("el banco trae 46 de nivel 1 y 191 de nivel 2", () => {
  const index = readJson<{ counts: { n1: number; n2: number }; sectors: { id: string }[] }>(join(content, "index.json"))
  const n1 = readJson<{ questions: Question[] }>(join(content, "n1.json"))
  assert.equal(n1.questions.length, 46)
  assert.equal(index.counts.n1, 46)
  assert.equal(index.counts.n2, 191)
  assert.equal(index.sectors.length, 12)
  const files = readdirSync(join(content, "n2")).filter((name) => name.endsWith(".json"))
  assert.equal(files.length, 12)
})

test("artes gráficas reproduce los tres scores técnicos de la sección G", () => {
  const n1 = readJson<{ questions: Question[] }>(join(content, "n1.json")).questions
  const graf = readJson<{ questions: Question[] }>(join(content, "n2/artes-graficas.json")).questions
  const questions = [...n1, ...graf]
  const answers = artesGraficasExample(questions)
  const report = evaluateSession(questions, answers, rules, "artes-graficas")

  assert.equal(report.sen.status, "ok")
  if (report.sen.status === "ok") close(report.sen.value, (13 / 36) * 100)
  assert.equal(report.technicalAuditoria.status, "ok")
  assert.equal(report.technicalAxes.status, "ok")
  assert.equal(report.technicalAllNumeric.status, "ok")
  if (report.technicalAuditoria.status === "ok") {
    close(report.technicalAuditoria.value.obtained, 175)
    close(report.technicalAuditoria.value.maximum, 400)
    close(report.technicalAuditoria.value.score, 43.75)
  }
  if (report.technicalAxes.status === "ok") close(report.technicalAxes.value.score, (300 / 700) * 100)
  if (report.technicalAllNumeric.status === "ok") {
    close(report.technicalAllNumeric.value.obtained, 425)
    close(report.technicalAllNumeric.value.score, 42.5)
  }
  assert.equal(report.isms.status, "undefined")

  const ranking = report.rankings.find((item) => item.sourceId === "R00-GRAF-PROD")
  assert.ok(ranking)
  assert.equal(ranking.tabulador.status, "ok")
  if (ranking.tabuladorMean != null) close(ranking.tabuladorMean, 56.25)

  if (report.technicalAuditoria.status === "ok") {
    const rows = illustrationsFor(report.technicalAuditoria.value.score, rules, report.rankings)
    const byBorda = new Map(rows.map((row) => [row.borda, row]))
    close(byBorda.get(0)?.isms ?? -1, 26.25)
    close(byBorda.get(56.25)?.isms ?? -1, 48.75)
    close(byBorda.get(100)?.isms ?? -1, 66.25)
    assert.equal(quadrantId(byBorda, 0), "I")
    assert.equal(quadrantId(byBorda, 56.25), "II")
    assert.equal(quadrantId(byBorda, 100), "III")
  }
})

test("una respuesta vacía detiene el score técnico", () => {
  const graf = readJson<{ questions: Question[] }>(join(content, "n2/artes-graficas.json")).questions
  const result = scoreTechnical(graf, {}, ["N2-GRAF-06"])
  assert.equal(result.status, "blocked")
  if (result.status === "blocked") assert.equal(result.failures[0]?.code, "empty_answer")
})

test("agroindustria y logística no tienen puntaje numérico", () => {
  for (const sectorId of ["agroindustria", "logistica"]) {
    const sector = readJson<{ questions: Question[] }>(join(content, `n2/${sectorId}.json`))
    const report = evaluateSession(sector.questions, {}, rules, sectorId)
    assert.equal(report.technicalAllNumeric.status, "blocked")
    if (report.technicalAllNumeric.status === "blocked") {
      assert.equal(report.technicalAllNumeric.failures[0]?.code, "no_numeric_questions")
    }
  }
})

test("No aplica de automotriz entra con el puntaje impreso", () => {
  const auto = readJson<{ questions: Question[] }>(join(content, "n2/automotriz.json")).questions
  const question = auto.find(
    (item): item is SingleQuestion =>
      item.type === "single_select" && item.options.some((option) => /no aplica/i.test(option.label)),
  )
  assert.ok(question)
  const option = question.options.find((item) => /no aplica/i.test(item.label))
  assert.equal(option?.score, 1)
  const result = scoreTechnical(auto, { [question.id]: { kind: "single", optionValue: option?.value ?? "" } }, [question.id])
  assert.equal(result.status, "ok")
  if (result.status === "ok") close(result.value.obtained, 1)
})

test("ISMS ilustrativo usa los pesos 0.60 y 0.40", () => {
  close(isms(43.75, 0, rules.ismsWeights), 26.25)
  assert.equal(rules.bordaAggregation, null)
  assert.equal(rules.technicalQuestionIds, null)
})
