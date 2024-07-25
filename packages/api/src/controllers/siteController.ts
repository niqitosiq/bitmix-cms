import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export class SiteController {
    async createSite(req: Request, res: Response) {
        try {
            const { name } = req.body
            const site = await prisma.site.create({
                data: {
                    name,
                },
            })
            res.status(201).json(site)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getSite(req: Request, res: Response) {
        try {
            const { id } = req.params
            const site = await prisma.site.findUnique({
                where: {
                    id: parseInt(id),
                },
            })
            if (!site) {
                res.status(404).json({ error: 'Site not found' })
            } else {
                res.json(site)
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async updateSite(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { name } = req.body
            const site = await prisma.site.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name,
                },
            })
            res.json(site)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async deleteSite(req: Request, res: Response) {
        try {
            const { id } = req.params
            await prisma.site.delete({
                where: {
                    id: parseInt(id),
                },
            })
            res.sendStatus(204)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getAllSites(req: Request, res: Response) {
        try {
            const sites = await prisma.site.findMany()
            res.json(sites)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getSiteById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const site = await prisma.site.findUnique({
                where: { id: Number(id) },
            })
            if (site) {
                res.json(site)
            } else {
                res.status(404).json({ message: 'Site not found' })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
