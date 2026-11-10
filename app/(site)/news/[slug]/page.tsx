import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNewsItemBySlug, getNewsItems } from '@/lib/services/content';
import { NewsDetailView } from '@/components/news/NewsDetailView';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const dynamic = 'force-dynamic';

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = await getNewsItems();
  return items.map((n) => ({
    slug: n.slug,
  }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItemBySlug(slug);
  if (!item) return { title: 'Dispatch Not Found' };

  return {
    title: `${item.title} | IPA Newsroom`,
    description: item.summary.slice(0, 160),
    openGraph: {
      title: item.title,
      description: item.summary.slice(0, 160),
      type: 'article',
      publishedTime: item.date,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const item = await getNewsItemBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs 
        items={[
          { label: 'News & Media', href: '/news' },
          { label: item.title }
        ]} 
      />
      <NewsDetailView item={item} />
    </>
  );
}
