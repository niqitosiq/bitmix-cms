import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3100',
})

export { api }
