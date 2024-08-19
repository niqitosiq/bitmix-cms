import { api } from '@shared/api'
import { Schema } from './types'
import type { SchemaCreationBody } from '@api/src/controllers/schemaController'
import { Prop } from '@entities/Prop'

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

const addVisiblePropToSchema = async ({
    schemaAlias,
    visiblePropName,
}: {
    schemaAlias: Schema['alias']
    visiblePropName: string
}): Promise<void> => {
    const res = await api.put(`/schemas/${schemaAlias}/visible-props`, {
        visiblePropName,
    })
    return res.data
}

const deleteVisiblePropFromSchema = async ({
    schemaAlias,
    visiblePropName,
}: {
    schemaAlias: Schema['alias']
    visiblePropName: string
}): Promise<void> => {
    const res = await api.delete(
        `/schemas/${schemaAlias}/visible-props/${visiblePropName}`
    )
    return res.data
}

const pinPropToCustomFrame = async ({
    schemaId,
    propName,
    propType,
}: {
    schemaId: Schema['id']
    propName?: Prop['name']
    propType?: Prop['type']
}): Promise<void> => {
    const res = await api.post('/schemas/pinPropToCustomFrame', {
        schemaId,
        propName,
        propType,
    })
    return res.data
}

const attachSchemaToSchema = async ({
    parentSchemaId,
    childSchemaId,
}: {
    parentSchemaId: Schema['id']
    childSchemaId: Schema['id']
}): Promise<void> => {
    const res = await api.post('/schemas/attachSchemaToSchema', {
        parentSchemaId,
        childSchemaId,
    })
    return res.data
}

export {
    getSchema,
    createSchema,
    deleteSchema,
    addVisiblePropToSchema,
    deleteVisiblePropFromSchema,
    pinPropToCustomFrame,
    attachSchemaToSchema,
}
