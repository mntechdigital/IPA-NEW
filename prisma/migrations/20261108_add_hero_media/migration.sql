-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN "heroImage" TEXT DEFAULT '/images/hero_public_dialogue.jpg',
ADD COLUMN "heroVideoUrl" TEXT,
ADD COLUMN "heroVideoActive" BOOLEAN NOT NULL DEFAULT false;
