import { useState, useEffect } from "react"

const MAX_COMPANY_NAME_LENGTH = 255
const MAX_WEBSITE_LENGTH = 255
const MAX_INDUSTRY_LENGTH = 255
const MAX_NOTES_LENGTH = 5000

const ALLOWED_STATUSES = [
    "new",
    "contacted",
    "qualified",
    "closed"
]

function LeadForm({ lead, onSubmit, onCancel }) {

    const [companyName, setCompanyName] = useState("")
    const [website, setWebsite] = useState("")
    const [email, setEmail] = useState("")
    const [industry, setIndustry] = useState("")
    const [status, setStatus] = useState("new")
    const [notes, setNotes] = useState("")

    const [errors, setErrors] = useState({})

    const isEditing = !!lead

    useEffect(() => {
        if (lead) {
            setCompanyName(lead.company_name || "")
            setWebsite(lead.website || "")
            setEmail(lead.email || "")
            setIndustry(lead.industry || "")
            setStatus(lead.status || "new")
            setNotes(lead.notes || "")
        } else {
            setCompanyName("")
            setWebsite("")
            setEmail("")
            setIndustry("")
            setStatus("new")
            setNotes("")
        }

        setErrors({})
    }, [lead])

    function validateForm() {

        const newErrors = {}

        const trimmedCompanyName = companyName.trim()
        const trimmedWebsite = website.trim()
        const trimmedEmail = email.trim()
        const trimmedIndustry = industry.trim()
        const trimmedNotes = notes.trim()

        // Company name
        if (!trimmedCompanyName) {
            newErrors.companyName = "Company name is required"
        } else if (
            trimmedCompanyName.length > MAX_COMPANY_NAME_LENGTH
        ) {
            newErrors.companyName =
                `Company name cannot exceed ${MAX_COMPANY_NAME_LENGTH} characters`
        }

        // Website
        if (trimmedWebsite.length > MAX_WEBSITE_LENGTH) {
            newErrors.website =
                `Website cannot exceed ${MAX_WEBSITE_LENGTH} characters`
        } else if (
            trimmedWebsite &&
            !isValidWebsite(trimmedWebsite)
        ) {
            newErrors.website =
                "Please enter a valid website URL"
        }

        // Email
        if (trimmedEmail && !isValidEmail(trimmedEmail)) {
            newErrors.email =
                "Please enter a valid email address"
        }

        // Industry
        if (trimmedIndustry.length > MAX_INDUSTRY_LENGTH) {
            newErrors.industry =
                `Industry cannot exceed ${MAX_INDUSTRY_LENGTH} characters`
        }

        // Status
        if (!ALLOWED_STATUSES.includes(status)) {
            newErrors.status = "Please select a valid status"
        }

        // Notes
        if (trimmedNotes.length > MAX_NOTES_LENGTH) {
            newErrors.notes =
                `Notes cannot exceed ${MAX_NOTES_LENGTH} characters`
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }

    function isValidWebsite(value) {
        try {
            const url = new URL(value)

            return (
                url.protocol === "http:" ||
                url.protocol === "https:"
            )
        } catch {
            return false
        }
    }

    async function handleSubmit(e) {

        e.preventDefault()

        const isValid = validateForm()

        if (!isValid) {
            return
        }

        try {
            await onSubmit({
                company_name: companyName.trim(),
                website: website.trim() || null,
                email: email.trim() || null,
                industry: industry.trim() || null,
                status,
                notes: notes.trim() || null
            })
        } catch (error) {

            const backendErrors = {}

            const details = error.response?.data?.detail

            if (Array.isArray(details)) {

                details.forEach((item) => {

                    const field = item.loc?.[item.loc.length - 1]

                    if (field) {

                        const fieldMap = {
                            company_name: "companyName",
                            website: "website",
                            email: "email",
                            industry: "industry",
                            status: "status",
                            notes: "notes"
                        }

                        const frontendField =
                            fieldMap[field] || field

                        backendErrors[frontendField] = item.msg
                    }
                })
            }

            if (Object.keys(backendErrors).length > 0) {
                setErrors(backendErrors)
            } else {
                setErrors({
                    form: "Unable to save lead. Please try again."
                })
            }
        }
    }

    return (
        <div
            className="modal-overlay"
            onClick={onCancel}
        >

            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="modal-header">

                    <h2>
                        {isEditing ? "Edit Lead" : "New Lead"}
                    </h2>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onCancel}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                >

                    {/* General error */}

                    {errors.form && (
                        <div className="form-error">
                            {errors.form}
                        </div>
                    )}

                    {/* COMPANY NAME */}

                    <div className="form-group">

                        <label
                            htmlFor="companyName"
                        >
                            Company Name
                        </label>

                        <input
                            id="companyName"
                            type="text"
                            className="form-input"
                            value={companyName}
                            onChange={(e) => {
                                setCompanyName(e.target.value)

                                if (errors.companyName) {
                                    setErrors((previous) => ({
                                        ...previous,
                                        companyName: undefined
                                    }))
                                }
                            }}
                            maxLength={MAX_COMPANY_NAME_LENGTH}
                            aria-invalid={!!errors.companyName}
                            aria-describedby={
                                errors.companyName
                                    ? "companyName-error"
                                    : undefined
                            }
                            autoFocus
                        />

                        <div className="character-count">
                            {companyName.length}/{MAX_COMPANY_NAME_LENGTH}
                        </div>

                        {errors.companyName && (
                            <p
                                id="companyName-error"
                                className="form-field-error"
                            >
                                {errors.companyName}
                            </p>
                        )}

                    </div>

                    {/* WEBSITE */}

                    <div className="form-group">

                        <label
                            htmlFor="website"
                        >
                            Website
                        </label>

                        <input
                            id="website"
                            type="url"
                            className="form-input"
                            value={website}
                            onChange={(e) => {
                                setWebsite(e.target.value)

                                if (errors.website) {
                                    setErrors((previous) => ({
                                        ...previous,
                                        website: undefined
                                    }))
                                }
                            }}
                            placeholder="https://example.com"
                            maxLength={MAX_WEBSITE_LENGTH}
                            aria-invalid={!!errors.website}
                            aria-describedby={
                                errors.website
                                    ? "website-error"
                                    : undefined
                            }
                        />

                        <div className="character-count">
                            {website.length}/{MAX_WEBSITE_LENGTH}
                        </div>

                        {errors.website && (
                            <p
                                id="website-error"
                                className="form-field-error"
                            >
                                {errors.website}
                            </p>
                        )}

                    </div>

                    {/* EMAIL */}

                    <div className="form-group">

                        <label
                            htmlFor="email"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)

                                if (errors.email) {
                                    setErrors((previous) => ({
                                        ...previous,
                                        email: undefined
                                    }))
                                }
                            }}
                            placeholder="example@company.com"
                            aria-invalid={!!errors.email}
                            aria-describedby={
                                errors.email
                                    ? "email-error"
                                    : undefined
                            }
                        />

                        {errors.email && (
                            <p
                                id="email-error"
                                className="form-field-error"
                            >
                                {errors.email}
                            </p>
                        )}

                    </div>

                    {/* INDUSTRY */}

                    <div className="form-group">

                        <label
                            htmlFor="industry"
                        >
                            Industry
                        </label>

                        <input
                            id="industry"
                            type="text"
                            className="form-input"
                            value={industry}
                            onChange={(e) => {
                                setIndustry(e.target.value)

                                if (errors.industry) {
                                    setErrors((previous) => ({
                                        ...previous,
                                        industry: undefined
                                    }))
                                }
                            }}
                            maxLength={MAX_INDUSTRY_LENGTH}
                            aria-invalid={!!errors.industry}
                            aria-describedby={
                                errors.industry
                                    ? "industry-error"
                                    : undefined
                            }
                        />

                        <div className="character-count">
                            {industry.length}/{MAX_INDUSTRY_LENGTH}
                        </div>

                        {errors.industry && (
                            <p
                                id="industry-error"
                                className="form-field-error"
                            >
                                {errors.industry}
                            </p>
                        )}

                    </div>

                    {/* STATUS */}

                    <div className="form-group">

                        <label
                            htmlFor="status"
                        >
                            Status
                        </label>

                        <select
                            id="status"
                            className="form-select"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value)

                                if (errors.status) {
                                    setErrors((previous) => ({
                                        ...previous,
                                        status: undefined
                                    }))
                                }
                            }}
                            aria-invalid={!!errors.status}
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

                        {errors.status && (
                            <p className="form-field-error">
                                {errors.status}
                            </p>
                        )}

                    </div>

                    {/* NOTES */}

                    <div className="form-group">

                        <label
                            htmlFor="notes"
                        >
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            className="form-textarea"
                            value={notes}
                            onChange={(e) => {
                                setNotes(e.target.value)

                                if (errors.notes) {
                                    setErrors((previous) => ({
                                        ...previous,
                                        notes: undefined
                                    }))
                                }
                            }}
                            maxLength={MAX_NOTES_LENGTH}
                            aria-invalid={!!errors.notes}
                            aria-describedby={
                                errors.notes
                                    ? "notes-error"
                                    : undefined
                            }
                        />

                        <div className="character-count">
                            {notes.length}/{MAX_NOTES_LENGTH}
                        </div>

                        {errors.notes && (
                            <p
                                id="notes-error"
                                className="form-field-error"
                            >
                                {errors.notes}
                            </p>
                        )}

                    </div>

                    {/* ACTIONS */}

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
                            {isEditing
                                ? "Save Changes"
                                : "Create Lead"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default LeadForm