'use client'

import { useState, useEffect } from 'react'
import { ResumeHistory, HistoryResponse } from '@/lib/types'

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<ResumeHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/resumes')
      const data: HistoryResponse = await response.json()
      if (data.success) {
        setAnalyses(data.analyses)
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
    setLoading(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-blue-600 bg-blue-100'
    if (score >= 4) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">📊 Analysis History</h1>
        <div className="text-sm text-gray-600">
          {analyses.length} total analyses
        </div>
      </div>
      
      {analyses.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">📄</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">No analyses yet</h3>
          <p className="text-gray-600 text-lg mb-8">
            Upload your first resume to get started with AI-powered analysis
          </p>
          <a  className="btn-primary inline-block text-lg px-8 py-3">
            Analyze Your First Resume
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {analyses.map((analysis) => (
            <div 
              key={analysis.id} 
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(analysis.overallScore)}`}>
                      Overall: {analysis.overallScore}/10
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(analysis.atsScore)}`}>
                      ATS: {analysis.atsScore}/10
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    📅 {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right max-w-md ml-4">
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <p className="text-sm text-gray-600 italic leading-relaxed">
                      {analysis.preview}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
