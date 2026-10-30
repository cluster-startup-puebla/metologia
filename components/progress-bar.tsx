'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
  color: string
}

export function ProgressBar({ current, total, color }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}
