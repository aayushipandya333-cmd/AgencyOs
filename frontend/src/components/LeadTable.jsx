import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"

import {
    generateAIEmail,
    sendEmail,
    updateLead,
    deleteLead
} from "../services/api"


function LeadTable({ leads, setLeads }) {

    const { getToken } = useAuth()

    const [emailLoading, setEmailLoading] = useState(null)
    const [generatedEmail, setGeneratedEmail] = useState(null)
    const [sendLoading, setSendLoading] = useState(false)
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
    async function handleGenerateEmail(lead) {

        try {

            setEmailLoading(lead.id)

            const response = await generateAIEmail(
                getToken,
                {
                    company_name: lead.company_name,
                    industry: lead.industry,
                    website: lead.website,
                    service: "Web Development",
                    recipient_name: null,
                    additional_context: lead.notes
                }
            )

            setGeneratedEmail({
                leadId: lead.id,
                recipient_email: lead.email,
                company_name: lead.company_name,
                ...response.email
            })

        } catch (err) {

            console.error(err)
            alert(err.message)

        } finally {

            setEmailLoading(null)

        }
    }


    async function handleSendEmail() {

    if (!generatedEmail) {
        return
    }

    try {

        setSendLoading(true)

        const response = await sendEmail(
            getToken,
            {
                recipient_email: generatedEmail.recipient_email,
                subject: generatedEmail.subject,
                body: generatedEmail.body
            }
        )

        alert(
            `Email sent successfully from ${response.gmail_email}`
        )

    } catch (err) {

        console.error("Send Email Error:", err)

        alert(err.message)

    } finally {

        setSendLoading(false)

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


                                    {/* AI Email */}

                                    <td className="px-5 py-4">

                                        <button
                                            className="whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                            onClick={() => handleGenerateEmail(lead)}
                                            disabled={emailLoading === lead.id}
                                        >
                                            {emailLoading === lead.id
                                                ? "Generating..."
                                                : "Generate Email"}
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



            {/* ================= AI GENERATED EMAIL ================= */}

            {generatedEmail && (

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">

                    <div className="mb-6 flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-indigo-400">
                                AI Outreach
                            </p>

                            <h3 className="mt-1 text-xl font-semibold text-white">
                                AI Generated Email
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                Email prepared for {generatedEmail.company_name}
                            </p>

                        </div>

                        <button
                            className="text-slate-500 transition hover:text-slate-300"
                            onClick={() => setGeneratedEmail(null)}
                            aria-label="Close email preview"
                        >
                            ✕
                        </button>

                    </div>


                    {/* Recipient */}

                    <div className="mb-4">

                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Recipient
                        </label>

                        <input
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 outline-none"
                            value={generatedEmail.recipient_email || "No email available"}
                            readOnly
                        />

                    </div>


                    {/* Subject */}

                    <div className="mb-4">

                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Subject
                        </label>

                        <input
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none"
                            value={generatedEmail.subject}
                            readOnly
                        />

                    </div>


                    {/* Body */}

                    <div className="mb-6">

                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Email Body
                        </label>

                        <textarea
                            className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm leading-6 text-slate-300 outline-none"
                            value={generatedEmail.body}
                            readOnly
                            rows="10"
                        />

                    </div>


                    {/* Actions */}

                    <div className="flex flex-wrap gap-3">

                        <button
                            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handleSendEmail}
                            disabled={sendLoading}
                        >
                            {sendLoading
                                ? "Sending..."
                                : "Send Email"}
                        </button>

                        <button
                            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
                            onClick={() => setGeneratedEmail(null)}
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </>
    )
}

export default LeadTable