// app/page.tsx
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ResumeAnalysis, AnalysisResponse } from '@/lib/types'

// Dynamically import components that use browser APIs
const ResumeUpload = dynamic(() => import('@/app/components/ResumeUpload'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-64">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
    </div>
  )
})

const Dashboard = dynamic(() => import('@/app/components/Dashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
    </div>
  )
})

export default function HomePage() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  // const [isLoading, setIsLoading] = useState(false)

  const handleAnalysisComplete = (result: AnalysisResponse) => {
    // setIsLoading(false)
    if (result.success && result.analysis) {
      setAnalysis(result.analysis)
    } else {
      console.error('Analysis failed:', result)
      alert('Analysis failed. Please try again.')
      setAnalysis(null)
    }
  }

  const handleNewAnalysis = () => {
    setAnalysis(null)
    // setIsLoading(false)
  }

  const handleAnalysisStart = () => {
    // setIsLoading(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {analysis ? (
        <Dashboard 
          analysis={analysis} 
          onNewAnalysis={handleNewAnalysis}
        />
      ) : (
        <div className="max-w-2xl mx-auto px-6 py-20">
          {/* Minimal Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              Resume Analyzer
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Get instant feedback on your resume
            </p>
          </div>

          {/* Upload Component */}
          <ResumeUpload 
            onAnalysisComplete={handleAnalysisComplete}
            onAnalysisStart={handleAnalysisStart}
          />
        </div>
      )}
    </div>
  )
}
