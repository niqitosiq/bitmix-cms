import { Schema } from '@entities/Schema'
import { SchemaToTranspileComponent } from '.'

const makePropsTranspiled = (
    props: Schema['props']
): SchemaToTranspileComponent['props'] => {
    return props
        .filter(
            (prop) =>
                prop.propValue?.value ||
                (prop.propValue?.schemaReferenceAlias &&
                    prop.propValue?.schemaReferenceField)
        )
        .map((prop) => ({
            [prop.name]:
                `&${prop.propValue?.schemaReferenceAlias}[${prop.propValue?.schemaReferenceField}]` ||
                prop.propValue?.value,
        }))
        .reduce(
            (acc, prop) => ({
                ...acc,
                ...prop,
            }),
            {}
        )
}

export const convertSchemaToTranspileReady = (
    schema: Schema
): SchemaToTranspileComponent => {
    const transpileReady: SchemaToTranspileComponent = {
        id: schema.alias,
        props: makePropsTranspiled(schema.props),
        type: schema.Frame!.name,
        children: [],
    }

    schema.ChildrenSchema?.forEach((child) => {
        transpileReady.children.push(convertSchemaToTranspileReady(child))
    })

    return transpileReady
}
