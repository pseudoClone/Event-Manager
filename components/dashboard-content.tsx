import Link from "next/link";
import { Button } from "./ui/button";
import { db } from "@/lib/db";
import { events as eventsTable, rsvpStatusEnum } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export type RSVPStatus = typeof rsvpStatusEnum.enumValues[number];

function countByStatus(rsvps: { status: RSVPStatus }[]) {
        let goingCount = 0;
        let maybeCount = 0;
        let notGoingCount = 0;

        for (const r of rsvps) {
                if (r.status === "GOING") {
                        goingCount++;
                } else if (r.status === "NOT_GOING") {
                        notGoingCount++;
                } else if (r.status === "UNSURE") {
                        maybeCount++;
                }
        }
        return { goingCount, maybeCount, notGoingCount };
}

export default async function DashboardContent({ userId }: { userId: string }) {
        const rows = await db.query.events.findMany({
                where: (events, { eq }) => eq(events.ownerUserId, userId),
                orderBy: (events, { desc }) => [desc(events.createdAt)],
                columns: {
                        id: true,
                        title: true,
                        eventDate: true,
                        location: true,
                },
                with: {
                        eventRSVPs: {
                                columns: {
                                        status: true,
                                },
                        },
                },
        });

        const events = rows.map((e) => ({
                id: e.id,
                title: e.title,
                eventDate: e.eventDate ? e.eventDate.toISOString() : null,
                location: e.location,
                ...countByStatus(e.eventRSVPs),
        }));

        return (
                <div className="flex grow flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                        <h1 className="text-2xl font-bold">Events</h1>
                                        <p className="text-muted-foreground">Track your invites and attendees</p>
                                </div>
                                <Button asChild>
                                        <Link href={"/events/new"}>Create Event</Link>
                                </Button>
                        </div>

                        {events.length === 0 ? (
                                <Card>
                                        <CardHeader>
                                                <CardTitle> No events </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                        Create your first event
                                                </p>
                                        </CardContent>
                                </Card>
                        ) : (
                                <div className="grid gap-2 md:grid-cols-2">
                                        {events.map((event) => (
                                                <Card key={event.id}>
                                                        <CardHeader className="space-y-2">
                                                                <div className="flex items-start justify-between">
                                                                        <CardTitle>{event.title}</CardTitle>
                                                                        <Button asChild size={"xs"}>
                                                                                <Link href={`/events/${event.id}`}>Open</Link>
                                                                        </Button>
                                                                </div>
                                                                <div>
                                                                        <Badge variant={"secondary"} >Going: {event.goingCount}</Badge>
                                                                        <Badge variant={"secondary"} >Not sure: {event.maybeCount}</Badge>
                                                                        <Badge variant={"secondary"} >Not going: {event.notGoingCount}</Badge>
                                                                </div>
                                                                <div className="text-sm">
                                                                        {
                                                                                event.eventDate
                                                                                        ?
                                                                                        new Date(event.eventDate).toLocaleString()
                                                                                        :
                                                                                        "No date mentioned"
                                                                        }
                                                                        <div>
                                                                                {
                                                                                        event.location
                                                                                                ? `${event.location}`
                                                                                                : "No location mentioned"
                                                                                }
                                                                        </div>
                                                                </div>
                                                        </CardHeader>
                                                </Card>
                                        ))}
                                </div>
                        )}
                </div>
        );
}