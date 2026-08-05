// Entire column of tasks (To Do / In Progress / Done )

import TaskCard from "./TaskCard.jsx";

const STATUS_LABELS = {               // To do mapping between UI and database
    pending: "To Do",
    started: "In Progress",
    completed: "Done"
}

function TaskColumn({status, tasks, onEdit, onDelete}) {
    return <div className={"kanban-column"}>
        <div className={`kanban-column-header kanban-column-header-${status}`}>          {/* template literals for different status of tasks, different CSS will be used like colors of columns will be different based on status */}
            <h3 className={"kanban-column-title"}>{STATUS_LABELS[status]}</h3>
            <span className={"kanban-column-count"}>{tasks.length}</span>
        </div>
        <div className={"kanban-column-body"}>
            {tasks.map(task =>                       // TaskCard called for each task in the TaskColumn                                     // TaskCard will be called for each task inside tasks
                (<TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />))}
        </div>
    </div>
}

export default TaskColumn