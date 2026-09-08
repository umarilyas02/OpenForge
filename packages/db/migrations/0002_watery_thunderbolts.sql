CREATE TABLE "secrets" (
	"ref" varchar(48) PRIMARY KEY NOT NULL,
	"version" integer NOT NULL,
	"algorithm" varchar(20) NOT NULL,
	"key_id" varchar(64) NOT NULL,
	"metadata" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"rotated_at" timestamp with time zone,
	"iv" text NOT NULL,
	"tag" text NOT NULL,
	"ciphertext" text NOT NULL,
	"wrapped_key_iv" text NOT NULL,
	"wrapped_key_tag" text NOT NULL,
	"wrapped_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_git_connections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"site_id" uuid NOT NULL,
	"repo_owner" varchar(200) NOT NULL,
	"repo_name" varchar(200) NOT NULL,
	"default_branch" varchar(200) DEFAULT 'main' NOT NULL,
	"secret_ref" varchar(48) NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_git_connections" ADD CONSTRAINT "site_git_connections_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_git_connections" ADD CONSTRAINT "site_git_connections_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "site_git_connections_site_id_idx" ON "site_git_connections" USING btree ("site_id");