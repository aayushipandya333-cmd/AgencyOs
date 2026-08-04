import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@clerk/clerk-react"

import { getLeads, createLead } from "../services/api"
import LeadTable from "../components/LeadTable"
import LeadForm from "../components/LeadForm"




function LeadsPage() {

    const { getToken } = useAuth()

    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [showForm, setShowForm] = useState(false)
    const [editingLead, setEditingLead] = useState(null)

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

    useEffect(() => {
        loadLeads()
    }, [loadLeads])

    async function handleSubmit(leadData) {

    try {

        const newLead = await createLead(getToken, leadData)

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

    return (
        <div className="dashboard-container">

            <div className="dashboard-header">
                <h1>Lead Finder</h1>

                <button
                    className="btn btn-primary"
                    onClick={handleAddLead}
                >
                    + Add Lead
                </button>
            </div>

            {loading ? (
                <p>Loading Leads...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <LeadTable leads={leads} />

                    {showForm && (
                        <LeadForm
                            lead={editingLead}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default LeadsPage