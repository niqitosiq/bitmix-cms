import express from 'express';
import { SchemaController } from '../controllers/schemaController';

const router = express.Router();
const schemaController = new SchemaController();

router.get('/schemas', schemaController.getAllSchemas);
router.get('/schemas/:id', schemaController.getSchemaById);
router.post('/schemas', schemaController.createSchema);
router.delete('/schemas/:id', schemaController.deleteSchema);
router.post(
    '/schemas/:schemaId/updatePropToSchema',
    schemaController.updatePropToSchema,
);
router.delete(
    '/schemas/:schemaId/deletePropFromSchema/:propId',
    schemaController.deletePropFromSchema,
);

export { router as schemaRouter };
