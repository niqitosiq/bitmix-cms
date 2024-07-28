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
    alias: Schema['alias']
    parentSchemaId: Schema['parentSchemaId']
    updatedAt: Schema['updatedAt']
    Frame: Schema['Frame']
    props: Prop[]
}

type SchemaNodeType = Node<CleanSchema, 'schema'>

export type { Schema, SchemaNodeType, CleanSchema }
