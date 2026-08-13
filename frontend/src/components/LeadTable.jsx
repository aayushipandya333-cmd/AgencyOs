import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"

import {  generateAIEmail, sendEmail } from "../services/api"


function LeadTable({ leads }) {

    const { getToken } = useAuth()

    const [emailLoading, setEmailLoading] = useState(null)
    const [generatedEmail, setGeneratedEmail] = useState(null)
    const [sendLoading, setSendLoading] = useState(false)


    if (leads.length === 0) {
        return (
            <div className="card">
                <h3>No Leads Found</h3>
                <p>Create your first lead.</p>
            </div>
        )
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
            <table className="lead-table">

                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Website</th>
                        <th>Email</th>
                        <th>Industry</th>
                        <th>Status</th>
                        <th>AI Email</th>
                    </tr>
                </thead>

                <tbody>

                    {leads.map((lead) => (

                        <tr key={lead.id}>

                            <td>{lead.company_name}</td>

                            <td>{lead.website || "N/A"}</td>

                            <td>{lead.email || "N/A"}</td>

                            <td>{lead.industry || "N/A"}</td>

                            <td>{lead.status}</td>

                            <td>

                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleGenerateEmail(lead)}
                                    disabled={emailLoading === lead.id}
                                >
                                    {emailLoading === lead.id
                                        ? "Generating..."
                                        : "Generate Email"}
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>


            {generatedEmail && (

                <div className="card">

                    <h3>AI Generated Email</h3>

                    <div className="form-group">
                        <label>Subject</label>

                        <input
                            className="form-input"
                            value={generatedEmail.subject}
                            readOnly
                        />
                    </div>


                    <div className="form-group">
                        <label>Email Body</label>

                        <textarea
                            className="form-textarea"
                            value={generatedEmail.body}
                            readOnly
                            rows="10"
                        />
                    </div>


                    <button
                        className="btn btn-primary"
                        onClick={handleSendEmail}
                        disabled={sendLoading}
                    >
                        {sendLoading ? "Sending..." : "Send Email"}
                    </button>

                    <button
                        className="btn btn-outline"
                        onClick={() => setGeneratedEmail(null)}
                    >
                        Close
                    </button>

                </div>

            )}

        </>
    )
}


export default LeadTable