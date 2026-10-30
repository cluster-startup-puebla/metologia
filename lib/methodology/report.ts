import {
  blocked,
  bordaRankingScores,
  idsWithNumericScore,
  isms,
  likertValues,
  mean,
  quadrantFromIsms,
  scoreTechnical,
  senScore,
} from "./score.ts"
import type {
  Answers,
  MethodologyRules,
  QuadrantBand,
  Question,
  RankQuestion,
  ScoreResult,
  TechnicalScore,
} from "./types"

export interface Illustration {
  label: string
  borda: number
  isms: number
  quadrant: ScoreResult<QuadrantBand>
}

export interface RankingReport {
  questionId: string
  sourceId: string
  title: string
  factorCount: number
  tabulador: ScoreResult<{ factorId: string; label: string; rank: number; score: number }[]>
  reporte: ScoreResult<{ factorId: string; label: string; rank: number; score: number }[]>
  tabuladorMean: number | null
}

export interface EvaluationReport {
  sectorId: string | null
  sen: ScoreResult<number>
  technicalAuditoria: ScoreResult<TechnicalScore>
  technicalAxes: ScoreResult<TechnicalScore>
  technicalAllNumeric: ScoreResult<TechnicalScore>
  rankings: RankingReport[]
  isms: {
    status: "undefined"
    reason: "borda_aggregation_not_defined"
    formula: string
  }
}

const AUDIT_BLOCK = "auditoria_tecnica"
const AXIS_BLOCKS = ["auditoria_tecnica", "complejidad"]

export function evaluateSession(
  questions: Question[],
  answers: Answers,
  rules: MethodologyRules,
  sectorId: string | null,
): EvaluationReport {
  const sectorQuestions = questions.filter((question) => question.level === "n2" && question.sectorId === sectorId)
  const likert = likertValues(rules.senQuestionIds, answers)
  const sen = likert.status === "ok" ? senScore(likert.value) : blocked<number>(likert.failures)

  return {
    sectorId,
    sen,
    technicalAuditoria: scoreTechnical(sectorQuestions, answers, idsWithNumericScore(sectorQuestions, [AUDIT_BLOCK])),
    technicalAxes: scoreTechnical(sectorQuestions, answers, idsWithNumericScore(sectorQuestions, AXIS_BLOCKS)),
    technicalAllNumeric: scoreTechnical(sectorQuestions, answers, idsWithNumericScore(sectorQuestions)),
    rankings: sectorQuestions.filter(isRank).map((question) => rankReport(question, answers)),
    isms: {
      status: "undefined",
      reason: "borda_aggregation_not_defined",
      formula: `ISMS = ${rules.ismsWeights.technical} × Score_Tecnico + ${rules.ismsWeights.borda} × Borda_Score`,
    },
  }
}

export function illustrationsFor(
  technicalScore: number,
  rules: MethodologyRules,
  rankings: RankingReport[],
): Illustration[] {
  const standIns: { label: string; borda: number }[] = [
    { label: "Si el Borda agregado valiera 0", borda: 0 },
    { label: "Si el Borda agregado fuera el rango 1 del tabulador (siempre 100)", borda: 100 },
  ]
  for (const ranking of rankings) {
    if (ranking.tabuladorMean == null) continue
    standIns.push({
      label: `Media constante del tabulador en ${ranking.sourceId} (N=${ranking.factorCount}). No cambia con el orden.`,
      borda: ranking.tabuladorMean,
    })
  }
  return standIns.map((standIn) => {
    const value = isms(technicalScore, standIn.borda, rules.ismsWeights)
    return {
      label: standIn.label,
      borda: standIn.borda,
      isms: value,
      quadrant: quadrantFromIsms(value, rules.quadrants),
    }
  })
}

function isRank(question: Question): question is RankQuestion {
  return question.type === "rank"
}

function rankReport(question: RankQuestion, answers: Answers): RankingReport {
  const answer = answers[question.id]
  const ranks = answer?.kind === "rank" ? answer.ranks : {}
  const tabulador = withLabels(question, bordaRankingScores(question, ranks, "tabulador"))
  const reporte = withLabels(question, bordaRankingScores(question, ranks, "reporte"))
  return {
    questionId: question.id,
    sourceId: question.sourceId,
    title: question.title,
    factorCount: question.factorCount,
    tabulador,
    reporte,
    tabuladorMean: tabulador.status === "ok" ? mean(tabulador.value.map((row) => row.score)) : null,
  }
}

function withLabels(
  question: RankQuestion,
  result: ScoreResult<{ factorId: string; rank: number; score: number }[]>,
): ScoreResult<{ factorId: string; label: string; rank: number; score: number }[]> {
  if (result.status === "blocked") return result
  return {
    status: "ok",
    value: result.value.map((row) => ({
      ...row,
      label: question.factors.find((factor) => factor.id === row.factorId)?.label ?? row.factorId,
    })),
  }
}

export function sectorIdFromAnswers(answers: Answers): string | null {
  const answer = answers["N1-02"]
  if (!answer || answer.kind !== "single") return null
  return answer.optionValue
}
