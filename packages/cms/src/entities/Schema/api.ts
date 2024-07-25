import { api } from '@shared/api'
import { Schema } from './types'
import type { SchemaCreationBody } from '@api/src/controllers/schemaController'

const getSchema = async (schemaId: Schema['id']): Promise<Schema> => {
    return api.get(`/schemas/${schemaId}`)
}

const createSchema = async (schema: SchemaCreationBody): Promise<Schema[]> => {
    return api.post('/schemas', schema)
}

const deleteSchema = async (schemaId: Schema['id']): Promise<void> => {
    return api.delete(`/schemas/${schemaId}`)
}

export { getSchema, createSchema, deleteSchema }
