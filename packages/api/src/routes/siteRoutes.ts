import express from 'express'
import { SiteController } from '../controllers/siteController'

const router = express.Router()
const siteController = new SiteController()

// Routes for Site entity
router.get('/sites', siteController.getAllSites)
router.get('/sites/:id', siteController.getSiteById)
router.post('/sites', siteController.createSite)
router.put('/sites/:id', siteController.updateSite)
router.delete('/sites/:id', siteController.deleteSite)
router.get('/sites/:id/pages', siteController.getSitePages)

export { router as siteRoutes }
