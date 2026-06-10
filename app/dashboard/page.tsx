import DashboardContent from "@/components/dashboard-content";
import { getSession } from "@/lib/auth/server";

export default async function Dash() {

        const session = await getSession();
        if (!session.data?.user?.id) {
                return null; // I could also redirect to login in this case
        }
        return (
                <DashboardContent userId={session.data?.user.id} />

        );
}