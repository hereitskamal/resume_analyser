/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SectionsTab.tsx
'use client'

import { motion } from 'framer-motion'
import { ResumeAnalysis } from '@/lib/types'
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react'

interface SectionsTabProps {
  analysis: ResumeAnalysis
}

export default function SectionsTab({ analysis }: SectionsTabProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {Object.entries(analysis.sections).map(([sectionName, section], index) => (
        <motion.div
          key={sectionName}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-gray-100 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 capitalize">
              {sectionName}
            </h3>
            <div className="flex items-center space-x-3">
              <span className={`w-2 h-2 rounded-full ${section.present ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm text-gray-900 font-medium">
                {section.score}/10
              </span>
            </div>
          </div>

          <p className="text-gray-600 font-light mb-4">{section.feedback}</p>

          {section.improvements.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm">Improvements:</h4>
              <div className="space-y-2">
                {section.improvements.map((improvement: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, idx: Key | null | undefined) => (
                  <div key={idx} className="border-l-2 border-gray-100 pl-3">
                    <p className="text-sm text-gray-600 font-light">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
