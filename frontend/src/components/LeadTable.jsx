function LeadTable({ leads }) {

    if (leads.length === 0) {
        return (
            <div className="card">
                <h3>No Leads Found</h3>
                <p>Create your first lead.</p>
            </div>
        )
    }

    return (
        <table className="lead-table">
            <thead>
                <tr>
                    <th>Company</th>
                    <th>Website</th>
                    <th>Email</th>
                    <th>Industry</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>
                {leads.map((lead) => (
                    <tr key={lead.id}>
                        <td>{lead.company_name}</td>
                        <td>{lead.website}</td>
                        <td>{lead.email}</td>
                        <td>{lead.industry}</td>
                        <td>{lead.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default LeadTable