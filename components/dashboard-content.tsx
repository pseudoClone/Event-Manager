import Link from "next/link";
import { Button } from "./ui/button";

export default async function DashboardContent() {
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
                                        <Link href={"/event/new"}>Create Event</Link>
                                </Button>
                        </div>
                </div>
        );
}