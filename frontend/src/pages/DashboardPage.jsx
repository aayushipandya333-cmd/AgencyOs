import { useState, useEffect, useCallback } from "react"
import { useAuth, useOrganization, CreateOrganization } from "@clerk/clerk-react"
import { getTasks } from "../services/api"
import KanbanBoard from "../components/KanbanBoard.jsx"


function DashboardPage()
{
    const {getToken} = useAuth()
    const {organization, memberships} = useOrganization(
        {memberships : {infinite: true}}
    )
    const [tasks, setTasks] = useState([])                    // whatever data we pass in setTasks(), comes inside tasks variable. 
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const memberCount = memberships?.count ?? 0                //Get the number of members in the organization. If that value doesn't exist yet, use 0 instead.
    const orgId = organization?.id                              // ?. means --> Get the ID of the current organization. If no organization is selected or loaded yet, don't throw an error

    const loadTasks = useCallback(async() => {                //useCallback tells React:"Don't create a new loadTasks function on every render. Reuse the same function unless its dependencies (Like Token) change."
        try{
            setLoading(true)
            setError(null)
            const data = await getTasks(getToken)
            setTasks(data)                                   //Update the React state.
        } catch(err){                         
            setError(err.message)
        }  finally{
            setLoading(false)
        }
    }, [getToken])                                        //This tells React: "Only recreate loadTasks if getToken changes."  If getToken stays the same: "Reuse loadTasks"

    useEffect(() => {                                    //useEffect runs automatically as soon as component renders. After the page loads (or when something changes), it works
        if(orgId){
            loadTasks()
        } else {
            setLoading(false)
        }
    },[orgId,loadTasks])                                 //This tells React: "Run this effect when either orgId or loadTasks changes."
        

   if (!organization) {
           return <div className={"dashboard-container"}>
               <div className={"no-org-container"}>
                   <h1 className={"no-org-title"}>Welcome to TaskBoard</h1>
                   <p className={"no-org-text"}>
                       Create or join an organization to start managing tasks with your team.
                   </p>
                   <CreateOrganization afterCreateOrganizationUrl={"/dashboard"}/>         {/* This is a Clerk component. It displays a button like: + Create Organization.  When the user clicks it: Clerk opens the organization creation flow,The user enters an organization name,The organization is created and The user is redirected to: /dashboard */}
               </div>
           </div>
       }
   
       return <div className={"dashboard-container"}>
           <div className={"dashboard-header"}>
               <div>
                   <h1 className={"dashboard-title"}>{organization.name}</h1>          {/* Name of organization on top  */}
                   <p className={"org-members"}>
                       {memberCount} member{memberCount !== 1 ? "s" : ""}               {/* Number of members */}
                   </p>
               </div>
           </div>
   
           {loading ? (
               <p className={"text-muted"}>Loading Tasks...</p>                       // If loading then print : Loading Tasks... 
           ) : error ? (
               <div className={"card-error"}>
                   <p className={"text-error text-error-title"}>Error loading tasks</p>
                   <p className={"text-error text-error-message"}>{error}</p>                 {/* If error then print : Exact error */} 
               </div>
           ) : (
               <KanbanBoard                                                                       //Explained down :                                                            // Else call KanbanBoard 
                   tasks={tasks}                              
                   setTasks={setTasks}
                   getToken={getToken}
               />
           )}
       </div>
   }

export default DashboardPage





// This code is passing data (props) from the parent component to the KanbanBoard child component.
// tasks={tasks} ----> This passes the list of tasks to the KanbanBoard.
// setTasks={setTasks} ----> This passes the function that updates tasks. Why?Suppose you drag a task from Pending to Completed. The child component needs to update the task list.
//getToken={getToken} ----> This passes Clerk's authentication function to handle token.