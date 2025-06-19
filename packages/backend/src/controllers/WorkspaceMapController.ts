import { Request, Response } from 'express'
import * as workspaceMapService from '../services/workspeceMapService'
export async function getAllWorkspacesMap(req: Request, res: Response) {
  try {
    const result = await workspaceMapService.getAllmaps()
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function getWorkspaceMapById(req: Request, res: Response) {
  try {
    const result = await workspaceMapService.getWorkspaceMapById(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export async function createWorkspaceMap(req: Request, res: Response) {
  try {
    const result = await workspaceMapService.createWorkspaceMap(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export async function updateWorkspaceMap(req: Request, res: Response) {
  try {
    const result = await workspaceMapService.updateWorkspaceMap(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export async function deleteWorkspaceMap(req: Request, res: Response) {
  try {
    await workspaceMapService.deleteWorkspaceMap(req.params.id)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export async function filterMap(req: Request, res: Response) {
  try {
    const result = await workspaceMapService.filterMap(req.body)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
