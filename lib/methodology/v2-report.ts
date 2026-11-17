import { techItemScore } from "./v2-score.ts"
import type { V2Answer, V2Answers, V2Question } from "./v2-types.ts"

export interface V2Friction {
  title: string
  items: string[]
}

export interface V2NamedChoice {
  title: string
  label: string
}

export interface V2Report {
  profile: V2NamedChoice[]
  frictions: V2Friction[]
  gapZone: string | null
  underuse: { used: number; idle: number; adornment: boolean } | null
  frontier: { score: number; delta: number; behind: boolean } | null
  control: { label: string; score: number } | null
  traceability: { label: string; score: number } | null
  sophistication: V2NamedChoice[]
  clubs: V2NamedChoice[]
  demand: string | null
  signals: string[]
}

const PROFILE = [
  ["MOD0-WEB-02", "Tamaño"],
  ["MOD0-WEB-03", "Dónde opera"],
  ["MOD0-WEB-05", "A quién le vende"],
] as const

function whole(value: number): string {
  return Math.abs(value - Math.round(value)) < 0.05 ? String(Math.round(value)) : value.toFixed(2)
}

/** Five bands: 0–39, 40–59, 60–79, 80–99, 100. */
export function useReading(used: number): { title: string; body: string } {
  const idle = Math.round((100 - used) * 100) / 100
  const have = whole(used)
  const left = whole(idle)
  if (used >= 100) {
    return {
      title: "Tecnología a tu disposición",
      body: "Felicidades, aprovechas el 100% de la tecnología a tu disposición.",
    }
  }
  if (used >= 80) {
    return {
      title: "Tecnología a tu disposición",
      body: `Aprovechas el ${have}%. Estás cerca de sacarle todo el provecho a lo que ya tienes.`,
    }
  }
  if (used >= 60) {
    return {
      title: "Tecnología a tu disposición",
      body: `Aprovechas el ${have}%. Queda ${left}% sin usar. Hay margen para capacitar antes de comprar más.`,
    }
  }
  if (used >= 40) {
    return {
      title: "Tecnología a tu disposición",
      body: `Aprovechas el ${have}%. Queda ${left}% sin usar. Más de 40 sin usar: parte de la tecnología está de adorno y toca capacitar a quien ya la tiene.`,
    }
  }
  return {
    title: "Tecnología a tu disposición",
    body: `Aprovechas solo el ${have}%. La mayor parte no se usa. Capacita a quien ya la tiene antes de comprar otra.`,
  }
}

/** Same five bands. The score is what they have; 100 is the leaders' ceiling. */
export function frontierReading(score: number): { title: string; body: string } {
  const have = whole(score)
  const gap = whole(Math.round((100 - score) * 100) / 100)
  if (score >= 100) {
    return { title: "Frente a los líderes", body: "Tienes 100. Ya estás en el techo de los líderes de tu sector." }
  }
  if (score >= 80) {
    return {
      title: "Frente a los líderes",
      body: `Tienes ${have}. El techo es 100. Estás cerca de lo que ya usan los líderes.`,
    }
  }
  if (score >= 60) {
    return {
      title: "Frente a los líderes",
      body: `Tienes ${have}. El techo es 100. La distancia es de ${gap}, todavía sin ser crítica.`,
    }
  }
  if (score >= 50) {
    return {
      title: "Frente a los líderes",
      body: `Tienes ${have}. El techo es 100. La distancia es de ${gap}, justo en el límite.`,
    }
  }
  return {
    title: "Frente a los líderes",
    body: `Tienes ${have}. El techo es 100. La distancia es de ${gap} y pasa de 50: estás lejos y hay riesgo de quedarse atrás.`,
  }
}

export function gapZone(ib: number): string {
  if (ib > 10) return "Falsa complacencia"
  if (ib < -10) return "Cautela"
  return "Alineado"
}

function choiceLabel(question: V2Question, answer: V2Answer | undefined): string | null {
  if (!answer || answer.kind === "rank" || answer.kind === "checks") return null
  const option = question.options?.find((item) => item.value === answer.optionValue)
  if (!option) return null
  if (answer.kind === "text" && question.text?.optionValue === option.value && answer.text.trim()) return answer.text.trim()
  return option.label
}

function topRanks(question: V2Question, answer: V2Answer | undefined, count: number): string[] {
  if (!question.factors || answer?.kind !== "rank") return []
  return Object.entries(answer.ranks)
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([id]) => question.factors?.find((factor) => factor.id === id)?.label)
    .filter((label): label is string => Boolean(label))
}

function frictionTitle(question: V2Question): string {
  const place = question.level === "n1" ? "en la región" : "en tu planta"
  if (question.id.includes("PROD")) return question.level === "n1" ? "Lo que más traba afuera" : "Lo que más traba en la planta"
  if (question.id.includes("MAT")) return `Lo que más encarece los insumos ${place}`
  if (question.id.includes("SERV")) return `El servicio que más falta ${place}`
  return "Fricciones"
}

function tech(questions: V2Question[], slot: number): V2Question | undefined {
  return questions.find((question) => question.id.endsWith(`TECH-0${slot}`) || question.id === `TECH-0${slot}`)
}

function titled(questions: V2Question[], answers: V2Answers, pattern: RegExp, titles: string[]): V2NamedChoice[] {
  return questions
    .filter((question) => pattern.test(question.id))
    .flatMap((question) => {
      const label = choiceLabel(question, answers[question.id])
      const slot = Number(question.id.match(/(\d+)$/)?.[1] ?? 0)
      if (!label) return []
      return [{ title: titles[slot - 1] ?? question.prompt, label }]
    })
}

export function buildReport(questions: V2Question[], answers: V2Answers, ib: number | null): V2Report {
  const profile = PROFILE.flatMap(([id, title]) => {
    const question = questions.find((item) => item.id === id)
    const label = question ? choiceLabel(question, answers[id]) : null
    return label ? [{ title, label }] : []
  })

  const frictions = questions
    .filter((question) => question.type === "rank")
    .map((question) => ({ title: frictionTitle(question), items: topRanks(question, answers[question.id], 3) }))
    .filter((group) => group.items.length > 0)

  const underuseQuestion = tech(questions, 2)
  const underuseScore = underuseQuestion ? techItemScore(underuseQuestion, answers[underuseQuestion.id]) : null
  const underuse = underuseScore === null ? null : { used: underuseScore, idle: Math.round((100 - underuseScore) * 100) / 100, adornment: 100 - underuseScore > 40 }

  const frontierQuestion = tech(questions, 3)
  const frontierScore = frontierQuestion ? techItemScore(frontierQuestion, answers[frontierQuestion.id]) : null
  const frontier = frontierScore === null ? null : { score: frontierScore, delta: Math.round((100 - frontierScore) * 100) / 100, behind: 100 - frontierScore > 50 }

  const controlQuestion = tech(questions, 6)
  const controlScore = controlQuestion ? techItemScore(controlQuestion, answers[controlQuestion.id]) : null
  const controlLabel = controlQuestion ? choiceLabel(controlQuestion, answers[controlQuestion.id]) : null
  const control = controlScore !== null && controlLabel ? { label: controlLabel, score: controlScore } : null

  const traceQuestion = tech(questions, 7)
  const traceScore = traceQuestion ? techItemScore(traceQuestion, answers[traceQuestion.id]) : null
  const traceLabel = traceQuestion ? choiceLabel(traceQuestion, answers[traceQuestion.id]) : null
  const traceability = traceScore !== null && traceLabel ? { label: traceLabel, score: traceScore } : null

  const demandQuestion = tech(questions, 5)
  const demand = demandQuestion ? choiceLabel(demandQuestion, answers[demandQuestion.id]) : null

  const signals = [
    underuse?.adornment ? "Capacitar a quien ya tiene el sistema, antes de comprar otro. El subuso pasa de 40." : null,
    frontier?.behind ? "Acercarse a la tecnología que ya usan los líderes del sector. La distancia pasa de 50." : null,
    control && control.score <= 50 ? "Ordenar el control de la operación: hoy se lleva a mano o en hojas sueltas." : null,
    traceability && traceability.score <= 50 ? "Pasar el rastro de papel a un registro que se pueda consultar." : null,
  ].filter((item): item is string => Boolean(item))

  return {
    profile,
    frictions,
    gapZone: ib === null ? null : gapZone(ib),
    underuse,
    frontier,
    control,
    traceability,
    sophistication: titled(questions, answers, /^CP-/, [
      "A qué te puedes reconvertir pronto",
      "Qué parte de la venta está en riesgo",
      "Qué tan sostenible se ve",
    ]),
    clubs: titled(questions, answers, /^COL-/, [
      "Compartir un centro o laboratorio",
      "Compartir un proceso que hoy se manda fuera",
      "Comprar junto con otras empresas",
    ]),
    demand,
    signals,
  }
}
