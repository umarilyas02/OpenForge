ALTER TABLE "assets" ADD COLUMN "external_id" varchar(40);--> statement-breakpoint
CREATE UNIQUE INDEX "assets_site_external_id_idx" ON "assets" USING btree ("site_id","external_id");