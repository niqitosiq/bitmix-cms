import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SchemaController {
    async createSchema(req: Request, res: Response) {
        try {
            const { componentId, name } = req.body as {
                componentId: number;
                name: string;
            };

            const schema = await prisma.schema.create({
                data: {
                    ParentComponent: { connect: { id: componentId } },
                    name,
                },
            });

            res.status(201).json(schema);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteSchema(req: Request, res: Response) {
        try {
            const { id } = req.params as unknown as { id: number };

            await prisma.schema.delete({ where: { id } });

            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllSchemas(req: Request, res: Response) {
        try {
            const schemas = await prisma.schema.findMany({
                include: {
                    props: true,
                    Component: {
                        include: {
                            Schemas: true,
                        },
                    },
                },
            });

            res.status(200).json(schemas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getSchemaById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const schema = await prisma.schema.findUnique({
                where: { id: Number(id) },
                include: {
                    props: true,
                    Component: {
                        include: {
                            Schemas: true,
                        },
                    },
                },
            });
            if (schema) {
                res.json(schema);
            } else {
                res.status(404).json({ message: 'Schema not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updatePropToSchema(req: Request, res: Response) {
        try {
            const { schemaId } = req.params as unknown as { schemaId: string };
            const { id, name, type, value } = req.body as {
                id?: number;
                name: string;
                type: string;
                value: string;
            };

            console.log('schemaId', schemaId);

            // if exists then update
            if (id) {
                const existingProp = await prisma.prop.findFirst({
                    where: {
                        id: Number(id),
                    },
                });

                if (existingProp) {
                    const prop = await prisma.prop.update({
                        where: { id: existingProp.id },
                        data: {
                            name,
                            type,
                            value,
                        },
                    });

                    return res.status(200).json(prop);
                }
            }
            const prop = await prisma.prop.create({
                data: {
                    Schema: { connect: { id: parseInt(schemaId) } },
                    name,
                    type,
                    value,
                },
            });

            res.status(201).json(prop);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deletePropFromSchema(req: Request, res: Response) {
        try {
            const { propId } = req.params as unknown as { propId: string };

            await prisma.prop.delete({ where: { id: Number(propId) } });

            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
