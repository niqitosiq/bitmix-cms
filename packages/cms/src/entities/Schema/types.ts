import { Schema as PrismaSchema } from '.prisma/client'
import { Frame } from '@entities/Frame'
import { Node } from '@xyflow/react'

type Schema = PrismaSchema & {
    ChildrenSchema?: Schema[]
    Frame?: Frame
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
