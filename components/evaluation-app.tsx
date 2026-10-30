'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ClusterLogo, SecihtiLogo } from '@/components/logos'
import { ProgressBar } from '@/components/progress-bar'
import { SectionIndicator } from '@/components/section-indicator'
import { QuestionCard } from '@/components/question-card'
import { WelcomeScreen } from '@/components/welcome-screen'
import { ResultsScreen } from '@/components/results-screen'
import { SECTIONS, TOTAL_QUESTIONS } from '@/lib/evaluation-data'
import {
  calculateIntegralResult,
  type Answers,
  type IntegralResult,
} from '@/lib/evaluation-calculator'
import {
  saveAnswers,
  loadAnswers,
  saveProgress,
  loadProgress,
  saveCompleted,
  loadCompleted,
  saveResults,
  loadResults,
  clearAllStorage,
} from '@/lib/storage'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { getOrCreateDeviceId } from '@/lib/device-id'
import { saveResponse, saveResult } from '@/lib/supabase-responses'

type AppScreen = 'welcome' | 'questions' | 'results'

export function EvaluationApp() {
  const [screen, setScreen] = useState<AppScreen>('welcome')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [results, setResults] = useState<IntegralResult | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [deviceId, setDeviceId] = useState<string>('')

  // Cargar estado desde localStorage
  useEffect(() => {
    // Inicializar device ID
    const id = getOrCreateDeviceId()
    setDeviceId(id)
    
    const completed = loadCompleted()
    if (completed) {
      const savedResults = loadResults() as IntegralResult | null
      if (savedResults) {
        setResults(savedResults)
        setScreen('results')
      }
    } else {
      const savedAnswers = loadAnswers()
      const { sectionIndex: savedSection, questionIndex: savedQuestion } = loadProgress()
      
      if (Object.keys(savedAnswers).length > 0) {
        setAnswers(savedAnswers)
        setSectionIndex(savedSection)
        setQuestionIndex(savedQuestion)
        setScreen('questions')
      }
    }
    setIsLoaded(true)
  }, [])

  // Guardar respuestas cuando cambian
  useEffect(() => {
    if (isLoaded && Object.keys(answers).length > 0) {
      saveAnswers(answers)
    }
  }, [answers, isLoaded])

  // Guardar progreso
  useEffect(() => {
    if (isLoaded && screen === 'questions') {
      saveProgress(sectionIndex, questionIndex)
    }
  }, [sectionIndex, questionIndex, screen, isLoaded])

  const currentSection = SECTIONS[sectionIndex]
  const currentQuestion = currentSection?.questions[questionIndex]
  
  // Calcular pregunta global
  const globalQuestionIndex = SECTIONS.slice(0, sectionIndex).reduce(
    (acc, s) => acc + s.questions.length,
    0
  ) + questionIndex

  const handleStart = useCallback(() => {
    setScreen('questions')
  }, [])

  const handleAnswer = useCallback((answer: string | Record<string, number>) => {
    if (!currentQuestion) return
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }))
  }, [currentQuestion])

  const isAnswerComplete = useCallback(() => {
    if (!currentQuestion) return false
    const answer = answers[currentQuestion.id]
    if (answer === undefined) return false
    
    if (currentQuestion.type === 'priority') {
      const rankings = answer as Record<string, number>
      return Object.keys(rankings).length === 4
    }
    
    return true
  }, [currentQuestion, answers])

  const handleNext = useCallback(() => {
    if (!isAnswerComplete()) return

    // Guardar la respuesta confirmada en Supabase
    if (deviceId && currentQuestion) {
      const confirmedAnswer = answers[currentQuestion.id]
      saveResponse({
        device_id: deviceId,
        question_id: currentQuestion.id,
        section_id: currentSection.id,
        answer_value: confirmedAnswer,
      })
    }

    const isLastQuestionInSection = questionIndex === currentSection.questions.length - 1
    const isLastSection = sectionIndex === SECTIONS.length - 1

    if (isLastQuestionInSection && isLastSection) {
      // Calcular resultados
      const calculatedResults = calculateIntegralResult(answers)
      setResults(calculatedResults)
      saveResults(calculatedResults)
      saveCompleted(true)
      
      // Guardar resultado final en Supabase
      if (deviceId) {
        saveResult({
          device_id: deviceId,
          total_score: calculatedResults.totalScore,
          section_scores: calculatedResults.sections,
          maturity_level: calculatedResults.category
        })
      }
      
      // Enviar al endpoint (placeholder)
      submitResults(answers, calculatedResults)
      
      setScreen('results')
    } else if (isLastQuestionInSection) {
      setSectionIndex((prev) => prev + 1)
      setQuestionIndex(0)
    } else {
      setQuestionIndex((prev) => prev + 1)
    }
  }, [isAnswerComplete, questionIndex, sectionIndex, currentSection, currentQuestion, answers, deviceId])

  const handlePrevious = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1)
    } else if (sectionIndex > 0) {
      const prevSection = SECTIONS[sectionIndex - 1]
      setSectionIndex((prev) => prev - 1)
      setQuestionIndex(prevSection.questions.length - 1)
    }
  }, [questionIndex, sectionIndex])

  const handleRestart = useCallback(() => {
    clearAllStorage()
    setAnswers({})
    setSectionIndex(0)
    setQuestionIndex(0)
    setResults(null)
    setScreen('welcome')
  }, [])

  // Placeholder para envío de resultados
  const submitResults = async (answersData: Answers, resultsData: IntegralResult) => {
    try {
      await fetch('/api/submit-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answersData,
          results: resultsData,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.log('Error submitting results (placeholder):', error)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin" style={{ borderTopColor: '#FF1493' }} />
      </div>
    )
  }

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />
  }

  if (screen === 'results' && results) {
    return <ResultsScreen results={results} deviceId={deviceId} />
  }

  const canGoPrevious = sectionIndex > 0 || questionIndex > 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <ClusterLogo className="h-7 md:h-8 text-foreground" />
          <SecihtiLogo className="h-10 md:h-12" />
        </div>

        {/* Progress Bar */}
        <ProgressBar
          current={globalQuestionIndex + 1}
          total={TOTAL_QUESTIONS}
          color={currentSection.color}
        />

        {/* Section Indicator */}
        <div className="flex items-center justify-between">
          <SectionIndicator currentSectionIndex={sectionIndex} />
          <span className="text-sm text-muted-foreground">
            {globalQuestionIndex + 1}/{TOTAL_QUESTIONS}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 md:px-6 pb-4">
        {/* Section Title */}
        <motion.div
          className="mb-6"
          key={currentSection.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {currentSection.title}
          </h1>
          <p className="text-lg" style={{ color: currentSection.color }}>
            {currentSection.subtitle}
          </p>
        </motion.div>

        {/* Question */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion?.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  answer={answers[currentQuestion.id]}
                  onAnswer={handleAnswer}
                  color={currentSection.color}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* Footer Navigation */}
      <footer className="flex-shrink-0 p-4 md:p-6 border-t border-border">
        <div className="flex gap-3">
          {canGoPrevious && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 py-6 rounded-2xl"
            >
              <ChevronUp className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!isAnswerComplete()}
            className="flex-1 py-6 rounded-2xl text-white disabled:opacity-50"
            style={{ backgroundColor: currentSection.color }}
          >
            {sectionIndex === SECTIONS.length - 1 &&
            questionIndex === currentSection.questions.length - 1
              ? 'Ver resultados'
              : 'Continuar'}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
