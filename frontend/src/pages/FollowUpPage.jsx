import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@clerk/clerk-react"

import { getLeads } from "../services/api"


function FollowUpsPage() {

    const { getToken } = useAuth()

    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    // ---------------- LOAD LEADS ----------------

    const loadLeads = useCallback(async () => {

        try {

            setLoading(true)
            setError(null)

            const data = await getLeads(getToken)

            setLeads(data)

        } catch (err) {

            console.error("Load Follow-Ups Error:", err)

            setError(err.message)

        } finally {

            setLoading(false)

        }

    }, [getToken])


    useEffect(() => {
        loadLeads()
    }, [loadLeads])


    // ---------------- FOLLOW-UP FILTERING ----------------

    const leadsWithFollowUps = leads.filter(
        lead => lead.next_follow_up_at
    )


    const now = new Date()


    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    )


    const startOfTomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
    )


    const overdueFollowUps = leadsWithFollowUps.filter(
        lead =>
            new Date(lead.next_follow_up_at) < startOfToday
    )


    const todayFollowUps = leadsWithFollowUps.filter(
        lead => {

            const followUpDate = new Date(
                lead.next_follow_up_at
            )

            return (
                followUpDate >= startOfToday &&
                followUpDate < startOfTomorrow
            )

        }
    )


    const upcomingFollowUps = leadsWithFollowUps.filter(
        lead =>
            new Date(lead.next_follow_up_at) >= startOfTomorrow
    )


    return (

        <div className="min-h-screen bg-slate-950 px-6 py-8">

            {/* ================= HEADER ================= */}

            <div className="mb-8">

                <p className="text-sm font-medium text-indigo-400">
                    Lead Management
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
                    Follow-Ups
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                    Stay on top of your scheduled lead follow-ups.
                </p>

            </div>


            {/* ================= LOADING ================= */}

            {loading ? (

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

                    <p className="text-sm text-slate-400">
                        Loading follow-ups...
                    </p>

                </div>

            ) : error ? (

                <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6">

                    <p className="font-semibold text-red-400">
                        Error loading follow-ups
                    </p>

                    <p className="mt-1 text-sm text-red-300/80">
                        {error}
                    </p>

                </div>

            ) : (

                <div className="space-y-8">


                    {/* ================= OVERDUE ================= */}

                    <section>

                        <div className="mb-4 flex items-center justify-between">

                            <div>

                                <h2 className="text-lg font-semibold text-red-400">
                                    Overdue
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Follow-ups that need attention.
                                </p>

                            </div>

                            <span className="rounded-full bg-red-950/50 px-3 py-1 text-xs font-semibold text-red-400">
                                {overdueFollowUps.length}
                            </span>

                        </div>


                        {overdueFollowUps.length === 0 ? (

                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                                <p className="text-sm text-slate-500">
                                    No overdue follow-ups.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-3">

                                {overdueFollowUps.map((lead) => (

                                    <div
                                        key={lead.id}
                                        className="rounded-xl border border-red-900/40 bg-slate-900 p-5"
                                    >

                                        <div className="flex items-center justify-between">

                                            <div>

                                                <h3 className="font-semibold text-white">
                                                    {lead.company_name}
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-400">
                                                    Follow-up was scheduled for{" "}

                                                    {new Date(
                                                        lead.next_follow_up_at
                                                    ).toLocaleString()}
                                                </p>

                                            </div>


                                            <span className="rounded-lg bg-red-950/50 px-3 py-1.5 text-xs font-semibold text-red-400">
                                                Overdue
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>


                    {/* ================= TODAY ================= */}

                    <section>

                        <div className="mb-4 flex items-center justify-between">

                            <div>

                                <h2 className="text-lg font-semibold text-yellow-400">
                                    Due Today
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Follow-ups scheduled for today.
                                </p>

                            </div>

                            <span className="rounded-full bg-yellow-950/50 px-3 py-1 text-xs font-semibold text-yellow-400">
                                {todayFollowUps.length}
                            </span>

                        </div>


                        {todayFollowUps.length === 0 ? (

                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                                <p className="text-sm text-slate-500">
                                    No follow-ups due today.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-3">

                                {todayFollowUps.map((lead) => (

                                    <div
                                        key={lead.id}
                                        className="rounded-xl border border-yellow-900/40 bg-slate-900 p-5"
                                    >

                                        <div className="flex items-center justify-between">

                                            <div>

                                                <h3 className="font-semibold text-white">
                                                    {lead.company_name}
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-400">

                                                    Follow-up scheduled for{" "}

                                                    {new Date(
                                                        lead.next_follow_up_at
                                                    ).toLocaleTimeString(
                                                        [],
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        }
                                                    )}

                                                </p>

                                            </div>


                                            <span className="rounded-lg bg-yellow-950/50 px-3 py-1.5 text-xs font-semibold text-yellow-400">
                                                Today
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>


                    {/* ================= UPCOMING ================= */}

                    <section>

                        <div className="mb-4 flex items-center justify-between">

                            <div>

                                <h2 className="text-lg font-semibold text-indigo-400">
                                    Upcoming
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Your upcoming scheduled follow-ups.
                                </p>

                            </div>

                            <span className="rounded-full bg-indigo-950/50 px-3 py-1 text-xs font-semibold text-indigo-400">
                                {upcomingFollowUps.length}
                            </span>

                        </div>


                        {upcomingFollowUps.length === 0 ? (

                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                                <p className="text-sm text-slate-500">
                                    No upcoming follow-ups.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-3">

                                {upcomingFollowUps.map((lead) => (

                                    <div
                                        key={lead.id}
                                        className="rounded-xl border border-indigo-900/40 bg-slate-900 p-5"
                                    >

                                        <div className="flex items-center justify-between">

                                            <div>

                                                <h3 className="font-semibold text-white">
                                                    {lead.company_name}
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-400">

                                                    Follow-up scheduled for{" "}

                                                    {new Date(
                                                        lead.next_follow_up_at
                                                    ).toLocaleString()}

                                                </p>

                                            </div>


                                            <span className="rounded-lg bg-indigo-950/50 px-3 py-1.5 text-xs font-semibold text-indigo-400">
                                                Upcoming
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>

                </div>

            )}

        </div>

    )

}


export default FollowUpsPage