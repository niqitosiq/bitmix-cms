import { Request, Response } from 'express'
import { PrismaClient, Prop, PropValue, Schema } from '@prisma/client'

const prisma = new PrismaClient()

export type SchemaCreationBody = {
    frameId: number
    name: string
    pageId: number
}
export type UpdatePropsToSchemaBody = {
    id?: number
    name: string
    type: string
    mockValue?: string
    reference?: {
        schemaId: number
        fieldName: string
    }
}

export class SchemaController {
    async createSchema(
        req: Request<unknown, Schema, SchemaCreationBody>,
        res: Response
    ) {
        try {
            const { frameId, name, pageId } = req.body

            const schema = await prisma.schema.create({
                data: {
                    ParentFrame: { connect: { id: frameId } },
                    Page: { connect: { id: pageId } },
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
            const { id } = req.params as unknown as { id: number }

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
                    props: true,
                    Frame: {
                        include: {
                            Schemas: true,
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
            const schema = await prisma.schema.findUnique({
                where: { id: Number(id) },
                include: {
                    props: true,
                    Frame: {
                        include: {
                            Schemas: true,
                        },
                    },
                },
            })
            if (schema) {
                res.json(schema)
            } else {
                res.status(404).json({ message: 'Schema not found' })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async updatePropToSchema(req: Request, res: Response) {
        try {
            const { schemaId } = req.params as unknown as { schemaId: string }
            const { name, mockValue, reference } =
                req.body as UpdatePropsToSchemaBody

            const isSchemaHasPropWithSameName = await prisma.prop.findFirst({
                where: {
                    schemaId: Number(schemaId),
                    name,
                },
            })

            if (isSchemaHasPropWithSameName) {
                await prisma.prop.delete({
                    where: { id: isSchemaHasPropWithSameName.id },
                })
            }

            const prop = await prisma.prop.create({
                data: {
                    name,
                    propValue: {
                        create: {
                            schemaReferenceId: reference?.schemaId,
                            schemaReferenceField: reference?.fieldName,
                            value: mockValue,
                        },
                    },
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

            await prisma.prop.delete({ where: { id: Number(propId) } })

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
                where: { id: Number(propId) },
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
}
