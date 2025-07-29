import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('resume-analyzer')
    const collection = db.collection('analyses')

    const analyses = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json({
      success: true,
      analyses: analyses.map(analysis => ({
        id: analysis._id.toString(),
        overallScore: analysis.analysis.overallScore,
        atsScore: analysis.analysis.atsScore,
        createdAt: analysis.createdAt,
        preview: analysis.resumeText.substring(0, 150) + '...'
      }))
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        message: 'Failed to fetch history', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
