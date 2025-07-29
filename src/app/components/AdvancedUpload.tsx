// components/AdvancedUpload.tsx
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { AnalysisResponse } from '@/lib/types'
import { pdfjs } from 'react-pdf'

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.js'
}

interface AdvancedUploadProps {
  onAnalysisComplete: (result: AnalysisResponse) => void
}

export default function AdvancedUpload({ onAnalysisComplete }: AdvancedUploadProps) {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [targetIndustry, setTargetIndustry] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'paste'>('upload')
  const [progress, setProgress] = useState(0)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // PDF text extraction function
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
      let fullText = ''

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        
        const pageText = textContent.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => {
            if ('str' in item) {
              return item.str
            }
            return ''
          })
          .join(' ')
        
        fullText += pageText + ' '
      }

      return fullText.trim()
    } catch (error) {
      console.error('PDF extraction error:', error)
      throw new Error('Failed to extract text from PDF. Please try again or use a different format.')
    }
  }

  // DOCX text extraction function
  const extractTextFromDOCX = async (file: File): Promise<string> => {
    try {
      const mammoth = await import('mammoth')
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      return result.value
    } catch (error) {
      console.error('DOCX extraction error:', error)
      throw new Error('Failed to extract text from DOCX. Please try again or use a different format.')
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsProcessingFile(true)
    setError(null)

    try {
      let text = ''

      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file)
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await extractTextFromDOCX(file)
      } else if (file.type === 'text/plain') {
        text = await file.text()
      } else {
        throw new Error('Unsupported file type. Please use PDF, DOCX, or TXT files.')
      }

      if (!text.trim()) {
        throw new Error('No text content found in the file. Please check your file and try again.')
      }

      setResumeText(text)
      setError(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('File processing error:', error)
    } finally {
      setIsProcessingFile(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0]
      if (rejection.errors[0].code === 'file-too-large') {
        setError('File is too large. Please use a file smaller than 10MB.')
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Invalid file type. Please use PDF, DOCX, or TXT files only.')
      } else {
        setError('File upload failed. Please try again.')
      }
    }
  })

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please provide resume content')
      return
    }

    if (resumeText.trim().length < 100) {
      setError('Resume content is too short. Please provide more details.')
      return
    }

    setIsAnalyzing(true)
    setProgress(0)
    setError(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90))
    }, 200)

    try {
      const response = await fetch('/api/analyze-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          jobDescription: jobDescription.trim() || undefined,
          targetIndustry: targetIndustry || undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Analysis failed' }))
        throw new Error(errorData.message || `Server error: ${response.status}`)
      }

      const result: AnalysisResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Analysis failed')
      }

      setProgress(100)
      
      setTimeout(() => {
        onAnalysisComplete(result)
      }, 500)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(`Analysis failed: ${errorMessage}`)
      console.error('Analysis error:', error)
    } finally {
      clearInterval(progressInterval)
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6">
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto float-right text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </motion.div>
      )}

      {/* Method Selection */}
      <div className="flex justify-center mb-8">
        <div className="border border-gray-200 rounded-lg p-1 flex">
          <button
            onClick={() => setUploadMethod('upload')}
            className={`px-6 py-2 rounded-md text-sm font-light transition-colors ${
              uploadMethod === 'upload'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setUploadMethod('paste')}
            className={`px-6 py-2 rounded-md text-sm font-light transition-colors ${
              uploadMethod === 'paste'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <AnimatePresence mode="wait">
        {uploadMethod === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8"
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400'
              } ${isProcessingFile ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input {...getInputProps()} disabled={isProcessingFile} />
              <div className="text-4xl mb-4 text-gray-400">
                {isProcessingFile ? '⏳' : '📄'}
              </div>
              <p className="text-lg font-light text-gray-900 mb-2">
                {isProcessingFile
                  ? 'Processing file...'
                  : isDragActive
                  ? 'Drop your resume here'
                  : 'Drop your resume or click to browse'}
              </p>
              <p className="text-sm text-gray-500">
                PDF, DOCX, or TXT files up to 10MB
              </p>
            </div>
          </motion.div>
        )}

        {uploadMethod === 'paste' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8"
          >
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content here..."
              className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none text-sm font-light"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Additional Options */}
      {resumeText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Job Description (Optional) */}
          <div>
            <label className="block text-sm font-light text-gray-600 mb-2">
              Job Description (Optional)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description you're targeting..."
              className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none text-sm font-light"
            />
          </div>

          {/* Industry Selection */}
          <div>
            <label className="block text-sm font-light text-gray-600 mb-2">
              Target Industry
            </label>
            <select
              value={targetIndustry}
              onChange={(e) => setTargetIndustry(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light"
            >
              <option value="">Auto-detect</option>
              <option value="software">Software Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
              <option value="design">Design</option>
              <option value="sales">Sales</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
            </select>
          </div>

          {/* Resume Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-light text-gray-600 mb-2">
              Resume loaded: {resumeText.length} characters
            </p>
            <div className="max-h-16 overflow-y-auto">
              <p className="text-xs text-gray-500 font-light">
                {resumeText.substring(0, 200)}...
              </p>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || isProcessingFile}
            className="w-full bg-gray-900 text-white py-4 rounded-lg font-light text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Analyzing... {progress}%
              </div>
            ) : (
              'Analyze Resume'
            )}
          </button>

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="w-full bg-gray-200 rounded-full h-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-1 bg-gray-900 rounded-full"
              />
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
