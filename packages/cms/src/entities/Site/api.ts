import { api } from '@shared/api'
import { Site } from './types'
import { Page } from '@entities/Page'

const getSite = async (id: Site['id']): Promise<Site> => {
    const response = await api.get(`/sites/${id}`)
    return response.data
}

const getSites = async (): Promise<Site[]> => {
    const response = await api.get('/sites')
    return response.data
}

export type Body = {
    name: Site['name']
}
const createSite = async (site: Body): Promise<Site> => {
    const response = await api.post('/sites', site)

    return response.data
}

const updateSite = async (site: Body & Partial<Site>): Promise<Site> => {
    const response = await api.put(`/sites/${site.id}`, site)
    return response.data
}

const deleteSite = async (id: Site['id']): Promise<void> => {
    await api.delete(`/sites/${id}`)
}

const getSitePages = async (
    siteId: Site['id']
): Promise<Site & { Pages: Page[] }> => {
    const response = await api.get(`/sites/${siteId}/pages`)
    return response.data
}

export { getSite, getSites, createSite, updateSite, deleteSite, getSitePages }
