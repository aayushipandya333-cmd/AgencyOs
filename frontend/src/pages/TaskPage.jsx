import { useState, useEffect, useCallback } from "react";
import { useAuth, useOrganization } from "@clerk/clerk-react";
import { getTasks } from "../services/api";
import KanbanBoard from "../components/KanbanBoard.jsx";


function TasksPage() {
    const { getToken } = useAuth();

    const { organization } = useOrganization();

    const [tasks, setTasks] = useState([]);                                               // whatever data we pass in setTasks(), comes inside tasks variable. 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const orgId = organization?.id;


    const loadTasks = useCallback(async () => {                                           //useCallback tells React:"Don't create a new loadTasks function on every render. Reuse the same function unless its dependencies (Like Token) change."
        try {
            setLoading(true);
            setError(null);

            const data = await getTasks(getToken);

            setTasks(data);                                                               //Update the React state.

        } catch (err) {
            setError(err.message);

        } finally {
            setLoading(false);
        }
    }, [getToken]);                                                                       //This tells React: "Only recreate loadTasks if getToken changes."  If getToken stays the same: "Reuse loadTasks"

 
    useEffect(() => {                                                                     //useEffect runs automatically as soon as component renders. After the page loads (or when something changes), it works
        if (orgId) {
            loadTasks();
        } else {
            setLoading(false);
        }
    }, [orgId, loadTasks]);                                                               //This tells React: "Run this effect when either orgId or loadTasks changes."


    if (!organization) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
                <div className="max-w-md text-center">

                    <h1 className="text-2xl font-bold text-white">
                        Welcome to TaskBoard
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        Create or join an organization to start managing tasks with your team.
                    </p>

                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-950 px-6 py-8">

            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    Tasks
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                    Manage your agency tasks and keep work moving.
                </p>
            </div>


            {/* Loading */}
            {loading ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
                    <p className="text-sm text-slate-400">
                        Loading tasks...
                    </p>
                </div>

            ) : error ? (

                /* Error */
                <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6">

                    <p className="font-semibold text-red-400">
                        Error loading tasks
                    </p>

                    <p className="mt-1 text-sm text-red-300/80">
                        {error}
                    </p>

                </div>

            ) : (

                /* Kanban */
                <KanbanBoard                                                    //Explained down :   
                    tasks={tasks}
                    setTasks={setTasks}
                    getToken={getToken}
                />

            )}

        </div>
    );
}


export default TasksPage;

// This code is passing data (props) from the parent component to the KanbanBoard child component.
// tasks={tasks} ----> This passes the list of tasks to the KanbanBoard.
// setTasks={setTasks} ----> This passes the function that updates tasks. Why?Suppose you drag a task from Pending to Completed. The child component needs to update the task list.
//getToken={getToken} ----> This passes Clerk's authentication function to handle token.