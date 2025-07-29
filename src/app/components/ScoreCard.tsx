// components/ScoreCard.tsx
'use client'

import { motion } from 'framer-motion'

interface ScoreCardProps {
  title: string
  score: number
  maxScore: number
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  icon: string
  description: string
  suffix?: string
}

export default function ScoreCard({
  title,
  score,
  maxScore,
  description,
  suffix = ''
}: ScoreCardProps) {
  const percentage = (score / maxScore) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="border border-gray-100 rounded-lg p-6 hover:border-gray-200 transition-colors"
    >
      <div className="text-center">
        <div className="text-2xl font-light text-gray-900 mb-2">
          {score}{suffix}
          <span className="text-sm text-gray-400 font-light">/{maxScore}{suffix}</span>
        </div>
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 font-light mb-4">{description}</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-1 rounded-full bg-gray-900"
          />
        </div>
      </div>
    </motion.div>
  )
}
