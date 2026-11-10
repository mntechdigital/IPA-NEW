import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProgramBySlug, getPrograms } from '@/lib/services/content';
import { ProgramDetailView } from '@/components/programs/ProgramDetailView';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const dynamic = 'force-dynamic';

interface ProgramDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = await getPrograms();
  return items.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: 'Program Not Found' };

  return {
    title: `${program.title} | IPA Programs`,
    description: program.description.slice(0, 160),
  };
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs 
        items={[
          { label: 'Programs & Initiatives', href: '/programs' },
          { label: program.title }
        ]} 
      />
      <ProgramDetailView program={program} />
    </>
  );
}
