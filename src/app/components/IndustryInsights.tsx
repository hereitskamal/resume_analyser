// components/IndustryInsights.tsx
'use client'

import { ResumeAnalysis } from '@/lib/types'

interface IndustryInsightsProps {
  analysis: ResumeAnalysis
}

export default function IndustryInsights({ analysis }: IndustryInsightsProps) {
  const { industryFit, keywordMatching } = analysis

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Industry Detection */}
      <div className="text-center">
        <h2 className="text-2xl font-light text-gray-900 mb-2">
          {industryFit.detectedIndustry.charAt(0).toUpperCase() + industryFit.detectedIndustry.slice(1)} Industry
        </h2>
        <p className="text-sm text-gray-500 font-light">
          {industryFit.confidence}% confidence
        </p>
      </div>

      {/* Keywords Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Matched Keywords */}
        <div>
          <h3 className="text-lg font-light text-gray-900 mb-4">
            Present Keywords ({keywordMatching.matched.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {keywordMatching.matched.map((keyword, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-light mr-2 mb-2"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div>
          <h3 className="text-lg font-light text-gray-900 mb-4">
            Missing Keywords ({keywordMatching.missing.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {keywordMatching.missing.map((keyword, index) => (
              <span
                key={index}
                className="inline-block border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-light mr-2 mb-2 hover:border-gray-300 cursor-pointer transition-colors"
                title="Click to copy"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <h3 className="text-lg font-light text-gray-900 mb-4">Suggested Keywords</h3>
        <div className="space-y-2">
          {keywordMatching.suggestions.map((suggestion, index) => (
            <span
              key={index}
              className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-light mr-2 mb-2 cursor-pointer hover:bg-gray-800 transition-colors"
              title="Click to copy"
            >
              {suggestion}
            </span>
          ))}
        </div>
      </div>

      {/* Industry-Specific Recommendations */}
      <div className="border-t border-gray-100 pt-8">
        <h3 className="text-lg font-light text-gray-900 mb-6">Recommendations</h3>
        <div className="space-y-4">
          {industryFit.suggestions.map((suggestion, index) => (
            <div key={index} className="border-l-2 border-gray-100 pl-4">
              <p className="text-gray-600 font-light leading-relaxed">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
