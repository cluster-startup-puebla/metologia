import type { Answers, Question, SingleQuestion } from "./types.ts"

function asSingle(question: Question | undefined, sourceId: string): SingleQuestion {
  if (!question || question.type !== "single_select") {
    throw new Error(`Falta la pregunta ${sourceId}`)
  }
  return question
}

function optionValue(question: SingleQuestion, labelPart: string): string {
  const match = question.options.find((option) => option.label.toLowerCase().includes(labelPart.toLowerCase()))
  if (!match) throw new Error(`${question.id} no tiene una opción con «${labelPart}»`)
  return match.value
}

/** Hypothetical fill from ENTENDIMIENTO section G. Not an official case. */
export function artesGraficasExample(questions: Question[]): Answers {
  const bySource = new Map(questions.map((question) => [question.sourceId, question]))
  const pick = (sourceId: string, labelPart: string) => {
    const question = asSingle(bySource.get(sourceId), sourceId)
    return { kind: "single" as const, optionValue: optionValue(question, labelPart) }
  }

  const answers: Answers = {
    "N1-02": { kind: "single", optionValue: "artes-graficas" },
    "N1-11": { kind: "likert", value: 2 },
    "N1-12": { kind: "likert", value: 3 },
    "N1-13": { kind: "likert", value: 3 },
    "N1-14": { kind: "likert", value: 4 },
    "N1-15": { kind: "likert", value: 2 },
    "N1-16": { kind: "likert", value: 5 },
    "N2-GRAF-06": pick("AG-TECH-01", "densitométrica básica"),
    "N2-GRAF-07": pick("AG-TECH-02", "térmico"),
    "N2-GRAF-08": pick("AG-TECH-03", "copia de muestras"),
    "N2-GRAF-09": pick("AG-TECH-04", "bajo pedido"),
    "N2-GRAF-10": pick("CP-AG-01", "farmacéutica"),
    "N2-GRAF-11": pick("CP-AG-02", "falsificación"),
    "N2-GRAF-12": pick("CP-AG-03", "cadena de custodia"),
    "N2-GRAF-13": pick("COL-AG01", "pay-per-use"),
    "N2-GRAF-14": pick("COL-AG02", "bolsa regional"),
    "N2-GRAF-15": pick("COL-AG03", "compras individuales"),
  }

  const ranking = questions.find((question) => question.sourceId === "R00-GRAF-PROD")
  if (!ranking || ranking.type !== "rank") throw new Error("Falta R00-GRAF-PROD")
  const ranks: Record<string, number> = {}
  ranking.factors.forEach((factor, index) => {
    ranks[factor.id] = index + 1
  })
  answers[ranking.id] = { kind: "rank", ranks, costMxn: null }
  return answers
}
