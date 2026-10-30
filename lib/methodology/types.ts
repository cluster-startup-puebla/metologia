export type OptionScore = number | null

export interface Choice {
  value: string
  label: string
  score: OptionScore
}

export interface QuestionBase {
  id: string
  sourceId: string
  level: "n1" | "n2"
  sectorId: string | null
  block: string
  indexId: string | null
  section: string
  title: string
  prompt: string
  note: string | null
}

export interface SingleQuestion extends QuestionBase {
  type: "single_select"
  sourceType: string
  options: Choice[]
}

export interface LikertQuestion extends QuestionBase {
  type: "likert_7"
  min: 1
  max: 7
  minLabel: string
  maxLabel: string
  scaleTo100: string | null
}

export interface RankQuestion extends QuestionBase {
  type: "rank"
  sourceType: string
  factorCount: number
  rankDirection: "1_is_max_pain"
  factors: { id: string; label: string }[]
  costCapture: { unit: "MXN"; entersScore: false }
}

export type Question = SingleQuestion | LikertQuestion | RankQuestion

export type SingleAnswer = { kind: "single"; optionValue: string }
export type LikertAnswer = { kind: "likert"; value: number }
export type RankAnswer = {
  kind: "rank"
  ranks: Record<string, number>
  costMxn: number | null
}
export type Answer = SingleAnswer | LikertAnswer | RankAnswer
export type Answers = Record<string, Answer>

export interface QuadrantBand {
  id: string
  min: number
  max: number
  label: string
}

export interface MethodologyRules {
  ismsWeights: { technical: number; borda: number }
  bordaActive: null
  bordaAggregation: null
  technicalQuestionIds: null
  senQuestionIds: string[]
  quadrants: QuadrantBand[]
}

export type BordaVariant = "tabulador" | "reporte"

export type ScoreFailureCode =
  | "empty_answer"
  | "non_numeric_option"
  | "unknown_option"
  | "unknown_question"
  | "no_numeric_questions"
  | "out_of_scope"
  | "incomplete"
  | "invalid_likert"
  | "no_band"

export interface ScoreFailure {
  code: ScoreFailureCode
  questionId?: string
  detail?: string
}

export type ScoreResult<T> =
  | { status: "ok"; value: T }
  | { status: "blocked"; failures: ScoreFailure[] }

export interface TechnicalScore {
  obtained: number
  maximum: number
  score: number
  questionCount: number
}
