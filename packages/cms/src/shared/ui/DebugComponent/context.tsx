import { UpdatePropsToSchemaBody } from '@api/src/controllers/schemaController'
import { Schema } from '@entities/Schema'
import { createContext, useContext } from 'react'

type FrameContextType = {
    schema?: Schema
    updateProp?: (body: {
        schemaAlias: Schema['alias']
        body: UpdatePropsToSchemaBody
    }) => void
}
export const FrameContext = createContext<FrameContextType>({})

export const useFrameContext = () => {
    const context = useContext(FrameContext) || {}

    return context
}
