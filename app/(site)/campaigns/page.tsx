import { Metadata } from 'next';
import { CampaignsExplorer } from '@/components/campaigns/CampaignsExplorer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getCampaigns } from '@/lib/services/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Campaigns & Advocacy | IPA — Institute of Public Affairs',
  description: 'Public awareness and civic advocacy campaigns led by IPA to foster digital discernment and democratic transparency.',
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <>
      <Breadcrumbs items={[{ label: 'Campaigns' }]} />
      <CampaignsExplorer items={campaigns} />
    </>
  );
}
