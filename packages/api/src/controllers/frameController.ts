import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class FrameController {
    async getAllFrames(req: Request, res: Response) {
        try {
            const frames = await prisma.frame.findMany()
            res.json(frames)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getFrameById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const customFrame = await prisma.customFrame.findUnique({
                where: { id },
            })
            if (customFrame) return res.json(customFrame)

            const frame = await prisma.frame.findUnique({
                where: { id },
            })
            if (frame) {
                res.json(frame)
            } else {
                res.status(404).json({ error: 'Frame not found' })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async createFrame(req: Request, res: Response) {
        const { name, description, icon, type, code, isBase } = req.body
        try {
            const frame = await prisma.frame.create({
                data: {
                    description,
                    icon,
                    name,
                    type,
                    code,
                    isBase,
                },
            })
            res.json(frame)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async updateFrame(req: Request, res: Response) {
        const { id } = req.params
        const { name, description, icon, category, type } = req.body
        try {
            const updatedFrame = await prisma.frame.update({
                where: { id },
                data: {
                    name,
                    description,
                    icon,
                    category,
                    type,
                },
            })
            res.json(updatedFrame)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async deleteFrame(req: Request, res: Response) {
        const { id } = req.params
        try {
            await prisma.frame.delete({
                where: { id },
            })
            res.json({ message: 'Frame deleted successfully' })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async createSchemaForFrame(req: Request, res: Response) {
        // const { frameId } = req.params
        // try {
        //     const schema = await prisma.frame.update({
        //         where: { id: parseInt(frameId) },
        //         data: {
        //             Schemas: {
        //                 create: [],
        //             },
        //         },
        //     })
        //     res.json(schema)
        // } catch (error) {
        //     console.error(error)
        //     res.status(500).json({ error: 'Internal server error' })
        // }
    }
}
