import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"

import {
    generateAIEmail,
    sendEmail,
    getGmailStatus,
    connectGmail
} from "../services/api"


function EmailPage() {

    const location = useLocation()
    const navigate = useNavigate()

    const { getToken } = useAuth()

    const selectedLead = location.state?.selectedLead

    const [lead] = useState(selectedLead || null)

    const [gmailConnected, setGmailConnected] = useState(false)
    const [gmailEmail, setGmailEmail] = useState(null)
    const [gmailLoading, setGmailLoading] = useState(false)

    const [generatedEmail, setGeneratedEmail] = useState(null)

    const [emailLoading, setEmailLoading] = useState(false)
    const [sendLoading, setSendLoading] = useState(false)

    useEffect(() => {

            async function loadGmailStatus() {

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

            }

            loadGmailStatus()

        }, [getToken])




        async function handleConnectGmail() {

                try {

                    setGmailLoading(true)

                    const data = await connectGmail(getToken)

                    window.location.href = data.authorization_url

                } catch (err) {

                    console.error(
                        "Connect Gmail Error:",
                        err
                    )

                    alert(err.message)

                } finally {

                    setGmailLoading(false)

                }

            }




            async function handleGenerateEmail() {

                    if (!lead) {

                        alert("Please select a lead first")

                        return

                    }

                    try {

                        setEmailLoading(true)

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
                            recipient_email: lead.email,
                            company_name: lead.company_name,
                            subject: response.email.subject,
                            body: response.email.body
                        })

                    } catch (err) {

                        console.error(
                            "Generate Email Error:",
                            err
                        )

                        alert(err.message)

                    } finally {

                        setEmailLoading(false)

                    }

                }




                async function handleSendEmail() {

                            if (!generatedEmail) return

                            if (!generatedEmail.recipient_email) {

                                alert("Selected lead does not have an email address")

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

                                console.error(
                                    "Send Email Error:",
                                    err
                                )

                                alert(err.message)

                            } finally {

                                setSendLoading(false)

                            }

                        }




    return (
        <div className="min-h-screen bg-slate-950 px-6 py-8">

            {/* ================= HEADER ================= */}

            <div className="mb-8">

                <p className="text-sm font-medium text-indigo-400">
                    Outreach
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
                    Email Center
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                    Generate personalized emails and manage your outreach.
                </p>

            </div>


             {/* ================= GMAIL ================= */}

                <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="text-lg font-semibold text-white">
                                Gmail Integration
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Connect Gmail to send outreach emails.
                            </p>

                        </div>


                        {gmailConnected ? (

                            <div className="text-right">

                                <p className="text-sm text-slate-300">
                                    {gmailEmail}
                                </p>

                                <p className="mt-1 text-sm text-emerald-400">
                                    Gmail Connected
                                </p>

                            </div>

                        ) : (

                            <button
                                onClick={handleConnectGmail}
                                disabled={gmailLoading}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {gmailLoading
                                    ? "Connecting..."
                                    : "Connect Gmail"}
                            </button>

                        )}

                    </div>

                </div>


                {/* ================= SELECTED LEAD ================= */}

                    {lead ? (

                        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-6">

                            <h2 className="text-lg font-semibold text-white">
                                Selected Lead
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Generate a personalized email for this lead.
                            </p>


                            <div className="mt-5 grid gap-4 md:grid-cols-3">

                                {/* COMPANY */}

                                <div>

                                    <p className="text-xs font-medium uppercase text-slate-500">
                                        Company
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-white">
                                        {lead.company_name}
                                    </p>

                                </div>


                                {/* EMAIL */}

                                <div>

                                    <p className="text-xs font-medium uppercase text-slate-500">
                                        Email
                                    </p>

                                    <p className="mt-1 text-sm text-slate-300">
                                        {lead.email || "No email available"}
                                    </p>

                                </div>


                                {/* INDUSTRY */}

                                <div>

                                    <p className="text-xs font-medium uppercase text-slate-500">
                                        Industry
                                    </p>

                                    <p className="mt-1 text-sm text-slate-300">
                                        {lead.industry || "N/A"}
                                    </p>

                                </div>

                            </div>


                            {/* GENERATE EMAIL BUTTON */}

                            <button
                                onClick={handleGenerateEmail}
                                disabled={emailLoading}
                                className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {emailLoading
                                    ? "Generating..."
                                    : "Generate Email"}
                            </button>

                        </div>

                    ) : (

                        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

                            <h2 className="text-lg font-semibold text-white">
                                No Lead Selected
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Go to the Leads page and select a lead to generate an email.
                            </p>


                            <button
                                onClick={() => navigate("/leads")}
                                className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                            >
                                Go to Leads
                            </button>

                        </div>

                    )}




                    {/* ================= GENERATED EMAIL ================= */}

                        {generatedEmail && (

                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                                <h2 className="text-lg font-semibold text-white">
                                    Generated Email
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Review and edit the email before sending.
                                </p>


                                {/* RECIPIENT */}

                                <div className="mt-5">

                                    <label className="text-sm font-medium text-slate-300">
                                        Recipient
                                    </label>

                                    <input
                                        type="email"
                                        value={generatedEmail.recipient_email || ""}
                                        onChange={(event) =>
                                            setGeneratedEmail(prev => ({
                                                ...prev,
                                                recipient_email: event.target.value
                                            }))
                                        }
                                        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                                    />

                                </div>


                                {/* SUBJECT */}

                                <div className="mt-4">

                                    <label className="text-sm font-medium text-slate-300">
                                        Subject
                                    </label>

                                    <input
                                        type="text"
                                        value={generatedEmail.subject || ""}
                                        onChange={(event) =>
                                            setGeneratedEmail(prev => ({
                                                ...prev,
                                                subject: event.target.value
                                            }))
                                        }
                                        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                                    />

                                </div>


                                {/* EMAIL BODY */}

                                <div className="mt-4">

                                    <label className="text-sm font-medium text-slate-300">
                                        Email Body
                                    </label>

                                    <textarea
                                        rows="12"
                                        value={generatedEmail.body || ""}
                                        onChange={(event) =>
                                            setGeneratedEmail(prev => ({
                                                ...prev,
                                                body: event.target.value
                                            }))
                                        }
                                        className="mt-2 w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm leading-6 text-white outline-none focus:border-indigo-500"
                                    />

                                </div>


                                {/* ACTION BUTTONS */}

                                <div className="mt-6 flex flex-wrap gap-3">

                                    <button
                                        onClick={handleSendEmail}
                                        disabled={
                                            sendLoading ||
                                            !gmailConnected
                                        }
                                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {sendLoading
                                            ? "Sending..."
                                            : "Send Email"}
                                    </button>


                                    <button
                                        onClick={handleGenerateEmail}
                                        disabled={emailLoading}
                                        className="rounded-lg border border-slate-700 bg-slate-950 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {emailLoading
                                            ? "Generating..."
                                            : "Regenerating"}
                                    </button>

                                </div>


                                {!gmailConnected && (

                                    <p className="mt-3 text-sm text-amber-400">
                                        Please connect Gmail before sending.
                                    </p>

                                )}

                            </div>

                        )}


        </div>
    )
}

export default EmailPage








