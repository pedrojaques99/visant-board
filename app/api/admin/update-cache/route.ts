import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updatePortfolioCache } from '@/utils/coda';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'visant2024';
const TABLE_ID = 'grid-7B5GxoqgKn'; // ID específico da tabela do portfólio

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.log(`[Cache Update] Iniciando atualização da tabela ${TABLE_ID}...`);
    
    // Atualiza o cache do portfólio
    await updatePortfolioCache();
    
    // Força revalidação das rotas que usam os dados
    console.log('[Cache Update] Revalidando rotas...');
    revalidatePath('/portfolio');
    revalidatePath('/');
    revalidatePath('/portfolio/[id]', 'layout');

    console.log('[Cache Update] Cache atualizado com sucesso');
    return NextResponse.json({ 
      success: true,
      message: 'Cache atualizado com sucesso'
    });
  } catch (error) {
    console.error('[Cache Update] Erro ao atualizar cache:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro ao atualizar cache',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 