'use client'

import { useState } from 'react'
import { pdfjs } from 'react-pdf'

// Configure worker for React-PDF
pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.js'

interface PDFViewerProps {
  onTextExtracted: (text: string) => void
}

export default function PDFViewer({ onTextExtracted }: PDFViewerProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      
      fileReader.onload = async () => {
        try {
          const typedArray = new Uint8Array(fileReader.result as ArrayBuffer)
          const pdf = await pdfjs.getDocument({ data: typedArray }).promise
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

          resolve(fullText.trim())
        } catch (error) {
          reject(error)
        }
      }

      fileReader.onerror = () => reject(new Error('File reading failed'))
      fileReader.readAsArrayBuffer(file)
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size too large. Please upload a file smaller than 10MB.')
      return
    }

    setIsProcessing(true)

    try {
      const text = await extractTextFromPDF(file)
      onTextExtracted(text)
    } catch (error) {
      console.error('PDF processing error:', error)
      alert('Error processing PDF. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
        id="pdf-upload"
        disabled={isProcessing}
      />
      <label htmlFor="pdf-upload" className="cursor-pointer block">
        <div className="text-4xl mb-4 text-gray-400">📄</div>
        <p className="text-lg font-light text-gray-900 mb-2">
          {isProcessing ? 'Processing PDF...' : 'Click to upload PDF'}
        </p>
        <p className="text-sm text-gray-500 font-light">
          Supports PDF files up to 10MB
        </p>
        {isProcessing && (
          <div className="mt-4">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-500 mt-2 font-light">Extracting text...</p>
          </div>
        )}
      </label>
    </div>
  )
}
