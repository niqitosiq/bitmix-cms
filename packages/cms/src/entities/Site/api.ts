import { api } from '@shared/api'
import { Site } from './types'

const getSite = async (id: Site['id']): Promise<Site> => {
    const response = await api.get(`/sites/${id}`)
    return response.data
}

const getSites = async (): Promise<Site[]> => {
    const response = await api.get('/sites')
    return response.data
}

const createSite = async (site: Site): Promise<Site> => {
    const response = await api.post('/sites', site)
    return response.data
}

const updateSite = async (site: Site): Promise<Site> => {
    const response = await api.put(`/sites/${site.id}`, site)
    return response.data
}

const deleteSite = async (id: Site['id']): Promise<void> => {
    await api.delete(`/sites/${id}`)
}

export { getSite, getSites, createSite, updateSite, deleteSite }
