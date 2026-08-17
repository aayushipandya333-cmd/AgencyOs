import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@clerk/clerk-react"

import {
    getLeads,
    createLead,
    findAILeads,
    getGmailStatus,
    connectGmail
} from "../services/api"

import LeadTable from "../components/LeadTable"
import LeadForm from "../components/LeadForm"
import AILeadForm from "../components/AILeadForm"
import AILeadResults from "../components/AILeadResults"


function LeadsPage() {

    const { getToken } = useAuth()

    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [gmailConnected, setGmailConnected] = useState(false)
    const [gmailEmail, setGmailEmail] = useState(null)
    const [gmailLoading, setGmailLoading] = useState(false)

    // Manual Lead Form
    const [showForm, setShowForm] = useState(false)
    const [editingLead, setEditingLead] = useState(null)

    // AI Lead Finder
    const [showAIForm, setShowAIForm] = useState(false)
    const [AILeads, setAILeads] = useState([])
    const [AILoading, setAILoading] = useState(false)


    // ---------------- LOAD EXISTING LEADS ----------------

    const loadLeads = useCallback(async () => {

        try {

            setLoading(true)
            setError(null)

            const data = await getLeads(getToken)

            setLeads(data)

        } catch (err) {

            setError(err.message)

        } finally {

            setLoading(false)

        }

    }, [getToken])


// ---------------- LOAD GMAIL STATUS ----------------

const loadGmailStatus = useCallback(async () => {

    try {

        const data = await getGmailStatus(getToken)

        setGmailConnected(data.connected)
        setGmailEmail(data.gmail_email)

    } catch (err) {

        console.error(
            "Failed to load Gmail status:",
            err
        )

    }

}, [getToken])


useEffect(() => {
    loadLeads()
}, [loadLeads])


useEffect(() => {
    loadGmailStatus()
}, [loadGmailStatus])
    // ---------------- MANUAL LEAD ----------------

    async function handleSubmit(leadData) {

        try {

            const newLead = await createLead(
                getToken,
                leadData
            )

            setLeads(prev => [...prev, newLead])

            setShowForm(false)
            setEditingLead(null)

        } catch (err) {

            console.error(err)
            alert(err.message)

        }

    }


    function handleCancel() {

        setShowForm(false)
        setEditingLead(null)

    }


    function handleAddLead() {

        setEditingLead(null)
        setShowForm(true)

    }


    // ---------------- AI LEAD FINDER ----------------

    async function handleAIFind(requirements) {

        try {

            setAILoading(true)

            const response = await findAILeads(
                getToken,
                requirements
            )
            

            setAILeads(response.leads || [])

            setShowAIForm(false)

        } catch (err) {

            console.error(err)
            alert(err.message)

        } finally {

            setAILoading(false)

        }

    }



    async function handleApproveAILead(AILead) {

    try {

        const leadData = {
            company_name: AILead.company_name,
            website: AILead.website || null,
            email: AILead.email || null,
            industry: AILead.industry || null,
            status: "new",
            notes: `Location: ${AILead.location || "Unknown"}
            Reason: ${AILead.reason || "Not provided"}
            AI Lead Score: ${AILead.lead_score ?? "N/A"}`
        }

        console.log("Approving AI Lead:", leadData)

        const newLead = await createLead(
            getToken,
            leadData
        )

        console.log("Lead created:", newLead)

        // Add approved lead to existing leads
        setLeads(prev => [...prev, newLead])

        // Remove approved lead from AI suggestions
        setAILeads(prev =>
            prev.filter(
                lead => lead.company_name !== AILead.company_name
            )
        )

        alert("Lead approved and added successfully!")

    } catch (err) {

        console.error("Approve AI Lead Error:", err)
        alert(err.message)

    }
}


    async function handleConnectGmail() {

    try {

        setGmailLoading(true)

        const data = await connectGmail(getToken)

        window.location.href = data.authorization_url

    } catch (err) {

        console.error(
            "Gmail connection error:",
            err
        )

        alert(err.message)

        setGmailLoading(false)
    }
}

    return (
        <div className="min-h-screen bg-slate-950 px-6 py-8">

             {/* ================= HEADER ================= */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="text-sm font-medium text-indigo-400">
                        Prospecting
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
                        Lead Finder
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Discover, manage and qualify potential clients.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <button
                        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                        onClick={() => setShowAIForm(true)}
                         >
                        ✨ Find Leads with AI
                    </button>

                    <button
                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                        onClick={handleAddLead}
                         >
                        + Add Lead
                    </button>

                </div>

            </div>

             {/* ================= LOADING ================= */}
            {loading ? (

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
                    <p className="text-sm text-slate-400">
                        Loading leads...
                    </p>
                </div>

            ) : error ? (

                /* ================= ERROR ================= */

                <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6">
                    <p className="font-semibold text-red-400">
                        Error loading leads
                    </p>

                    <p className="mt-1 text-sm text-red-300/80">
                        {error}
                    </p>
                </div>

            ) : (

                <>

                 {/* ================= GMAIL ================= */}


                <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-sm font-semibold text-white">
                                Gmail Integration
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                Connect Gmail to send outreach emails to your leads.
                            </p>
                        </div>

                {gmailConnected ? (

                    <div>
                        <p className="text-sm text-slate-300">
                            Gmail connected:
                            <strong className="ml-1 text-white">
                                {gmailEmail}
                            </strong>
                        </p>

                        <button
                            className="mt-3 rounded-lg border border-emerald-800 bg-emerald-950/40 px-4 py-2 text-sm font-medium text-emerald-400"
                            disabled
                        >
                            Gmail Connected
                        </button>
                    </div>

                ) : (

                    <div>
                        <button
                            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handleConnectGmail}
                            disabled={gmailLoading}
                        >
                            {gmailLoading
                                ? "Connecting..."
                                : "Connect Gmail"}
                        </button>
                    </div>

                )}
                </div>
            </div>
                     {/* ================= LEADS ================= */}
                    <LeadTable
                        leads={leads}
                        setLeads={setLeads}
                    />
                     {/* ================= MANUAL LEAD FORM ================= */}
                    {showForm && (
                        <LeadForm
                            lead={editingLead}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    )}

                      {/* ================= AI LEAD FORM ================= */}
                    {showAIForm && (
                        <AILeadForm
                            onSubmit={handleAIFind}
                            onCancel={() => setShowAIForm(false)}
                            loading={AILoading}
                        />
                    )}

                     {/* ================= AI RESULTS ================= */}
                    {AILeads.length > 0 && (
                    <AILeadResults
                        leads={AILeads}
                        onApprove={handleApproveAILead}
                    />
                )}
                </>

            )}

        </div>
    )


}

export default LeadsPage