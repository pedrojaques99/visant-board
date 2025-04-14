import { getPortfolioData } from '@/utils/coda';
import { NextResponse } from 'next/server';

// Route segment config for better performance
export const runtime = 'nodejs';
export const preferredRegion = 'iad1'; // US East (N. Virginia)
export const dynamic = 'force-dynamic'; // No caching, always fetch fresh data

export async function GET() {
  try {
    const result = await getPortfolioData();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to fetch portfolio data' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 