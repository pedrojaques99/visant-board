import { getPortfolioItemById } from '@/utils/coda';
import { NextResponse } from 'next/server';

// Route segment config for better performance
export const runtime = 'nodejs';
export const preferredRegion = 'iad1'; // US East (N. Virginia)
export const dynamic = 'force-dynamic'; // No caching, always fetch fresh data

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const result = await getPortfolioItemById(id);
    
    if (!result.success || !result.item) {
      return NextResponse.json(
        { success: false, error: result.error || 'Item not found' },
        { status: 404 }
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