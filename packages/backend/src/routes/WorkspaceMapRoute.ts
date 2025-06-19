import express from 'express'
import * as workspaceMapController from '../controllers/workspaceMapController'

const router = express.Router()
router.get('/', workspaceMapController.getAllWorkspacesMap)
router.get('/:id', workspaceMapController.getWorkspaceMapById)
router.post('/', workspaceMapController.createWorkspaceMap)
router.put('/:id', workspaceMapController.updateWorkspaceMap)
router.delete('/:id', workspaceMapController.deleteWorkspaceMap)
router.post('/filter', workspaceMapController.filterMap)

export default router
