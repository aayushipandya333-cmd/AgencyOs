import { useState, useEffect } from "react"

function LeadForm({ lead, onSubmit, onCancel }) {

    const [companyName, setCompanyName] = useState("")
    const [website, setWebsite] = useState("")
    const [email, setEmail] = useState("")
    const [industry, setIndustry] = useState("")
    const [status, setStatus] = useState("new")
    const [notes, setNotes] = useState("")

    const isEditing = !!lead

    useEffect(() => {
        if (lead) {
            setCompanyName(lead.company_name)
            setWebsite(lead.website || "")
            setEmail(lead.email || "")
            setIndustry(lead.industry || "")
            setStatus(lead.status)
            setNotes(lead.notes || "")
        } else {
            setCompanyName("")
            setWebsite("")
            setEmail("")
            setIndustry("")
            setStatus("new")
            setNotes("")
        }
    }, [lead])

    function handleSubmit(e) {
        e.preventDefault()

        if (!companyName.trim()) return

        onSubmit({
            company_name: companyName.trim(),
            website: website.trim() || null,
            email: email.trim() || null,
            industry: industry.trim() || null,
            status,
            notes: notes.trim() || null
        })
    }

    return (
        <div className="modal-overlay" onClick={onCancel}>

            <div className="modal" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header">
                    <h2>
                        {isEditing ? "Edit Lead" : "New Lead"}
                    </h2>

                    <button
                        className="modal-close"
                        onClick={onCancel}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            className="form-input"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Website</label>
                        <input
                            className="form-input"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Industry</label>
                        <input
                            className="form-input"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>

                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="closed">Closed</option>
                        </select>

                    </div>

                    <div className="form-group">
                        <label>Notes</label>

                        <textarea
                            className="form-textarea"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">

                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            {isEditing ? "Save Changes" : "Create Lead"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default LeadForm