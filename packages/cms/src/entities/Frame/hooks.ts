import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    createCustomFrame,
    getCustomFrameById,
    getCustomFrames,
    getFrames,
} from './api'
import { CustomFrame } from './types'

const useGetFrames = () => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: ['frames'],
        queryFn: getFrames,
    })
}

const useGetCustomFrames = () => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: ['customFrames'],
        queryFn: getCustomFrames,
    })
}

const useCreateCustomFrame = (onSuccess?: (arg: CustomFrame) => void) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['createCustomFrame'],
        mutationFn: createCustomFrame,
        onSuccess,
    })
}

const useGetCustomFrameById = (id: string) => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: ['customFrame', id],
        queryFn: () => getCustomFrameById(id),
    })
}

export {
    useGetFrames,
    useGetCustomFrames,
    useCreateCustomFrame,
    useGetCustomFrameById,
}
