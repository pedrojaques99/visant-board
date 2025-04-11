import { getPortfolioItemById } from '@/utils/coda';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/breadcrumb';

// Add region configuration for Vercel deployment
export const runtime = 'nodejs';
export const preferredRegion = 'iad1'; // US East (N. Virginia)

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

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: item.title || 'Project Details' },
  ];

  return (
    <main className="min-h-screen bg-background antialiased pb-12">
      <div className="border-b bg-muted/40">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        {/* Project header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
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
          <div className="prose prose-gray dark:prose-invert max-w-none mb-12">
            {item.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-foreground">Description</h2>
                <p className="text-muted-foreground text-lg">{item.description}</p>
              </div>
            )}
            {item.ptbr && (
              <div>
                <h2 className="text-xl font-semibold mb-3 text-foreground">Descrição</h2>
                <p className="text-muted-foreground text-lg">{item.ptbr}</p>
              </div>
            )}
          </div>
        )}

        {/* Project images */}
        {images.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 md:gap-10">
            {images.map((imageUrl, index) => (
              <div 
                key={imageUrl} 
                className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg bg-muted"
              >
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
          <div className="text-center py-12 rounded-lg border border-border bg-muted/40">
            <p className="text-muted-foreground">No images available for this project</p>
          </div>
        )}
      </div>
    </main>
  );
} 