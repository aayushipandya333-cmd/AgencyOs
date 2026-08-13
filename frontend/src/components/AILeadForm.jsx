import { useState } from "react"

const MAX_INDUSTRY_LENGTH = 100
const MAX_LOCATION_LENGTH = 100
const MAX_COMPANY_SIZE_LENGTH = 100
const MAX_SERVICE_LENGTH = 200

const MIN_LEADS = 1
const MAX_LEADS = 20

function AILeadForm({ onSubmit, onCancel, loading }) {

    const [industry, setIndustry] = useState("")
    const [location, setLocation] = useState("")
    const [companySize, setCompanySize] = useState("")
    const [service, setService] = useState("")
    const [numberOfLeads, setNumberOfLeads] = useState(5)

    const [errors, setErrors] = useState({})

    function validateForm() {

        const newErrors = {}

        const trimmedIndustry = industry.trim()
        const trimmedLocation = location.trim()
        const trimmedCompanySize = companySize.trim()
        const trimmedService = service.trim()

        // Industry
        if (!trimmedIndustry) {
            newErrors.industry = "Industry is required"
        } else if (
            trimmedIndustry.length > MAX_INDUSTRY_LENGTH
        ) {
            newErrors.industry =
                `Industry cannot exceed ${MAX_INDUSTRY_LENGTH} characters`
        }

        // Location
        if (!trimmedLocation) {
            newErrors.location = "Location is required"
        } else if (
            trimmedLocation.length > MAX_LOCATION_LENGTH
        ) {
            newErrors.location =
                `Location cannot exceed ${MAX_LOCATION_LENGTH} characters`
        }

        // Company size
        if (
            trimmedCompanySize.length >
            MAX_COMPANY_SIZE_LENGTH
        ) {
            newErrors.companySize =
                `Company size cannot exceed ${MAX_COMPANY_SIZE_LENGTH} characters`
        }

        // Service
        if (!trimmedService) {
            newErrors.service = "Service is required"
        } else if (
            trimmedService.length > MAX_SERVICE_LENGTH
        ) {
            newErrors.service =
                `Service cannot exceed ${MAX_SERVICE_LENGTH} characters`
        }

        // Number of leads
        const leadCount = Number(numberOfLeads)

        if (
            !Number.isInteger(leadCount) ||
            leadCount < MIN_LEADS ||
            leadCount > MAX_LEADS
        ) {
            newErrors.numberOfLeads =
                `Number of leads must be between ${MIN_LEADS} and ${MAX_LEADS}`
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e) {

        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {

            await onSubmit({
                industry: industry.trim(),
                location: location.trim(),
                company_size:
                    companySize.trim() || null,
                service: service.trim(),
                number_of_leads: Number(numberOfLeads)
            })

        } catch (error) {

            const backendErrors = {}

            const details =
                error.response?.data?.detail

            if (Array.isArray(details)) {

                details.forEach((item) => {

                    const field =
                        item.loc?.[item.loc.length - 1]

                    if (field) {

                        const fieldMap = {
                            industry: "industry",
                            location: "location",
                            company_size: "companySize",
                            service: "service",
                            number_of_leads: "numberOfLeads"
                        }

                        const frontendField =
                            fieldMap[field] || field

                        backendErrors[frontendField] =
                            item.msg
                    }

                })
            }

            if (
                Object.keys(backendErrors).length > 0
            ) {

                setErrors(backendErrors)

            } else {

                setErrors({
                    form:
                        "Unable to find leads. Please try again."
                })
            }
        }
    }

    function clearError(field) {

        if (errors[field]) {

            setErrors((previous) => ({
                ...previous,
                [field]: undefined
            }))
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
                        Find Leads with AI
                    </h2>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onCancel}
                        disabled={loading}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                >

                    {/* GENERAL ERROR */}

                    {errors.form && (
                        <div className="form-error">
                            {errors.form}
                        </div>
                    )}

                    {/* INDUSTRY */}

                    <div className="form-group">

                        <label htmlFor="ai-industry">
                            Industry
                        </label>

                        <input
                            id="ai-industry"
                            className="form-input"
                            placeholder="e.g. IT, Healthcare, E-commerce"
                            value={industry}
                            maxLength={MAX_INDUSTRY_LENGTH}
                            onChange={(e) => {
                                setIndustry(e.target.value)
                                clearError("industry")
                            }}
                            aria-invalid={!!errors.industry}
                        />

                        <div className="character-count">
                            {industry.length}/{MAX_INDUSTRY_LENGTH}
                        </div>

                        {errors.industry && (
                            <p className="form-field-error">
                                {errors.industry}
                            </p>
                        )}

                    </div>

                    {/* LOCATION */}

                    <div className="form-group">

                        <label htmlFor="ai-location">
                            Location
                        </label>

                        <input
                            id="ai-location"
                            className="form-input"
                            placeholder="e.g. India, Indore, USA"
                            value={location}
                            maxLength={MAX_LOCATION_LENGTH}
                            onChange={(e) => {
                                setLocation(e.target.value)
                                clearError("location")
                            }}
                            aria-invalid={!!errors.location}
                        />

                        <div className="character-count">
                            {location.length}/{MAX_LOCATION_LENGTH}
                        </div>

                        {errors.location && (
                            <p className="form-field-error">
                                {errors.location}
                            </p>
                        )}

                    </div>

                    {/* COMPANY SIZE */}

                    <div className="form-group">

                        <label htmlFor="ai-company-size">
                            Company Size
                        </label>

                        <input
                            id="ai-company-size"
                            className="form-input"
                            placeholder="e.g. 10-100 employees"
                            value={companySize}
                            maxLength={MAX_COMPANY_SIZE_LENGTH}
                            onChange={(e) => {
                                setCompanySize(e.target.value)
                                clearError("companySize")
                            }}
                            aria-invalid={!!errors.companySize}
                        />

                        <div className="character-count">
                            {companySize.length}/{MAX_COMPANY_SIZE_LENGTH}
                        </div>

                        {errors.companySize && (
                            <p className="form-field-error">
                                {errors.companySize}
                            </p>
                        )}

                    </div>

                    {/* SERVICE */}

                    <div className="form-group">

                        <label htmlFor="ai-service">
                            Service Required
                        </label>

                        <input
                            id="ai-service"
                            className="form-input"
                            placeholder="e.g. Web Development"
                            value={service}
                            maxLength={MAX_SERVICE_LENGTH}
                            onChange={(e) => {
                                setService(e.target.value)
                                clearError("service")
                            }}
                            aria-invalid={!!errors.service}
                        />

                        <div className="character-count">
                            {service.length}/{MAX_SERVICE_LENGTH}
                        </div>

                        {errors.service && (
                            <p className="form-field-error">
                                {errors.service}
                            </p>
                        )}

                    </div>

                    {/* NUMBER OF LEADS */}

                    <div className="form-group">

                        <label htmlFor="ai-number-of-leads">
                            Number of Leads
                        </label>

                        <input
                            id="ai-number-of-leads"
                            className="form-input"
                            type="number"
                            min={MIN_LEADS}
                            max={MAX_LEADS}
                            step="1"
                            value={numberOfLeads}
                            onChange={(e) => {
                                setNumberOfLeads(e.target.value)
                                clearError("numberOfLeads")
                            }}
                            aria-invalid={
                                !!errors.numberOfLeads
                            }
                        />

                        {errors.numberOfLeads && (
                            <p className="form-field-error">
                                {errors.numberOfLeads}
                            </p>
                        )}

                    </div>

                    {/* ACTIONS */}

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
                            {loading
                                ? "Finding Leads..."
                                : "Find Leads"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default AILeadForm