import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { DEFAULT_ABOUT_SETTINGS } from '@/lib/services/content';

function parseJsonArray<T>(val: any, fallback: T[]): T[] {
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

export async function GET() {
  try {
    const [settings, coreValues, rawAbout] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { id: 'default' } }),
      prisma.coreValue.findMany({ orderBy: { order: 'asc' } }),
      prisma.$queryRaw<any[]>`SELECT * FROM "AboutSetting" WHERE "id" = 'default' LIMIT 1`.catch(() => []),
    ]);

    let aboutSettings = DEFAULT_ABOUT_SETTINGS;
    if (rawAbout && rawAbout[0]) {
      const row = rawAbout[0];
      aboutSettings = {
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
        milestones: parseJsonArray(row.milestones, DEFAULT_ABOUT_SETTINGS.milestones),
        collaborators: parseJsonArray(row.collaborators, DEFAULT_ABOUT_SETTINGS.collaborators),
      };
    }

    return NextResponse.json({ settings, coreValues, aboutSettings });
  } catch (error) {
    console.error('Failed to get about data:', error);
    return NextResponse.json({ error: 'Failed to retrieve about content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings, coreValues, aboutSettings } = body;

    // 1. Update Mission & Vision in SiteSetting if provided
    if (settings) {
      await prisma.siteSetting.update({
        where: { id: 'default' },
        data: {
          mission: settings.mission,
          vision: settings.vision,
        },
      });
    }

    // 2. Update Core Values if provided
    if (Array.isArray(coreValues)) {
      for (const val of coreValues) {
        if (val.id) {
          await prisma.coreValue.update({
            where: { id: val.id },
            data: {
              title: val.title,
              description: val.description,
            },
          });
        }
      }
    }

    // 3. Update AboutSetting (Hero, Mandate, Milestones, Collaborators)
    // Supports safe partial updates so saving collaborators doesn't wipe milestones (and vice-versa)
    if (aboutSettings && typeof aboutSettings === 'object') {
      const rawAbout = await prisma.$queryRaw<any[]>`SELECT * FROM "AboutSetting" WHERE "id" = 'default' LIMIT 1`.catch(() => []);
      const existing = rawAbout && rawAbout[0] ? rawAbout[0] : null;

      if (!existing) {
        // Record does not exist yet: create with defaults merged with incoming fields
        const heroEyebrow = aboutSettings.heroEyebrow ?? DEFAULT_ABOUT_SETTINGS.heroEyebrow;
        const heroTitle = aboutSettings.heroTitle ?? DEFAULT_ABOUT_SETTINGS.heroTitle;
        const heroDescription = aboutSettings.heroDescription ?? DEFAULT_ABOUT_SETTINGS.heroDescription;
        const mandateEyebrow = aboutSettings.mandateEyebrow ?? DEFAULT_ABOUT_SETTINGS.mandateEyebrow;
        const mandateTitle = aboutSettings.mandateTitle ?? DEFAULT_ABOUT_SETTINGS.mandateTitle;
        const mandateParagraph1 = aboutSettings.mandateParagraph1 ?? DEFAULT_ABOUT_SETTINGS.mandateParagraph1;
        const mandateParagraph2 = aboutSettings.mandateParagraph2 ?? DEFAULT_ABOUT_SETTINGS.mandateParagraph2;
        const mandatePrinciplesTitle = aboutSettings.mandatePrinciplesTitle ?? DEFAULT_ABOUT_SETTINGS.mandatePrinciplesTitle;
        const mandatePrinciples = aboutSettings.mandatePrinciples ?? DEFAULT_ABOUT_SETTINGS.mandatePrinciples;
        const mandateImage = aboutSettings.mandateImage ?? DEFAULT_ABOUT_SETTINGS.mandateImage;
        const mandateImageLabel = aboutSettings.mandateImageLabel ?? DEFAULT_ABOUT_SETTINGS.mandateImageLabel;
        const mandateImageCaption = aboutSettings.mandateImageCaption ?? DEFAULT_ABOUT_SETTINGS.mandateImageCaption;
        const milestones = aboutSettings.milestones !== undefined ? aboutSettings.milestones : DEFAULT_ABOUT_SETTINGS.milestones;
        const collaborators = aboutSettings.collaborators !== undefined ? aboutSettings.collaborators : DEFAULT_ABOUT_SETTINGS.collaborators;

        await prisma.$executeRawUnsafe(
          `INSERT INTO "AboutSetting" (
            "id", "heroEyebrow", "heroTitle", "heroDescription",
            "mandateEyebrow", "mandateTitle", "mandateParagraph1", "mandateParagraph2",
            "mandatePrinciplesTitle", "mandatePrinciples", "mandateImage", "mandateImageLabel",
            "mandateImageCaption", "milestones", "collaborators", "updatedAt"
          ) VALUES (
            'default', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, $14::jsonb, NOW()
          )`,
          heroEyebrow,
          heroTitle,
          heroDescription,
          mandateEyebrow,
          mandateTitle,
          mandateParagraph1,
          mandateParagraph2,
          mandatePrinciplesTitle,
          mandatePrinciples,
          mandateImage,
          mandateImageLabel,
          mandateImageCaption,
          JSON.stringify(milestones),
          JSON.stringify(collaborators)
        );
      } else {
        // Record exists: ONLY update fields that are explicitly provided in aboutSettings
        const updateClauses: string[] = [];
        const params: any[] = [];
        let pIdx = 1;

        if (aboutSettings.heroEyebrow !== undefined) {
          updateClauses.push(`"heroEyebrow" = $${pIdx++}`);
          params.push(aboutSettings.heroEyebrow);
        }
        if (aboutSettings.heroTitle !== undefined) {
          updateClauses.push(`"heroTitle" = $${pIdx++}`);
          params.push(aboutSettings.heroTitle);
        }
        if (aboutSettings.heroDescription !== undefined) {
          updateClauses.push(`"heroDescription" = $${pIdx++}`);
          params.push(aboutSettings.heroDescription);
        }
        if (aboutSettings.mandateEyebrow !== undefined) {
          updateClauses.push(`"mandateEyebrow" = $${pIdx++}`);
          params.push(aboutSettings.mandateEyebrow);
        }
        if (aboutSettings.mandateTitle !== undefined) {
          updateClauses.push(`"mandateTitle" = $${pIdx++}`);
          params.push(aboutSettings.mandateTitle);
        }
        if (aboutSettings.mandateParagraph1 !== undefined) {
          updateClauses.push(`"mandateParagraph1" = $${pIdx++}`);
          params.push(aboutSettings.mandateParagraph1);
        }
        if (aboutSettings.mandateParagraph2 !== undefined) {
          updateClauses.push(`"mandateParagraph2" = $${pIdx++}`);
          params.push(aboutSettings.mandateParagraph2);
        }
        if (aboutSettings.mandatePrinciplesTitle !== undefined) {
          updateClauses.push(`"mandatePrinciplesTitle" = $${pIdx++}`);
          params.push(aboutSettings.mandatePrinciplesTitle);
        }
        if (aboutSettings.mandatePrinciples !== undefined) {
          updateClauses.push(`"mandatePrinciples" = $${pIdx++}`);
          params.push(aboutSettings.mandatePrinciples);
        }
        if (aboutSettings.mandateImage !== undefined) {
          updateClauses.push(`"mandateImage" = $${pIdx++}`);
          params.push(aboutSettings.mandateImage);
        }
        if (aboutSettings.mandateImageLabel !== undefined) {
          updateClauses.push(`"mandateImageLabel" = $${pIdx++}`);
          params.push(aboutSettings.mandateImageLabel);
        }
        if (aboutSettings.mandateImageCaption !== undefined) {
          updateClauses.push(`"mandateImageCaption" = $${pIdx++}`);
          params.push(aboutSettings.mandateImageCaption);
        }
        if (aboutSettings.milestones !== undefined) {
          updateClauses.push(`"milestones" = $${pIdx++}::jsonb`);
          params.push(JSON.stringify(aboutSettings.milestones));
        }
        if (aboutSettings.collaborators !== undefined) {
          updateClauses.push(`"collaborators" = $${pIdx++}::jsonb`);
          params.push(JSON.stringify(aboutSettings.collaborators));
        }

        if (updateClauses.length > 0) {
          updateClauses.push(`"updatedAt" = NOW()`);
          const query = `UPDATE "AboutSetting" SET ${updateClauses.join(', ')} WHERE "id" = 'default'`;
          await prisma.$executeRawUnsafe(query, ...params);
        }
      }
    }

    revalidatePath('/about');
    revalidatePath('/');
    revalidatePath('/dashboard/pages/about');
    revalidatePath('/dashboard/pages/about/collaborators');
    revalidatePath('/dashboard/pages/about/timeline');
    revalidatePath('/dashboard/pages/about/mandate');

    return NextResponse.json({ success: true, message: 'About page updated successfully' });
  } catch (error) {
    console.error('Failed to update about content:', error);
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
  }
}
