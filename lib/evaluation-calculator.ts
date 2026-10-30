// Calculadora de resultados - Lógica de negocio

import {
  ANSWER_POINTS,
  PRIORITY_SEVERITY,
  SECTION_RANGES,
  INTEGRAL_RANGES,
  SECTION_PROFILES,
  INTEGRAL_PROFILES,
  SECTIONS,
} from './evaluation-data'

export type Answers = Record<number, string | Record<string, number>>

export interface SectionResult {
  sectionId: string
  sectionName: string
  score: number
  maxScore: number
  category: string
  riesgo: string
  reto: string
  color: string
}

export interface IntegralResult {
  sections: SectionResult[]
  totalScore: number
  maxScore: number
  category: string
  riesgo: string
  reto: string
}

function scoreAnswer(answer: string): number {
  const key = answer.trim().toLowerCase()
  return ANSWER_POINTS[key] ?? 0
}

function scorePriorityRanking(rankings: Record<string, number>): number {
  const topConcern = Object.entries(rankings).find(([, v]) => v === 1)?.[0]
  if (!topConcern) return 0
  return PRIORITY_SEVERITY[topConcern] ?? 0
}

function scoreQuestion(questionId: number, answer: string | Record<string, number>): number {
  if (questionId === 16 && typeof answer === 'object') {
    return scorePriorityRanking(answer)
  }
  if (typeof answer === 'string') {
    return scoreAnswer(answer)
  }
  return 0
}

function categorizeScore(score: number, ranges: [number, number, string][]): string {
  for (const [low, high, category] of ranges) {
    if (score >= low && score <= high) {
      return category
    }
  }
  return 'Sin categoría'
}

function getSectionMaxScore(sectionId: string): number {
  const section = SECTIONS.find((s) => s.id === sectionId)
  if (!section) return 0
  return section.questions.length * 6
}

export function calculateSectionResult(sectionId: string, answers: Answers): SectionResult {
  const section = SECTIONS.find((s) => s.id === sectionId)
  if (!section) {
    return {
      sectionId,
      sectionName: 'Desconocido',
      score: 0,
      maxScore: 0,
      category: 'Sin categoría',
      riesgo: '',
      reto: '',
      color: '#FF1493',
    }
  }

  const score = section.questions.reduce((acc, q) => {
    const answer = answers[q.id]
    if (answer !== undefined) {
      return acc + scoreQuestion(q.id, answer)
    }
    return acc
  }, 0)

  const maxScore = getSectionMaxScore(sectionId)
  const ranges = SECTION_RANGES[sectionId] ?? []
  const category = categorizeScore(score, ranges)
  const profile = SECTION_PROFILES[`${sectionId}-${category}`] ?? { riesgo: '', reto: '' }

  return {
    sectionId,
    sectionName: section.name,
    score,
    maxScore,
    category,
    riesgo: profile.riesgo,
    reto: profile.reto,
    color: section.color,
  }
}

export function calculateIntegralResult(answers: Answers): IntegralResult {
  const sections = SECTIONS.map((s) => calculateSectionResult(s.id, answers))
  const totalScore = sections.reduce((acc, s) => acc + s.score, 0)
  const maxScore = 108
  const category = categorizeScore(totalScore, INTEGRAL_RANGES)
  const profile = INTEGRAL_PROFILES[category] ?? { riesgo: '', reto: '' }

  return {
    sections,
    totalScore,
    maxScore,
    category,
    riesgo: profile.riesgo,
    reto: profile.reto,
  }
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'Bronce':
      return '🥉'
    case 'Plata':
      return '🥈'
    case 'Oro':
      return '🥇'
    default:
      return '📊'
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Bronce':
      return '#CD7F32'
    case 'Plata':
      return '#C0C0C0'
    case 'Oro':
      return '#FFD700'
    default:
      return '#888888'
  }
}
