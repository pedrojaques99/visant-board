import { getPortfolioItemById, getPortfolioItems } from '@/utils/coda';
import { notFound } from 'next/navigation';
import ClientWrapper from './client-wrapper';

interface Props {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: Props) {
  try {
    const { id } = await Promise.resolve(params);
    const response = await getPortfolioItemById(id);

    if (!response.success || !response.item) {
      return notFound();
    }
    
    return <ClientWrapper id={id} initialData={response.item} />;
  } catch (error) {
    console.error('Error in ProjectPage:', error);
    return notFound();
  }
}

export async function generateStaticParams() {
  try {
    const response = await getPortfolioItems();
    if (!response.success || !response.items) {
      return [];
    }
    return response.items.map((item) => ({
      id: item.id,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
} 