import express from 'express'
import { SchemaController } from '../controllers/schemaController'

const router = express.Router()
const schemaController = new SchemaController()

router.get('/schemas', schemaController.getAllSchemas)
router.get('/schemas/:id', schemaController.getSchemaById)
router.post('/schemas', schemaController.createSchema)
router.delete('/schemas/:id', schemaController.deleteSchema)
router.post('/schemas/:schemaId/props', schemaController.updatePropToSchema)
router.delete(
    '/schemas/:schemaId/props/:propId',
    schemaController.deletePropFromSchema
)
router.get('/props/:propId', schemaController.getPropById)

export { router as schemaRouter }
