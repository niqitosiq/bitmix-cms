import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export class PageController {
    async getAllPages(req: Request, res: Response) {
        try {
            const pages = await prisma.page.findMany()
            res.json(pages)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getPageById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const page = await prisma.page.findUnique({
                where: { id: Number(id) },
                include: { Schema: true },
            })
            if (page) {
                res.json(page)
            } else {
                res.status(404).json({ error: 'Page not found' })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async createPage(req: Request, res: Response) {
        const {
            url,
            name,
            pageFrameName = 'PageFrame',
        } = req.body as { url: string; name: string; pageFrameName: string }

        try {
            const page = await prisma.page.create({
                data: {
                    url,
                    name,
                    Schema: {
                        create: {
                            Frame: {
                                connect: { name: pageFrameName },
                            },
                        },
                    },
                },
                include: { Schema: true },
            })
            res.json(page)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async updatePage(req: Request, res: Response) {
        const { id } = req.params
        const { url, schemaId } = req.body
        try {
            const page = await prisma.page.update({
                where: { id: Number(id) },
                data: {
                    url,
                    Schema: { connect: { id: schemaId } },
                },
            })
            res.json(page)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async deletePage(req: Request, res: Response) {
        const { id } = req.params
        try {
            await prisma.page.delete({ where: { id: Number(id) } })
            res.json({ message: 'Page deleted successfully' })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getPageSchema(req: Request, res: Response) {
        const { id } = req.params
        try {
            const page = await prisma.page.findUnique({
                where: { id: Number(id) },
                include: { Schema: true },
            })
            if (page) {
                res.json(page.Schema)
            } else {
                res.status(404).json({ error: 'Page not found' })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}
