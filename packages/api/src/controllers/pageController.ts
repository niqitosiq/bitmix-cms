import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { getUniqueWordId } from './schemaController'

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
                where: { id },
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
            siteId,
            pageFrameName = 'Page',
        } = req.body as {
            url: string
            name: string
            pageFrameName: string
            siteId: string
        }

        try {
            const page = await prisma.page.create({
                data: {
                    url,
                    name,
                    Site: { connect: { id: siteId } },
                    Schema: {
                        create: {
                            alias: 'page' + getUniqueWordId(),
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
                where: { id },
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
            await prisma.page.delete({ where: { id } })
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
                where: { id },
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
