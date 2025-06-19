import { Request, Response } from 'express'
import * as workspaceService from '../services/workspeceMapService'

export async function getWorkspaceById(req: Request, res: Response) {
  try {
    const result = await workspaceService.getWorkspaceById(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export async function createWorkspace(req: Request, res: Response) {
  try {
    const result = await workspaceService.createWorkspace(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export async function updateWorkspace(req: Request, res: Response) {
  try {
    const result = await workspaceService.updateWorkspace(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export async function deleteWorkspace(req: Request, res: Response) {
  try {
    await workspaceService.deleteWorkspace(req.params.id)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}