// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Resume Analyzer',
  description: 'AI-powered resume analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white">
        {/* Fixed Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/5 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-center py-4">
              <Link 
                href="/" 
                className="md:text-xl font-light text-gray-900 hover:text-gray-700 transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-light">R</span>
                </div>
                Resume Analyzer
              </Link>
              
              <div className="flex items-center space-x-6">
                <Link 
                  href="/history" 
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  History
                </Link>
                
                <Link 
                  href="/about" 
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content with top padding to account for fixed nav */}
        <main className="pt-16">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-gray-100 mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-light">R</span>
                </div>
                <span className="text-sm text-gray-900">Resume Analyzer</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <Link 
                  href="/privacy"
                  className="text-xs text-gray-500 hover:text-gray-700 font-light transition-colors"
                >
                  Privacy
                </Link>
                <Link 
                  href="/support" 
                  className="text-xs text-gray-500 hover:text-gray-700 font-light transition-colors"
                >
                  Support
                </Link>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 font-light">
                © 2025 Resume Analyzer. Built with Next.js 15 & React 19.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
