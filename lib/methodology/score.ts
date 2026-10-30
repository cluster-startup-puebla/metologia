import type {
  Answer,
  Answers,
  BordaVariant,
  Choice,
  LikertAnswer,
  MethodologyRules,
  QuadrantBand,
  Question,
  RankQuestion,
  ScoreFailure,
  ScoreResult,
  SingleQuestion,
  TechnicalScore,
} from "./types"

export function blocked<T>(failures: ScoreFailure[]): ScoreResult<T> {
  return { status: "blocked", failures }
}

export function isSingle(question: Question): question is SingleQuestion {
  return question.type === "single_select"
}

export function numericChoices(question: SingleQuestion): Choice[] {
  return question.options.filter((option) => typeof option.score === "number")
}

export function hasNumericScore(question: Question): question is SingleQuestion {
  return isSingle(question) && numericChoices(question).length > 0
}

export function maxNumericScore(question: SingleQuestion): number {
  return Math.max(...numericChoices(question).map((option) => option.score as number))
}

export function idsWithNumericScore(questions: Question[], blocks?: string[]): string[] {
  return questions
    .filter((question) => hasNumericScore(question))
    .filter((question) => (blocks ? blocks.includes(question.block) : true))
    .map((question) => question.id)
}

/**
 * Score_Tecnico = (sum of printed scores / sum of each question's max) * 100.
 * Stops when an answer is missing or the chosen option has no number.
 * The question set is an argument because the tabulador does not name it.
 */
export function scoreTechnical(
  questions: Question[],
  answers: Answers,
  questionIds: string[],
): ScoreResult<TechnicalScore> {
  if (questionIds.length === 0) {
    return blocked([{ code: "no_numeric_questions" }])
  }

  const failures: ScoreFailure[] = []
  let obtained = 0
  let maximum = 0

  for (const questionId of questionIds) {
    const question = questions.find((item) => item.id === questionId)
    if (!question) {
      failures.push({ code: "unknown_question", questionId })
      continue
    }
    if (!isSingle(question)) {
      failures.push({ code: "out_of_scope", questionId })
      continue
    }
    const scored = numericChoices(question)
    if (scored.length === 0) {
      failures.push({ code: "non_numeric_option", questionId })
      continue
    }
    const answer = answers[questionId]
    if (!answer) {
      failures.push({ code: "empty_answer", questionId })
      continue
    }
    if (answer.kind !== "single") {
      failures.push({ code: "out_of_scope", questionId })
      continue
    }
    const choice = question.options.find((option) => option.value === answer.optionValue)
    if (!choice) {
      failures.push({ code: "unknown_option", questionId })
      continue
    }
    if (typeof choice.score !== "number") {
      failures.push({ code: "non_numeric_option", questionId })
      continue
    }
    obtained += choice.score
    maximum += maxNumericScore(question)
  }

  if (failures.length > 0) return blocked(failures)
  if (maximum === 0) return blocked([{ code: "no_numeric_questions" }])

  return {
    status: "ok",
    value: {
      obtained,
      maximum,
      score: (obtained / maximum) * 100,
      questionCount: questionIds.length,
    },
  }
}

/**
 * Tabulador: ((N - rank + 1) / N) * 100
 * Reporte: ((N - rank + 1) / (N * (N + 1) / 2)) * 100
 * Rank 1 is maximum pain. The score is not inverted.
 */
export function bordaFactorScore(factorCount: number, rank: number, variant: BordaVariant): number {
  if (!Number.isInteger(factorCount) || factorCount < 1) {
    throw new RangeError("factorCount")
  }
  if (!Number.isInteger(rank) || rank < 1 || rank > factorCount) {
    throw new RangeError("rank")
  }
  const weight = factorCount - rank + 1
  const denominator = variant === "tabulador" ? factorCount : (factorCount * (factorCount + 1)) / 2
  return (weight / denominator) * 100
}

export function bordaRankingScores(
  question: RankQuestion,
  ranks: Record<string, number>,
  variant: BordaVariant,
): ScoreResult<{ factorId: string; rank: number; score: number }[]> {
  const failures: ScoreFailure[] = []
  const seen = new Set<number>()
  const rows: { factorId: string; rank: number; score: number }[] = []

  for (const factor of question.factors) {
    const rank = ranks[factor.id]
    if (rank == null) {
      failures.push({ code: "incomplete", questionId: question.id, detail: factor.id })
      continue
    }
    if (!Number.isInteger(rank) || rank < 1 || rank > question.factorCount || seen.has(rank)) {
      failures.push({ code: "out_of_scope", questionId: question.id, detail: factor.id })
      continue
    }
    seen.add(rank)
    rows.push({
      factorId: factor.id,
      rank,
      score: bordaFactorScore(question.factorCount, rank, variant),
    })
  }

  if (failures.length > 0) return blocked(failures)
  return { status: "ok", value: rows }
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function isms(technicalScore: number, bordaAggregate: number, weights: MethodologyRules["ismsWeights"]): number {
  return weights.technical * technicalScore + weights.borda * bordaAggregate
}

export function quadrantFromIsms(value: number, bands: QuadrantBand[]): ScoreResult<QuadrantBand> {
  if (!Number.isFinite(value)) {
    return blocked([{ code: "no_band", detail: String(value) }])
  }
  const match = bands.find((band) => value >= band.min && value <= band.max)
  if (!match) return blocked([{ code: "no_band", detail: String(value) }])
  return { status: "ok", value: match }
}

/** SEN = ((mean(EN1..EN6) - 1) / 6) * 100. Requires six integers from 1 to 7. */
export function senScore(values: number[]): ScoreResult<number> {
  if (values.length !== 6) {
    return blocked([{ code: "incomplete", detail: String(values.length) }])
  }
  if (values.some((value) => !Number.isInteger(value) || value < 1 || value > 7)) {
    return blocked([{ code: "invalid_likert" }])
  }
  const average = mean(values)
  return { status: "ok", value: ((average - 1) / 6) * 100 }
}

export function likertValues(questionIds: string[], answers: Answers): ScoreResult<number[]> {
  const failures: ScoreFailure[] = []
  const values: number[] = []
  for (const questionId of questionIds) {
    const answer: Answer | undefined = answers[questionId]
    if (!answer) {
      failures.push({ code: "empty_answer", questionId })
      continue
    }
    if (!isLikert(answer)) {
      failures.push({ code: "out_of_scope", questionId })
      continue
    }
    values.push(answer.value)
  }
  if (failures.length > 0) return blocked(failures)
  return { status: "ok", value: values }
}

function isLikert(answer: Answer): answer is LikertAnswer {
  return answer.kind === "likert"
}
