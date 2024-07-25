import { api } from '@shared/api'
import { Page } from './types'
import { Schema } from '@entities/Schema'
import { Site } from '@entities/Site'

const getPages = (): Promise<Page[]> => {
    return api.get(`/pages`)
}

const getPage = async (pageId: string): Promise<Page & { Schema: Schema }> => {
    const data = await api.get(`/pages/${pageId}`)
    return data.data
}

export type Body = {
    name: string
    url: string
    pageFrameName?: string
    siteId: Site['id']
}
const createPage = async ({
    name,
    url,
    pageFrameName = 'PageFrame',
    siteId,
}: Body): Promise<Page & { Schema: Schema }> => {
    const response = await api.post(`/pages`, {
        name,
        url,
        pageFrameName,
        siteId,
    })
    return response.data
}

export { getPages, getPage, createPage }
