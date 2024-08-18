import { api } from '@shared/api'
import { CustomFrame, Frame } from './types'

const getFrames = async (): Promise<Frame[]> => {
    const res = await api.get(`/frames`)
    return res.data
}

const getCustomFrames = async (): Promise<Frame[]> => {
    const res = await api.get(`/frames/custom`)
    return res.data
}

const createCustomFrame = async (
    frame: Pick<CustomFrame, 'description' | 'name'>
): Promise<CustomFrame> => {
    const res = await api.post(`/frames/custom`, frame)
    return res.data
}

const getCustomFrameById = async (id: string): Promise<CustomFrame> => {
    const res = await api.get(`/frames/${id}`)
    return res.data
}

export { getFrames, getCustomFrames, createCustomFrame, getCustomFrameById }
