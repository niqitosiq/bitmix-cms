import { UpdatePropsToSchemaBody } from '@api/src/controllers/schemaController'
import { Schema } from '@entities/Schema'
import { api } from '@shared/api'
import { Prop } from './types'

const updatePropToSchema = (
    schemaId: Schema['id'],
    body: UpdatePropsToSchemaBody
): Promise<Prop> => {
    return api.put(`/schemas/${schemaId}/props`, body)
}

const deletePropFromSchema = (schemaId: Schema['id'], propId: string) => {
    return api.delete(`/schemas/${schemaId}/props/${propId}`)
}

const getProp = async (propId: Prop['id']): Promise<Prop> => {
    return api.get(`/props/${propId}`)
}

export { updatePropToSchema, deletePropFromSchema, getProp }
