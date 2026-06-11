import { EventDetailContent } from "@/components/event-detail-content";
import { getSession } from "@/lib/auth/server";

export default async function EventDetailsPage({ params, }: { params: Promise<{ eventId: string }> }) {
        const { eventId } = await params;

        const session = await getSession();
        if (!session.data?.user.id) {
                return null;
        }
        return <EventDetailContent userId={session.data?.user.id} eventId={eventId} />;
}