import { Metadata } from 'next';
import { ContactView } from '@/components/contact/ContactView';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getSiteSettings } from '@/lib/services/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact the Institute | IPA — Institute of Public Affairs',
  description: 'Connect with the IPA secretariat, submit research inquiries, media interview requests, or civic partnership proposals.',
};

interface ContactPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const [params, settings] = await Promise.all([
    searchParams,
    getSiteSettings(),
  ]);
  const initialIntent = typeof params?.intent === 'string' ? params.intent : undefined;

  return (
    <>
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <ContactView initialIntent={initialIntent} settings={settings} />
    </>
  );
}
