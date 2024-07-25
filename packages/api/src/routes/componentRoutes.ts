import express from 'express';
import { ComponentController } from '../controllers/componentController';

const router = express.Router();
const componentController = new ComponentController();

// Get all components
router.get('/components', componentController.getAllComponents);

// Get a component by ID
router.get('/components/:id', componentController.getComponentById);

// Create a new component
router.post('/components', componentController.createComponent);

// Update a component
router.put('/components/:id', componentController.updateComponent);

// Delete a component
router.delete('/components/:id', componentController.deleteComponent);

// createSchemaForComponent
router.post(
    '/components/:componentId/schemas',
    componentController.createSchemaForComponent,
);

export { router as componentRouter };
