import React from 'react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BackToTop } from '@/components/ui/BackToTop';
import { getSiteSettings } from '@/lib/services/content';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <AnnouncementBar announcement={settings.announcement} />
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} />
      <BackToTop />
    </>
  );
}
