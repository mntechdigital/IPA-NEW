import { Metadata } from 'next';
import { NewsForm } from '@/components/dashboard/NewsForm';

export const metadata: Metadata = {
  title: 'Edit News Article | IPA Dashboard',
  description: 'Update article headlines, content dispatches, and press media attachments.',
};

interface EditNewsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;
  return <NewsForm initialId={id} />;
}
