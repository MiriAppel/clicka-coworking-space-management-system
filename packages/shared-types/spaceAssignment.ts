<<<<<<< HEAD
 export interface SpaceAssign {
 ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  SUSPENDED = 'SUSPENDED'
 }
=======
// סטטוס של השמה
export enum AssignmentStatus {
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  SUSPENDED = 'SUSPENDED'
}

// Space model
export interface SpaceAssign {
  id?: string;
  workspaceId: string;
  customerId: string;
  assignedDate: Date;
  unassignedDate?: Date;
  notes?: string;
  assignedBy: string;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}
>>>>>>> ff367ee9a065d3e84a1c2b37e7f87defb917cb8d
