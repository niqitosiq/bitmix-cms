import { UpdatePropsToSchemaBody } from '@api/src/controllers/schemaController'
import { Schema } from '@entities/Schema'
import { api } from '@shared/api'
import { Prop } from './types'

const updatePropToSchema = async ({
    body,
    schemaAlias,
}: {
    schemaAlias: Schema['alias']
    body: UpdatePropsToSchemaBody
}): Promise<Prop> => {
    const res = await api.put(`/schemas/${schemaAlias}/props`, body)
    return res.data
}

const deletePropFromSchema = async (schemaId: Schema['id'], propId: string) => {
    const res = await api.delete(`/schemas/${schemaId}/props/${propId}`)
    return res.data
}

const getProp = async (propId: Prop['id']): Promise<Prop> => {
    const res = await api.get(`/props/${propId}`)
    return res.data
}

export { updatePropToSchema, deletePropFromSchema, getProp }
