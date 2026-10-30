// LocalStorage utilities para persistencia

import type { Answers } from './evaluation-calculator'

const STORAGE_KEYS = {
  ANSWERS: 'cluster_evaluation_answers',
  CURRENT_SECTION: 'cluster_evaluation_section',
  CURRENT_QUESTION: 'cluster_evaluation_question',
  COMPLETED: 'cluster_evaluation_completed',
  RESULTS: 'cluster_evaluation_results',
}

export function saveAnswers(answers: Answers): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers))
}

export function loadAnswers(): Answers {
  if (typeof window === 'undefined') return {}
  const stored = localStorage.getItem(STORAGE_KEYS.ANSWERS)
  if (!stored) return {}
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export function saveProgress(sectionIndex: number, questionIndex: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.CURRENT_SECTION, String(sectionIndex))
  localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION, String(questionIndex))
}

export function loadProgress(): { sectionIndex: number; questionIndex: number } {
  if (typeof window === 'undefined') return { sectionIndex: 0, questionIndex: 0 }
  const section = localStorage.getItem(STORAGE_KEYS.CURRENT_SECTION)
  const question = localStorage.getItem(STORAGE_KEYS.CURRENT_QUESTION)
  return {
    sectionIndex: section ? parseInt(section, 10) : 0,
    questionIndex: question ? parseInt(question, 10) : 0,
  }
}

export function saveCompleted(completed: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.COMPLETED, String(completed))
}

export function loadCompleted(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true'
}

export function saveResults(results: unknown): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results))
}

export function loadResults(): unknown {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEYS.RESULTS)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function clearAllStorage(): void {
  if (typeof window === 'undefined') return
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
}
