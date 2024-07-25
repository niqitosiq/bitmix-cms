import axios from 'axios'

const api = axios.create({
    baseURL: 'locahost:3000',
})

export { api }
