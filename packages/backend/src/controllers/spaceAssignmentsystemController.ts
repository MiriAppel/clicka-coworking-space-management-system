import { Request,Response } from "express";
import spaceAssignmentsystemService from '../services/spaceAssignmentsystemService';

export async function  assignCustomerToWorkspace(req: Request, res: Response) {
    try {
      const result = spaceAssignmentsystemService.assignCustomerToWorkspace(req.params.customerId);
      res.json(result)
    } catch (err:any) {
       res.status(500).json({ message:err.message});
    }
  }
  export async function unassignCustomerFromWorkspace(req: Request, res: Response) {
    try{
       const result=await spaceAssignmentsystemService.unassignCustomerFromWorkspace(req.params.customerId,req.params.roomid);
       res.json(result);
    }
    catch(err:any){
        res.status(500).json({message:err.message});
    }
  }
  export async function getAssignmentHistoryForCustomer(req:Request,res:Response) {
    try{
        const result=await spaceAssignmentsystemService.getAssignmentHistoryForCustomer(req.params.customerId);
        res.json(result);
    }
    catch(err:any){
        res.status(500).json({message:err.message});
    }
  }
  export async function assignCustomerToWorkspaces(req:Request,res:Response) {
    try{
       const result=await spaceAssignmentsystemService.assignCustomerToWorkspaces(req.params.customerId,req.params.workspaceid);
       res.json(result);
    }
    catch(err:any){
        res.status(500).json({message: err.message});
    }
  }
  module.exports={
    assignCustomerToWorkspace,
    unassignCustomerFromWorkspace,
    getAssignmentHistoryForCustomer,
    assignCustomerToWorkspaces
  }