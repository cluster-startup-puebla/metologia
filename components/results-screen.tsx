'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ClusterLogo, SecihtiLogo } from '@/components/logos'
import type { IntegralResult } from '@/lib/evaluation-calculator'
import { getCategoryColor } from '@/lib/evaluation-calculator'
import { Trophy, AlertTriangle, Target, Mail, X, CheckCircle2 } from 'lucide-react'
import { saveEmailLead } from '@/lib/supabase-responses'

interface ResultsScreenProps {
  results: IntegralResult
  deviceId: string
}

export function ResultsScreen({ results, deviceId }: ResultsScreenProps) {
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const duration = 3000
    const end = Date.now() + duration
    const colors = ['#FF1493', '#00CED1', '#FFD700', '#9B59B6']
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const categoryColor = getCategoryColor(results.category)
  const percentage = Math.round((results.totalScore / results.maxScore) * 100)

  const handleEmailSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setEmailStatus('loading')
    const ok = await saveEmailLead(deviceId, email)
    setEmailStatus(ok ? 'success' : 'error')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <ClusterLogo className="h-8 text-foreground" />
        <SecihtiLogo className="h-10 md:h-12" />
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Título y categoría */}
        <motion.div className="text-center space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8" style={{ color: categoryColor }} />
            <h1 className="text-2xl md:text-3xl font-bold">¡Evaluación Completada!</h1>
          </div>
          <div className="inline-flex flex-col items-center gap-2 p-6 rounded-3xl bg-muted/30">
            <span className="text-sm text-muted-foreground">Tu nivel de madurez digital</span>
            <span className="text-4xl md:text-5xl font-bold" style={{ color: categoryColor }}>
              {results.category}
            </span>
            <span className="text-2xl font-semibold text-foreground">
              {results.totalScore} / {results.maxScore} puntos ({percentage}%)
            </span>
          </div>
        </motion.div>

        {/* Perfil integral */}
        <motion.div
          className="space-y-4 p-5 rounded-2xl border border-border bg-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: '#FF1493' }} />
            Diagnóstico General
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium">Riesgo identificado</span>
                <p className="text-sm text-muted-foreground">{results.riesgo}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: '#FF149310' }}>
              <Target className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FF1493' }} />
              <div>
                <span className="text-sm font-medium">Reto recomendado</span>
                <p className="text-sm text-muted-foreground">{results.reto}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resultados por sección */}
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="font-semibold text-lg">Resultados por Sección</h2>
          <div className="space-y-4">
            {results.sections.map((section, index) => (
              <motion.div
                key={section.sectionId}
                className="p-5 rounded-2xl border border-border bg-card space-y-4"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: section.color }} />
                    <h3 className="font-medium">{section.sectionName}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: getCategoryColor(section.category) + '20', color: getCategoryColor(section.category) }}
                    >
                      {section.category}
                    </span>
                    <span className="text-sm text-muted-foreground">{section.score}/{section.maxScore}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: section.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(section.score / section.maxScore) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  />
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Riesgo: </span>
                    <span>{section.riesgo}</span>
                  </div>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: section.color + '10' }}>
                    <span className="text-muted-foreground">Reto: </span>
                    <span>{section.reto}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA correo */}
        <motion.div
          className="pt-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        >
          <Button
            onClick={() => setShowModal(true)}
            className="w-full py-6 rounded-2xl text-white text-base font-semibold"
            style={{ backgroundColor: '#FF1493' }}
          >
            <Mail className="w-5 h-5 mr-2" />
            Recibir análisis detallado por correo
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Te enviamos un diagnóstico completo y recomendaciones personalizadas
          </p>
        </motion.div>
      </main>

      <footer className="p-4 mt-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Clúster Startups Puebla · Todos los derechos reservados
        </p>
      </footer>

      {/* Modal correo */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { if (emailStatus !== 'loading') setShowModal(false) }}
          >
            <motion.div
              className="bg-card rounded-3xl p-8 w-full max-w-sm relative border border-border shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors"
                disabled={emailStatus === 'loading'}
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {emailStatus === 'success' ? (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
                  <h3 className="text-lg font-semibold">¡Listo!</h3>
                  <p className="text-sm text-muted-foreground">
                    Te contactaremos pronto con tu análisis detallado.
                  </p>
                  <Button onClick={() => setShowModal(false)} className="w-full rounded-xl mt-2" variant="outline">
                    Cerrar
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold">Análisis detallado</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ingresa tu correo y te enviamos recomendaciones personalizadas para tu empresa.
                    </p>
                  </div>
                  <input
                    type="email"
                    placeholder="tucorreo@empresa.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailStatus('idle') }}
                    onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                    autoFocus
                  />
                  {emailStatus === 'error' && (
                    <p className="text-xs text-red-500">Ocurrió un error, intenta de nuevo.</p>
                  )}
                  <Button
                    onClick={handleEmailSubmit}
                    disabled={emailStatus === 'loading' || !email}
                    className="w-full py-5 rounded-xl text-white"
                    style={{ backgroundColor: '#FF1493' }}
                  >
                    {emailStatus === 'loading' ? 'Enviando...' : 'Enviar'}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    Tu evaluación ha sido completamente anónima. Compartir tu correo es opcional y solo se usará para enviarte un análisis personalizado.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
