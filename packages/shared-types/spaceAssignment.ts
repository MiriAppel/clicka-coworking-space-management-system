// סטטוס של השמה
export enum AssignmentStatus {
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
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
