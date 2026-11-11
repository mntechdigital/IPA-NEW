import { Metadata } from 'next';
import { CampaignForm } from '@/components/dashboard/CampaignForm';

export const metadata: Metadata = {
  title: 'Edit Campaign | IPA Dashboard',
  description: 'Modify campaign goals, narrative rationale, and action frameworks.',
};

interface EditCampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCampaignPage({ params }: EditCampaignPageProps) {
  const { id } = await params;
  return <CampaignForm initialId={id} />;
}
