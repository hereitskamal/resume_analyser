// components/Dashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResumeAnalysis } from '@/lib/types'
import ScoreCard from './ScoreCard'
import RecommendationsList from './RecommendationsList'
import IndustryInsights from './IndustryInsights'
import CompetitorBenchmark from './CompetitorBenchmark'
import OverviewTab from './OverviewTab'
import SectionsTab from './SectionsTab'
import KeywordsTab from './KeywordsTab'

interface DashboardProps {
  analysis: ResumeAnalysis | null
  onNewAnalysis: () => void
}

// Loading Component
const LoadingDashboard = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-light text-gray-900 mb-2">Analyzing Your Resume</h2>
      <p className="text-gray-600 font-light">Please wait while we process your information...</p>
    </div>
  </div>
)

// Error Component
const ErrorDashboard = ({ onNewAnalysis }: { onNewAnalysis: () => void }) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center bg-white rounded-lg border border-gray-200 p-8 max-w-md">
      <div className="text-4xl mb-6 text-gray-400">❌</div>
      <h2 className="text-xl font-light text-gray-900 mb-4">Analysis Error</h2>
      <p className="text-gray-600 font-light mb-6">
        There was an error processing your resume analysis. Please try again.
      </p>
      <button
        onClick={onNewAnalysis}
        className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-light"
      >
        Try Again
      </button>
    </div>
  </div>
)

export default function Dashboard({ analysis, onNewAnalysis }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [mounted, setMounted] = useState(false)

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle loading state
  if (!analysis) {
    return <LoadingDashboard />
  }

  // Handle missing required properties
  if (!analysis.overallScore && !analysis.atsScore) {
    return <ErrorDashboard onNewAnalysis={onNewAnalysis} />
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'sections', label: 'Sections' },
    { id: 'keywords', label: 'Keywords' },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'industry', label: 'Industry Fit' },
    { id: 'benchmark', label: 'Benchmark' }
  ]

  const renderTabContent = () => {
    // Prevent rendering until mounted to avoid hydration issues
    if (!mounted) {
      return (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      )
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewTab analysis={analysis} />
      case 'sections':
        return <SectionsTab analysis={analysis} />
      case 'keywords':
        return <KeywordsTab analysis={analysis} />
      case 'recommendations':
        return <RecommendationsList recommendations={analysis.recommendations || []} />
      case 'industry':
        return <IndustryInsights analysis={analysis} />
      case 'benchmark':
        return <CompetitorBenchmark analysis={analysis} />
      default:
        return <OverviewTab analysis={analysis} />
    }
  }

  // Safe score calculation that prevents hydration issues
  const getScoreWithFallback = (score: number | undefined, fallback: number = 0): number => {
    if (!mounted) return fallback // Return static fallback during SSR
    return typeof score === 'number' && !isNaN(score) ? score : fallback
  }

  // Safe Math.round that prevents hydration issues
  const getRoundedScore = (score: number | undefined, fallback: number = 0): number => {
    if (!mounted) return fallback // Return static fallback during SSR
    const safeScore = typeof score === 'number' && !isNaN(score) ? score : fallback
    return Math.round(safeScore)
  }

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return <LoadingDashboard />
  }

  return (
    <div className="min-h-screen bg-white">
    

      {/* Score Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ScoreCard
            title="Overall Score"
            score={getScoreWithFallback(analysis.overallScore)}
            maxScore={10}
            color="blue"
            icon=""
            description="Comprehensive resume quality"
          />
          <ScoreCard
            title="ATS Score"
            score={getScoreWithFallback(analysis.atsScore)}
            maxScore={10}
            color="green"
            icon=""
            description="Applicant Tracking System compatibility"
          />
          <ScoreCard
            title="Readability"
            score={getScoreWithFallback(analysis.readabilityScore)}
            maxScore={10}
            color="purple"
            icon=""
            description="Content clarity and structure"
          />
          <ScoreCard
            title="Keyword Density"
            score={getRoundedScore(analysis.keywordDensity)} // Fixed: Using safe rounded score
            maxScore={100}
            color="orange"
            icon=""
            description="Industry-relevant keywords"
            suffix="%"
          />
        </div>

        {/* Quick Actions */}
        <div className="border border-gray-100 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-light text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-left">
              <h4 className="font-medium text-gray-900 mb-1">Download Report</h4>
              <p className="text-sm text-gray-600 font-light">Get detailed PDF analysis</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-left">
              <h4 className="font-medium text-gray-900 mb-1">Resume Templates</h4>
              <p className="text-sm text-gray-600 font-light">Browse optimized templates</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-left">
              <h4 className="font-medium text-gray-900 mb-1">Job Matching</h4>
              <p className="text-sm text-gray-600 font-light">Find relevant positions</p>
            </button>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-100">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-light text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab} // Simplified key to prevent hydration issues
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
