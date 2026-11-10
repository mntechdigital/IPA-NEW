-- CreateTable
CREATE TABLE "AboutSetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "heroEyebrow" TEXT NOT NULL DEFAULT 'INSTITUTIONAL PROFILE & GOVERNANCE',
    "heroTitle" TEXT NOT NULL DEFAULT 'About the Institute of Public Affairs',
    "heroDescription" TEXT NOT NULL DEFAULT 'Strengthening public understanding, media integrity, and democratic participation through empirical research and inclusive civic dialogue.',
    "mandateEyebrow" TEXT NOT NULL DEFAULT 'FOUNDATIONAL MANDATE',
    "mandateTitle" TEXT NOT NULL DEFAULT 'An Independent Hub for Evidence and Public Deliberation',
    "mandateParagraph1" TEXT NOT NULL,
    "mandateParagraph2" TEXT NOT NULL,
    "mandatePrinciplesTitle" TEXT NOT NULL DEFAULT 'Our Research Principles:',
    "mandatePrinciples" TEXT NOT NULL,
    "mandateImage" TEXT NOT NULL DEFAULT '/images/research_media_analysis.jpg',
    "mandateImageLabel" TEXT NOT NULL DEFAULT 'IPA Research Archive & Library',
    "mandateImageCaption" TEXT NOT NULL DEFAULT 'Scholars analyzing media monitoring datasets and municipal audit filings.',
    "milestones" JSONB NOT NULL,
    "collaborators" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutSetting_pkey" PRIMARY KEY ("id")
);
