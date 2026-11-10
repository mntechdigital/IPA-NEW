import { Metadata } from 'next';
import { ResearchForm } from '@/components/dashboard/ResearchForm';

export const metadata: Metadata = {
  title: 'New Publication | IPA Dashboard',
  description: 'Create and publish a new empirical research study or policy brief.',
};

export default function NewResearchPage() {
  return <ResearchForm />;
}
