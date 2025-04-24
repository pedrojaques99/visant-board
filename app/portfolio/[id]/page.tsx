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
    
    // Fetch current project and all portfolio items in parallel
    const [projectResponse, portfolioResponse] = await Promise.all([
      getPortfolioItemById(id),
      getPortfolioItems()
    ]);

    if (!projectResponse.success || !projectResponse.item) {
      return notFound();
    }

    // Get related projects (same category/type, excluding current project)
    const relatedProjects = portfolioResponse.success && portfolioResponse.items 
      ? portfolioResponse.items
          .filter(item => 
            item.id !== id && // Exclude current project
            item.type === projectResponse.item.type // Same type/category
          )
          .sort(() => Math.random() - 0.5) // Randomize order
          .slice(0, 3) // Get up to 3 related projects
      : [];
    
    return (
      <ClientWrapper 
        id={id} 
        initialData={projectResponse.item}
        relatedProjects={relatedProjects}
      />
    );
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