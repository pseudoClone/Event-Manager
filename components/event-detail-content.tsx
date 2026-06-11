import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { countByStatus } from "./dashboard-content";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { createInviteLinkAction } from "@/lib/actions/events";

export async function EventDetailContent({ userId, eventId, }: { userId: string; eventId: string }) {
    const row = await db.query.events.findFirst({
        where: (events, { eq, and }) => and(
            eq(events.id, eventId),
            eq(events.ownerUserId, userId)
        ),
        columns: {
            id: true,
            title: true,
            description: true,
            location: true,
            eventDate: true,
        },
        with: {
            invite: {
                columns: {
                    token: true,
                },
            },
            eventRSVPs: {
                columns: {
                    status: true,
                },
            },
        },
    });
    if (!row) {
        notFound();
    }

    const counts = countByStatus(row.eventRSVPs);
    const event = {
        id: row.id,
        title: row.title,
        description: row.description,
        location: row.location,
        eventDate: row.eventDate ? row.eventDate.toISOString() : null,
        inviteToken: row.invite?.token ?? null,
        goingCount: counts.goingCount,
        maybeCount: counts.maybeCount,
        notGoingCount: counts.notGoingCount,
    }

    const createInviteActionForEvent = createInviteLinkAction.bind(
        null,
        event.id,
    );

    const inviteUrl = event.inviteToken ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/invite/${event.inviteToken}` :
        null;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-col gap-y-2">
                    <h1 className="font-bold text-2xl">
                        {event.title}
                    </h1>
                    <p>{event.eventDate ? new Date(event.eventDate).toLocaleString() : "No event date available"}</p>
                    {event.location ? `- ${event.location}` : "No location available"}
                    {event.description && (
                        <p className="text-muted-foreground text-sm max-w-2xl">{event.description}</p>
                    )}
                </div>
                <Button asChild variant={"destructive"}><Link href={"/dashboard"}>Go back</Link></Button>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant={"default"} >Going: {event.goingCount}</Badge>
                <Badge variant={"outline"} >Not sure: {event.maybeCount}</Badge>
                <Badge variant={"destructive"} >Not going: {event.notGoingCount}</Badge>
            </div>

            <Card>
                <CardHeader>
                    Invite Link
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">Share this link for guests to RSVP without an account!</p>

                                        {
                                                inviteUrl ?
                                                        (
                                                                <div className="rounded-md border border-border p-3 text-sm">
                                                                        {inviteUrl}
                                                                </div>
                                                        ) :
                                                        <p>No invite links generated</p>
                                        }
                                        <form action={createInviteActionForEvent}>
                                                <Button type="submit">Generate Link</Button>
                                        </form>
                                </CardContent>
                        </Card>
                </div>
        );
}