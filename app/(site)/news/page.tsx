import { Metadata } from 'next';
import { NewsExplorer } from '@/components/news/NewsExplorer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getNewsItems } from '@/lib/services/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'News & Media | IPA — Institute of Public Affairs',
  description: 'Official announcements, event recaps, press statements, and dispatches from the Institute of Public Affairs.',
};

interface NewsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const [params, news] = await Promise.all([
    searchParams,
    getNewsItems(),
  ]);

  const initialCategory = typeof params?.category === 'string' ? params.category : undefined;

  return (
    <>
      <Breadcrumbs items={[{ label: 'News & Media' }]} />
      <NewsExplorer initialCategory={initialCategory} items={news} />
    </>
  );
}
