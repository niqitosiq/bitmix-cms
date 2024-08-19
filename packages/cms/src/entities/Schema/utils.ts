import { Schema, CleanSchema } from './types'

export const getCleanSchema = (schema: Schema): CleanSchema => {
    return {
        id: schema['id'],
        alias: schema['alias'],
        props: schema['props'],
        parentSchemaId: schema['parentSchemaId'],
        updatedAt: schema['updatedAt'],
        Frame: schema['Frame'],
        visibleProps: schema['visibleProps'],
    }
}

export const iterateOverChildrenSchemas = (
    schema: Schema,
    handler: (schema: Schema, parentSchema: Schema) => void,
    condition?: (schema: Schema, parentSchema: Schema) => boolean
) => {
    if (schema.ChildrenSchema && schema.ChildrenSchema.length) {
        schema.ChildrenSchema.forEach((childSchema) => {
            handler(childSchema, schema)
            if (condition ? condition(childSchema, schema) : true) {
                iterateOverChildrenSchemas(childSchema, handler)
            }
        })
    }
}
