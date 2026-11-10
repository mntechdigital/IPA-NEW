import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [settings, focusAreas, impactIndicators, rawMedia] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { id: "default" } }),
      prisma.focusArea.findMany({ orderBy: { order: "asc" } }),
      prisma.impactIndicator.findMany({ orderBy: { order: "asc" } }),
      prisma.$queryRaw<any[]>`SELECT "heroImage", "heroVideoUrl", "heroVideoActive" FROM "SiteSetting" WHERE "id" = 'default' LIMIT 1`.catch(() => []),
    ]);

    const media = rawMedia[0] || {};
    const mergedSettings = settings
      ? {
          ...settings,
          heroImage: media.heroImage ?? (settings as any).heroImage ?? '/images/hero_public_dialogue.jpg',
          heroVideoUrl: media.heroVideoUrl ?? (settings as any).heroVideoUrl ?? null,
          heroVideoActive: media.heroVideoActive ?? (settings as any).heroVideoActive ?? false,
        }
      : null;

    return NextResponse.json({ settings: mergedSettings, focusAreas, impactIndicators });
  } catch (error) {
    console.error("Failed to get home data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve home content" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings, focusAreas, impactIndicators } = body;

    // Update settings with safe partial updates
    if (settings) {
      const existing = await prisma.siteSetting.findUnique({ where: { id: "default" } });
      if (existing) {
        // 1. Standard textual and core settings
        const standardUpdateData: any = {};
        if (settings.tagline !== undefined) standardUpdateData.tagline = settings.tagline;
        if (settings.editorialLead !== undefined) standardUpdateData.editorialLead = settings.editorialLead;
        if (settings.announcementText !== undefined) standardUpdateData.announcementText = settings.announcementText;
        if (settings.announcementLinkText !== undefined) standardUpdateData.announcementLinkText = settings.announcementLinkText;
        if (settings.announcementHref !== undefined) standardUpdateData.announcementHref = settings.announcementHref;
        if (settings.announcementActive !== undefined) standardUpdateData.announcementActive = Boolean(settings.announcementActive);

        if (Object.keys(standardUpdateData).length > 0) {
          await prisma.siteSetting.update({
            where: { id: "default" },
            data: standardUpdateData,
          });
        }

        // 2. Multimedia settings (hero image & YouTube video) - uses direct SQL for compatibility
        if (
          settings.heroImage !== undefined ||
          settings.heroVideoUrl !== undefined ||
          settings.heroVideoActive !== undefined
        ) {
          const heroImg = settings.heroImage !== undefined ? settings.heroImage : (existing as any).heroImage || '/images/hero_public_dialogue.jpg';
          const heroVid = settings.heroVideoUrl !== undefined ? (settings.heroVideoUrl || null) : (existing as any).heroVideoUrl;
          const heroActive = settings.heroVideoActive !== undefined ? Boolean(settings.heroVideoActive) : Boolean((existing as any).heroVideoActive);

          await prisma.$executeRaw`
            UPDATE "SiteSetting"
            SET "heroImage" = ${heroImg}, "heroVideoUrl" = ${heroVid}, "heroVideoActive" = ${heroActive}
            WHERE "id" = 'default'
          `;
        }
      } else {
        await prisma.siteSetting.create({
          data: {
            id: "default",
            siteName: "IPA — Institute of Public Affairs",
            shortName: "IPA",
            tagline: settings.tagline || "Building an Informed Society",
            editorialLead: settings.editorialLead || "",
            mission: "",
            vision: "",
            announcementText: settings.announcementText,
            announcementLinkText: settings.announcementLinkText,
            announcementHref: settings.announcementHref,
            announcementActive: settings.announcementActive !== undefined ? Boolean(settings.announcementActive) : true,
          },
        });
      }
    }

    // Update focus areas if provided
    if (Array.isArray(focusAreas)) {
      for (const area of focusAreas) {
        if (area.id) {
          await prisma.focusArea.update({
            where: { id: area.id },
            data: {
              title: area.title,
              description: area.description,
              metrics: area.metrics,
            },
          });
        }
      }
    }

    // Update impact indicators if provided
    if (Array.isArray(impactIndicators)) {
      for (const ind of impactIndicators) {
        if (ind.id) {
          await prisma.impactIndicator.update({
            where: { id: ind.id },
            data: {
              value: ind.value,
              label: ind.label,
              descriptor: ind.descriptor,
            },
          });
        }
      }
    }

    revalidatePath('/');
    revalidatePath('/', 'layout');

    return NextResponse.json({
      success: true,
      message: "Home page content updated successfully",
    });
  } catch (error: any) {
    console.error("Failed to update home content:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update home content" },
      { status: 500 },
    );
  }
}
