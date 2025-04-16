import { getStatistics } from '@/utils/coda';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await getStatistics();
    
    if (!response.success) {
      return NextResponse.json({ error: response.error }, { status: 500 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in statistics route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 