import express from 'express';
import { PageController } from '../controllers/pageController';

const router = express.Router();
const pageController = new PageController();

// GET /pages
router.get('/pages', pageController.getAllPages);

// GET /pages/:id
router.get('/pages/:id', pageController.getPageById);

// POST /pages
router.post('/pages/', pageController.createPage);

// PUT /pages/:id
router.put('/pages/:id', pageController.updatePage);

// DELETE /pages/:id
router.delete('/pages/:id', pageController.deletePage);

export { router as pageRouter };