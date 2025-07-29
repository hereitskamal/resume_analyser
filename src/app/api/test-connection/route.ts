import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('Testing MongoDB connection...')
    const client = await clientPromise
    const db = client.db('resume-analyzer')
    
    // Test connection with ping
    await db.command({ ping: 1 })
    
    console.log('✅ MongoDB connection successful')
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: 'resume-analyzer'
    })
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
