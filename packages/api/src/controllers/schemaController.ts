import { Request, Response } from 'express'
import { PrismaClient, Prop, PropValue, Schema } from '@prisma/client'
import { generate } from 'random-words'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export type SchemaCreationBody = {
    parentSchemaId?: string
    pageId?: string
    frameId: string
}
export type UpdatePropsToSchemaBody = {
    id?: string
    name: string
    type?: string
    mockValue?: string
    reference?: {
        schemaAlias: string
        fieldName: string
    }
}

export const getUniqueWordId = (): string => {
    return generate() + uuidv4().slice(0, 4)
}

export class SchemaController {
    async createSchema(
        req: Request<unknown, Schema, SchemaCreationBody>,
        res: Response
    ) {
        try {
            const { parentSchemaId, pageId, frameId } = req.body

            const schema = await prisma.schema.create({
                data: {
                    alias: getUniqueWordId(),
                    ParentSchema: parentSchemaId
                        ? { connect: { id: parentSchemaId } }
                        : undefined,
                    Page: pageId ? { connect: { id: pageId } } : undefined,
                    Frame: { connect: { id: frameId } },
                },
            })

            res.status(201).json(schema)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async deleteSchema(req: Request, res: Response) {
        try {
            const { id } = req.params as unknown as { id: string }

            await prisma.schema.delete({ where: { id } })

            res.status(204).end()
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async getAllSchemas(req: Request, res: Response) {
        try {
            const schemas = await prisma.schema.findMany({
                include: {
                    props: {
                        include: {
                            propValue: true,
                        },
                    },
                    Frame: true,
                    ChildrenSchema: {
                        include: {
                            ChildrenSchema: true,
                            Frame: true,
                            visibleProps: true,
                        },
                    },
                },
            })

            res.status(200).json(schemas)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async getSchemaById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const topLevelSchema = await prisma.schema.findFirst({
                where: { OR: [{ id }, { alias: id }] },
                include: {
                    props: {
                        include: {
                            propValue: true,
                        },
                    },
                    Frame: true,
                    ChildrenSchema: true,
                    visibleProps: true,
                },
            })

            if (!topLevelSchema) {
                res.status(404).json({ message: 'Schema not found' })
                return
            }

            // find all childrens for schema and include it recursively
            const findChildren = async (schema: Schema) => {
                const children = await prisma.schema.findMany({
                    where: { ParentSchema: { some: { id: schema.id } } },
                    include: {
                        props: {
                            include: {
                                propValue: true,
                            },
                        },
                        Frame: true,
                        ChildrenSchema: true,
                        visibleProps: true,
                    },
                })

                for (const child of children) {
                    child.ChildrenSchema = await findChildren(child)
                }

                return children
            }

            res.json({
                ...topLevelSchema,
                ChildrenSchema: await findChildren(topLevelSchema!),
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async updatePropToSchema(req: Request, res: Response) {
        try {
            const { schemaAlias } = req.params as unknown as {
                schemaAlias: string
            }
            const { name, mockValue, reference, type } =
                req.body as UpdatePropsToSchemaBody

            const propSchema = await prisma.prop.findFirst({
                where: {
                    Schema: {
                        alias: schemaAlias,
                    },
                    name,
                },
            })

            if (propSchema) {
                await prisma.prop.delete({
                    where: { id: propSchema.id },
                })
            }

            const schema = await prisma.schema.findUnique({
                where: { alias: schemaAlias },
            })

            if (!schema) {
                res.status(404).json({ message: 'Schema with alias not found' })
                return
            }

            const prop = await prisma.prop.create({
                data: {
                    name,
                    Schema: {
                        connect: { id: schema.id },
                    },
                    propValue: {
                        create: {
                            value: mockValue,
                            schemaReferenceAlias: reference?.schemaAlias,
                            schemaReferenceField: reference?.fieldName,
                            type: type,
                        },
                    },
                },
                include: {
                    propValue: true,
                    Schema: true,
                },
            })

            res.status(201).json(prop)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async deletePropFromSchema(req: Request, res: Response) {
        try {
            const { propId } = req.params as unknown as { propId: string }

            await prisma.prop.delete({ where: { id: propId } })

            res.status(204).end()
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async getPropById(req: Request, res: Response) {
        try {
            const { propId } = req.params as unknown as { propId: string }

            const prop = await prisma.prop.findUnique({
                where: { id: propId },
            })

            if (prop) {
                res.json(prop)
            } else {
                res.status(404).json({ message: 'Prop not found' })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async addVisiblePropToSchema(req: Request, res: Response) {
        try {
            const { schemaAlias } = req.params as unknown as {
                schemaAlias: string
            }
            const { visiblePropName } = req.body as { visiblePropName: string }

            const existing = await prisma.visibleProp.findFirst({
                where: {
                    Schema: { alias: schemaAlias },
                    name: visiblePropName,
                },
            })

            if (existing) {
                res.status(400).json({ message: 'Prop already exists' })
                return
            }

            const prop = await prisma.visibleProp.create({
                data: {
                    name: visiblePropName,
                    Schema: {
                        connect: { alias: schemaAlias },
                    },
                },
            })

            res.status(201).json(prop)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async deleteVisiblePropFromSchema(req: Request, res: Response) {
        try {
            const { visiblePropName } = req.params as unknown as {
                visiblePropName: string
            }

            const { schemaAlias } = req.params as unknown as {
                schemaAlias: string
            }

            await prisma.visibleProp.deleteMany({
                where: {
                    name: visiblePropName,
                    Schema: { alias: schemaAlias },
                },
            })

            res.status(204).end()
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async createCustomFrame(req: Request, res: Response) {
        try {
            const { name, description, id } = req.body as {
                name: string
                description: string
                id: string
            }

            const frame = await prisma.customFrame.create({
                data: {
                    name,
                    description,
                    id,
                    Schema: {
                        create: {
                            alias: `Frame${getUniqueWordId()}`,
                            Frame: {
                                connect: {
                                    name: 'Frame',
                                },
                            },
                        },
                    },
                },
            })

            res.status(201).json(frame)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async getCustomFrames(req: Request, res: Response) {
        try {
            const frames = await prisma.customFrame.findMany()

            res.status(200).json(frames)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
