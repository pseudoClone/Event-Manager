import Link from "next/link";
import { Button } from "./ui/button";

export default async function DashboardContent({ userId }: { userId: string }) {

        const rows = await prisma.event.findMany({
                where: { ownerUserId: userId },
                orderBy: { createdAt: "desc" },
                select: {
                        id: true,
                        title: true,
                        eventDate: true,
                        location: true,
                }
        });

        const events = rows.map((e) => ({
                id: e.id,
                title: e.title,
                eventDate: e.eventDate ? e.eventDate.toISOString() : null,
                location: e.location,
        }));

        return (
                <div className="flex grow flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                        <h1 className="text-2xl font-bold">
                                                Events
                                        </h1>
                                        <p className="text-muted-foreground">Track your invites and attendees</p>
                                </div>
                                <Button asChild>
                                        <Link href={"/events/new"}>Create Event</Link>
                                </Button>
                        </div>
                </div>
        );
}