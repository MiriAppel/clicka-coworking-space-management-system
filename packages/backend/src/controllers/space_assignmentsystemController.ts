import { Request,Response } from "express";
import {space_assignmentsystemService} from '../services/space_assignmentsystemService';

export async function  assignCustomerToWorkspace(req: Request, res: Response) {
    try {
      const result = space_assignmentsystemService.assignCustomerToWorkspace(req.params.customerId);
      res.json(result)
    } catch (err) {
       res.status(500).json({ message: "err.message" });
    }
  }
  export async function unassignCustomerFromWorkspace(req: Request, res: Response) {
    try{
       const result=space_assignmentsystemService.unassignCustomerFromWorkspace(req.params.customerId,req.params.roomid);
       res.json(result);
    }
    catch(err){
        res.status(500).json({message:"err.message"});
    }
  }
  export async function getAssignmentHistoryForCustomer(req:Request,res:Response) {
    try{
        const result=space_assignmentsystemService.getAssignmentHistoryForCustomer(req.params.customerId);
        res.json(result);
    }
    catch(err){
        res.status(500).json({message:"err.message"});
    }
  }
  export async function assignCustomerToWorkspaces(req:Request,res:Response) {
    try{
       const result=space_assignmentsystemService.assignCustomerToWorkspaces(req.params.customerId,req.params.workspaceid);
       res.json(result);
    }
    catch(err){
        res.status(500).json({message:"err.message"});
    }
  }