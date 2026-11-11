import { Metadata } from 'next';
import { CampaignForm } from '@/components/dashboard/CampaignForm';

export const metadata: Metadata = {
  title: 'New Campaign | IPA Dashboard',
  description: 'Create and launch a new public campaign or civic advocacy initiative.',
};

export default function NewCampaignPage() {
  return <CampaignForm />;
}
