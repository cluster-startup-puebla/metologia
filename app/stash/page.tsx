'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { ClusterLogo, SecihtiLogo } from '@/components/logos'
import { SECTIONS, SECTION_PROFILES, SECTION_RANGES } from '@/lib/evaluation-data'
import { getResponseStats, subscribeToResponses, subscribeToResults } from '@/lib/supabase-responses'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, CheckCircle2, BarChart3, TrendingUp, RefreshCw, QrCode, X, AlertTriangle, Target } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'

interface SectionScore {
  sectionId: string
  score: number
  maxScore: number
  category: string
}

interface Stats {
  uniqueParticipants: number
  responses: Array<{
    device_id: string
    question_id: string
    section_id: string
    answer_value: string | Record<string, number>
  }>
  results: Array<{
    device_id: string
    total_score: number
    section_scores: SectionScore[]
    maturity_level: string
  }>
}

// Determina el nivel de madurez de una sección según el score numérico
function getSectionLevel(sectionId: string, score: number): string {
  const ranges = SECTION_RANGES[sectionId]
  if (!ranges) return 'Bronce'
  for (const [min, max, level] of ranges) {
    if (score >= min && score <= max) return level
  }
  return score < ranges[0][0] ? 'Bronce' : 'Oro'
}

export default function StashPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState(['', '', '', ''])
  const [pinError, setPinError] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(false)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    const data = await getResponseStats()
    setStats(data)
    setLastUpdate(new Date())
    setIsLoading(false)
  }, [])

  // Verificar PIN
  const verifyPin = useCallback(() => {
    const enteredPin = pin.join('')
    const correctPin = process.env.NEXT_PUBLIC_STASH_PIN || '4512'
    
    if (enteredPin === correctPin) {
      setIsAuthenticated(true)
      setPinError(false)
    } else {
      setPinError(true)
      setPin(['', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }, [pin])

  // Auto-verificar cuando se completan 4 dígitos
  useEffect(() => {
    if (pin.every(d => d !== '')) {
      verifyPin()
    }
  }, [pin, verifyPin])

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    
    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    setPinError(false)
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return
    
    fetchStats()

    // Suscribirse a cambios en tiempo real
    const unsubResponses = subscribeToResponses(() => {
      fetchStats()
    })
    const unsubResults = subscribeToResults(() => {
      fetchStats()
    })

    return () => {
      unsubResponses()
      unsubResults()
    }
  }, [isAuthenticated, fetchStats])

  // Polling cada 60 segundos cuando autoRefresh está activo
  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return
    const interval = setInterval(fetchStats, 60_000)
    return () => clearInterval(interval)
  }, [isAuthenticated, autoRefresh, fetchStats])

  // Calcular estadísticas derivadas
  const derivedStats = useMemo(() => {
    if (!stats) return null

    // IDs de dispositivos que completaron la evaluación
    const completedDeviceIds = new Set(stats.results.map(r => r.device_id))

    // Distribución de niveles de madurez
    const maturityDistribution: Record<string, number> = {}
    stats.results.forEach(r => {
      maturityDistribution[r.maturity_level] = (maturityDistribution[r.maturity_level] || 0) + 1
    })

    // Promedio de scores por sección (solo evaluaciones completadas)
    const sectionScoreSums: Record<string, number> = {}
    const sectionCounts: Record<string, number> = {}
    stats.results.forEach(r => {
      const sections = Array.isArray(r.section_scores) ? r.section_scores : []
      sections.forEach(sec => {
        const sid = sec.sectionId
        if (!sectionScoreSums[sid]) { sectionScoreSums[sid] = 0; sectionCounts[sid] = 0 }
        sectionScoreSums[sid] += sec.score
        sectionCounts[sid]++
      })
    })
    const sectionAverages: Record<string, number> = {}
    Object.keys(sectionScoreSums).forEach(key => {
      sectionAverages[key] = sectionScoreSums[key] / (sectionCounts[key] || 1)
    })

    // Completación rate
    const completionRate = stats.uniqueParticipants > 0
      ? (stats.results.length / stats.uniqueParticipants) * 100
      : 0

    // Respuestas deduplicadas por device_id+question (solo participantes que completaron)
    // Nos quedamos con la última respuesta de cada device por pregunta
    const lastResponseByDeviceQuestion = new Map<string, typeof stats.responses[0]>()
    stats.responses.forEach(r => {
      if (!completedDeviceIds.has(r.device_id)) return
      const key = `${r.device_id}:${r.question_id}`
      lastResponseByDeviceQuestion.set(key, r)
    })
    const cleanResponses = Array.from(lastResponseByDeviceQuestion.values())

    // Distribución de respuestas por pregunta (deduplicadas)
    const answerDistribution: Record<string, Record<string, number>> = {}
    cleanResponses.forEach(r => {
      const qid = String(r.question_id)
      if (!answerDistribution[qid]) answerDistribution[qid] = {}
      const val = r.answer_value
      if (typeof val === 'string') {
        answerDistribution[qid][val] = (answerDistribution[qid][val] || 0) + 1
      }
    })

    // Barreras de modernización (pregunta 13) — deduplicadas
    const barriersDist = answerDistribution['13'] ?? {}
    const barriersTotal = Object.values(barriersDist).reduce((a, b) => a + b, 0)
    const barriers = [
      { key: 'a', label: 'Resistencia al cambio', color: '#FF1493' },
      { key: 'b', label: 'Presupuesto / Costo', color: '#FF8C00' },
      { key: 'c', label: 'Complejidad técnica', color: '#9370DB' },
      { key: 'd', label: 'Malas experiencias previas', color: '#00CED1' },
    ].map(b => ({
      ...b,
      count: barriersDist[b.key] ?? 0,
      pct: barriersTotal > 0 ? ((barriersDist[b.key] ?? 0) / barriersTotal) * 100 : 0,
    })).sort((a, b) => b.count - a.count)

    // Q16: Causas de paros no programados — ranking agregado
    // Peso inverso: rank 1 = 4 pts, rank 2 = 3 pts, rank 3 = 2 pts, rank 4 = 1 pt
    const stopCausePoints: Record<string, number> = {}
    const stopCauseCount: Record<string, number> = {}
    cleanResponses.forEach(r => {
      if (String(r.question_id) !== '16') return
      const rankings = r.answer_value as Record<string, number>
      if (typeof rankings !== 'object' || Array.isArray(rankings)) return
      Object.entries(rankings).forEach(([cause, rank]) => {
        if (!stopCausePoints[cause]) { stopCausePoints[cause] = 0; stopCauseCount[cause] = 0 }
        stopCausePoints[cause] += (5 - rank) // rank 1 → 4 pts, rank 4 → 1 pt
        stopCauseCount[cause]++
      })
    })
    const stopCauseMeta: Record<string, { label: string; color: string }> = {
      falta_materiales: { label: 'Falta de materiales', color: '#FF1493' },
      fallas_mecanicas: { label: 'Fallas mecánicas', color: '#FF6B35' },
      personal:         { label: 'Personal', color: '#9B59B6' },
      set_ups_lentos:   { label: 'Set-ups lentos', color: '#00CED1' },
    }
    const totalStopPoints = Object.values(stopCausePoints).reduce((a, b) => a + b, 0)
    const stopCauses = Object.entries(stopCausePoints)
      .map(([key, pts]) => ({
        key,
        ...stopCauseMeta[key],
        points: pts,
        pct: totalStopPoints > 0 ? (pts / totalStopPoints) * 100 : 0,
        respondents: stopCauseCount[key] ?? 0,
      }))
      .sort((a, b) => b.points - a.points)

    return {
      maturityDistribution,
      sectionAverages,
      completionRate,
      answerDistribution,
      barriers,
      barriersTotal,
      stopCauses,
      cleanResponseCount: cleanResponses.length,
    }
  }, [stats])

  const maturityLabels: Record<string, { label: string; color: string }> = {
    'Bronce': { label: 'Bronce', color: '#CD7F32' },
    'Plata': { label: 'Plata', color: '#C0C0C0' },
    'Oro': { label: 'Oro', color: '#B8860B' },
  }

  // Puntuaciones máximas por sección para calcular porcentaje de madurez
  const sectionMaxScores: Record<string, number> = {
    infraestructura: 24,
    equipo_productivo: 18,
    financiera: 18,
    operacion: 48,
  }

  const evaluationUrl = typeof window !== 'undefined' ? window.location.origin : ''

  // PIN Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-8">
            <ClusterLogo className="h-10" />
          </div>
          
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <h1 className="text-xl font-semibold text-center text-foreground mb-2">
              Acceso Restringido
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Ingresa el PIN de 4 dígitos
            </p>
            
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={pin[index]}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 bg-background transition-all outline-none ${
                    pinError 
                      ? 'border-red-500 animate-pulse' 
                      : 'border-border focus:border-primary'
                  }`}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            
            {pinError && (
              <motion.p 
                className="text-red-500 text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                PIN incorrecto. Intenta de nuevo.
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <ClusterLogo className="h-7 md:h-8 text-foreground" />
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg md:text-xl font-semibold text-foreground">
              Estadísticas en Vivo
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowQR(true)}
              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              title="Mostrar QR"
            >
              <QrCode className="w-5 h-5" />
            </button>
            <button
              onClick={fetchStats}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Actualizar ahora"
            >
              <RefreshCw className={`w-5 h-5 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setAutoRefresh(v => !v)}
              title={autoRefresh ? 'Auto-refresh activo (cada 60s)' : 'Activar auto-refresh'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                autoRefresh
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/30'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/40'}`} />
              {autoRefresh ? 'Live' : 'Auto'}
            </button>
            <SecihtiLogo className="h-10 md:h-12" />
          </div>
        </div>
      </header>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQR(false)}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full text-center relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Escanea para Evaluar
              </h2>
              <p className="text-gray-500 mb-8">
                Clúster Startups Puebla
              </p>
              
              <div className="flex justify-center mb-8">
                <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
                  <QRCodeSVG
                    value={evaluationUrl}
                    size={260}
                    level="H"
                    includeMargin={false}
                    fgColor="#000000"
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-400 break-all">
                {evaluationUrl}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Last update */}
        <p className="text-sm text-muted-foreground text-right">
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </p>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard
            icon={Users}
            label="Participantes"
            value={stats?.uniqueParticipants ?? 0}
            color="#FF1493"
          />
          <KPICard
            icon={CheckCircle2}
            label="Completados"
            value={stats?.results.length ?? 0}
            color="#00CED1"
          />
          <KPICard
            icon={BarChart3}
            label="Respuestas"
            value={stats?.responses.length ?? 0}
            color="#9370DB"
          />
          <KPICard
            icon={TrendingUp}
            label="Tasa Completación"
            value={`${(derivedStats?.completionRate ?? 0).toFixed(0)}%`}
            color="#FF8C00"
          />
        </div>

        {/* Distribución de Madurez */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Distribución de Niveles de Madurez</h2>
          {stats?.results.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aún no hay evaluaciones completadas
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(maturityLabels).map(([key, { label, color }]) => {
                const count = derivedStats?.maturityDistribution[key] ?? 0
                const total = stats?.results.length ?? 1
                const percentage = (count / total) * 100

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{label}</span>
                      <span className="text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Score Promedio por Sección */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-1">Score Promedio por Sección</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Basado en {stats?.results.length ?? 0} evaluaciones completadas
          </p>
          {stats?.results.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aún no hay evaluaciones completadas
            </p>
          ) : (
            <div className="space-y-4">
              {SECTIONS.map(section => {
                const avgScore = derivedStats?.sectionAverages[section.id] ?? 0
                const maxScore = sectionMaxScores[section.id] ?? 1
                const pct = Math.min((avgScore / maxScore) * 100, 100)
                const level = getSectionLevel(section.id, avgScore)
                const maturity = maturityLabels[level] ?? { label: level, color: '#888' }

                return (
                  <div key={section.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: section.color }}
                        />
                        <span className="font-medium">{section.title} · {section.subtitle}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: maturity.color }}
                        >
                          {maturity.label}
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: section.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Diagnóstico del Sector */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-1">Diagnóstico del Sector</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Riesgos y retos identificados por área de madurez
          </p>
          {stats?.results.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aún no hay evaluaciones completadas
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SECTIONS.map(section => {
                const avgScore = derivedStats?.sectionAverages[section.id] ?? 0
                const maxScore = sectionMaxScores[section.id] ?? 1
                const pct = Math.min((avgScore / maxScore) * 100, 100)
                const level = getSectionLevel(section.id, avgScore)
                const maturity = maturityLabels[level] ?? { label: level, color: '#888' }
                const profileKey = `${section.id}-${level}`
                const profile = SECTION_PROFILES[profileKey]

                return (
                  <motion.div
                    key={section.id}
                    className="rounded-xl border p-4 space-y-3"
                    style={{ borderColor: section.color + '40' }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Header tarjeta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: section.color + '20' }}
                        >
                          <BarChart3 className="w-4 h-4" style={{ color: section.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-tight">{section.title}</p>
                          <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                        </div>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: maturity.color }}
                      >
                        {maturity.label}
                      </span>
                    </div>

                    {/* Barra de madurez */}
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Madurez promedio</span>
                        <span>{pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: section.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>

                    {/* Riesgo y reto */}
                    {profile && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
                          <p className="text-xs text-muted-foreground leading-snug">
                            <span className="font-medium text-foreground">Riesgo: </span>
                            {profile.riesgo}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Target className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />
                          <p className="text-xs text-muted-foreground leading-snug">
                            <span className="font-medium text-foreground">Reto: </span>
                            {profile.reto}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>

        {/* Principales Barreras de Modernización */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-1">Principales Barreras de Modernización</h2>
          <p className="text-sm text-muted-foreground mb-5">
            ¿Cuál es la mayor barrera para modernizar su empresa? (Pregunta 13)
          </p>
          {(derivedStats?.barriersTotal ?? 0) === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aún no hay respuestas para esta pregunta
            </p>
          ) : (
            <div className="space-y-3">
              {derivedStats?.barriers.map((barrier, index) => (
                <motion.div
                  key={barrier.key}
                  className="space-y-1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07 }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{barrier.label}</span>
                    <span className="text-muted-foreground">
                      {barrier.count} ({barrier.pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: barrier.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barrier.pct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Causas de Paros No Programados */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-1">Causas de Paros No Programados</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Mayor a menor impacto según el sector — basado en {derivedStats?.stopCauses[0]?.respondents ?? 0} evaluaciones
          </p>
          {(derivedStats?.stopCauses.length ?? 0) === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aún no hay respuestas para esta pregunta
            </p>
          ) : (
            <div className="space-y-3">
              {derivedStats?.stopCauses.map((cause, index) => (
                <div key={cause.key} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: cause.color }}
                      >
                        {index + 1}
                      </span>
                      <span className="font-medium">{cause.label}</span>
                    </div>
                    <span className="text-muted-foreground">{cause.pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: cause.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${cause.pct}%` }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Evaluaciones Recientes */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Evaluaciones Completadas Recientes</h2>
          {stats?.results.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aún no hay evaluaciones completadas
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Nivel</th>
                    {SECTIONS.map(s => (
                      <th key={s.id} className="pb-3 font-medium" style={{ color: s.color }}>
                        {s.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats?.results.slice(-10).reverse().map((result, index) => {
                    const maturity = maturityLabels[result.maturity_level] ?? { label: result.maturity_level, color: '#888' }

                    return (
                      <motion.tr
                        key={result.device_id}
                        className="border-b border-border/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="py-3 text-sm font-mono text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            {result.device_id.slice(0, 8)}…
                            {result.total_score === 108 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-sans">test</span>
                            )}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm font-semibold">
                            {((result.total_score / 108) * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: maturity.color }}
                          >
                            {maturity.label}
                          </span>
                        </td>
                        {SECTIONS.map(s => {
                          const sections = Array.isArray(result.section_scores) ? result.section_scores : []
                          const secData = sections.find(sec => sec.sectionId === s.id)
                          const secMaturity = secData
                            ? (maturityLabels[secData.category] ?? { label: secData.category, color: '#888' })
                            : null
                          return (
                            <td key={s.id} className="py-3">
                              {secMaturity ? (
                                <span
                                  className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: secMaturity.color }}
                                >
                                  {secMaturity.label}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                          )
                        })}
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          <p>
            Datos actualizados en tiempo real. Esta información es anónima y se utiliza para
            entender el estado de la industria.
          </p>
          <p className="mt-2">
            <Link href="/privacidad" className="underline hover:text-foreground transition-colors">
              Aviso de Privacidad
            </Link>
          </p>
        </footer>
      </main>
    </div>
  )
}

function KPICard({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: typeof Users
  label: string
  value: number | string
  color: string
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: color + '20' }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl md:text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  )
}
