import { pgTable, uuid, text, timestamp, unique, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const rsvpStatusEnum = pgEnum("RSVPStatus", ["GOING", "UNSURE", "NOT_GOING"]);

export const events = pgTable("Event", {
        id: uuid("id").primaryKey().defaultRandom(),
        ownerUserId: text("owner_user_id").notNull(),
        title: text("title").notNull(),
        description: text("description"),
        location: text("location"),
        eventDate: timestamp("event_date", { withTimezone: true, precision: 6 }),
        createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 }).defaultNow().notNull(),
});

export const eventInvites = pgTable("EventInvite", {
        id: uuid("id").primaryKey().defaultRandom(),
        eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }).unique(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }).defaultNow().notNull(),
});

export const eventRSVPs = pgTable("EventRSVP", {
        id: uuid("id").primaryKey().defaultRandom(),
        eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
        inviteId: uuid("invite_id").references(() => eventInvites.id, { onDelete: "set null" }),
        name: text("name").notNull(),
        email: text("email").notNull(),
        emailNormalized: text("email_normalized").notNull(),
        status: rsvpStatusEnum("status").notNull(),
        respondedAt: timestamp("responded_at", { withTimezone: true, precision: 6 }).defaultNow().notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 }).defaultNow().notNull(),
}, (t) => [
        unique().on(t.eventId, t.emailNormalized)
]);

export const eventsRelations = relations(events, ({ one, many }) => ({
        invite: one(eventInvites, { fields: [events.id], references: [eventInvites.eventId] }),
        eventRSVPs: many(eventRSVPs),
}));

export const eventInvitesRelations = relations(eventInvites, ({ one, many }) => ({
        event: one(events, { fields: [eventInvites.eventId], references: [events.id] }),
        eventRSVPs: many(eventRSVPs),
}));

export const eventRSVPsRelations = relations(eventRSVPs, ({ one }) => ({
        event: one(events, { fields: [eventRSVPs.eventId], references: [events.id] }),
        invite: one(eventInvites, { fields: [eventRSVPs.inviteId], references: [eventInvites.id] }),
}));