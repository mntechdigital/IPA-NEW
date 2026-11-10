import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getResearchItemBySlug, getResearchItems } from '@/lib/services/content';
import { PublicationDetailView } from '@/components/research/PublicationDetailView';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const dynamic = 'force-dynamic';

interface PublicationDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = await getResearchItems();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PublicationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getResearchItemBySlug(slug);
  if (!item) return { title: 'Publication Not Found' };

  return {
    title: `${item.title} | IPA Research`,
    description: item.abstract.slice(0, 160),
    openGraph: {
      title: item.title,
      description: item.abstract.slice(0, 160),
      type: 'article',
      publishedTime: item.date,
      authors: item.authors.map((a) => a.name),
    },
  };
}

export default async function PublicationDetailPage({ params }: PublicationDetailPageProps) {
  const { slug } = await params;
  const [item, allItems] = await Promise.all([
    getResearchItemBySlug(slug),
    getResearchItems(),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs 
        items={[
          { label: 'Research & Publications', href: '/research' },
          { label: item.title }
        ]} 
      />
      <PublicationDetailView item={item} relatedItems={allItems} />
    </>
  );
}
