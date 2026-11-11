import { Metadata } from 'next';
import { ProgramForm } from '@/components/dashboard/ProgramForm';

export const metadata: Metadata = {
  title: 'New Program | IPA Dashboard',
  description: 'Create and publish a new civic education, public dialogue, or policy fellowship program.',
};

export default function NewProgramPage() {
  return <ProgramForm />;
}
