import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Site } from './types'
import { deleteSite, getSite, getSites } from './api'

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

const useCreateSite = (id: Site['id']) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: [SITE_KEY, { id }],
        mutationFn: () => getSite(id),
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

const useDeleteSite = (id: Site['id']) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: [SITE_KEY, { id }],
        mutationFn: () => deleteSite(id),
        onSuccess: () => {
            const sites = queryClient.getQueryData([SITES_KEY])
            if (!sites) return
            queryClient.setQueryData(
                [SITES_KEY],
                (sites as Site[]).filter((site) => site.id !== id)
            )
        },
    })
}

export { useGetSite, useGetSites, useCreateSite, useDeleteSite }
