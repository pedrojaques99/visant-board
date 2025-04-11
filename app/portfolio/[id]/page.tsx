import { getPortfolioItemById } from '@/utils/coda';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: Props) {
  const result = await getPortfolioItemById(params.id);

  if (!result.success || !result.item) {
    notFound();
  }

  const { item } = result;
  
  // Collect all valid images
  const images = [item.image01, item.image02, item.image03, item.image04]
    .filter((url): url is string => typeof url === 'string')
    .map(url => url.trim())
    .filter(url => url.length > 0 && url.startsWith('http'));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link 
          href="/portfolio"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Portfolio
        </Link>

        {/* Project header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {item.title || 'Untitled Project'}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-muted-foreground">{item.client || 'No client specified'}</span>
            {item.date && (
              <>
                <span className="text-muted-foreground/60">•</span>
                <span className="text-muted-foreground">{item.date}</span>
              </>
            )}
            {item.type && (
              <>
                <span className="text-muted-foreground/60">•</span>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-muted text-muted-foreground">
                  {item.type}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Project description */}
        {(item.description || item.ptbr) && (
          <div className="prose max-w-none mb-12">
            {item.description && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            )}
            {item.ptbr && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground">{item.ptbr}</p>
              </div>
            )}
          </div>
        )}

        {/* Project images */}
        {images.length > 0 ? (
          <div className="grid gap-8">
            {images.map((imageUrl, index) => (
              <div key={imageUrl} className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={imageUrl}
                  alt={`${item.title || 'Project'} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority={index === 0}
                  quality={90}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">No images available for this project</p>
          </div>
        )}
      </div>
    </div>
  );
} 