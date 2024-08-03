import { Schema as PrismaSchema, VisibleProp } from '.prisma/client'
import { Frame } from '@entities/Frame'
import { Prop } from '@entities/Prop'
import { Node } from '@xyflow/react'

type Schema = PrismaSchema & {
    ChildrenSchema?: Schema[]
    Frame?: Frame
    props: Prop[]
    visibleProps: VisibleProp[]
}

type CleanSchema = {
    id: Schema['id']
    alias: Schema['alias']
    parentSchemaId: Schema['parentSchemaId']
    updatedAt: Schema['updatedAt']
    Frame: Schema['Frame']
    props: Prop[]
    visibleProps: VisibleProp[]
}

type SchemaNodeType = Node<CleanSchema, 'schema'>

export type { Schema, SchemaNodeType, CleanSchema }
