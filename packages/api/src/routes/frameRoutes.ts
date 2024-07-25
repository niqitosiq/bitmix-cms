import express from 'express'
import { FrameController } from '../controllers/frameController'

const router = express.Router()
const frameController = new FrameController()

// Get all frames
router.get('/frames', frameController.getAllFrames)

// Get a frame by ID
router.get('/frames/:id', frameController.getFrameById)

// Create a new frame
router.post('/frames', frameController.createFrame)

// Update a frame
router.put('/frames/:id', frameController.updateFrame)

// Delete a frame
router.delete('/frames/:id', frameController.deleteFrame)

// createSchemaForFrame
router.post('/frames/:frameId/schemas', frameController.createSchemaForFrame)

export { router as frameRouter }
