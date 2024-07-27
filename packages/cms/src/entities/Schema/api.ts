import { api } from '@shared/api'
import { Schema } from './types'
import type { SchemaCreationBody } from '@api/src/controllers/schemaController'

const getSchema = async (schemaId: Schema['id']): Promise<Schema> => {
    const res = await api.get(`/schemas/${schemaId}`)
    return res.data
}

const createSchema = async (schema: SchemaCreationBody): Promise<Schema> => {
    const res = await api.post('/schemas', schema)
    return res.data
}

const deleteSchema = async (schemaId: Schema['id']): Promise<void> => {
    const res = await api.delete(`/schemas/${schemaId}`)
    return res.data
}

export { getSchema, createSchema, deleteSchema }
