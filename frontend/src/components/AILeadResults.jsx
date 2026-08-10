function AILeadResults({ leads, onApprove }) {

    if (!leads || leads.length === 0) {
        return (
            <div className="card">
                <h3>No AI Leads Found</h3>
                <p>
                    Try changing your requirements and search again.
                </p>
            </div>
        )
    }

    return (
        <div className="card">

            <div className="dashboard-header">
                <h2>AI Suggested Leads</h2>

                <p>
                    Review the leads before adding them to your Lead list.
                </p>
            </div>

            <table className="lead-table">

                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Website</th>
                        <th>Industry</th>
                        <th>Location</th>
                        <th>Reason</th>
                        <th>Score</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {leads.map((lead, index) => (

                        <tr
                            key={lead.company_name || index}
                        >

                            <td>
                                {lead.company_name}
                            </td>

                            <td>
                                {lead.website || "N/A"}
                            </td>

                            <td>
                                {lead.industry || "N/A"}
                            </td>

                            <td>
                                {lead.location || "N/A"}
                            </td>

                            <td>
                                {lead.reason || "N/A"}
                            </td>

                            <td>
                                {lead.lead_score ?? "N/A"}
                            </td>

                            <td>

                                <button
                                    className="btn btn-primary"
                                    onClick={() => onApprove(lead)}
                                >
                                    Approve
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    )
}

export default AILeadResults