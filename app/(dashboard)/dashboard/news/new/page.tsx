import { Metadata } from 'next';
import { NewsForm } from '@/components/dashboard/NewsForm';

export const metadata: Metadata = {
  title: 'New Press Release | IPA Dashboard',
  description: 'Draft and publish a new institutional press release, announcement, or media dispatch.',
};

export default function NewNewsPage() {
  return <NewsForm />;
}
