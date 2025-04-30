-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "platforms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
