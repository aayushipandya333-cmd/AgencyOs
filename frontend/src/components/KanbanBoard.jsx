import {useState} from "react"
import {useOrganization} from "@clerk/clerk-react"
import TaskColumn from "./TaskColumn.jsx"
import {createTask, updateTask, deleteTask} from "../services/api.js"
import TaskForm from "./TaskForm.jsx"


const STATUSES = ["pending", "started", "completed"]

function KanbanBoard({tasks, setTasks, getToken}) {
    const {membership} = useOrganization()
    const [showForm, setShowForm] = useState(false)               //Show form yes or no, Initially false means don't show the form
    const [editingTask, setEditingTask] = useState(null)          //Which task is being edited? Initially null means no task is edited

    const role = membership?.role
    const canManage = role === "org:admin" || role === "org:editor"

    function getTasksByStatus(status) {
        return tasks.filter(task => task.status === status)
    }

    function handleEdit(task) {
        setEditingTask(task)        //Stores and passes which task to edit
        setShowForm(true)             //Form should be showed
    }

    async function handleDelete(taskId) {
        if (!confirm("Are you sure you want to delete this task?")) return             //  User clicks Cancel --> confirm() = false --> !false = true --> return --> Deletion stops and Nothing gets deleted.

        const taskToDelete = tasks.find(t => t.id === taskId)                          // now if you want to delete, Save it because if deleting fails, we can restore it.
        setTasks(prev => prev.filter(t => t.id !== taskId))                          //This removes the task before calling the backend. This makes the app feel much faster. prev will hold tasks except the one we want to delete (! is used)

        try {
            await deleteTask(getToken, taskId)
        } catch (err) {
            setTasks(prev => [...prev, taskToDelete])   //Restore the task. (...) is the spread operator. It copies all items from the prev array. At the end we are adding taskToDelete also. So at the end prev will hold all data to restore if delete fails.
            console.error(err)
        }
    }

    async function handleSubmit(taskData) {
        if (editingTask) {                                            // If you are submitting after pressing edit button 
            const updatedTask = {...editingTask, ...taskData}         // editingTask --> Task you need to edit, taskData ---> New data you passed in function. Both are merged because The old task may have fields you don't want to lose (Or you dont want to edit, must remain same as previous)
            setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t))   // immediately show updated values on screen. map() goes through every task. If it finds the edited task:Replace it. Otherwise:Keep it unchanged.
            setShowForm(false)
            setEditingTask(null)

            try {
                await updateTask(getToken, editingTask.id, taskData)                      // Actually changing data in DB
            } catch (err) {
                setTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t))    // If not updated due to error so restore data
                console.error(err)
            }
        } else {
            try {
                const newTask = await createTask(getToken, taskData)                       // If you are submittiing after adding new task 
                setTasks(prev => [...prev, newTask])
                setShowForm(false)
            } catch (err) {
                console.error(err)
            }
        }
    }

    function handleCancel() {
        setShowForm(false)
        setEditingTask(null)
    }

    function handleAddTask() {
        setEditingTask(null)           //Because its a new task, not task to be edited
        setShowForm(true)
    }

    return <div className={"kanban-wrapper"}>
        <div className={"kanban-header"}>
            <h2 className={"kanban-title"}>Tasks</h2>
            {canManage && (                                                     //If user can manage (admin or editor), then show "+Add Task" button and on clicking go to handleAddTask()
                <button className={"btn btn-primary"} onClick={handleAddTask}>
                    + Add Task
                </button>
            )}
        </div>

        <div className={"kanban-board"}>
            {STATUSES.map(status => (                            // STATUSES declared on top. This is the loop which will create TaskColumn for all 3 STATUSES
                <TaskColumn
                    key={status}
                    status={status}
                    tasks={getTasksByStatus(status)}            //Values passed in TaskColumn.jsx
                    onEdit={canManage ? handleEdit : null}          // Pass the handleEdit function using the prop name onEdit
                    onDelete={canManage ? handleDelete : null}      // Pass the handleDelete function using the prop name onDelete
                />
            ))}
        </div>

        {showForm && <TaskForm                    //Initially showForm is false, so no popup and if button is clicked so open the TaskForm with details
        task={editingTask} 
        onSubmit={handleSubmit} 
        onCancel={handleCancel}
        />}
    </div>
}

export default KanbanBoard