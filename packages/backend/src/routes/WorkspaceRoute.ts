import express from 'express'
import * as workspaceMapController from '../controllers/WorkspaceController'

const router = express.Router()

router.get('/:id', workspaceMapController.getWorkspaceById)
router.post('/', workspaceMapController.createWorkspace)
router.put('/:id', workspaceMapController.updateWorkspace)
router.delete('/:id', workspaceMapController.deleteWorkspace)


export default router