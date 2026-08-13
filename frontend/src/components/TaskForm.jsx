import {useState, useEffect} from "react"
// useState ---> To hold values of the Form filled by user
// useEffect ---> If task is being edited, then old values in the form will be filled by useEffect 

const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 5000

function TaskForm({task, onSubmit, onCancel}) {                  //These detials are coming from KanbanBoard. handleSubmit() and handleCancel() are passed from kanban in onSubmit and onCancel
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('pending')
    const [errors, setErrors] = useState({})

    const isEditing = !!task                   // !! ----> If task hold some value (of task to be edited) then isEditing = true, else (task = null)  then isEditing = false

    useEffect(() => {
        if (task) {
            setTitle(task.title || "")
            setDescription(task.description || "")
            setStatus(task.status || "pending")
        } else {
            setTitle("")
            setDescription("")
            setStatus("pending")
        } setErrors({})
    }, [task])

function validateForm() {
        const newErrors = {}

        const trimmedTitle = title.trim()
        const trimmedDescription = description.trim()

        // Title validation
        if (!trimmedTitle) {
            newErrors.title = "Title is required"
        } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
            newErrors.title = `Title cannot exceed ${MAX_TITLE_LENGTH} characters`
        }

        // Description validation
        if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
            newErrors.description =
                `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`
        }

        // Status validation
        const allowedStatuses = ["pending", "started", "completed"]

        if (!allowedStatuses.includes(status)) {
            newErrors.status = "Please select a valid status"
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

     async function handleSubmit(e) {
        e.preventDefault()

        const isValid = validateForm()

        if (!isValid) {
            return
        }

        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim() || null,
                status
            })
        } catch (error) {
            // If backend returns validation errors,
            // show them in the form.
            const backendErrors = {}

            const details = error.response?.data?.detail

            if (Array.isArray(details)) {
                details.forEach((item) => {
                    const field = item.loc?.[item.loc.length - 1]

                    if (field) {
                        backendErrors[field] = item.msg
                    }
                })
            }

            if (Object.keys(backendErrors).length > 0) {
                setErrors(backendErrors)
            } else {
                setErrors({
                    form: "Unable to save task. Please try again."
                })
            }
        }
    }

     return (
        <div className={"modal-overlay"} onClick={onCancel}>
            <div
                className={"modal"}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={"modal-header"}>
                    <h2 className={"modal-title"}>
                        {isEditing ? "Edit Task" : "New Task"}
                    </h2>

                    <button
                        type={"button"}
                        className={"modal-close"}
                        onClick={onCancel}
                        aria-label={"Close"}
                    >
                        x
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>

                    {/* General/backend error */}
                    {errors.form && (
                        <div className={"form-error"}>
                            {errors.form}
                        </div>
                    )}

                    {/* TITLE */}
                    <div className={"form-group"}>
                        <label
                            className={"form-label"}
                            htmlFor={"title"}
                        >
                            Title
                        </label>

                        <input
                            id={"title"}
                            type={"text"}
                            className={"form-input"}
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)

                                // Remove title error as user corrects it
                                if (errors.title) {
                                    setErrors((previous) => ({
                                        ...previous,
                                        title: undefined
                                    }))
                                }
                            }}
                            placeholder={"Enter task title"}
                            maxLength={MAX_TITLE_LENGTH}
                            autoFocus
                            aria-invalid={!!errors.title}
                            aria-describedby={
                                errors.title ? "title-error" : undefined
                            }
                        />

                        <div className={"character-count"}>
                            {title.length}/{MAX_TITLE_LENGTH}
                        </div>

                        {errors.title && (
                            <p
                                id={"title-error"}
                                className={"form-field-error"}
                            >
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className={"form-group"}>
                        <label
                            className={"form-label"}
                            htmlFor={"description"}
                        >
                            Description
                        </label>

                        <textarea
                            id={"description"}
                            className={"form-textarea"}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)

                                if (errors.description) {
                                    setErrors((previous) => ({
                                        ...previous,
                                        description: undefined
                                    }))
                                }
                            }}
                            placeholder={"Enter description (optional)"}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            aria-invalid={!!errors.description}
                            aria-describedby={
                                errors.description
                                    ? "description-error"
                                    : undefined
                            }
                        />

                        <div className={"character-count"}>
                            {description.length}/{MAX_DESCRIPTION_LENGTH}
                        </div>

                        {errors.description && (
                            <p
                                id={"description-error"}
                                className={"form-field-error"}
                            >
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* STATUS */}
                    <div className={"form-group"}>
                        <label
                            className={"form-label"}
                            htmlFor={"status"}
                        >
                            Status
                        </label>

                        <select
                            id={"status"}
                            className={"form-select"}
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
                            <option value={"pending"}>
                                To Do
                            </option>

                            <option value={"started"}>
                                In Progress
                            </option>

                            <option value={"completed"}>
                                Done
                            </option>
                        </select>

                        {errors.status && (
                            <p className={"form-field-error"}>
                                {errors.status}
                            </p>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className={"form-actions"}>
                        <button
                            type={"button"}
                            className={"btn btn-outline"}
                            onClick={onCancel}
                        >
                            Cancel
                        </button>

                        <button
                            type={"submit"}
                            className={"btn btn-primary"}
                        >
                            {isEditing
                                ? "Save Changes"
                                : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TaskForm