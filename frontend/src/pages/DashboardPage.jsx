import { useOrganization, CreateOrganization } from "@clerk/clerk-react";


function DashboardPage() {

    const { organization, memberships } = useOrganization({
        memberships: { infinite: true }
    });


    const memberCount = memberships?.count ?? 0;


    /*
     * If the user has not created or joined
     * an organization yet, show the organization setup.
     */
    if (!organization) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">

                <div className="max-w-md text-center">

                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Welcome to AgencyOS
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        Create or join an organization to start managing
                        your agency from one place.
                    </p>

                    <div className="mt-6">
                        <CreateOrganization
                            afterCreateOrganizationUrl="/dashboard"
                        />
                    </div>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-950 px-6 py-8">

            {/* ================= HEADER ================= */}

            <div className="mb-8">

                <p className="text-sm font-medium text-indigo-400">
                    Agency Overview
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
                    Welcome back
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                    Here's what's happening in {organization.name} today.
                </p>

            </div>


            {/* ================= STATS ================= */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* Organization */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                    <p className="text-sm text-slate-400">
                        Organization
                    </p>

                    <p className="mt-2 truncate text-lg font-semibold text-white">
                        {organization.name}
                    </p>

                </div>


                {/* Members */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                    <p className="text-sm text-slate-400">
                        Team Members
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                        {memberCount}
                    </p>

                </div>


                {/* Leads */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                    <p className="text-sm text-slate-400">
                        Leads
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                        —
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Lead analytics coming soon
                    </p>

                </div>


                {/* Tasks */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                    <p className="text-sm text-slate-400">
                        Tasks
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                        —
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Task analytics coming soon
                    </p>

                </div>

            </div>


            {/* ================= QUICK ACTIONS ================= */}

            <div className="mt-8">

                <h2 className="text-lg font-semibold text-white">
                    Quick Actions
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Get important agency work done faster.
                </p>


                <div className="mt-4 grid gap-4 md:grid-cols-3">

                    {/* Leads */}
                    <a
                        href="/leads"
                        className="group rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-indigo-500/50 hover:bg-slate-800"
                    >

                        <div className="flex items-center justify-between">

                            <span className="text-2xl">
                                🎯
                            </span>

                            <span className="text-slate-600 transition group-hover:text-indigo-400">
                                →
                            </span>

                        </div>

                        <h3 className="mt-4 font-semibold text-white">
                            Find Leads
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                            Discover and manage potential clients.
                        </p>

                    </a>


                    {/* Emails */}
                    <a
                        href="/emails"
                        className="group rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-indigo-500/50 hover:bg-slate-800"
                    >

                        <div className="flex items-center justify-between">

                            <span className="text-2xl">
                                ✉️
                            </span>

                            <span className="text-slate-600 transition group-hover:text-indigo-400">
                                →
                            </span>

                        </div>

                        <h3 className="mt-4 font-semibold text-white">
                            Generate Email
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                            Create AI-powered outreach emails.
                        </p>

                    </a>


                    {/* Tasks */}
                    <a
                        href="/tasks"
                        className="group rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-indigo-500/50 hover:bg-slate-800"
                    >

                        <div className="flex items-center justify-between">

                            <span className="text-2xl">
                                ✓
                            </span>

                            <span className="text-slate-600 transition group-hover:text-indigo-400">
                                →
                            </span>

                        </div>

                        <h3 className="mt-4 font-semibold text-white">
                            Manage Tasks
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                            Organize your team's work and follow-ups.
                        </p>

                    </a>

                </div>

            </div>


            {/* ================= COMING SOON ================= */}

            <div className="mt-8 rounded-xl border border-dashed border-slate-800 bg-slate-900/50 p-6">

                <p className="text-sm font-medium text-indigo-400">
                    AgencyOS Vision
                </p>

                <h2 className="mt-2 text-xl font-semibold text-white">
                    Run your agency in 30 minutes a day.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    AgencyOS brings leads, outreach, tasks, proposals,
                    meetings and invoicing into one workspace so you can
                    spend less time managing operations and more time
                    growing your agency.
                </p>

            </div>

        </div>
    );
}


export default DashboardPage;