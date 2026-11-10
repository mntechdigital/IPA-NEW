import { Metadata } from 'next';
import { ResearchExplorer } from '@/components/research/ResearchExplorer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getResearchItems } from '@/lib/services/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Research & Publications | IPA — Institute of Public Affairs',
  description: 'Searchable repository of peer-reviewed empirical studies, policy briefs, and working papers on media integrity and public affairs.',
};

interface ResearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResearchPage({ searchParams }: ResearchPageProps) {
  const [params, items] = await Promise.all([
    searchParams,
    getResearchItems(),
  ]);

  const initialCategory = typeof params?.category === 'string' ? params.category : undefined;
  const initialType = typeof params?.type === 'string' ? params.type : undefined;

  return (
    <>
      <Breadcrumbs items={[{ label: 'Research & Publications' }]} />
      <ResearchExplorer initialCategory={initialCategory} initialType={initialType} items={items} />
    </>
  );
}
