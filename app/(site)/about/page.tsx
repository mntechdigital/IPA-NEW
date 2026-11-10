import { Metadata } from 'next';
import { AboutView } from '@/components/about/AboutView';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  getSiteSettings,
  getTeamMembers,
  getCoreValues,
  getAboutSettings,
} from '@/lib/services/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About the Institute | IPA — Institute of Public Affairs',
  description:
    'Learn about the mission, vision, research directorates, and leadership fellows of the Institute of Public Affairs.',
};

export default async function AboutPage() {
  const [settings, teamMembers, values, aboutSettings] = await Promise.all([
    getSiteSettings(),
    getTeamMembers(),
    getCoreValues(),
    getAboutSettings(),
  ]);

  return (
    <>
      <Breadcrumbs items={[{ label: 'About IPA' }]} />
      <AboutView
        settings={settings}
        teamMembers={teamMembers}
        values={values}
        aboutSettings={aboutSettings}
      />
    </>
  );
}
