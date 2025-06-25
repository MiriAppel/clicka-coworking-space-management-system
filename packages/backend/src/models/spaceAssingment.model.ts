import { AssignmentStatus, SpaceAssign } from "@types/spaceAssignment";

export class SpaceModel implements SpaceAssign {
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

  constructor(params: SpaceAssign) {
    this.id = params.id;
    this.workspaceId = params.workspaceId;
    this.customerId = params.customerId;
    this.assignedDate = params.assignedDate;
    this.unassignedDate = params.unassignedDate;
    this.notes = params.notes;
    this.assignedBy = params.assignedBy;
    this.status = params.status;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      workspaceId: this.workspaceId,
      customerId: this.customerId,
      assignedDate: this.assignedDate,
      unassignedDate: this.unassignedDate,
      notes: this.notes,
      assignedBy: this.assignedBy,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}