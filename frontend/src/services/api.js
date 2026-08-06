//File which acts as a bridge between frontend and backend
//Without this file: Every React component would have to write fetch() code.
//But now, by using thisfile, every component simply calls functions like: getTasks(), createTask(), deleteTask()
//This follows the DRY (Don't Repeat Yourself) principle.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"                         // To store base url of backend. Access the backend url either with .env file (If mentioned there) or use direct localhost link provided after ||

export async function fetchWithAuth(endpoint, getToken, options = {}) {                        // This function Fetch data with authentication. This function automatically: Gets the Clerk token, Adds it to the request, Calls the backend, Handles errors, Returns data.
                                                                                               // endpoint : It tells the function which backend API to call. "/api/tasks" or "/api/leads" 
                                                                                               // getToken : This comes from Clerk.
                                                                                               // options = {} : Options is for third argument. If third argument is passed (like in post request), then its good else if no third argument is passed (Like in get request), JavaScript automatically uses {} i.e. an empty object.
    const token = await getToken()
    const response = await fetch(                                                              // fetch() is a built-in JavaScript function used to send HTTP requests to a server (your FastAPI backend).
        `${API_URL}${endpoint}`,                                                                // First argument which is passed to fetch(). It creates the complete URL that fetch() will call. To build url dynamically.
         {                                                                                      // fetch() accepts two main arguments: fetch(URL, options). URL (where to send the request), Options (how to send the request). 
            ...options,                                                                         // ...options : It copied every property from options, we received in above function.
            headers: {                                                                          // Headers are metadata sent with an HTTP request
            'Content-Type': 'application/json',                                                 // Specifies that JSON data is sent to backend
            'Authorization': `Bearer ${token}`,                                                 // Tell the backend who the user is.
            ...options.headers                                                                  // If any additional headers to be provided in future, then they will also be added.
            }
        }
    )
    
    if (!response.ok) {
        const error = await response.json().catch(() => {})
        throw new Error(error.detail || "Request failed")
    }

    if (response.status == 204){                                                                   // 204 ---> no content. Mostly used in delete. If deleted, then return nothing (i.e null)
        return null
    }

    return response.json()                                                                           // if no error, then return the response came from backend
}




// ---------- TASKS ----------

export async function getTasks(getToken) {                                                            // exported from here so that other pages can import it. like in KanbanBoard.jsx ---> import {createTask, updateTask, deleteTask} from "../services/api.js"
    return fetchWithAuth("/api/tasks", getToken)
} 

export async function createTask(getToken, task) {
    return fetchWithAuth("/api/tasks", getToken, {
        method: "POST",
        body : JSON.stringify(task)                                                                   // task is an object and browser can't send object thus convert it into JSON string 
    })
} 


export async function updateTask(getToken, taskId, task) {
    return fetchWithAuth(`/api/tasks/${taskId}`, getToken,{
        method: "PUT", 
        body : JSON.stringify(task)
    })
} 

export async function deleteTask(getToken, taskId) {
    return fetchWithAuth(`/api/tasks/${taskId}`, getToken,{
        method: "DELETE"
    })
} 





// ---------- LEADS ----------

export async function getLeads(getToken) {
    return fetchWithAuth("/api/leads", getToken)
}

export async function createLead(getToken, lead) {
    return fetchWithAuth("/api/leads", getToken, {
        method: "POST",
        body: JSON.stringify(lead)
    })
}

export async function updateLead(getToken, leadId, lead) {
    return fetchWithAuth(`/api/leads/${leadId}`, getToken, {
        method: "PUT",
        body: JSON.stringify(lead)
    })
}

export async function deleteLead(getToken, leadId) {
    return fetchWithAuth(`/api/leads/${leadId}`, getToken, {
        method: "DELETE"
    })
}