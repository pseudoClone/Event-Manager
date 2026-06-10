"use server";
import { redirect } from "next/navigation";
import { getSession } from "../auth/server";
import { prisma } from "../prisma";

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

export default async function createEventAction(formData: FormData) {
        const session = await getSession();
        const userId = session.data?.user.id;
        if (!userId) {
                throw new Error("Unauthorized");
        }
        const input = parseCreateEvent(formData);

        try {
                const parsedInput = await prisma.event.create({
                        data: {
                                ownerUserId: userId,
                                title: input.title,
                                description: input.description,
                                eventDate: input.eventDate ? new Date(input.eventDate) : null,
                        },
                });
                redirect(`/events/${parsedInput.id}`);
        } catch (err) {
                console.log(err);
        }

}

