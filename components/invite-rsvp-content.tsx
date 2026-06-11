import { Button } from "./ui/button";
import { db } from "@/lib/db";
import { rsvpStatusEnum } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { notFound } from "next/navigation";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { submitOrUpdateRSVPAction } from "@/lib/actions/events";

export type RSVPStatus = typeof rsvpStatusEnum.enumValues[number];


export default async function InviteRSVPContent({ token, submitted }: { token: string; submitted: Boolean; }) {
        const row = await db.query.eventInvites.findFirst({
                where: (eventInvites, { eq }) => eq(eventInvites.token, token),
                with: {
                        event: {
                                columns: {
                                        id: true,
                                        title: true,
                                        description: true,
                                        location: true,
                                        eventDate: true,
                                },
                        },
                },
        });
        if (!row) {
                notFound();
        }

        const e = row.event;
        const event = {
                title: e.title,
                description: e.description,
                location: e.location,
                eventDate: e.eventDate ? e.eventDate.toISOString() : null,
        };

        const submitRSVPForToken = submitOrUpdateRSVPAction.bind(null, token);

        return (
                <div className="flex grow flex-col gap-4">
                        <Card>
                                <CardHeader className="space-y-2">
                                        <Badge variant={"secondary"} className="w-fit">
                                                RSVP
                                        </Badge>
                                        <CardTitle>
                                                {event.title}
                                        </CardTitle>
                                        <p>
                                                {event.eventDate ? new Date(event.eventDate).toISOString() : "No Date available"}
                                                {event.location ? `- ${event.location}` : "No location available"}
                                        </p>
                                        <p className="text-sm text-foreground">
                                                {event.description ? event.description : "No description available"}
                                        </p>
                                </CardHeader>
                                <CardContent>
                                        {
                                                submitted ? (
                                                        <p className="mb-4 rounded-md border border-foreground/50">Your RSVP has been recorded.</p>
                                                ) : null
                                        }
                                        <form action={submitRSVPForToken}>
                                                <Label htmlFor="name">
                                                        Name
                                                </Label>
                                                <Input id="name" name="name" required placeholder="Enter your name" />

                                                <Label htmlFor="email">
                                                        Email
                                                </Label>
                                                <Input id="email" name="email" required placeholder="Enter your email" />

                                                <Label htmlFor="status">
                                                        Attendance
                                                </Label>
                                                <select
                                                        id="status"
                                                        name="status"
                                                        required
                                                        defaultValue={"GOING"}
                                                        className="flex h-10 w-full rounded-md border border-border">

                                                        <option value={"GOING"} className="bg-background">Going</option>
                                                        <option value={"MAYBE"} className="bg-background">Maybe</option>
                                                        <option value={"NOT_GOING"} className="bg-background">Not Going</option>
                                                </select>
                                                <Button type="submit">Submit RSVP</Button>

                                        </form>
                                </CardContent>
                        </Card>
                </div>
        );
}