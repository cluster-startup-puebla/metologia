'use client'

import { motion } from 'framer-motion'
import {
  FileText,
  LayoutGrid,
  Monitor,
  Cpu,
  PenLine,
  Files,
  Calculator,
  Network,
  Phone,
  Mail,
  Cloud,
  Plug,
  Ban,
  BarChart2,
  BarChart,
  CheckCircle2,
  History,
  Clock,
  Timer,
  Zap,
  Wrench,
  ClipboardList,
  Activity,
  HelpCircle,
  PieChart,
  ClipboardCheck,
  TrendingUp,
  Calendar,
  CalendarCheck,
  RefreshCw,
  UserX,
  Mouse,
  Link,
  Package,
  PackagePlus,
  AlertTriangle,
  Truck,
  AlertCircle,
  Info,
  ShieldCheck,
  Users,
  DollarSign,
  Code2,
  ThumbsDown,
  MessageCircle,
  Printer,
  EyeOff,
  Eye,
  Search,
  GitBranch,
  Brain,
  FolderOpen,
  Building,
  Unlink,
  Wifi,
  WifiOff,
  type LucideIcon,
} from 'lucide-react'
import type { Question } from '@/lib/evaluation-data'

// Iconos semánticos por questionId-optionKey
const OPTION_ICONS: Record<string, LucideIcon> = {
  // Q1: ¿Cómo se capturan los datos de producción?
  '1-a': FileText,       // Papel/Bitácoras
  '1-b': LayoutGrid,     // Excel al final de turno
  '1-c': Monitor,        // Terminales digitales
  '1-d': Cpu,            // Sistemas automatizados/IoT

  // Q2: Herramienta para planeación de recursos y finanzas
  '2-a': PenLine,        // Registro manual
  '2-b': Files,          // Documentos digitales independientes
  '2-c': Calculator,     // Software contable básico
  '2-d': Network,        // ERP integral

  // Q3: Intercambio de información con proveedores/clientes
  '3-a': Phone,          // Teléfono/Presencial
  '3-b': Mail,           // Correo manual
  '3-c': Cloud,          // Portales nube
  '3-d': Plug,           // Integración EDI/API/MRP

  // Q4: % procesos en la nube o con respaldo automático
  '4-a': Ban,            // 0%
  '4-b': BarChart2,      // Menos del 50%
  '4-c': BarChart,       // Más del 80%
  '4-d': CheckCircle2,   // 100% Paperless

  // Q5: Antigüedad promedio de maquinaria
  '5-a': History,        // >20 años
  '5-b': Clock,          // 10-20 años
  '5-c': Timer,          // 5-10 años
  '5-d': Zap,            // <5 años

  // Q6: Mantenimiento de equipos productivos
  '6-a': Wrench,         // Correctivo
  '6-b': ClipboardList,  // Preventivo manual
  '6-c': BarChart,       // Basado en uso (Software)
  '6-d': Activity,       // Predictivo (Sensores)

  // Q7: Capacidad de conectarse a red
  '7-a': WifiOff,        // No, opera aislada
  '7-b': Cpu,            // Requiere instalación sensores
  '7-c': Wifi,           // Sí, pero no se usan
  '7-d': Activity,       // Sí, tiene monitoreo activo

  // Q8: Precisión del costo unitario real
  '8-a': HelpCircle,     // Basado en estimación/Experiencia
  '8-b': PieChart,       // Por prorrateo global
  '8-c': ClipboardCheck, // Por orden de producción
  '8-d': TrendingUp,     // En tiempo real/Trazable

  // Q9: Tiempo para generar estados financieros
  '9-a': History,        // >15 días
  '9-b': Calendar,       // 7-15 días
  '9-c': CalendarCheck,  // <7 días
  '9-d': RefreshCw,      // Al día (Cierre continuo)

  // Q10: Cumplimiento fiscal SAT
  '10-a': UserX,         // Externo desfasado
  '10-b': Mouse,         // Manual en portal SAT
  '10-c': Link,          // Integrado a ventas
  '10-d': Network,       // Automatizado y vinculado a almacén

  // Q11: Problema más recurrente en cadena de suministro
  '11-a': Package,       // Desabasto
  '11-b': PackagePlus,   // Exceso stock
  '11-c': AlertTriangle, // Diferencias registro físico vs sistema
  '11-d': Truck,         // Costos logísticos altos

  // Q12: Frecuencia de retrabajos o rechazos
  '12-a': AlertCircle,   // Muy frecuentes (diarios)
  '12-b': AlertTriangle, // Ocasionales
  '12-c': Info,          // Raros
  '12-d': ShieldCheck,   // Evitados por sistema

  // Q13: Mayor barrera para modernizar
  '13-a': Users,         // Resistencia al cambio
  '13-b': DollarSign,    // Presupuesto/Costo
  '13-c': Code2,         // Complejidad técnica
  '13-d': ThumbsDown,    // Malas experiencias previas

  // Q14: Comunicación de objetivos de producción
  '14-a': MessageCircle, // De palabra
  '14-b': Monitor,       // Pizarrones físicos → usamos monitor/pantalla de pizarrón
  '14-c': Printer,       // Reportes impresos
  '14-d': Activity,      // Tableros digitales en tiempo real

  // Q15: Nivel de trazabilidad de lote
  '15-a': EyeOff,        // Nula
  '15-b': Eye,           // Parcial manual
  '15-c': Search,        // Alta en sistema
  '15-d': GitBranch,     // Total desde proveedor

  // Q17: Mayor cuello de botella para liberación de calidad
  '17-a': BarChart2,     // No hay muestreo estadístico
  '17-b': FileText,      // Datos aislados en papel
  '17-c': HelpCircle,    // Criterios subjetivos
  '17-d': Unlink,        // Falta trazabilidad de rechazo

  // Q18: Flujo de información técnica al operador
  '18-a': Brain,         // Memoria/Experiencia
  '18-b': FolderOpen,    // Carpeta física
  '18-c': Building,      // Consulta en oficina
  '18-d': Monitor,       // Tablero digital en estación
}

// Iconos para las opciones de prioridad (Q16)
const PRIORITY_OPTION_ICONS: Record<string, LucideIcon> = {
  falta_materiales: Package,
  fallas_mecanicas: Wrench,
  personal: Users,
  set_ups_lentos: Timer,
}

const FALLBACK_ICON = HelpCircle

interface QuestionCardProps {
  question: Question
  answer: string | Record<string, number> | undefined
  onAnswer: (answer: string | Record<string, number>) => void
  color: string
}

export function QuestionCard({ question, answer, onAnswer, color }: QuestionCardProps) {
  if (question.type === 'priority') {
    return (
      <PriorityQuestion
        question={question}
        answer={answer as Record<string, number> | undefined}
        onAnswer={onAnswer}
        color={color}
      />
    )
  }

  return (
    <SingleQuestion
      question={question}
      answer={answer as string | undefined}
      onAnswer={onAnswer}
      color={color}
    />
  )
}

function SingleQuestion({
  question,
  answer,
  onAnswer,
  color,
}: {
  question: Question
  answer: string | undefined
  onAnswer: (answer: string) => void
  color: string
}) {
  return (
    <div className="space-y-4">
      <motion.h2
        className="text-lg md:text-xl font-medium text-foreground leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={question.id}
      >
        {question.text}
      </motion.h2>

      <motion.div
        className="space-y-3 pt-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {question.options?.map((option) => {
          const Icon = OPTION_ICONS[`${question.id}-${option.key}`] ?? FALLBACK_ICON
          const isSelected = answer === option.key

          return (
            <button
              key={option.key}
              onClick={() => onAnswer(option.key)}
              className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-150 flex items-center gap-4 active:scale-[0.99] ${
                isSelected
                  ? 'border-current bg-current/5'
                  : 'border-muted hover:border-current/30'
              }`}
              style={{
                borderColor: isSelected ? color : undefined,
                color: isSelected ? color : undefined,
              }}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors duration-150 ${
                  isSelected ? '' : 'text-muted-foreground/60'
                }`}
                style={{ color: isSelected ? color : undefined }}
              />
              <span
                className={`text-sm md:text-base transition-colors duration-150 ${isSelected ? 'font-medium' : 'text-muted-foreground'}`}
                style={{ color: isSelected ? color : undefined }}
              >
                {option.label}
              </span>
            </button>
          )
        })}
      </motion.div>
    </div>
  )
}

function PriorityQuestion({
  question,
  answer,
  onAnswer,
  color,
}: {
  question: Question
  answer: Record<string, number> | undefined
  onAnswer: (answer: Record<string, number>) => void
  color: string
}) {
  const rankings = answer ?? {}
  const usedRanks = Object.values(rankings)

  const handleRankSelect = (optionKey: string, rank: number) => {
    const newRankings = { ...rankings }

    const existingKey = Object.entries(newRankings).find(([, r]) => r === rank)?.[0]
    if (existingKey && existingKey !== optionKey) {
      delete newRankings[existingKey]
    }

    if (newRankings[optionKey] === rank) {
      delete newRankings[optionKey]
      onAnswer(newRankings)
      return
    }

    if (newRankings[optionKey] !== undefined) {
      delete newRankings[optionKey]
    }

    newRankings[optionKey] = rank
    onAnswer(newRankings)
  }

  const handleClearAll = () => {
    onAnswer({})
  }

  return (
    <div className="space-y-4">
      <motion.h2
        className="text-lg md:text-xl font-medium text-foreground leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={question.id}
      >
        {question.text}
      </motion.h2>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Selecciona el orden de impacto (1 = mayor impacto, 4 = menor impacto)
        </p>
        {Object.keys(rankings).length > 0 && (
          <motion.button
            onClick={handleClearAll}
            className="text-xs px-3 py-1 rounded-full border border-muted-foreground/30 text-muted-foreground hover:bg-muted transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            Limpiar
          </motion.button>
        )}
      </div>

      <motion.div
        className="space-y-3 pt-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {question.priorityOptions?.map((option) => {
          const currentRank = rankings[option.key]
          const Icon = PRIORITY_OPTION_ICONS[option.key] ?? FALLBACK_ICON

          return (
            <div
              key={option.key}
              className="flex items-center gap-3"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((rank) => {
                  const isSelected = currentRank === rank
                  const isUsedByOther = usedRanks.includes(rank) && !isSelected

                  return (
                    <button
                      key={rank}
                      onClick={() => handleRankSelect(option.key, rank)}
                      className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 ${
                        isSelected
                          ? 'text-white'
                          : isUsedByOther
                            ? 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
                            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                      }`}
                      style={{
                        backgroundColor: isSelected ? color : undefined,
                      }}
                      disabled={isUsedByOther}
                    >
                      {rank}
                    </button>
                  )
                })}
              </div>
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  currentRank ? '' : 'text-muted-foreground/60'
                }`}
                style={{ color: currentRank ? color : undefined }}
              />
              <span
                className={`text-sm md:text-base flex-1 ${currentRank ? 'font-medium' : 'text-muted-foreground'}`}
                style={{ color: currentRank ? color : undefined }}
              >
                {option.label}
              </span>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
