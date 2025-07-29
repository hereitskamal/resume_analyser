// components/OverviewTab.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ResumeAnalysis } from '@/lib/types'

interface OverviewTabProps {
  analysis: ResumeAnalysis
}

export default function OverviewTab({ analysis }: OverviewTabProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Safe access with fallbacks to prevent undefined errors - FIXED
  const safeAnalysis = {
    ...analysis, // Spread first to get all properties
    // Then override with safe fallbacks
    overallScore: analysis?.overallScore ?? 0,
    atsScore: analysis?.atsScore ?? 0,
    readabilityScore: analysis?.readabilityScore ?? 0,
    keywordDensity: analysis?.keywordDensity ?? 0,
    industryFit: analysis?.industryFit ?? { 
      confidence: 0, 
      detectedIndustry: 'general', 
      suggestions: [] 
    },
    competitorComparison: analysis?.competitorComparison ?? { 
      percentile: 0, 
      benchmark: 'Unknown', 
      similarProfiles: 0 
    },
    summary: analysis?.summary ?? 'Analysis summary not available.',
    recommendations: analysis?.recommendations ?? [],
    strengths: analysis?.strengths ?? [],
    improvements: analysis?.improvements ?? [],
    keywordMatching: analysis?.keywordMatching ?? {
      matched: [],
      missing: [],
      suggestions: []
    }
  }

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    if (score >= 4) return 'Fair'
    return 'Needs Improvement'
  }

  // Safe Math.round that prevents hydration issues
  const getRoundedKeywordDensity = () => {
    if (!mounted) return 0 // Return static value during SSR
    return Math.round(safeAnalysis.keywordDensity)
  }

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading overview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Main Score */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6"
        >
          <div className="w-32 h-32 rounded-full border-4 border-gray-100 flex items-center justify-center">
            <span className="text-3xl font-light text-gray-900">{safeAnalysis.overallScore}/10</span>
          </div>
        </motion.div>
        <h2 className="text-2xl font-light text-gray-900 mb-2">Overall Score</h2>
        <p className="text-gray-600 font-light">
          {getScoreLabel(safeAnalysis.overallScore)}
        </p>
        <p className="text-sm text-gray-500 font-light mt-2">
          Better than {safeAnalysis.competitorComparison.percentile}% of candidates
        </p>
      </div>

      {/* Sub-scores */}
      <div className="grid grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-2xl font-light text-gray-900 mb-2">
            {safeAnalysis.atsScore}/10
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">ATS Score</h3>
          <p className="text-xs text-gray-500 font-light">System compatibility</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="text-2xl font-light text-gray-900 mb-2">
            {safeAnalysis.readabilityScore}/10
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Readability</h3>
          <p className="text-xs text-gray-500 font-light">Content clarity</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="text-2xl font-light text-gray-900 mb-2">
            {getRoundedKeywordDensity()}%
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Keywords</h3>
          <p className="text-xs text-gray-500 font-light">Industry relevance</p>
        </motion.div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="border-t border-gray-100 pt-8"
      >
        <h3 className="text-lg font-light text-gray-900 mb-4">Summary</h3>
        <p className="text-gray-600 leading-relaxed font-light">{safeAnalysis.summary}</p>
      </motion.div>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-light text-gray-900 mb-4">Strengths</h3>
          <div className="space-y-3">
            {safeAnalysis.strengths.length > 0 ? (
              safeAnalysis.strengths.slice(0, 4).map((strength, index) => (
                <div key={`strength-${index}`} className="border-l-2 border-gray-100 pl-4">
                  <p className="text-gray-600 font-light text-sm">{strength}</p>
                </div>
              ))
            ) : (
              <div className="border-l-2 border-gray-100 pl-4">
                <p className="text-gray-500 font-light text-sm">No strengths identified yet.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Improvements */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-light text-gray-900 mb-4">Areas for Improvement</h3>
          <div className="space-y-3">
            {safeAnalysis.improvements.length > 0 ? (
              safeAnalysis.improvements.slice(0, 4).map((improvement, index) => (
                <div key={`improvement-${index}`} className="border-l-2 border-gray-100 pl-4">
                  <p className="text-gray-600 font-light text-sm">{improvement}</p>
                </div>
              ))
            ) : (
              <div className="border-l-2 border-gray-100 pl-4">
                <p className="text-gray-500 font-light text-sm">No improvements suggested.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Priority Actions */}
      {safeAnalysis.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="border-t border-gray-100 pt-8"
        >
          <h3 className="text-lg font-light text-gray-900 mb-6">Priority Actions</h3>
          <div className="space-y-4">
            {safeAnalysis.recommendations.slice(0, 3).map((rec, index) => (
              <div key={`recommendation-${index}`} className="border-l-2 border-gray-100 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                <p className="text-gray-600 text-sm font-light">{rec.description}</p>
                <span className="text-xs text-gray-400 font-light">{rec.category}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
