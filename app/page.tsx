import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-12 md:py-12">
      <section className="text-center flex flex-col items-center max-w-3xl mx-auto gap-6">
        <span className="px-3 py-1 text-sm font-medium text-amber-200">
          Don't struggle with your event manager
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text flex flex-col">
          <span className="text-green-200">Create events. Invite guests. Straight up. No BS.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Manage your gatherings easily. Guests get to RSVP in without accounts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="px-6 py-3 text-sm font-medium text-black bg-green-300 rounded-lg shadow-sm"
          >
            Create Your First Event
          </Link>
        </div>
      </section>
    </div>
  );
}
