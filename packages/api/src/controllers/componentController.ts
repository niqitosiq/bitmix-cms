import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ComponentController {
    async getAllComponents(req: Request, res: Response) {
        try {
            const components = await prisma.component.findMany();
            res.json(components);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getComponentById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const component = await prisma.component.findUnique({
                where: { id: parseInt(id) },
            });
            if (component) {
                res.json(component);
            } else {
                res.status(404).json({ error: 'Component not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createComponent(req: Request, res: Response) {
        const { name, description, icon, type, code, isBase } = req.body;
        try {
            const component = await prisma.component.create({
                data: {
                    description,
                    icon,
                    name,
                    type,
                    code,
                    isBase,
                },
            });
            res.json(component);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateComponent(req: Request, res: Response) {
        const { id } = req.params;
        const { name, description, icon, category, type } = req.body;
        try {
            const updatedComponent = await prisma.component.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    description,
                    icon,
                    category,
                    type,
                },
            });
            res.json(updatedComponent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteComponent(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.component.delete({
                where: { id: parseInt(id) },
            });
            res.json({ message: 'Component deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createSchemaForComponent(req: Request, res: Response) {
        const { componentId } = req.params;
        try {
            const schema = await prisma.component.update({
                where: { id: parseInt(componentId) },
                data: {
                    Schemas: {
                        create: [],
                    },
                },
            });
            res.json(schema);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
