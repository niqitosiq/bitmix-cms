import { api } from '@shared/api'
import { Frame } from './types'

const getFrames = async (): Promise<Frame[]> => {
    const res = await api.get(`/frames`)
    return res.data
}

export { getFrames }
