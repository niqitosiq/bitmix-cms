import {
    useMutation,
    UseMutationOptions,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { Site } from './types'
import {
    Body,
    createSite,
    deleteSite,
    getSite,
    getSitePages,
    getSites,
} from './api'

const SITES_KEY = 'sites'
const SITE_KEY = 'site'

const useGetSite = (id: Site['id']) => {
    return useQuery({
        queryKey: [SITE_KEY, { id }],
        queryFn: () => getSite(id),
    })
}

const useGetSites = () => {
    return useQuery({
        queryKey: [SITES_KEY],
        queryFn: () => getSites(),
    })
}

const useCreateSite = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [SITE_KEY],
        mutationFn: createSite,
        onSuccess: (created) => {
            const sites = queryClient.getQueryData([SITES_KEY])
            if (!sites) return
            queryClient.setQueryData(
                [SITES_KEY],
                [...(sites as Site[]), created]
            )
        },
    })
}

const useDeleteSite = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: [SITE_KEY],
        mutationFn: deleteSite,
        onSuccess: (_, id) => {
            const sites = queryClient.getQueryData([SITES_KEY])
            if (!sites) return
            queryClient.setQueryData(
                [SITES_KEY],
                (sites as Site[]).filter((site) => site.id !== id)
            )
        },
    })
}

const useGetSitePages = (id: Site['id']) => {
    return useQuery({
        queryKey: [SITE_KEY, { siteId: id }],
        queryFn: () => getSitePages(id),
    })
}

export {
    useGetSite,
    useGetSites,
    useCreateSite,
    useDeleteSite,
    useGetSitePages,
}
