import { Metadata } from 'next';
import { ProgramForm } from '@/components/dashboard/ProgramForm';

export const metadata: Metadata = {
  title: 'Edit Program | IPA Dashboard',
  description: 'Modify institutional program curriculum, objectives, and fellowship details.',
};

interface EditProgramPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  const { id } = await params;
  return <ProgramForm initialId={id} />;
}
