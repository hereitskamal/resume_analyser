// components/CompetitorBenchmark.tsx
'use client'

import { motion } from 'framer-motion'
import { ResumeAnalysis } from '@/lib/types'

interface CompetitorBenchmarkProps {
  analysis: ResumeAnalysis
}

export default function CompetitorBenchmark({ analysis }: CompetitorBenchmarkProps) {
  const { competitorComparison, overallScore, atsScore, readabilityScore } = analysis

  const getPercentileMessage = (percentile: number) => {
    if (percentile >= 90) return "Top 10% of candidates"
    if (percentile >= 75) return "Above average performance"
    if (percentile >= 50) return "Average performance"
    if (percentile >= 25) return "Below average performance"
    return "Significant improvement needed"
  }

  const marketData = [
    { 
      metric: 'Overall Quality', 
      your: overallScore, 
      average: 6.5,
      max: 10
    },
    { 
      metric: 'ATS Compatibility', 
      your: atsScore, 
      average: 5.8,
      max: 10
    },
    { 
      metric: 'Readability', 
      your: readabilityScore, 
      average: 7.2,
      max: 10
    },
    { 
      metric: 'Keywords', 
      your: analysis.keywordMatching.matched.length, 
      average: 15,
      max: 25
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Percentile Ranking */}
      <div className="text-center">
        <div className="inline-block mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                stroke="rgb(243 244 246)" 
                strokeWidth="12" 
                fill="none"
              />
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                stroke="rgb(17 24 39)" 
                strokeWidth="12" 
                fill="none"
                strokeDasharray={`${competitorComparison.percentile * 3.14} ${314}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-light text-gray-900">{competitorComparison.percentile}</span>
              <span className="text-xs text-gray-500 font-light">percentile</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-light text-gray-900 mb-2">Market Position</h3>
        <p className="text-gray-600 font-light">
          {getPercentileMessage(competitorComparison.percentile)}
        </p>
      </div>

      {/* Market Comparison */}
      <div className="space-y-6">
        <h3 className="text-xl font-light text-gray-900 text-center mb-8">Performance Comparison</h3>
        <div className="space-y-6">
          {marketData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-gray-700">{item.metric}</span>
                <span className="text-sm font-light text-gray-500">
                  {typeof item.your === 'number' ? item.your.toFixed(1) : item.your} / {item.max}
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-gray-900 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(item.your / item.max) * 100}%` }}
                  />
                </div>
                <div 
                  className="absolute top-0 w-1 h-2 bg-gray-400 rounded"
                  style={{ left: `${(item.average / item.max) * 100}%` }}
                  title={`Market average: ${item.average}`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-light">
                <span>0</span>
                <span>Market avg: {item.average}</span>
                <span>{item.max}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simple Stats */}
      <div className="grid grid-cols-3 gap-8 py-8 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-light text-gray-900 mb-1">
            {competitorComparison.similarProfiles}
          </div>
          <div className="text-sm text-gray-500 font-light">Profiles Analyzed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-gray-900 mb-1">
            {Math.round((100 - competitorComparison.percentile) / 100 * competitorComparison.similarProfiles)}
          </div>
          <div className="text-sm text-gray-500 font-light">You Outperform</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-gray-900 mb-1">
            {Math.round(competitorComparison.percentile / 100 * competitorComparison.similarProfiles)}
          </div>
          <div className="text-sm text-gray-500 font-light">Outperform You</div>
        </div>
      </div>
    </div>
  )
}
