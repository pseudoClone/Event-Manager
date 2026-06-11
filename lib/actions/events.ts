"use server";
import { redirect } from "next/navigation";
import { getSession } from "../auth/server";
import { db } from "../db";
import { eventInvites, eventRSVPs, events as eventsTable } from "../db/schema";
import { RSVPStatus } from "@/components/dashboard-content";

function parseCreateEvent(formData: FormData) {
        const title = String(formData.get("title") ?? "").trim();
        if (title.length < 3) {
                throw new Error("Title Length must be more than 3")
        }

        const description = String(formData.get("description") ?? "").trim();
        const location = String(formData.get("location") ?? "").trim();
        const eventDate = String(formData.get("eventDate") ?? "").trim();

        return {
                title,
                description: description.length ? description.slice(0, 2000) : null,
                location: location.length ? location.slice(0, 200) : null,
                eventDate: eventDate.length ? eventDate : null,
        }
}

const RSVP_STATUSES = ["GOING", "MAYBE", "NOT_GOING"] as const;

function isRSVPStatus(s: string): s is RSVPStatus {
        return (RSVP_STATUSES as readonly string[]).includes(s);
}

function parseRSVP(formData: FormData) {
        const name = String(formData.get("name") ?? "").trim();
        if (name.length < 2 || name.length > 120) {
                throw new Error("Name must be more than 2 and less than 120 characters long");
        }
        const email = String(formData.get("email") ?? "").trim();
        if (email.length < 6 || email.length > 200 || !email.includes("@")) {
                throw new Error("Email must be more than 6 and less than 200 characters long");
        } // For the love of god, I cannot bother to put an email validation here. Should have used Better AUTH FFS.

        const status = String(formData.get("status") ?? "").trim();
        if (!isRSVPStatus(status)) {
                throw new Error("Invalid RSVP Status");
        }
        return { name, email, status };
}


export async function createEventAction(formData: FormData) {
        const session = await getSession();
        const userId = session.data?.user.id;
        if (!userId) {
                throw new Error("Unauthorized");
        }
        const input = parseCreateEvent(formData);
        let newEventId: string | undefined;

        try {
                const [insertedEvent] = await db.insert(eventsTable).values({
                        ownerUserId: userId,
                        title: input.title,
                        description: input.description,
                        eventDate: input.eventDate ? new Date(input.eventDate) : null,
                        location: input.location,
                }).returning({ id: eventsTable.id });

                newEventId = insertedEvent?.id;
        } catch (err) {
                console.log(err);
                return; // Prevent redirecting on failure
        }
        if (newEventId) {
                redirect(`/events/${newEventId}`);
        }
}

export async function createInviteLinkAction(eventId: string) {
        const session = await getSession();
        const userId = session.data?.user.id;
        if (!userId) {
                throw new Error("Unauthorized");
        }

        const owns = await db.query.events.findFirst({
                where: (events, { eq, and }) =>
                        and(
                                eq(events.id, eventId),
                                eq(events.ownerUserId, userId)
                        ),
                columns: {
                        id: true,
                },
        });

        if (!owns) {
                throw new Error("Event not found!");
        }

        const token = crypto.randomUUID().replace(/-/g, "");
        await db
                .insert(eventInvites)
                .values({
                        id: crypto.randomUUID(),
                        eventId,
                        token,
                })
                .onConflictDoUpdate({
                        target: eventInvites.eventId,
                        set: {
                                token,
                        },
                });
        return token;
}


export async function submitOrUpdateRSVPAction(token: string, formData: FormData) {
        const input = parseRSVP(formData);
        const invite = await db.query.eventInvites.findFirst({
                where: (eventInvites, { eq }) => eq(eventInvites.token, token),
                columns: {
                        id: true,
                },
                with: {
                        event: {
                                columns: {
                                        id: true,
                                },
                        },
                },
        });

        if (!invite) {
                throw new Error("Invite link is invalid");
        }

        const eventId = invite.event.id;
        const emailNormalized = input.email.toLowerCase();

        await db.insert(eventRSVPs).values({
                eventId,
                inviteId: invite.id,
                name: input.name,
                email: input.email,
                emailNormalized,
                status: input.status,
        }).onConflictDoUpdate({
                target: [eventRSVPs.eventId, eventRSVPs.emailNormalized],
                set: {
                        name: input.name,
                        status: input.status,
                        respondedAt: new Date(),
                },
        });

        redirect(`/invite/${token}?submitted=1`);
}