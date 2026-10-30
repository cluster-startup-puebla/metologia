import type { Answer, Question } from "./types.ts"

export function isAnswerComplete(question: Question, answer: Answer | undefined): boolean {
  if (!answer) return false
  if (question.type === "single_select") return answer.kind === "single"
  if (question.type === "likert_7") return answer.kind === "likert" && Number.isInteger(answer.value)
  if (question.type !== "rank" || answer.kind !== "rank") return false
  const ranks = question.factors.map((factor) => answer.ranks[factor.id])
  if (ranks.some((rank) => rank == null)) return false
  const unique = new Set(ranks)
  return unique.size === question.factorCount && [...unique].every((rank) => rank >= 1 && rank <= question.factorCount)
}
