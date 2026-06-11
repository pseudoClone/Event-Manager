CREATE TYPE "public"."RSVPStatus" AS ENUM('GOING', 'UNSURE', 'NOT_GOING');--> statement-breakpoint
CREATE TABLE "EventInvite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "EventInvite_event_id_unique" UNIQUE("event_id"),
	CONSTRAINT "EventInvite_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "EventRSVP" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"invite_id" uuid,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_normalized" text NOT NULL,
	"status" "RSVPStatus" NOT NULL,
	"responded_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "EventRSVP_event_id_email_normalized_unique" UNIQUE("event_id","email_normalized")
);
--> statement-breakpoint
CREATE TABLE "Event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"location" text,
	"event_date" timestamp (6) with time zone,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "EventInvite" ADD CONSTRAINT "EventInvite_event_id_Event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "EventRSVP" ADD CONSTRAINT "EventRSVP_event_id_Event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "EventRSVP" ADD CONSTRAINT "EventRSVP_invite_id_EventInvite_id_fk" FOREIGN KEY ("invite_id") REFERENCES "public"."EventInvite"("id") ON DELETE set null ON UPDATE no action;