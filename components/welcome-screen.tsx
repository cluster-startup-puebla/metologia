'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ClusterLogo, SecihtiLogo } from '@/components/logos'
import { ArrowRight, Shield, BarChart3, Lightbulb } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <ClusterLogo className="h-8 md:h-10 text-foreground" />
        <SecihtiLogo className="h-10 md:h-12" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
        <motion.div
          className="max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="space-y-3">
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-foreground text-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Batería de Evaluación
            </motion.h1>
            <motion.p
              className="text-lg text-primary font-medium"
              style={{ color: '#FF1493' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Nivel de Madurez Digital
            </motion.p>
          </div>

          {/* Description */}
          <motion.p
            className="text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Este instrumento evaluará el nivel de digitalización de tu empresa a través de 18
            preguntas distribuidas en 4 secciones. Al finalizar, recibirás un diagnóstico
            personalizado con recomendaciones.
          </motion.p>

          {/* Features */}
          <motion.div
            className="grid grid-cols-3 gap-4 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#FF149320' }}
              >
                <BarChart3 className="w-6 h-6" style={{ color: '#FF1493' }} />
              </div>
              <span className="text-xs text-muted-foreground">4 Secciones</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#FF149320' }}
              >
                <Lightbulb className="w-6 h-6" style={{ color: '#FF1493' }} />
              </div>
              <span className="text-xs text-muted-foreground">18 Preguntas</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#FF149320' }}
              >
                <Shield className="w-6 h-6" style={{ color: '#FF1493' }} />
              </div>
              <span className="text-xs text-muted-foreground">~10 min</span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={onStart}
              size="lg"
              className="w-full md:w-auto px-10 py-6 text-base font-medium rounded-2xl text-white"
              style={{ backgroundColor: '#FF1493' }}
            >
              Comenzar evaluación
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Privacy note */}
          <motion.p
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Al continuar, aceptas nuestro{' '}
            <a href="/privacidad" className="underline hover:text-foreground transition-colors">
              aviso de privacidad
            </a>
            . La prueba del diagnóstico sectorial está en{' '}
            <a href="/diagnostico" className="underline hover:text-foreground transition-colors">
              /diagnostico
            </a>
          </motion.p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Clúster Startups Puebla · Todos los derechos reservados
        </p>
      </footer>
    </div>
  )
}
