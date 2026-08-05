// Particular task in a particular TaskColumn

function TaskCard({task, onEdit, onDelete}) {
    const canEdit  = !!onEdit                      // !! ---> Convert any value to a boolean value. Two values can come from kanbanBoard either handleEdit (true) or null ( false)
    const canDelete = !!onDelete                   // Two values can come from kanbanBoard either handleDelete (true) or null ( false)

    return <div className={`task-card ${canEdit ? 'task-card-clickable' : ""}`}        // If a user is eligible to edit (If canEdit = true), then card will be clickable (custom CSS)
        onClick = {canEdit ? () => onEdit(task) : undefined}                           // if a user is eligible to edit, then function is called onClick
        >                                                                              {/* it is actually calling: handleEdit(task) ---> which is defined in and passed from KanbanBoard */}

            <div className={"task-card-header"}>
                <h4 className={"task-card-title"}>{task.title}</h4>
                {canDelete && (
                    <button
                        className={"task-card-btn task-card-btn-delete"}
                        onClick={(e) => {
                        e.stopPropagation();                //To stop edit and only execute delete on cliking X button
                        onDelete(task.id);
                        }}
                        
                        title={"Delete Task"}
                        >
                            X
                        </button>
                )}

                
            </div>

            {task.description && (                                      // If task has description so show that
                    <p className={"task-card-description"}>{task.description}</p>
                )}
    </div>
}


export default TaskCard