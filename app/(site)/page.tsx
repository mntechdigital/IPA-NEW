import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { OrgIntroSection } from '@/components/home/OrgIntroSection';
import { LatestProgramsSection } from '@/components/home/LatestProgramsSection';
import { FeaturedResearchSection } from '@/components/home/FeaturedResearchSection';
import { CampaignsSection } from '@/components/home/CampaignsSection';
import { NewsSection } from '@/components/home/NewsSection';
import { ImpactSection } from '@/components/home/ImpactSection';
import { KnowledgeHubSection } from '@/components/home/KnowledgeHubSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import {
  getSiteSettings,
  getImpactIndicators,
  getLatestPrograms,
  getResearchItems,
  getCampaigns,
  getNewsItems,
  getResources,
} from '@/lib/services/content';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [
    settings,
    impactIndicators,
    latestPrograms,
    researchItems,
    campaigns,
    newsItems,
    resources,
  ] = await Promise.all([
    getSiteSettings(),
    getImpactIndicators(),
    getLatestPrograms(3),
    getResearchItems(),
    getCampaigns(),
    getNewsItems(),
    getResources(),
  ]);

  return (
    <>
      <HeroSection settings={settings} />
      <OrgIntroSection settings={settings} />
      <LatestProgramsSection programs={latestPrograms} />
      <FeaturedResearchSection items={researchItems} campaigns={campaigns} />
      <CampaignsSection campaigns={campaigns} />
      <NewsSection news={newsItems} />
      <ImpactSection indicators={impactIndicators} />
      <KnowledgeHubSection resources={resources} />
      <NewsletterSection />
    </>
  );
}
