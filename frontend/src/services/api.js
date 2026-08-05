//File which acts as a bridge between frontend and backend

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"                         // To store base url of backend. Access the backend url either with .env file (If mentioned there) or use direct localhost link provided after ||

export async function fetchWithAuth(endpoint, getToken, options = {}) {
    const token = await getToken()

    const response = await fetch(
        `${API_URL}${endpoint}`,
         {
            ...options,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
            }
        }
    )
    
    if (!response.ok) {
        const error = await response.json().catch(() => {})
        throw new Error(error.detail || "Request failed")
    }

    if (response.status == 204){
        return null
    }

    return response.json()
}




// ---------- TASKS ----------

export async function getTasks(getToken) {
    return fetchWithAuth("/api/tasks", getToken)
} 

export async function createTask(getToken, task) {
    return fetchWithAuth("/api/tasks", getToken, {
        method: "POST",
        body : JSON.stringify(task)
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