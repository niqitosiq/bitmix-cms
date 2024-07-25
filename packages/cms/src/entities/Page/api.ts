import { api } from '@shared/api'
import { Page } from './types'
import { Schema } from '@entities/Schema'

const getPages = (): Promise<Page[]> => {
    return api.get(`/pages`)
}

const getPage = (pageId: string): Promise<Page & { Schema: Schema }> => {
    return api.get(`/pages/${pageId}`)
}

export type Body = {
    name: string
    url: string
    pageFrameName?: string
}
const createPage = ({
    name,
    url,
    pageFrameName = 'PageFrame',
}: Body): Promise<Page & { Schema: Schema }> => {
    return api.post(`/pages`, { name, url, pageFrameName })
}

export { getPages, getPage, createPage }
