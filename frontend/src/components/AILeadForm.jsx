import { useState } from "react"

function AILeadForm({ onSubmit, onCancel, loading }) {

    const [industry, setIndustry] = useState("")
    const [location, setLocation] = useState("")
    const [companySize, setCompanySize] = useState("")
    const [service, setService] = useState("")
    const [numberOfLeads, setNumberOfLeads] = useState(5)

    function handleSubmit(e) {
        e.preventDefault()

        if (!industry.trim() || !location.trim() || !service.trim()) {
            alert("Please fill Industry, Location and Service")
            return
        }

        onSubmit({
            industry: industry.trim(),
            location: location.trim(),
            company_size: companySize.trim() || null,
            service: service.trim(),
            number_of_leads: Number(numberOfLeads)
        })
    }

    return (
        <div className="modal-overlay" onClick={onCancel}>

            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="modal-header">
                    <h2>Find Leads with AI</h2>

                    <button
                        className="modal-close"
                        onClick={onCancel}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Industry</label>

                        <input
                            className="form-input"
                            placeholder="e.g. IT, Healthcare, E-commerce"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>

                        <input
                            className="form-input"
                            placeholder="e.g. India, Indore, USA"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Company Size</label>

                        <input
                            className="form-input"
                            placeholder="e.g. 10-100 employees"
                            value={companySize}
                            onChange={(e) => setCompanySize(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Service Required</label>

                        <input
                            className="form-input"
                            placeholder="e.g. Web Development"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Number of Leads</label>

                        <input
                            className="form-input"
                            type="number"
                            min="1"
                            max="20"
                            value={numberOfLeads}
                            onChange={(e) => setNumberOfLeads(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">

                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Finding Leads..." : "Find Leads"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default AILeadForm