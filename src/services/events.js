import axios from 'axios'

//baseUrl = 'http://localhost:3000'

const baseUrl = 'https://result-backend-a25n.onrender.com'

const getAll = ({year=""}) => {
    response = axios.get(`${baseUrl}/tulokset-new/online/online_events_dt.json?Year=${year}`)
    response.then((response) => {
        return response
    }).catch((error) => {
        console.log(error)
    })
}

export default { getAll }