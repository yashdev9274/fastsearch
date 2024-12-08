CREATE TABLE IF NOT EXISTS "characters" (
	"id" text PRIMARY KEY DEFAULT 'uuid_generate_v4()' NOT NULL,
	"name" text NOT NULL,
	"imageId" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
