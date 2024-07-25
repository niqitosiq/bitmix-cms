import express from 'express';
import { CategoryController } from '../controllers/categoryController';

const router = express.Router();
const categoryController = new CategoryController();

// Get all categories
router.get('/categories', categoryController.getAllCategories);

// Get a category by ID
router.get('/categories/:id', categoryController.getCategoryById);

// Create a new category
router.post('/categories', categoryController.createCategory);

// Update a category
router.put('/categories/:id', categoryController.updateCategory);

// Delete a category
router.delete('/categories/:id', categoryController.deleteCategory);

export { router as categoryRouter };