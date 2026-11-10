import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCampaignBySlug, getCampaigns } from '@/lib/services/content';
import { CampaignDetailView } from '@/components/campaigns/CampaignDetailView';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const dynamic = 'force-dynamic';

interface CampaignDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = await getCampaigns();
  return items.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: CampaignDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) return { title: 'Campaign Not Found' };

  return {
    title: `${campaign.title} | IPA Campaigns`,
    description: campaign.introduction.slice(0, 160),
  };
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs 
        items={[
          { label: 'Campaigns', href: '/campaigns' },
          { label: campaign.title }
        ]} 
      />
      <CampaignDetailView campaign={campaign} />
    </>
  );
}
