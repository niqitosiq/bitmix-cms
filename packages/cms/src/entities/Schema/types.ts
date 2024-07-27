import { Schema as PrismaSchema } from '.prisma/client'
import { Frame } from '@entities/Frame'
import { Prop } from '@entities/Prop'
import { Node } from '@xyflow/react'

type Schema = PrismaSchema & {
    ChildrenSchema?: Schema[]
    Frame?: Frame
    props: Prop[]
}

type CleanSchema = {
    id: Schema['id']
    schema: Schema['frameId']
    parentSchemaId: Schema['parentSchemaId']
    updatedAt: Schema['updatedAt']
    Frame: Schema['Frame']
}

type SchemaNodeType = Node<CleanSchema, 'schema'>

export type { Schema, SchemaNodeType, CleanSchema }
