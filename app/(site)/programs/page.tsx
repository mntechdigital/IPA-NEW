import { Metadata } from 'next';
import { ProgramsExplorer } from '@/components/programs/ProgramsExplorer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getPrograms } from '@/lib/services/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Programs & Initiatives | IPA — Institute of Public Affairs',
  description: 'Explore the core action frameworks, community dialogues, and youth public policy fellowships of IPA.',
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <Breadcrumbs items={[{ label: 'Programs & Initiatives' }]} />
      <ProgramsExplorer items={programs} />
    </>
  );
}
