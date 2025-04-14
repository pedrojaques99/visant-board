import { listCodaTableColumnIds } from '@/utils/coda';
import { NextResponse } from 'next/server';

export async function GET() {
  // Using the portfolio table ID from your existing code
  const result = await listCodaTableColumnIds('grid-7B5GsoqgKn');
  return NextResponse.json(result);
} 