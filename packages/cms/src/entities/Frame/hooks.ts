import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getFrames } from './api'

const useGetFrames = () => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: ['frames'],
        queryFn: getFrames,
    })
}

export { useGetFrames }
