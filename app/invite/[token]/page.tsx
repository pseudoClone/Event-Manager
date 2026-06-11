import { EventDetailContent } from "@/components/event-detail-content";
import InviteRSVPContent from "@/components/invite-rsvp-content";
// This does not need session because the guests are accessing this page without an account

export default async function InvitePage({ params, searchParams }:
        { params: Promise<{ token: string }>; searchParams: Promise<{ submitted?: string }> }) {
        // The searchParams is to check if the user has submitted to this event invite
        const { token } = await params;
        const query = await searchParams;

        return <InviteRSVPContent token={token} submitted={query.submitted === "1"} />;
}