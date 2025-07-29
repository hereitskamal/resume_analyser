// components/RecommendationsList.tsx
'use client'

import { motion } from 'framer-motion'
import { Recommendation } from '@/lib/types'

interface RecommendationsListProps {
  recommendations: Recommendation[]
}

export default function RecommendationsList({ recommendations }: RecommendationsListProps) {

  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.type]) acc[rec.type] = []
    acc[rec.type].push(rec)
    return acc
  }, {} as Record<string, Recommendation[]>)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Critical Recommendations */}
      {groupedRecommendations.critical && (
        <div>
          <h3 className="text-lg font-light text-gray-900 mb-4">
            Critical Issues ({groupedRecommendations.critical.length})
          </h3>
          <div className="space-y-4">
            {groupedRecommendations.critical.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-red-200 rounded-lg p-4 bg-red-50"
              >
                <h4 className="font-medium text-gray-900 mb-2">{rec.title}</h4>
                <p className="text-gray-600 text-sm font-light mb-3">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-light">{rec.category}</span>
                  <span className="text-xs text-red-700 font-medium">
                    {rec.impact.toUpperCase()} IMPACT
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Important Recommendations */}
      {groupedRecommendations.important && (
        <div>
          <h3 className="text-lg font-light text-gray-900 mb-4">
            Important Items ({groupedRecommendations.important.length})
          </h3>
          <div className="space-y-4">
            {groupedRecommendations.important.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="border border-orange-200 rounded-lg p-4 bg-orange-50"
              >
                <h4 className="font-medium text-gray-900 mb-2">{rec.title}</h4>
                <p className="text-gray-600 text-sm font-light mb-3">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-light">{rec.category}</span>
                  <span className="text-xs text-orange-700 font-medium">
                    {rec.impact.toUpperCase()} IMPACT
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Enhancement Recommendations */}
      {groupedRecommendations['nice-to-have'] && (
        <div>
          <h3 className="text-lg font-light text-gray-900 mb-4">
            Enhancements ({groupedRecommendations['nice-to-have'].length})
          </h3>
          <div className="space-y-4">
            {groupedRecommendations['nice-to-have'].map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="border border-blue-200 rounded-lg p-4 bg-blue-50"
              >
                <h4 className="font-medium text-gray-900 mb-2">{rec.title}</h4>
                <p className="text-gray-600 text-sm font-light mb-3">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-light">{rec.category}</span>
                  <span className="text-xs text-blue-700 font-medium">
                    {rec.impact.toUpperCase()} IMPACT
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-light text-gray-900 mb-1">
            {groupedRecommendations.critical?.length || 0}
          </div>
          <div className="text-sm text-gray-500 font-light">Critical</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-gray-900 mb-1">
            {groupedRecommendations.important?.length || 0}
          </div>
          <div className="text-sm text-gray-500 font-light">Important</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-gray-900 mb-1">
            {groupedRecommendations['nice-to-have']?.length || 0}
          </div>
          <div className="text-sm text-gray-500 font-light">Enhancements</div>
        </div>
      </div>
    </div>
  )
}
