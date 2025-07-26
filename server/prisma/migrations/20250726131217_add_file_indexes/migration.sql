-- CreateIndex
CREATE INDEX "File_alias_uploadedBy_idx" ON "File"("alias", "uploadedBy");

-- CreateIndex
CREATE INDEX "File_cid_uploadedBy_idx" ON "File"("cid", "uploadedBy");
