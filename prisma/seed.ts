import { PrismaClient } from '@prisma/client';
import { ORGANIZATION } from '../src/data/organization';
import { RESEARCH_ITEMS } from '../src/data/research';
import { PROGRAMS } from '../src/data/programs';
import { CAMPAIGNS } from '../src/data/campaigns';
import { NEWS_ITEMS } from '../src/data/news';
import { RESOURCES } from '../src/data/resources';
import { TEAM_MEMBERS } from '../src/data/team';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Site Settings
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {
      siteName: ORGANIZATION.name,
      shortName: ORGANIZATION.shortName,
      tagline: ORGANIZATION.tagline,
      editorialLead: ORGANIZATION.editorialLead,
      mission: ORGANIZATION.mission,
      vision: ORGANIZATION.vision,
      announcementText: ORGANIZATION.announcement.text,
      announcementLinkText: ORGANIZATION.announcement.linkText,
      announcementHref: ORGANIZATION.announcement.href,
      announcementActive: true,
      contactEmail: 'info@ipa.org.bd',
      contactPhone: '+880 (2) 987-6543',
      contactAddress: 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh',
    },
    create: {
      id: 'default',
      siteName: ORGANIZATION.name,
      shortName: ORGANIZATION.shortName,
      tagline: ORGANIZATION.tagline,
      editorialLead: ORGANIZATION.editorialLead,
      mission: ORGANIZATION.mission,
      vision: ORGANIZATION.vision,
      announcementText: ORGANIZATION.announcement.text,
      announcementLinkText: ORGANIZATION.announcement.linkText,
      announcementHref: ORGANIZATION.announcement.href,
      announcementActive: true,
      contactEmail: 'info@ipa.org.bd',
      contactPhone: '+880 (2) 987-6543',
      contactAddress: 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh',
    },
  });

  // 2. Seed Focus Areas
  for (let i = 0; i < ORGANIZATION.focusAreas.length; i++) {
    const area = ORGANIZATION.focusAreas[i];
    await prisma.focusArea.upsert({
      where: { slug: area.slug },
      update: {
        title: area.title,
        description: area.description,
        metrics: area.metrics,
        order: i,
      },
      create: {
        slug: area.slug,
        title: area.title,
        description: area.description,
        metrics: area.metrics,
        order: i,
      },
    });
  }

  // 3. Seed Impact Indicators
  await prisma.impactIndicator.deleteMany({});
  for (let i = 0; i < ORGANIZATION.impactIndicators.length; i++) {
    const indicator = ORGANIZATION.impactIndicators[i];
    await prisma.impactIndicator.create({
      data: {
        value: indicator.value,
        label: indicator.label,
        descriptor: indicator.descriptor,
        order: i,
      },
    });
  }

  // 4. Seed Core Values
  await prisma.coreValue.deleteMany({});
  for (let i = 0; i < ORGANIZATION.values.length; i++) {
    const val = ORGANIZATION.values[i];
    await prisma.coreValue.create({
      data: {
        title: val.title,
        description: val.description,
        order: i,
      },
    });
  }

  // 5. Seed Research Items
  for (const item of RESEARCH_ITEMS) {
    await prisma.researchItem.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        category: item.category,
        type: item.type,
        date: item.date,
        year: item.year,
        featured: item.featured ?? false,
        coverImage: item.coverImage,
        pages: item.pages,
        fileSize: item.fileSize,
        doi: item.doi ?? null,
        abstract: item.abstract,
        authors: item.authors as any,
        keyFindings: item.keyFindings as any,
        executiveSummary: item.content?.executiveSummary ?? null,
        methodology: item.content?.methodology ?? null,
        discussion: item.content?.discussion ?? null,
        recommendations: (item.content?.recommendations ?? []) as any,
      },
      create: {
        slug: item.slug,
        title: item.title,
        category: item.category,
        type: item.type,
        date: item.date,
        year: item.year,
        featured: item.featured ?? false,
        coverImage: item.coverImage,
        pages: item.pages,
        fileSize: item.fileSize,
        doi: item.doi ?? null,
        abstract: item.abstract,
        authors: item.authors as any,
        keyFindings: item.keyFindings as any,
        executiveSummary: item.content?.executiveSummary ?? null,
        methodology: item.content?.methodology ?? null,
        discussion: item.content?.discussion ?? null,
        recommendations: (item.content?.recommendations ?? []) as any,
      },
    });
  }

  // 6. Seed Programs
  for (let i = 0; i < PROGRAMS.length; i++) {
    const prog = PROGRAMS[i];
    await prisma.programItem.upsert({
      where: { slug: prog.slug },
      update: {
        title: prog.title,
        subtitle: prog.subtitle,
        status: prog.status,
        category: prog.category,
        description: prog.description,
        coverImage: prog.coverImage,
        overview: prog.overview,
        objectives: prog.objectives as any,
        activities: prog.activities as any,
        targetAudience: prog.targetAudience,
        expectedOutcomes: prog.expectedOutcomes as any,
        leadFellow: prog.leadFellow,
        order: i,
      },
      create: {
        slug: prog.slug,
        title: prog.title,
        subtitle: prog.subtitle,
        status: prog.status,
        category: prog.category,
        description: prog.description,
        coverImage: prog.coverImage,
        overview: prog.overview,
        objectives: prog.objectives as any,
        activities: prog.activities as any,
        targetAudience: prog.targetAudience,
        expectedOutcomes: prog.expectedOutcomes as any,
        leadFellow: prog.leadFellow,
        order: i,
      },
    });
  }

  // 7. Seed Campaigns
  for (let i = 0; i < CAMPAIGNS.length; i++) {
    const camp = CAMPAIGNS[i];
    await prisma.campaignItem.upsert({
      where: { slug: camp.slug },
      update: {
        title: camp.title,
        tagline: camp.tagline,
        status: camp.status,
        coverImage: camp.coverImage,
        introduction: camp.introduction,
        whyItMatters: camp.whyItMatters,
        objectives: camp.objectives as any,
        coreActions: camp.coreActions as any,
        partnerNetworks: camp.partnerNetworks as any,
        resources: (camp.resources ?? []) as any,
        order: i,
      },
      create: {
        slug: camp.slug,
        title: camp.title,
        tagline: camp.tagline,
        status: camp.status,
        coverImage: camp.coverImage,
        introduction: camp.introduction,
        whyItMatters: camp.whyItMatters,
        objectives: camp.objectives as any,
        coreActions: camp.coreActions as any,
        partnerNetworks: camp.partnerNetworks as any,
        resources: (camp.resources ?? []) as any,
        order: i,
      },
    });
  }

  // 8. Seed News Items
  for (const news of NEWS_ITEMS) {
    await prisma.newsItem.upsert({
      where: { slug: news.slug },
      update: {
        title: news.title,
        category: news.category,
        date: news.date,
        coverImage: news.coverImage,
        summary: news.summary,
        location: news.location ?? null,
        readTime: news.readTime,
        content: news.content as any,
        relatedTopics: news.relatedTopics as any,
      },
      create: {
        slug: news.slug,
        title: news.title,
        category: news.category,
        date: news.date,
        coverImage: news.coverImage,
        summary: news.summary,
        location: news.location ?? null,
        readTime: news.readTime,
        content: news.content as any,
        relatedTopics: news.relatedTopics as any,
      },
    });
  }

  // 9. Seed Resources
  await prisma.resourceItem.deleteMany({});
  for (const res of RESOURCES) {
    await prisma.resourceItem.create({
      data: {
        title: res.title,
        type: res.type,
        category: res.category,
        date: res.date,
        year: res.year,
        size: res.size,
        description: res.description,
        fileFormat: res.fileFormat,
        downloadCount: res.downloadCount,
      },
    });
  }

  // 10. Seed Team Members
  await prisma.teamMember.deleteMany({});
  for (let i = 0; i < TEAM_MEMBERS.length; i++) {
    const member = TEAM_MEMBERS[i];
    await prisma.teamMember.create({
      data: {
        name: member.name,
        role: member.role,
        division: member.division,
        bio: member.bio,
        focusAreas: member.focusAreas as any,
        publicationsCount: member.publicationsCount,
        order: i,
      },
    });
  }

  // 11. Seed About Settings
  await prisma.$executeRawUnsafe(
    `INSERT INTO "AboutSetting" (
      "id", "heroEyebrow", "heroTitle", "heroDescription",
      "mandateEyebrow", "mandateTitle", "mandateParagraph1", "mandateParagraph2",
      "mandatePrinciplesTitle", "mandatePrinciples", "mandateImage", "mandateImageLabel",
      "mandateImageCaption", "milestones", "collaborators", "updatedAt"
    ) VALUES (
      'default',
      'INSTITUTIONAL PROFILE & GOVERNANCE',
      'About the Institute of Public Affairs',
      'Strengthening public understanding, media integrity, and democratic participation through empirical research and inclusive civic dialogue.',
      'FOUNDATIONAL MANDATE',
      'An Independent Hub for Evidence and Public Deliberation',
      'The Institute of Public Affairs (IPA) was established to address a critical deficit in contemporary democratic governance: the widening chasm between academic empirical analysis, media reporting standards, and active citizen participation.',
      'Operating without partisan affiliations or commercial ownership interests, IPA serves as a trusted research foundation and deliberative bridge. We monitor information ecosystems, publish peer-reviewed policy briefs, and organize structured community hearings where citizens examine local governance challenges alongside public officials.',
      'Our Research Principles:',
      'Every study published by IPA undergoes rigorous double-blind methodological review, adheres to open-access data archiving, and prioritizes actionable civic utility over theoretical abstraction.',
      '/images/research_media_analysis.jpg',
      'IPA Research Archive & Library',
      'Scholars analyzing media monitoring datasets and municipal audit filings.',
      '[{"year":"2024","title":"Founding and Initial Media Monitoring Pilot","desc":"Established as an independent think-tank and research collective in Dhaka, launching systematic content analysis across national daily newspapers."},{"year":"2025","title":"Inauguration of the Community Dialogue Initiative","desc":"Piloted regional town hall deliberations in four divisions, connecting municipal officials with community youth advocates regarding public infrastructure records."},{"year":"2026","title":"Launch of Digital Rights Cell & Nationwide Media Literacy Campaign","desc":"Expanded computational monitoring of algorithmic misinformation and distributed digital verification curriculum to secondary schools and universities."}]'::jsonb,
      '["National University Journalists'' Forum","Centre for Democratic Governance","Federation of Regional Press Clubs","Public Policy Scholars'' Network","Community Legal Transparency Initiative","Digital Rights & Verification Consortium","South Asian Media Research Alliance","Civic Deliberation Action Forum"]'::jsonb,
      NOW()
    ) ON CONFLICT ("id") DO NOTHING`
  );

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
