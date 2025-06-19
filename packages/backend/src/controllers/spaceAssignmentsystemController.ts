import { Request,Response } from "express";
import spaceAssignmentsystemService from '../services/SpaceAssignmentsystemService';

export async function  assignCustomerToWorkspace(req: Request, res: Response) {
    try {
      const result = spaceAssignmentsystemService.assignCustomerToWorkspace(req.params.customerId);
      res.json(result)
    } catch (err) {
       res.status(500).json({ message: "err.message" });
    }
  }
  export async function unassignCustomerFromWorkspace(req: Request, res: Response) {
    try{
       const result=spaceAssignmentsystemService.unassignCustomerFromWorkspace(req.params.customerId,req.params.roomid);
       res.json(result);
    }
    catch(err){
        res.status(500).json({message:"err.message"});
    }
  }
  export async function getAssignmentHistoryForCustomer(req:Request,res:Response) {
    try{
        const result=spaceAssignmentsystemService.getAssignmentHistoryForCustomer(req.params.customerId);
        res.json(result);
    }
    catch(err){
        res.status(500).json({message:"err.message"});
    }
  }
  export async function assignCustomerToWorkspaces(req:Request,res:Response) {
    try{
       const result=spaceAssignmentsystemService.assignCustomerToWorkspaces(req.params.customerId,req.params.workspaceid);
       res.json(result);
    }
    catch(err){
        res.status(500).json({message:"err.message"});
    }
  }