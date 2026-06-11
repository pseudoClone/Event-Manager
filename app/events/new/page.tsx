import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEventAction } from "@/lib/actions/events";
import Link from "next/link";
export default async function NewEventCreation() {
        return (
                <div className="mx-auto w-full max-w-2xl">
                        <Card>
                                <CardHeader>
                                        <CardTitle>Create Event</CardTitle>
                                </CardHeader>
                                <CardContent>
                                        <form action={createEventAction} className="space-y-4">

                                                <div className="space-y-2">
                                                        <Label htmlFor="title">
                                                                Title
                                                        </Label>
                                                        <Input id="title" name="title" required placeholder="Event" />
                                                </div>

                                                <div className="space-y-2">
                                                        <Label htmlFor="description">Description</Label>
                                                        <Textarea id="description" name="description" placeholder="Event Details" />
                                                </div>

                                                <div className="space-y-2">
                                                        <Label htmlFor="location">
                                                                Location
                                                        </Label>
                                                        <Input id="location" name="location" placeholder="Kathmandu..." />
                                                </div>

                                                <div className="space-y-2">
                                                        <Label htmlFor="eventDate">
                                                                Date and Time
                                                        </Label>
                                                        <Input id="eventDate" name="eventDate" type="datetime-local" />
                                                </div>

                                                <div className="flex justify-between">
                                                        <Button variant={"default"} type={"submit"}>
                                                                Create event
                                                        </Button>
                                                        <Button type="button" variant={"destructive"} asChild>
                                                                <Link href={"/dashboard"}>Cancel</Link>
                                                        </Button>
                                                </div>
                                        </form>
                                </CardContent>
                        </Card>
                </div>
        );
}