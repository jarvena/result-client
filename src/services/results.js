import axios from 'axios'

//const baseUrl = 'http://localhost:3000'
const baseUrl = 'https://result-backend-a25n.onrender.com'

const getEvents = (year="") => {
    const response = axios.get(`${baseUrl}/tulokset-new/online/online_events_dt.json${year}`)
    return response
}

const getEvent = (eventId="2024_esijukola_h") => {
    const response = axios.get(`${baseUrl}/tulokset-new/online/online_${eventId}_event.json`)
    return response
}

const getCompetitors = (eventId="2024_esijukola_h") => {
    const response = axios.get(`${baseUrl}/tulokset-new/online/online_${eventId}_competitors.json`)
    return response
}

const getResults = (eventId="2024_esijukola_h") => {
    const response = axios.get(`${baseUrl}/tulokset-new/online/online_${eventId}_results.json`)
    return response
}

export default { getEvents, getEvent, getCompetitors, getResults }