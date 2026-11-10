import { Metadata } from 'next';
import { ResearchForm } from '@/components/dashboard/ResearchForm';

export const metadata: Metadata = {
  title: 'Edit Publication | IPA Dashboard',
  description: 'Modify empirical research study or policy brief.',
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditResearchPage({ params }: EditPageProps) {
  const { id } = await params;
  return <ResearchForm initialId={id} />;
}
