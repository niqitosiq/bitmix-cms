import express from 'express'
import { SchemaController } from '../controllers/schemaController'

const router = express.Router()
const schemaController = new SchemaController()

router.get('/schemas', schemaController.getAllSchemas)
router.get('/schemas/:id', schemaController.getSchemaById)
router.post('/schemas', schemaController.createSchema)
router.delete('/schemas/:id', schemaController.deleteSchema)
router.put('/schemas/:schemaAlias/props', schemaController.updatePropToSchema)
router.delete(
    '/schemas/:schemaAlias/props/:propId',
    schemaController.deletePropFromSchema
)
router.get('/props/:propId', schemaController.getPropById)

router.put(
    '/schemas/:schemaAlias/visible-props',
    schemaController.addVisiblePropToSchema
)
router.delete(
    '/schemas/:schemaAlias/visible-props/:visiblePropName',
    schemaController.deleteVisiblePropFromSchema
)

export { router as schemaRouter }
