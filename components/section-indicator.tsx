'use client'

import { motion } from 'framer-motion'
import { SECTIONS } from '@/lib/evaluation-data'

interface SectionIndicatorProps {
  currentSectionIndex: number
}

export function SectionIndicator({ currentSectionIndex }: SectionIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {SECTIONS.map((section, index) => (
        <motion.div
          key={section.id}
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index <= currentSectionIndex ? section.color : '#E5E7EB',
              scale: index === currentSectionIndex ? 1.3 : 1,
            }}
            animate={{
              scale: index === currentSectionIndex ? 1.3 : 1,
            }}
          />
          {index < SECTIONS.length - 1 && (
            <div
              className="w-6 h-0.5 transition-colors duration-300"
              style={{
                backgroundColor: index < currentSectionIndex ? section.color : '#E5E7EB',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
