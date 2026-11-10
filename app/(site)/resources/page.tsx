import { Metadata } from 'next';
import { ResourcesExplorer } from '@/components/resources/ResourcesExplorer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getResources } from '@/lib/services/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Resources & Knowledge Hub | IPA — Institute of Public Affairs',
  description: 'Searchable repository of open-access policy briefs, research datasets, Right to Information toolkits, and educational curriculums.',
};

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <>
      <Breadcrumbs items={[{ label: 'Resources' }]} />
      <ResourcesExplorer items={resources} />
    </>
  );
}
