import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"

import { useNavigate } from "react-router-dom"

import {
    updateLead,
    deleteLead
} from "../services/api"


function LeadTable({ leads, setLeads }) {
    
    const navigate = useNavigate()
    const { getToken } = useAuth()

    const [deleteLoading, setDeleteLoading] = useState(null)

    if (leads.length === 0) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-xl">
                    👥
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">
                    No Leads Found
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                    Add a lead manually or use AI Lead Finder to discover potential clients.
                </p>

            </div>
        )
    }

    async function handleStatusChange(lead, newStatus) {

    try {

        const updatedLead = await updateLead(
            getToken,
            lead.id,
            {
                status: newStatus
            }
        )

        console.log("Lead status updated:", updatedLead)

    } catch (err) {

        console.error("Update Lead Status Error:", err)

        alert(err.message)

    }
    }

    async function handleDeleteLead(lead) {

    const confirmed = window.confirm(
        `Are you sure you want to delete ${lead.company_name}?`
    )

    if (!confirmed) {
        return
    }

    try {

        setDeleteLoading(lead.id)

        await deleteLead(
            getToken,
            lead.id
        )

        // Remove deleted lead from the current table
        setLeads(prev =>
            prev.filter(item => item.id !== lead.id)
        )

        alert(`${lead.company_name} deleted successfully`)

    } catch (err) {

        console.error("Delete Lead Error:", err)

        alert(err.message)

    } finally {

        setDeleteLoading(null)

    }
}
    
    return (
        <>
            {/* ================= LEAD TABLE ================= */}

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px] text-left">

                        <thead className="border-b border-slate-800 bg-slate-900/80">

                            <tr>

                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Company
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Website
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Email
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Industry
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Follow-Up
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    AI Email
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Actions
                                </th>
                            </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-800">

                            {leads.map((lead) => (

                                <tr
                                    key={lead.id}
                                    className="transition hover:bg-slate-800/40"
                                >

                                    {/* Company */}

                                    <td className="px-5 py-4">

                                        <p className="font-medium text-white">
                                            {lead.company_name}
                                        </p>

                                    </td>


                                    {/* Website */}

                                    <td className="px-5 py-4">

                                        {lead.website ? (

                                            <a
                                                href={lead.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="max-w-[180px] truncate text-sm text-indigo-400 hover:text-indigo-300"
                                            >
                                                {lead.website}
                                            </a>

                                        ) : (

                                            <span className="text-sm text-slate-500">
                                                N/A
                                            </span>

                                        )}

                                    </td>


                                    {/* Email */}

                                    <td className="px-5 py-4">

                                        {lead.email ? (

                                            <span className="text-sm text-slate-300">
                                                {lead.email}
                                            </span>

                                        ) : (

                                            <span className="text-sm text-slate-500">
                                                N/A
                                            </span>

                                        )}

                                    </td>


                                    {/* Industry */}

                                    <td className="px-5 py-4">

                                        <span className="text-sm text-slate-300">
                                            {lead.industry || "N/A"}
                                        </span>

                                    </td>


                                    {/* Status */}

                                    <td className="px-5 py-4">

                                        <select
                                            value={lead.status || "new"}
                                            onChange={async (event) => {

                                                const newStatus = event.target.value

                                                try {

                                                    const updatedLead = await updateLead(
                                                        getToken,
                                                        lead.id,
                                                        {
                                                            status: newStatus
                                                        }
                                                    )

                                                    setLeads(prev =>
                                                        prev.map(item =>
                                                            item.id === lead.id
                                                                ? updatedLead
                                                                : item
                                                        )
                                                    )
                                                    alert(`Lead status changed to ${updatedLead.status}`)

                                                } catch (err) {

                                                    console.error("Update Lead Status Error:", err)

                                                    alert(err.message)

                                                }

                                            }}
                                            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 outline-none transition focus:border-indigo-500"
                                        >

                                            <option value="new">
                                                New
                                            </option>

                                            <option value="contacted">
                                                Contacted
                                            </option>

                                            <option value="qualified">
                                                Qualified
                                            </option>

                                            <option value="closed">
                                                Closed
                                            </option>

                                        </select>

                                    </td>


                                    {/* Follow-Up */}

                                    <td className="px-5 py-4">

                                        <input
                                            type="datetime-local"
                                            value={
                                                lead.next_follow_up_at
                                                    ? new Date(lead.next_follow_up_at)
                                                        .toISOString()
                                                        .slice(0, 16)
                                                    : ""
                                            }

                                            onChange={async (event) => {

                                                const nextFollowUp = event.target.value

                                                try {

                                                    const updatedLead = await updateLead(
                                                        getToken,
                                                        lead.id,
                                                        {
                                                            next_follow_up_at: nextFollowUp || null
                                                        }
                                                    )

                                                    setLeads(prev =>
                                                        prev.map(item =>
                                                            item.id === lead.id
                                                                ? updatedLead
                                                                : item
                                                        )
                                                    )

                                                } catch (err) {

                                                    console.error(
                                                        "Update Follow-Up Error:",
                                                        err
                                                    )

                                                    alert(err.message)

                                                }

                                            }}

                                            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none transition focus:border-indigo-500 [color-scheme:dark]"
                                        />

                                    </td>


                                    {/* AI Email */}

                                    <td className="px-5 py-4">

                                        <button
                                            className="whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
                                            onClick={() =>
                                                navigate("/emails", {
                                                    state: {
                                                        selectedLead: lead
                                                    }
                                                })
                                            }
                                        >
                                            Generate Email
                                        </button>

                                    </td>

                                    <td className="px-5 py-4">
                                        <button
                                            className="rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-950/60 disabled:cursor-not-allowed disabled:opacity-50"
                                            onClick={() => handleDeleteLead(lead)}
                                            disabled={deleteLoading === lead.id}
                                        >
                                            {deleteLoading === lead.id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>
                    </div>
                    </div>


        </>
    )
}

export default LeadTable