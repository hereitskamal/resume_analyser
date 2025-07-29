// app/api/analyze-advanced/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { analyzeResumeAdvanced } from '@/lib/advanced-analyzer'
import clientPromise from '@/lib/mongodb'
import { rateLimit } from '@/lib/rate-limit'

interface AnalyzeRequest {
  resumeText: string
  jobDescription?: string
  targetIndustry?: string
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous'
    const { success } = await rateLimit.limit(identifier)
    
    if (!success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    console.log('🚀 Advanced Analyze API called')
    
    const { resumeText, jobDescription, targetIndustry }: AnalyzeRequest = await request.json()

    // Validation
    if (!resumeText || resumeText.trim().length < 100) {
      return NextResponse.json(
        { message: 'Resume text is too short (minimum 100 characters)' },
        { status: 400 }
      )
    }

    if (resumeText.length > 25000) {
      return NextResponse.json(
        { message: 'Resume text is too long (maximum 25,000 characters)' },
        { status: 400 }
      )
    }

    // Advanced analysis
    console.log('🤖 Starting advanced resume analysis...')
    const analysis = await analyzeResumeAdvanced(resumeText, jobDescription, targetIndustry)
    console.log('✅ Advanced analysis completed')

    // Save to MongoDB with enhanced data
    let savedId = null
    try {
      const client = await clientPromise
      const db = client.db('resume-analyzer-pro')
      const collection = db.collection('analyses')

      const document = {
        resumeText: resumeText.substring(0, 2000), // Store more text
        jobDescription: jobDescription?.substring(0, 1000),
        targetIndustry,
        analysis,
        createdAt: new Date(),
        ipAddress: identifier,
        userAgent: request.headers.get('user-agent') || 'unknown',
        aiProvider: 'advanced-analyzer',
        version: '2.0'
      }

      const result = await collection.insertOne(document)
      savedId = result.insertedId.toString()
      console.log('💾 Advanced analysis saved to MongoDB')
    } catch (mongoError) {
      console.warn('⚠️ MongoDB save failed:', mongoError)
    }

    return NextResponse.json({
      success: true,
      analysis,
      id: savedId || `temp-${Date.now()}`,
      provider: 'advanced-analyzer',
      version: '2.0'
    })

  } catch (error) {
    console.error('💥 Advanced API Error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Advanced analysis failed', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
