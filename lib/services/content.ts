import { prisma } from '@/lib/prisma';
import { ORGANIZATION } from '@/data/organization';
import { RESEARCH_ITEMS } from '@/data/research';
import { PROGRAMS } from '@/data/programs';
import { CAMPAIGNS } from '@/data/campaigns';
import { NEWS_ITEMS } from '@/data/news';
import { RESOURCES } from '@/data/resources';
import { TEAM_MEMBERS } from '@/data/team';
import { ResearchItem, ProgramItem, CampaignItem, NewsItem, ResourceItem, TeamMember } from '@/types';

export async function getSiteSettings() {
  try {
    const [settings, rawMedia] = await Promise.all([
      prisma.siteSetting.findUnique({
        where: { id: 'default' },
      }),
      prisma.$queryRaw<any[]>`SELECT "heroImage", "heroVideoUrl", "heroVideoActive" FROM "SiteSetting" WHERE "id" = 'default' LIMIT 1`.catch(() => []),
    ]);

    const media = rawMedia[0] || {};
    if (settings) {
      return {
        ...ORGANIZATION,
        name: settings.siteName,
        shortName: settings.shortName,
        tagline: settings.tagline,
        editorialLead: settings.editorialLead,
        mission: settings.mission,
        vision: settings.vision,
        heroImage: media.heroImage || (settings as any).heroImage || '/images/hero_public_dialogue.jpg',
        heroVideoUrl: media.heroVideoUrl ?? (settings as any).heroVideoUrl ?? null,
        heroVideoActive: media.heroVideoActive !== undefined ? Boolean(media.heroVideoActive) : (settings as any).heroVideoActive ?? false,
        contactEmail: settings.contactEmail || undefined,
        contactPhone: settings.contactPhone || undefined,
        contactAddress: settings.contactAddress || undefined,
        facebookUrl: settings.facebookUrl || undefined,
        twitterUrl: settings.twitterUrl || undefined,
        linkedinUrl: settings.linkedinUrl || undefined,
        youtubeUrl: settings.youtubeUrl || undefined,
        announcement: {
          id: 'ann-live',
          text: settings.announcementText || ORGANIZATION.announcement.text,
          linkText: settings.announcementLinkText || ORGANIZATION.announcement.linkText,
          href: settings.announcementHref || ORGANIZATION.announcement.href,
          active: settings.announcementActive ?? true,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching site settings from DB:', error);
  }
  return ORGANIZATION;
}

export async function getFocusAreas() {
  try {
    const areas = await prisma.focusArea.findMany({
      orderBy: { order: 'asc' },
    });
    return areas.map((a) => ({
      id: a.slug,
      title: a.title,
      description: a.description,
      slug: a.slug,
      metrics: a.metrics,
    }));
  } catch (error) {
    console.error('Error fetching focus areas from DB:', error);
    return ORGANIZATION.focusAreas;
  }
}

export async function getImpactIndicators() {
  try {
    const indicators = await prisma.impactIndicator.findMany({
      orderBy: { order: 'asc' },
    });
    return indicators.map((ind) => ({
      value: ind.value,
      label: ind.label,
      descriptor: ind.descriptor,
    }));
  } catch (error) {
    console.error('Error fetching impact indicators from DB:', error);
    return ORGANIZATION.impactIndicators;
  }
}

export async function getCoreValues() {
  try {
    const values = await prisma.coreValue.findMany({
      orderBy: { order: 'asc' },
    });
    return values.map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description,
    }));
  } catch (error) {
    console.error('Error fetching core values from DB:', error);
    return ORGANIZATION.values;
  }
}

export interface AboutSettingData {
  id: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  mandateEyebrow: string;
  mandateTitle: string;
  mandateParagraph1: string;
  mandateParagraph2: string;
  mandatePrinciplesTitle: string;
  mandatePrinciples: string;
  mandateImage: string;
  mandateImageLabel: string;
  mandateImageCaption: string;
  milestones: { year: string; title: string; desc: string }[];
  collaborators: string[];
}

export const DEFAULT_ABOUT_SETTINGS: AboutSettingData = {
  id: 'default',
  heroEyebrow: 'INSTITUTIONAL PROFILE & GOVERNANCE',
  heroTitle: 'About the Institute of Public Affairs',
  heroDescription:
    'Strengthening public understanding, media integrity, and democratic participation through empirical research and inclusive civic dialogue.',
  mandateEyebrow: 'FOUNDATIONAL MANDATE',
  mandateTitle: 'An Independent Hub for Evidence and Public Deliberation',
  mandateParagraph1:
    'The Institute of Public Affairs (IPA) was established to address a critical deficit in contemporary democratic governance: the widening chasm between academic empirical analysis, media reporting standards, and active citizen participation.',
  mandateParagraph2:
    'Operating without partisan affiliations or commercial ownership interests, IPA serves as a trusted research foundation and deliberative bridge. We monitor information ecosystems, publish peer-reviewed policy briefs, and organize structured community hearings where citizens examine local governance challenges alongside public officials.',
  mandatePrinciplesTitle: 'Our Research Principles:',
  mandatePrinciples:
    'Every study published by IPA undergoes rigorous double-blind methodological review, adheres to open-access data archiving, and prioritizes actionable civic utility over theoretical abstraction.',
  mandateImage: '/images/research_media_analysis.jpg',
  mandateImageLabel: 'IPA Research Archive & Library',
  mandateImageCaption:
    'Scholars analyzing media monitoring datasets and municipal audit filings.',
  milestones: [
    {
      year: '2024',
      title: 'Founding and Initial Media Monitoring Pilot',
      desc: 'Established as an independent think-tank and research collective in Dhaka, launching systematic content analysis across national daily newspapers.',
    },
    {
      year: '2025',
      title: 'Inauguration of the Community Dialogue Initiative',
      desc: 'Piloted regional town hall deliberations in four divisions, connecting municipal officials with community youth advocates regarding public infrastructure records.',
    },
    {
      year: '2026',
      title: 'Launch of Digital Rights Cell & Nationwide Media Literacy Campaign',
      desc: 'Expanded computational monitoring of algorithmic misinformation and distributed digital verification curriculum to secondary schools and universities.',
    },
  ],
  collaborators: [
    "National University Journalists' Forum",
    'Centre for Democratic Governance',
    'Federation of Regional Press Clubs',
    "Public Policy Scholars' Network",
    'Community Legal Transparency Initiative',
    'Digital Rights & Verification Consortium',
    'South Asian Media Research Alliance',
    'Civic Deliberation Action Forum',
  ],
};

function parseJsonArraySafe<T>(val: any, fallback: T[]): T[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export async function getAboutSettings(): Promise<AboutSettingData> {
  try {
    const raw = await prisma.$queryRaw<any[]>`SELECT * FROM "AboutSetting" WHERE "id" = 'default' LIMIT 1`;
    if (raw && raw[0]) {
      const row = raw[0];
      return {
        id: row.id,
        heroEyebrow: row.heroEyebrow || DEFAULT_ABOUT_SETTINGS.heroEyebrow,
        heroTitle: row.heroTitle || DEFAULT_ABOUT_SETTINGS.heroTitle,
        heroDescription: row.heroDescription || DEFAULT_ABOUT_SETTINGS.heroDescription,
        mandateEyebrow: row.mandateEyebrow || DEFAULT_ABOUT_SETTINGS.mandateEyebrow,
        mandateTitle: row.mandateTitle || DEFAULT_ABOUT_SETTINGS.mandateTitle,
        mandateParagraph1: row.mandateParagraph1 || DEFAULT_ABOUT_SETTINGS.mandateParagraph1,
        mandateParagraph2: row.mandateParagraph2 || DEFAULT_ABOUT_SETTINGS.mandateParagraph2,
        mandatePrinciplesTitle: row.mandatePrinciplesTitle || DEFAULT_ABOUT_SETTINGS.mandatePrinciplesTitle,
        mandatePrinciples: row.mandatePrinciples || DEFAULT_ABOUT_SETTINGS.mandatePrinciples,
        mandateImage: row.mandateImage || DEFAULT_ABOUT_SETTINGS.mandateImage,
        mandateImageLabel: row.mandateImageLabel || DEFAULT_ABOUT_SETTINGS.mandateImageLabel,
        mandateImageCaption: row.mandateImageCaption || DEFAULT_ABOUT_SETTINGS.mandateImageCaption,
        milestones: parseJsonArraySafe(row.milestones, DEFAULT_ABOUT_SETTINGS.milestones),
        collaborators: parseJsonArraySafe(row.collaborators, DEFAULT_ABOUT_SETTINGS.collaborators),
      };
    }
  } catch (error) {
    console.error('Error fetching about settings from DB:', error);
  }
  return DEFAULT_ABOUT_SETTINGS;
}

export async function getResearchItems(): Promise<ResearchItem[]> {
  try {
    const items = await prisma.researchItem.findMany({
      where: { published: true },
      orderBy: [{ createdAt: 'desc' }],
    });
    return items.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      category: r.category as any,
      type: r.type as any,
      date: r.date,
      year: r.year,
      featured: r.featured,
      coverImage: r.coverImage || '',
      pages: r.pages,
      fileSize: r.fileSize,
      doi: r.doi || undefined,
      downloadUrl: r.downloadUrl || undefined,
      abstract: r.abstract,
      authors: (r.authors as any) || [],
      keyFindings: (r.keyFindings as any) || [],
      content: {
        executiveSummary: r.executiveSummary || '',
        methodology: r.methodology || '',
        discussion: r.discussion || '',
        recommendations: (r.recommendations as any) || [],
      },
    }));
  } catch (error) {
    console.error('Error fetching research items from DB:', error);
    return RESEARCH_ITEMS;
  }
}

export async function getResearchItemBySlug(slug: string): Promise<ResearchItem | null> {
  try {
    const r = await prisma.researchItem.findUnique({
      where: { slug },
    });
    if (r) {
      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        category: r.category as any,
        type: r.type as any,
        date: r.date,
        year: r.year,
        featured: r.featured,
        coverImage: r.coverImage || '',
        pages: r.pages,
        fileSize: r.fileSize,
        doi: r.doi || undefined,
        downloadUrl: r.downloadUrl || undefined,
        abstract: r.abstract,
        authors: (r.authors as any) || [],
        keyFindings: (r.keyFindings as any) || [],
        content: {
          executiveSummary: r.executiveSummary || '',
          methodology: r.methodology || '',
          discussion: r.discussion || '',
          recommendations: (r.recommendations as any) || [],
        },
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching research item by slug from DB:', error);
    return RESEARCH_ITEMS.find((item) => item.slug === slug) || null;
  }
}

export async function getPrograms(): Promise<ProgramItem[]> {
  try {
    const items = await prisma.programItem.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return items.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      status: p.status as any,
      category: p.category,
      description: p.description,
      coverImage: p.coverImage,
      overview: p.overview,
      objectives: (p.objectives as any) || [],
      activities: (p.activities as any) || [],
      targetAudience: p.targetAudience,
      expectedOutcomes: (p.expectedOutcomes as any) || [],
      leadFellow: p.leadFellow,
    }));
  } catch (error) {
    console.error('Error fetching programs from DB:', error);
    return PROGRAMS;
  }
}

export async function getLatestPrograms(limit: number = 3): Promise<ProgramItem[]> {
  try {
    const items = await prisma.programItem.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return items.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      status: p.status as any,
      category: p.category,
      description: p.description,
      coverImage: p.coverImage,
      overview: p.overview,
      objectives: (p.objectives as any) || [],
      activities: (p.activities as any) || [],
      targetAudience: p.targetAudience,
      expectedOutcomes: (p.expectedOutcomes as any) || [],
      leadFellow: p.leadFellow,
    }));
  } catch (error) {
    console.error('Error fetching latest programs from DB:', error);
    return PROGRAMS.slice(0, limit);
  }
}

export async function getProgramBySlug(slug: string): Promise<ProgramItem | null> {
  try {
    const p = await prisma.programItem.findUnique({
      where: { slug },
    });
    if (p) {
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        status: p.status as any,
        category: p.category,
        description: p.description,
        coverImage: p.coverImage,
        overview: p.overview,
        objectives: (p.objectives as any) || [],
        activities: (p.activities as any) || [],
        targetAudience: p.targetAudience,
        expectedOutcomes: (p.expectedOutcomes as any) || [],
        leadFellow: p.leadFellow,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching program by slug from DB:', error);
    return PROGRAMS.find((item) => item.slug === slug) || null;
  }
}

export async function getCampaigns(): Promise<CampaignItem[]> {
  try {
    const items = await prisma.campaignItem.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
    return items.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      tagline: c.tagline,
      status: c.status as any,
      coverImage: c.coverImage,
      introduction: c.introduction,
      whyItMatters: c.whyItMatters,
      objectives: (c.objectives as any) || [],
      coreActions: (c.coreActions as any) || [],
      partnerNetworks: (c.partnerNetworks as any) || [],
      resources: (c.resources as any) || [],
    }));
  } catch (error) {
    console.error('Error fetching campaigns from DB:', error);
    return CAMPAIGNS;
  }
}

export async function getCampaignBySlug(slug: string): Promise<CampaignItem | null> {
  try {
    const c = await prisma.campaignItem.findUnique({
      where: { slug },
    });
    if (c) {
      return {
        id: c.id,
        slug: c.slug,
        title: c.title,
        tagline: c.tagline,
        status: c.status as any,
        coverImage: c.coverImage,
        introduction: c.introduction,
        whyItMatters: c.whyItMatters,
        objectives: (c.objectives as any) || [],
        coreActions: (c.coreActions as any) || [],
        partnerNetworks: (c.partnerNetworks as any) || [],
        resources: (c.resources as any) || [],
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching campaign by slug from DB:', error);
    return CAMPAIGNS.find((item) => item.slug === slug) || null;
  }
}

export async function getNewsItems(): Promise<NewsItem[]> {
  try {
    const items = await prisma.newsItem.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((n) => ({
      id: n.id,
      slug: n.slug,
      title: n.title,
      category: n.category as any,
      date: n.date,
      coverImage: n.coverImage,
      summary: n.summary,
      location: n.location || undefined,
      readTime: n.readTime,
      content: (n.content as any) || [],
      relatedTopics: (n.relatedTopics as any) || [],
    }));
  } catch (error) {
    console.error('Error fetching news items from DB:', error);
    return NEWS_ITEMS;
  }
}

export async function getNewsItemBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const n = await prisma.newsItem.findUnique({
      where: { slug },
    });
    if (n) {
      return {
        id: n.id,
        slug: n.slug,
        title: n.title,
        category: n.category as any,
        date: n.date,
        coverImage: n.coverImage,
        summary: n.summary,
        location: n.location || undefined,
        readTime: n.readTime,
        content: (n.content as any) || [],
        relatedTopics: (n.relatedTopics as any) || [],
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching news item by slug from DB:', error);
    return NEWS_ITEMS.find((item) => item.slug === slug) || null;
  }
}

export async function getResources(): Promise<ResourceItem[]> {
  try {
    const items = await prisma.resourceItem.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type as any,
      category: r.category as any,
      date: r.date,
      year: r.year,
      size: r.size,
      description: r.description,
      fileFormat: r.fileFormat as any,
      downloadCount: r.downloadCount,
    }));
  } catch (error) {
    console.error('Error fetching resources from DB:', error);
    return RESOURCES;
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const items = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    });
    return items.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      division: m.division,
      bio: m.bio,
      focusAreas: (m.focusAreas as any) || [],
      publicationsCount: m.publicationsCount,
    }));
  } catch (error) {
    console.error('Error fetching team members from DB:', error);
    return TEAM_MEMBERS;
  }
}
