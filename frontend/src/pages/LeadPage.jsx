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
            status: "New",
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
        <div className="dashboard-container">

            <div className="dashboard-header">

                <h1>Lead Finder</h1>

                <div>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAIForm(true)}
                    >
                        ✨ Find Leads with AI
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleAddLead}
                    >
                        + Add Lead
                    </button>

                </div>

            </div>


            {loading ? (

                <p>Loading Leads...</p>

            ) : error ? (

                <p>{error}</p>

            ) : (

                <>

                    <div className="card gmail-card">

    <h3>Gmail Integration</h3>

    {gmailConnected ? (

        <div>

            <p>
                Gmail connected:
                <strong> {gmailEmail}</strong>
            </p>

            <button
                className="btn btn-outline"
                disabled
            >
                Gmail Connected
            </button>

        </div>

    ) : (

        <div>

            <p>
                Connect your organization's Gmail account
                to send emails to your leads.
            </p>

            <button
                className="btn btn-primary"
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

                    <LeadTable leads={leads} />

                    {showForm && (
                        <LeadForm
                            lead={editingLead}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    )}

                    {showAIForm && (
                        <AILeadForm
                            onSubmit={handleAIFind}
                            onCancel={() => setShowAIForm(false)}
                            loading={AILoading}
                        />
                    )}

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